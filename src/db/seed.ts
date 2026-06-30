import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

const seniors = [
  { email: 'senior1@kmitl.ac.th', studentId: '6512345678', displayName: 'Zayar Lin',  nickname: 'Zay',   house: 'noir'    as const, role: 'senior' as const },
  { email: 'senior2@kmitl.ac.th', studentId: '6587654321', displayName: 'Thida Oo',   nickname: 'Thida', house: 'tracer'  as const, role: 'senior' as const },
  { email: 'senior3@kmitl.ac.th', studentId: '6511112222', displayName: 'Aung Myat',  nickname: 'Aung',  house: 'foxlock' as const, role: 'senior' as const },
  { email: 'senior4@kmitl.ac.th', studentId: '6533334444', displayName: 'Phyo Thu',   nickname: 'Phyo',  house: 'cipher'  as const, role: 'senior' as const },
  { email: 'senior5@kmitl.ac.th', studentId: '6544445555', displayName: 'Wai Yan',    nickname: 'Wai',   house: 'noir'    as const, role: 'senior' as const },
  { email: 'senior6@kmitl.ac.th', studentId: '6566667777', displayName: 'Tun Lin',    nickname: 'Tun',   house: 'tracer'  as const, role: 'senior' as const },
  { email: 'senior7@kmitl.ac.th', studentId: '6599990000', displayName: 'Kyaw Zin',   nickname: 'Kyaw',  house: 'foxlock' as const, role: 'senior' as const },
  { email: 'senior8@kmitl.ac.th', studentId: '6522223333', displayName: 'Myo Min',    nickname: 'Myo',   house: 'cipher'  as const, role: 'senior' as const },
];

const juniors = [
  { email: 'junior1@kmitl.ac.th', studentId: '6612345678', displayName: 'Kyaw Thu',  nickname: 'KT',    house: 'noir'    as const, role: 'junior' as const, guessLeft: 3 },
  { email: 'junior2@kmitl.ac.th', studentId: '6687654321', displayName: 'Min Htet',  nickname: 'Min',   house: 'tracer'  as const, role: 'junior' as const, guessLeft: 2 },
  { email: 'junior3@kmitl.ac.th', studentId: '6611112222', displayName: 'Su Su',     nickname: 'Su',    house: 'foxlock' as const, role: 'junior' as const, guessLeft: 1 },
  { email: 'junior4@kmitl.ac.th', studentId: '6633334444', displayName: 'Nay Chi',   nickname: 'Nay',   house: 'cipher'  as const, role: 'junior' as const, guessLeft: 3 },
  { email: 'junior5@kmitl.ac.th', studentId: '6644445555', displayName: 'Aye Mya',   nickname: 'Aye',   house: 'noir'    as const, role: 'junior' as const, guessLeft: 0 },
  { email: 'junior6@kmitl.ac.th', studentId: '6666667777', displayName: 'Hnin Wai',  nickname: 'Hnin',  house: 'tracer'  as const, role: 'junior' as const, guessLeft: 3 },
  { email: 'junior7@kmitl.ac.th', studentId: '6699990000', displayName: 'Ei Phyu',   nickname: 'Ei',    house: 'foxlock' as const, role: 'junior' as const, guessLeft: 2 },
  { email: 'junior8@kmitl.ac.th', studentId: '6622223333', displayName: 'Thin Thin', nickname: 'Thin',  house: 'cipher'  as const, role: 'junior' as const, guessLeft: 3 },
];

async function seed() {
  console.log('Seeding students...');

  const insertedSeniors = await db
    .insert(schema.student)
    .values(seniors)
    .onConflictDoNothing()
    .returning({ id: schema.student.id, studentId: schema.student.studentId });

  const insertedJuniors = await db
    .insert(schema.student)
    .values(juniors)
    .onConflictDoNothing()
    .returning({ id: schema.student.id, studentId: schema.student.studentId });

  console.log(`Inserted ${insertedSeniors.length} seniors, ${insertedJuniors.length} juniors`);

  // Map studentId -> uuid for pairing
  const seniorMap = Object.fromEntries(insertedSeniors.map((s) => [s.studentId, s.id]));
  const juniorMap = Object.fromEntries(insertedJuniors.map((j) => [j.studentId, j.id]));

  const pairings = [
    { seniorStudentId: '6512345678', juniorStudentId: '6612345678', foundAt: new Date('2027-08-01') },
    { seniorStudentId: '6587654321', juniorStudentId: '6687654321', foundAt: null },
    { seniorStudentId: '6511112222', juniorStudentId: '6611112222', foundAt: null },
    { seniorStudentId: '6533334444', juniorStudentId: '6633334444', foundAt: new Date('2027-08-03') },
    { seniorStudentId: '6544445555', juniorStudentId: '6644445555', foundAt: null },
    { seniorStudentId: '6566667777', juniorStudentId: '6666667777', foundAt: new Date('2027-08-02') },
    { seniorStudentId: '6599990000', juniorStudentId: '6699990000', foundAt: null },
    { seniorStudentId: '6522223333', juniorStudentId: '6622223333', foundAt: new Date('2027-08-04') },
  ];

  const pcodeValues = pairings
    .filter((p) => seniorMap[p.seniorStudentId] && juniorMap[p.juniorStudentId])
    .map((p) => ({
      seniorId: seniorMap[p.seniorStudentId],
      juniorId: juniorMap[p.juniorStudentId],
      foundAt:  p.foundAt,
    }));

  if (pcodeValues.length > 0) {
    const insertedPcodes = await db
      .insert(schema.pcode)
      .values(pcodeValues)
      .onConflictDoNothing()
      .returning({ id: schema.pcode.id });
    console.log(`Inserted ${insertedPcodes.length} pcode pairs`);
  }

  console.log('Done.');
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
