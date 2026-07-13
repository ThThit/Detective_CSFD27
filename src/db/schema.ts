import { pgTable, uuid, text, boolean, integer, timestamp, jsonb, unique, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const student = pgTable('student', {
  id:          uuid('id').primaryKey().defaultRandom(),
  email:       text('email').unique().notNull(),
  studentId:   text('student_id').unique().notNull(),
  role:        text('role').notNull().default('junior'),
  isAdmin:     boolean('is_admin').notNull().default(false),
  displayName: text('display_name').notNull(),
  nickname:    text('nickname'),
  profileUrl:  text('profile_url'),
  house:       text('house').notNull().default('noir'),
  guessLeft:   integer('guess_left').notNull().default(3),
  instagram:   text('instagram'),
  discord:     text('discord'),
  line:        text('line'),
  nationality: text('nationality'),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
  deletedAt:   timestamp('deleted_at'),
}, (t) => [
  check('student_role_check',  sql`${t.role}  IN ('junior', 'senior', 'house_leader')`),
  check('student_house_check', sql`${t.house} IN ('noir', 'foxlock', 'tracer', 'cipher')`),
]);

export const pcode = pgTable('pcode', {
  id:        uuid('id').primaryKey().defaultRandom(),
  seniorId:  uuid('senior_id').notNull().references(() => student.id),
  juniorId:  uuid('junior_id').notNull().references(() => student.id),
  foundAt:   timestamp('found_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (t) => [
  unique().on(t.seniorId, t.juniorId),
]);

export const hint = pgTable('hint', {
  id:         uuid('id').primaryKey().defaultRandom(),
  pcodeId:    uuid('pcode_id').notNull().references(() => pcode.id, { onDelete: 'cascade' }),
  content:    text('content').notNull().default(''),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
  updatedAt:  timestamp('updated_at').notNull().defaultNow(),
  deletedAt:  timestamp('deleted_at'),
});

export const mutationLog = pgTable('mutation_log', {
  id:        uuid('id').primaryKey().defaultRandom(),
  tableName: text('table_name').notNull(),
  recordId:  uuid('record_id').notNull(),
  operation: text('operation').notNull(),
  oldData:   jsonb('old_data'),
  newData:   jsonb('new_data'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  check('mutation_log_operation_check', sql`${t.operation} IN ('INSERT', 'UPDATE', 'DELETE')`),
]);
