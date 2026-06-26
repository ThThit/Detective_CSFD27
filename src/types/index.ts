export type HouseKey = 'noir' | 'foxlock' | 'tracer' | 'cipher';
export type Role = 'junior' | 'senior' | 'house_leader';

export type Student = {
  id: string;
  email: string;
  studentId: string;
  role: Role;
  isAdmin: boolean;
  displayName: string;
  nickname: string | null;
  profileUrl: string | null;
  house: HouseKey;
  guessLeft: number;
  instagram: string | null;
  discord: string | null;
  line: string | null;
  nationality: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicStudent = Omit<Student, 'isAdmin' | 'guessLeft' | 'email'>;

export type Hint = {
  id: string;
  pcodeId: string;
  content: string;
  revealDate: string;
  isRevealed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Pcode = {
  id: string;
  seniorId: string;
  juniorId: string;
  foundAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PcodePair = {
  id: string;
  senior: PublicStudent;
  junior: PublicStudent & { guessLeft: number };
  foundAt: string | null;
  createdAt: string;
};

export type MeResponse = {
  id: string;
  email: string;
  studentId: string;
  role: Role;
  isAdmin: boolean;
  displayName: string;
  nickname: string | null;
  profileUrl: string | null;
  house: HouseKey;
  guessLeft: number;
  instagram: string | null;
  discord: string | null;
  line: string | null;
  nationality: string | null;
  hints: Hint[];
  mentee: PublicStudent | null;
  isFound: boolean;
};
