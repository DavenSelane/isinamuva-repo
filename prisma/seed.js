"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var parents, i, _a, _b, students, i, _c, _d, tutors, i, _e, _f, class1, lesson1, assignment1, _i, students_1, student;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    parents = [];
                    i = 1;
                    _g.label = 1;
                case 1:
                    if (!(i <= 10)) return [3 /*break*/, 4];
                    _b = (_a = parents).push;
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                firstName: "Parent".concat(i),
                                lastName: "Lastname".concat(i),
                                email: "parent".concat(i, "@example.com"),
                                password: "password123",
                                role: "PARENT",
                                phone: "08000000".concat(i),
                                bio: "I am parent number ".concat(i),
                            },
                        })];
                case 2:
                    _b.apply(_a, [_g.sent()]);
                    _g.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    students = [];
                    i = 1;
                    _g.label = 5;
                case 5:
                    if (!(i <= 15)) return [3 /*break*/, 8];
                    _d = (_c = students).push;
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                firstName: "Student".concat(i),
                                lastName: "Lastname".concat(i),
                                email: "student".concat(i, "@example.com"),
                                password: "password123",
                                role: "STUDENT",
                                gradeId: 1, // Assuming grade 1 exists
                                classId: 1, // Assuming class 1 exists
                                parentId: parents[(i - 1) % parents.length].id,
                            },
                        })];
                case 6:
                    _d.apply(_c, [_g.sent()]);
                    _g.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    tutors = [];
                    i = 1;
                    _g.label = 9;
                case 9:
                    if (!(i <= 8)) return [3 /*break*/, 12];
                    _f = (_e = tutors).push;
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                firstName: "Tutor".concat(i),
                                lastName: "Lastname".concat(i),
                                email: "tutor".concat(i, "@example.com"),
                                password: "password123",
                                role: "TUTOR",
                                phone: "08100000".concat(i),
                                bio: "I teach subjects for students.",
                            },
                        })];
                case 10:
                    _f.apply(_e, [_g.sent()]);
                    _g.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 9];
                case 12: return [4 /*yield*/, prisma.class.create({
                        data: {
                            name: "Class A",
                            gradeId: 1,
                            supervisorId: tutors[0].id,
                        },
                    })];
                case 13:
                    class1 = _g.sent();
                    return [4 /*yield*/, prisma.lesson.create({
                            data: {
                                topic: "Introduction to Math",
                                classId: class1.id,
                                tutorId: tutors[0].id,
                                subjectId: 1, // Assuming subject with id 1 exists
                            },
                        })];
                case 14:
                    lesson1 = _g.sent();
                    return [4 /*yield*/, prisma.assignment.create({
                            data: {
                                title: "Math Homework 1",
                                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                                description: "Solve all exercises in the PDF",
                                lessonId: lesson1.id,
                                createdById: tutors[0].id,
                                maxScore: 100,
                            },
                        })];
                case 15:
                    assignment1 = _g.sent();
                    _i = 0, students_1 = students;
                    _g.label = 16;
                case 16:
                    if (!(_i < students_1.length)) return [3 /*break*/, 19];
                    student = students_1[_i];
                    return [4 /*yield*/, prisma.result.create({
                            data: {
                                studentId: student.id,
                                assignmentId: assignment1.id,
                                score: Math.floor(Math.random() * 101), // Random score 0-100
                                status: "submitted",
                            },
                        })];
                case 17:
                    _g.sent();
                    _g.label = 18;
                case 18:
                    _i++;
                    return [3 /*break*/, 16];
                case 19: 
                // ----- CONTENT -----
                return [4 /*yield*/, prisma.content.create({
                        data: {
                            title: "Math Basics",
                            type: "DOCUMENT",
                            subjectId: 1,
                            grades: 1,
                            description: "Introductory notes for math",
                            documentUrl: "https://example.com/math.pdf",
                            authorId: tutors[0].id,
                        },
                    })];
                case 20:
                    // ----- CONTENT -----
                    _g.sent();
                    // ----- ANNOUNCEMENTS -----
                    return [4 /*yield*/, prisma.announcement.create({
                            data: {
                                title: "Welcome to the new term!",
                                description: "We hope everyone has a great term ahead.",
                                authorId: tutors[0].id,
                                classId: class1.id,
                            },
                        })];
                case 21:
                    // ----- ANNOUNCEMENTS -----
                    _g.sent();
                    // ----- CALENDAR EVENTS -----
                    return [4 /*yield*/, prisma.calendarEvent.create({
                            data: {
                                title: "Math Test",
                                start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                                end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
                                userId: tutors[0].id,
                            },
                        })];
                case 22:
                    // ----- CALENDAR EVENTS -----
                    _g.sent();
                    console.log("✅ Database seeded successfully");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
