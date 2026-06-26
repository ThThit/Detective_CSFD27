"use client";

import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// The cropped output must be at least this big (natural pixels) per the spec.
const MIN_OUTPUT_PX = 200;

type ImageCropperProps = {
  /** Called with a base64 JPEG data URI once the user confirms a crop. */
  onComplete: (dataUri: string) => void;
  onCancel?: () => void;
};

function centeredSquareCrop(width: number, height: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
    width,
    height,
  );
}

function toCroppedJpegDataUri(image: HTMLImageElement, crop: PixelCrop): string {
  // `crop` is in the displayed image's pixels; scale up to the natural image.
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const width = Math.round(crop.width * scaleX);
  const height = Math.round(crop.height * scaleY);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get a 2D canvas context");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    width,
    height,
    0,
    0,
    width,
    height,
  );

  return canvas.toDataURL("image/jpeg", 0.9);
}

export function ImageCropper({ onComplete, onCancel }: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please choose a JPEG or PNG image.");
      return;
    }
    setError(null);
    setCompletedCrop(null);
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centeredSquareCrop(width, height));
  }

  function handleConfirm() {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      setError("Select a crop area first.");
      return;
    }
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const outputPx = completedCrop.width * scaleX;
    if (outputPx < MIN_OUTPUT_PX) {
      setError(`Crop must be at least ${MIN_OUTPUT_PX}×${MIN_OUTPUT_PX}px.`);
      return;
    }
    setError(null);
    onComplete(toCroppedJpegDataUri(imgRef.current, completedCrop));
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="file" accept="image/jpeg,image/png" onChange={handleFile} />

      {src && (
        <ReactCrop
          crop={crop}
          onChange={(pixelCrop) => setCrop(pixelCrop)}
          onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
          aspect={1}
          minWidth={50}
          circularCrop
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt="Crop preview"
            onLoad={handleImageLoad}
            style={{ maxHeight: 400 }}
          />
        </ReactCrop>
      )}

      {error && <p className="text-sm text-[#8b2020]">{error}</p>}

      {src && (
        <div className="flex gap-2">
          <button type="button" onClick={handleConfirm}>
            Confirm crop
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
