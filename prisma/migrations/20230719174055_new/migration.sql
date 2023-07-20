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
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "problemStatementEasy" TEXT NOT NULL,
    "problemStatementModerate" TEXT NOT NULL,
    "problemStatementHard" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "memberName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_eventId_key" ON "events"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "team_teamId_key" ON "team"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "team_teamName_key" ON "team"("teamName");

-- CreateIndex
CREATE UNIQUE INDEX "participants_email_key" ON "participants"("email");

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
