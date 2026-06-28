import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Add it to .env.local or your shell environment.");
  process.exit(1);
}

const mockPhotoUrl = "/mock-agent.svg";

const mockStudents = [
  ["mock.noir.leader@ad.sit.kmutt.ac.th", "6800000001", "house_leader", "Noir Lead Agent", "Oracle", "noir", "@noir.lead", "oracle#2027", "noirlead"],
  ["mock.noir.senior@ad.sit.kmutt.ac.th", "6800000002", "senior", "Noir Senior Agent", "Shade", "noir", "@noir.senior", "shade#2027", "noirsenior"],
  ["mock.noir.junior1@ad.sit.kmutt.ac.th", "6900000001", "junior", "Noir Junior One", "Ghost", "noir", null, null, null],
  ["mock.noir.junior2@ad.sit.kmutt.ac.th", "6900000002", "junior", "Noir Junior Two", "Lynx", "noir", null, null, null],
  ["mock.noir.junior3@ad.sit.kmutt.ac.th", "6900000003", "junior", "Noir Junior Three", null, "noir", null, null, null],

  ["mock.foxlock.leader@ad.sit.kmutt.ac.th", "6800000011", "house_leader", "Foxlock Lead Agent", "Vex", "foxlock", "@foxlock.lead", "vex#2027", "foxlead"],
  ["mock.foxlock.senior@ad.sit.kmutt.ac.th", "6800000012", "senior", "Foxlock Senior Agent", "Wraith", "foxlock", "@foxlock.senior", "wraith#2027", "foxsenior"],
  ["mock.foxlock.junior1@ad.sit.kmutt.ac.th", "6900000011", "junior", "Foxlock Junior One", "Flash", "foxlock", null, null, null],
  ["mock.foxlock.junior2@ad.sit.kmutt.ac.th", "6900000012", "junior", "Foxlock Junior Two", "Bolt", "foxlock", null, null, null],
  ["mock.foxlock.junior3@ad.sit.kmutt.ac.th", "6900000013", "junior", "Foxlock Junior Three", null, "foxlock", null, null, null],

  ["mock.tracer.leader@ad.sit.kmutt.ac.th", "6800000021", "house_leader", "Tracer Lead Agent", "Spectre", "tracer", "@tracer.lead", "spectre#2027", "tracerlead"],
  ["mock.tracer.senior@ad.sit.kmutt.ac.th", "6800000022", "senior", "Tracer Senior Agent", "Shadow", "tracer", "@tracer.senior", "shadow#2027", "tracersenior"],
  ["mock.tracer.junior1@ad.sit.kmutt.ac.th", "6900000021", "junior", "Tracer Junior One", "Slate", "tracer", null, null, null],
  ["mock.tracer.junior2@ad.sit.kmutt.ac.th", "6900000022", "junior", "Tracer Junior Two", "Raven", "tracer", null, null, null],
  ["mock.tracer.junior3@ad.sit.kmutt.ac.th", "6900000023", "junior", "Tracer Junior Three", null, "tracer", null, null, null],

  ["mock.cipher.leader@ad.sit.kmutt.ac.th", "6800000031", "house_leader", "Cipher Lead Agent", "Nexus", "cipher", "@cipher.lead", "nexus#2027", "cipherlead"],
  ["mock.cipher.senior@ad.sit.kmutt.ac.th", "6800000032", "senior", "Cipher Senior Agent", "Key", "cipher", "@cipher.senior", "key#2027", "ciphersenior"],
  ["mock.cipher.junior1@ad.sit.kmutt.ac.th", "6900000031", "junior", "Cipher Junior One", "Token", "cipher", null, null, null, mockPhotoUrl],
  ["mock.cipher.junior2@ad.sit.kmutt.ac.th", "6900000032", "junior", "Cipher Junior Two", "Byte", "cipher", null, null, null],
  ["mock.cipher.junior3@ad.sit.kmutt.ac.th", "6900000033", "junior", "Cipher Junior Three", null, "cipher", null, null, null],
];

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

try {
  await sql.begin(async (tx) => {
    for (const [email, studentId, role, displayName, nickname, house, instagram, discord, line, profileUrl = null] of mockStudents) {
      await tx`
        INSERT INTO student (
          email,
          student_id,
          role,
          display_name,
          nickname,
          profile_url,
          house,
          instagram,
          discord,
          line,
          nationality
        )
        VALUES (
          ${email},
          ${studentId},
          ${role},
          ${displayName},
          ${nickname},
          ${profileUrl},
          ${house},
          ${instagram},
          ${discord},
          ${line},
          'Thai'
        )
        ON CONFLICT (email) DO UPDATE SET
          student_id = EXCLUDED.student_id,
          role = EXCLUDED.role,
          display_name = EXCLUDED.display_name,
          nickname = EXCLUDED.nickname,
          profile_url = EXCLUDED.profile_url,
          house = EXCLUDED.house,
          instagram = EXCLUDED.instagram,
          discord = EXCLUDED.discord,
          line = EXCLUDED.line,
          nationality = EXCLUDED.nationality,
          deleted_at = NULL
      `;
    }
  });

  console.log(`Seeded ${mockStudents.length} mock students.`);
  console.log("Open /houses/noir, /houses/foxlock, /houses/tracer, and /houses/cipher to review the UI.");
} finally {
  await sql.end();
}
