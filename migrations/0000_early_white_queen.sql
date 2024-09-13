CREATE TABLE IF NOT EXISTS "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"originalUrl" varchar(255),
	"shortUrl" varchar(50),
	"clicks" integer DEFAULT 0,
	"status" varchar(10) DEFAULT 'active',
	"createdAt" timestamp DEFAULT now()
);
