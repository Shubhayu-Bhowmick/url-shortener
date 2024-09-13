import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';


export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  originalUrl: varchar('originalUrl', { length: 255 }),
  shortUrl: varchar('shortUrl', { length: 50 }),
  clicks: integer('clicks').default(0),
  status: varchar('status', { length: 10 }).default('active'),
  createdAt: varchar('createdAt', { length: 50 }),
});