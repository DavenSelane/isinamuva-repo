/*
  Warnings:

  - You are about to drop the column `date` on the `CalendarEvent` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `CalendarEvent` table. All the data in the column will be lost.
  - You are about to drop the column `examId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Exam` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `end` to the `CalendarEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `CalendarEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CalendarEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CalendarEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CalendarEvent" DROP CONSTRAINT "CalendarEvent_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Exam" DROP CONSTRAINT "Exam_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Result" DROP CONSTRAINT "Result_examId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_subjectId_fkey";

-- AlterTable
ALTER TABLE "public"."Assignment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imgUrl" TEXT,
ADD COLUMN     "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "questions" TEXT,
ADD COLUMN     "solutionUrl" TEXT,
ADD COLUMN     "subjectId" INTEGER,
ALTER COLUMN "lessonId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."CalendarEvent" DROP COLUMN "date",
DROP COLUMN "subjectId",
ADD COLUMN     "allDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#3b82f6',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Result" DROP COLUMN "examId",
ADD COLUMN     "answers" TEXT,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "gradedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'submitted',
ADD COLUMN     "submissionUrl" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "score" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "subjectId";

-- DropTable
DROP TABLE "public"."Exam";

-- CreateTable
CREATE TABLE "public"."Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    "classId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_SubjectStudents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SubjectStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubjectStudents_B_index" ON "public"."_SubjectStudents"("B");

-- CreateIndex
CREATE INDEX "Assignment_lessonId_idx" ON "public"."Assignment"("lessonId");

-- CreateIndex
CREATE INDEX "Assignment_subjectId_idx" ON "public"."Assignment"("subjectId");

-- CreateIndex
CREATE INDEX "Assignment_dueDate_idx" ON "public"."Assignment"("dueDate");

-- CreateIndex
CREATE INDEX "Assignment_createdById_idx" ON "public"."Assignment"("createdById");

-- CreateIndex
CREATE INDEX "Content_subjectId_idx" ON "public"."Content"("subjectId");

-- CreateIndex
CREATE INDEX "Content_grades_idx" ON "public"."Content"("grades");

-- CreateIndex
CREATE INDEX "Content_type_idx" ON "public"."Content"("type");

-- CreateIndex
CREATE INDEX "Content_createdAt_idx" ON "public"."Content"("createdAt");

-- CreateIndex
CREATE INDEX "Lesson_subjectId_idx" ON "public"."Lesson"("subjectId");

-- CreateIndex
CREATE INDEX "Lesson_classId_idx" ON "public"."Lesson"("classId");

-- CreateIndex
CREATE INDEX "Lesson_tutorId_idx" ON "public"."Lesson"("tutorId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "User_classId_idx" ON "public"."User"("classId");

-- CreateIndex
CREATE INDEX "User_gradeId_idx" ON "public"."User"("gradeId");

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarEvent" ADD CONSTRAINT "CalendarEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SubjectStudents" ADD CONSTRAINT "_SubjectStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SubjectStudents" ADD CONSTRAINT "_SubjectStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
