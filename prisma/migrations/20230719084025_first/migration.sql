-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "OrderDate" TEXT NOT NULL,
    "Region" TEXT NOT NULL,
    "Rep" TEXT NOT NULL,
    "Item" TEXT NOT NULL,
    "Units" INTEGER NOT NULL,
    "Unit_Cost" DOUBLE PRECISION NOT NULL,
    "Total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_email_key" ON "participants"("email");
