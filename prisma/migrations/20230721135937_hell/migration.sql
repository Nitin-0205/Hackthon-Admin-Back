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
    "participantId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "aadhar" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "telegram_userId" TEXT NOT NULL,
    "telegram_chat_id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problemStatement" (
    "id" SERIAL NOT NULL,
    "problemStatementId" TEXT NOT NULL,
    "problemStatementTitle" TEXT NOT NULL,
    "problemStatementDescription" TEXT NOT NULL,
    "problemStatementDifficulty" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "problemStatement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_eventId_key" ON "events"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "team_teamId_key" ON "team"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "team_teamName_key" ON "team"("teamName");

-- CreateIndex
CREATE UNIQUE INDEX "participants_participantId_key" ON "participants"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "participants_email_key" ON "participants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "problemStatement_problemStatementId_key" ON "problemStatement"("problemStatementId");

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problemStatement" ADD CONSTRAINT "problemStatement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
