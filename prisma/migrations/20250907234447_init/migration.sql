-- CreateTable
CREATE TABLE "public"."Health" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Health_pkey" PRIMARY KEY ("id")
);
