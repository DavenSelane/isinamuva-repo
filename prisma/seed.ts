import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // --- Create Grades and Classes ---
  const grade1 = await prisma.grade.create({
    data: { name: "Grade 8" },
  });

  const grade2 = await prisma.grade.create({
    data: { name: "Grade 9" },
  });

  const classA = await prisma.class.create({
    data: { name: "8A", gradeId: grade1.id, supervisorId: 0 }, // placeholder, will update later
  });

  const classB = await prisma.class.create({
    data: { name: "9A", gradeId: grade2.id, supervisorId: 0 },
  });

  // --- Create Tutors ---
  const tutors = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      prisma.user.create({
        data: {
          email: `tutor${i + 1}@school.com`,
          password: "tutorpass",
          role: "TUTOR",
          firstName: `Tutor${i + 1}`,
          lastName: "Smith",
        },
      })
    )
  );

  // --- Update class supervisors ---
  await prisma.class.update({
    where: { id: classA.id },
    data: { supervisorId: tutors[0].id },
  });
  await prisma.class.update({
    where: { id: classB.id },
    data: { supervisorId: tutors[1].id },
  });

  // --- Create Parents ---
  const parents = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.user.create({
        data: {
          email: `parent${i + 1}@school.com`,
          password: "parentpass",
          role: "PARENT",
          firstName: `Parent${i + 1}`,
          lastName: "Doe",
        },
      })
    )
  );

  // --- Create Students ---
  const students = await Promise.all(
    Array.from({ length: 15 }, (_, i) =>
      prisma.user.create({
        data: {
          email: `student${i + 1}@school.com`,
          password: "studentpass",
          role: "STUDENT",
          firstName: `Student${i + 1}`,
          lastName: "Learner",
          gradeId: i < 8 ? grade1.id : grade2.id,
          classId: i < 8 ? classA.id : classB.id,
          parentId: parents[i % parents.length].id,
        },
      })
    )
  );

  // --- Create Subjects ---
  const subjects = await Promise.all(
    ["Math", "English", "Science", "History"].map((name, i) =>
      prisma.subject.create({
        data: {
          name,
          tutors: { connect: { id: tutors[i % tutors.length].id } },
          students: { connect: students.map((s) => ({ id: s.id })) },
        },
      })
    )
  );

  // --- Create Lessons ---
  const lessons = await Promise.all(
    subjects.map((subject, i) =>
      prisma.lesson.create({
        data: {
          topic: `${subject.name} Lesson 1`,
          subjectId: subject.id,
          classId: i % 2 === 0 ? classA.id : classB.id,
          tutorId: tutors[i % tutors.length].id,
        },
      })
    )
  );

  // --- Create Content ---
  await Promise.all(
    subjects.map((subject, i) =>
      prisma.content.create({
        data: {
          title: `${subject.name} Intro Video`,
          type: "VIDEO",
          subjectId: subject.id,
          grades: i % 2 === 0 ? grade1.id : grade2.id,
          description: `Introduction to ${subject.name}`,
          videoUrl: `https://example.com/${subject.name.toLowerCase()}-video.mp4`,
          authorId: tutors[i % tutors.length].id,
        },
      })
    )
  );

  const supervisor1 = await prisma.user.create({
  data: {
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@school.com",
    password: "hashedpassword",
    role: "TUTOR",
  },
});

await prisma.class.create({
  data: {
    name: "Class 1",
    gradeId: grade1.id,
    supervisorId: supervisor1.id, // <-- must exist
  },
});


  // --- Create Assignments ---
  await Promise.all(
    lessons.map((lesson, i) =>
      prisma.assignment.create({
        data: {
          title: `${lesson.topic} Assignment`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
          description: `Complete exercises for ${lesson.topic}`,
          lessonId: lesson.id,
          subjectId: lesson.subjectId,
          createdById: lesson.tutorId,
        },
      })
    )
  );

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
