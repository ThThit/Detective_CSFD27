"use client";

import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// The cropped output must be at least this big (natural pixels) per the spec.
const MIN_OUTPUT_PX = 200;

type ImageCropperProps = {
  /** Called with a base64 JPEG data URI once the user confirms a crop. */
  onComplete: (dataUri: string) => void;
  onCancel?: () => void;
};

/**
 * A centered square crop sized from the image's *natural* dimensions, so the
 * aspect is correct regardless of how the image is displayed. The 90% box is
 * fit to the shorter side so the square never overflows the image.
 */
function centeredSquareCrop(naturalWidth: number, naturalHeight: number): Crop {
  const fitToHeight = naturalWidth > naturalHeight;
  return centerCrop(
    makeAspectCrop(
      fitToHeight ? { unit: "%", height: 90 } : { unit: "%", width: 90 },
      1,
      naturalWidth,
      naturalHeight,
    ),
    naturalWidth,
    naturalHeight,
  );
}

/** Render a percentage crop to a base64 JPEG, working in natural pixels. */
function toCroppedJpegDataUri(image: HTMLImageElement, crop: Crop): string {
  const nW = image.naturalWidth;
  const nH = image.naturalHeight;
  const sx = (crop.x / 100) * nW;
  const sy = (crop.y / 100) * nH;
  const sw = (crop.width / 100) * nW;
  const sh = (crop.height / 100) * nH;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(sw);
  canvas.height = Math.round(sh);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get a 2D canvas context");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, Math.round(sw), Math.round(sh));

  return canvas.toDataURL("image/jpeg", 0.9);
}

export function ImageCropper({ onComplete, onCancel }: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  // `crop` is always kept in percentage units so it tracks the displayed image.
  const [crop, setCrop] = useState<Crop>();
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please choose a JPEG or PNG image.");
      return;
    }
    setError(null);
    setCrop(undefined);
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setCrop(centeredSquareCrop(naturalWidth, naturalHeight));
  }

  function handleConfirm() {
    const image = imgRef.current;
    if (!image || !crop?.width || !crop?.height) {
      setError("Select a crop area first.");
      return;
    }
    const outputPx = (crop.width / 100) * image.naturalWidth;
    if (outputPx < MIN_OUTPUT_PX) {
      setError(`Crop must be at least ${MIN_OUTPUT_PX}×${MIN_OUTPUT_PX}px.`);
      return;
    }
    setError(null);
    onComplete(toCroppedJpegDataUri(image, crop));
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="self-start inline-flex items-center px-3 py-2 border border-accent/40 bg-accent/8 text-[10px] text-accent tracking-[1px] font-mono cursor-pointer hover:bg-accent/12 transition-colors">
        {src ? "CHOOSE DIFFERENT IMAGE" : "CHOOSE IMAGE"}
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFile}
          className="hidden"
        />
      </label>

      {src && (
        <div className="flex justify-center bg-dark/5 p-2">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            aspect={1}
            minWidth={50}
            keepSelection
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="Crop preview"
              onLoad={handleImageLoad}
              style={{ maxHeight: "55vh", maxWidth: "100%", display: "block" }}
            />
          </ReactCrop>
        </div>
      )}

      {error && <p className="text-[13px] text-danger">{error}</p>}

      {src && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 border border-accent bg-accent/15 text-[10px] text-accent tracking-[2px] font-mono cursor-pointer hover:bg-accent/25 transition-colors"
          >
            CONFIRM CROP
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-dark/15 text-[10px] text-muted tracking-[2px] font-mono cursor-pointer hover:text-foreground transition-colors"
            >
              CANCEL
            </button>
          )}
        </div>
      )}
    </div>
  );
}
