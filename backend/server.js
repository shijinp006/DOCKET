import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import upload from "./Middleware/multer.js";

import { addAllowedAdmin } from "./Contrlos/Admin/createAdmin.js"
import { verifyId } from "./Contrlos/VeriftId/verifyId.js"
import { sendOtp } from "./Contrlos/VeriftId/sendOtp.js"
import { verifyOtp } from "./Contrlos/VeriftId/verifiedOtp.js"
import { registerUser } from "./Contrlos/Signup/Signup.js"
import { loginUser } from "./Contrlos/Login/login.js"
import { lookupUserByRegisterNumber } from "./Contrlos/Loockup/loockUp.js"
import { getAllUsers } from "./Contrlos/GetAllUsers/getAllUsers.js"
import { getAllTeachers } from "./Contrlos/Teachers/getAllTeachers.js"
import { addTeacher } from "./Contrlos/Teachers/addTeacher.js"
import { updateTeacher } from "./Contrlos/Teachers/updateTeacher.js"
import { deleteTeacher } from "./Contrlos/Teachers/deleteTeacher.js"
import { getAllStudents } from "./Contrlos/Students/getAllStudents.js"
import { createStudent } from "./Contrlos/Students/addStudents.js"
import { updateStudent } from "./Contrlos/Students/updateStudents.js"
import { deleteStudent } from "./Contrlos/Students/deleteStudents.js"
import { getAllPrograms } from "./Contrlos/Programs/getAllPrograms.js"
import { createProgram } from "./Contrlos/Programs/createPrograms.js"
import { updateProgram } from "./Contrlos/Programs/updatePrograms.js"
import { deleteProgram } from "./Contrlos/Programs/deletePrograms.js"
import { getAllEvents } from "./Contrlos/Events/getAllEvents.js"
import { createEvent } from "./Contrlos/Events/addEvents.js"
import { updateEvent } from "./Contrlos/Events/updateEvents.js"
import { updateEventStatus } from "./Contrlos/Events/updateEventsStatus.js"
import { getRegisteredTeachers } from "./Contrlos/Teachers/getRegsterdTeachers.js"
import { deleteEvent } from "./Contrlos/Events/deleteEvents.js"
import { getAllRegistrations } from "./Contrlos/Registration/getAllRegistraion.js"
import { createRegistration } from "./Contrlos/Registration/createRegistration.js"
import { getRegistrationsByUser } from "./Contrlos/Registration/getRegistraionByuserId.js"
import { getAllAttendance } from "./Contrlos/Attendance/getAllAttendance.js"
import { markAttendance } from "./Contrlos/Attendance/markAttendance.js"
import { updateAttendanceStatus } from "./Contrlos/Attendance/updateAttendance.js"
import { getAllRatings } from "./Contrlos/Rating/getAllRating.js"
import { upsertRating } from "./Contrlos/Rating/updateRating.js"
import { getAllReports } from "./Contrlos/Reports/getAllReports.js"
import { createReport } from "./Contrlos/Reports/createReport.js"
import { deleteReport } from "./Contrlos/Reports/deleteReports.js"
import { getAllNotifications } from "./Contrlos/Notification/getAllNotifications.js"
import { createNotification } from "./Contrlos/Notification/createNotification.js"
import { addReplyToNotification } from "./Contrlos/Notification/createReplyNotification.js"
import { getAllEventResults } from "./Contrlos/EventsResults/getAllEventsResults.js"
import { createEventResults } from "./Contrlos/EventsResults/addEventsResults.js"
import { deleteEventResult } from "./Contrlos/EventsResults/deleteEventsResults.js"
import { updateUser , updateProfileImage } from "./Contrlos/UpdateUser/updateuser.js";

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error("❌ MongoDB Connection Failed:", error.message);
    });

// In-memory OTP storage
const otpStore = new Map(); // Key: registerNumber, Value: otp

// Consolidate CORS configuration and fix trailing slash
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Create or connect to database

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));


app.post("/add-allowed-admin", addAllowedAdmin);
app.post("/verify-id", verifyId);
app.post("/send-otp", sendOtp);
app.post("/verify-otp", verifyOtp);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/api/users/lookup/:regNo", lookupUserByRegisterNumber);
app.get("/api/users", getAllUsers);
app.put("/api/users/:id", updateUser);
app.put("/api/profile-picture/:id", upload.array("file", 5), updateProfileImage);
app.get("/api/teachers", getAllTeachers);
app.post("/api/teachers", addTeacher);
app.put("/api/teachers/:id", updateTeacher);
app.delete("/api/teachers/:id", deleteTeacher);
app.get("/api/students", getAllStudents);
app.post("/api/students", createStudent);
app.put("/api/students/:id", updateStudent);
app.delete("/api/students/:id", deleteStudent);
app.get("/api/programs", getAllPrograms);
app.post("/api/programs", upload.array("file", 5), createProgram);
app.put("/api/programs/:id", upload.array("file", 5), updateProgram);
app.delete("/api/programs/:id", deleteProgram);
app.get("/api/events", getAllEvents);
app.post("/api/events", upload.array("file", 5), createEvent);
app.put("/api/events/:id", upload.array("file", 5), updateEvent);
app.patch("/api/events/:id/status", updateEventStatus);
app.get("/api/registered-teachers", getRegisteredTeachers);
app.delete("/api/events/:id", deleteEvent);
app.get("/api/registrations", getAllRegistrations);
app.post("/api/registrations", createRegistration);
app.get("/api/registrations/user/:userId", getRegistrationsByUser);
app.get("/api/attendance", getAllAttendance);
app.post("/api/attendance", markAttendance);
app.patch("/api/attendance/:id", updateAttendanceStatus);
app.get("/api/ratings", getAllRatings);
app.post("/api/ratings", upsertRating);
app.get("/api/reports", getAllReports);
app.post("/api/reports", upload.array("file", 5), createReport);
app.delete("/api/reports/:id", deleteReport);
app.get("/api/notifications", getAllNotifications);
app.post("/api/notifications", upload.array("file", 5), createNotification);
app.post("/api/notifications/:id/reply", addReplyToNotification);
app.get("/api/event-results", getAllEventResults);
app.post("/api/event-results", createEventResults);
app.delete("/api/event-results/:id", deleteEventResult);

// // 1. Verify ID
// app.post("/verify-id", (req, res) => {
//     const { registerNumber } = req.body;
//     if (!registerNumber) return res.status(400).json({ error: "ID is required" });

//     const id = registerNumber.toUpperCase();

//     // Check Users table first (if already registered)
//     db.get("SELECT * FROM users WHERE registerNumber = ?", [id], (err, user) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (user) {
//             return res.json({
//                 status: "registered",
//                 email: user.email,
//                 role: user.role,
//                 message: "User already registered"
//             });
//         }

//         // Keep existing logic: SFA -> Student, AED -> Teacher
//         if (id.startsWith("SFA")) {
//             db.get("SELECT * FROM allowed_students WHERE registerNumber = ?", [id], (err, row) => {
//                 if (err) return res.status(500).json({ error: err.message });
//                 if (row) {
//                     return res.json({ status: "allowed", email: row.email, role: "student" });
//                 } else {
//                     return res.status(404).json({ error: "Student ID not found in records." });
//                 }
//             });
//         } else if (id.startsWith("AED")) {
//             db.get("SELECT * FROM allowed_teachers WHERE teacherId = ?", [id], (err, row) => {
//                 if (err) return res.status(500).json({ error: err.message });
//                 if (row) {
//                     return res.json({ status: "allowed", email: row.email, role: "teacher" });
//                 } else {
//                     return res.status(404).json({ error: "Teacher ID not found in records." });
//                 }
//             });
//         } else if (id.startsWith("ADMIN")) {
//             db.get("SELECT * FROM allowed_admins WHERE adminId = ?", [id], (err, row) => {
//                 if (err) return res.status(500).json({ error: err.message });
//                 if (row) {
//                     return res.json({ status: "allowed", email: row.email, role: "admin" });
//                 } else {
//                     return res.status(404).json({ error: "Admin ID not found in records." });
//                 }
//             });
//         } else {
//             return res.status(400).json({ error: "Invalid ID format." });
//         }
//     });
// });

// 2. Send OTP
// app.post("/send-otp", (req, res) => {
//     const { registerNumber } = req.body;
//     if (!registerNumber) return res.status(400).json({ error: "ID is required" });

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Store in memory
//     otpStore.set(registerNumber, otp);
//     console.log(`OTP for ${registerNumber}: ${otp}`); // Log for testing

//     // In a real app, send email here
//     // await sendEmail(email, otp);

//     res.json({ message: "OTP sent successfully", otp: otp }); // Returning OTP for testing convenience
// });

// 3. Verify OTP
// app.post("/verify-otp", (req, res) => {
//     const { registerNumber, otp } = req.body;

//     if (otpStore.get(registerNumber) === otp) {
//         otpStore.delete(registerNumber); // Clear used OTP
//         res.json({ message: "OTP verified" });
//     } else {
//         res.status(400).json({ error: "Invalid OTP" });
//     }
// });

// 4. Register (Signup)
// app.post("/register", (req, res) => {
//     const {
//         name, email, password, role,
//         registerNumber, department, mobile,
//         semester, admissionNumber,
//         gender, designation, qualification
//     } = req.body;

//     const stmt = db.prepare(`
//         INSERT INTO users (
//             name, email, password, role, registerNumber, department, mobile,
//             semester, admissionNumber, gender, designation, qualification
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `);

//     stmt.run(
//         name, email, password, role, registerNumber, department, mobile,
//         semester, admissionNumber, gender, designation, qualification,
//         function (err) {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }
//             res.json({ message: "User registered successfully", userId: this.lastID });
//         }
//     );
//     stmt.finalize();
// });

// 5. Login
// app.post("/login", (req, res) => {
//     const { registerNumber, password } = req.body;
//     console.log(registerNumber, password);

//     db.get("SELECT * FROM users WHERE registerNumber = ? AND password = ?", [registerNumber, password], (err, user) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (user) {
//             const { password, ...userWithoutPassword } = user; // Exclude password
//             res.json({ user: userWithoutPassword });
//         } else {
//             res.status(401).json({ error: "Invalid credentials" });
//         }
//     });
// });

// Update lookup endpoint for team members
// app.get("/api/users/lookup/:regNo", (req, res) => {
//     const { regNo } = req.params;
//     db.get("SELECT name, registerNumber, department FROM users WHERE registerNumber = ?", [regNo.toUpperCase()], (err, row) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (row) {
//             res.json(row);
//         } else {
//             res.status(404).json({ error: "User not found" });
//         }
//     });
// });

// Get all registered users (for roster mapping)
// app.get("/api/users", (req, res) => {
//     db.all("SELECT id, name, email, role, registerNumber, department, mobile, semester FROM users", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// 6. Teacher Management APIs

// Get all teachers
// app.get("/api/teachers", (req, res) => {
//     db.all("SELECT * FROM allowed_teachers", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// Add a teacher
// app.post("/api/teachers", (req, res) => {
//     const { teacherId, email } = req.body;
//     if (!teacherId || !email) return res.status(400).json({ error: "Missing fields" });

//     const stmt = db.prepare("INSERT INTO allowed_teachers (teacherId, email) VALUES (?, ?)");
//     stmt.run(teacherId, email, function (err) {
//         if (err) {
//             if (err.message.includes("UNIQUE constraint failed")) {
//                 return res.status(400).json({ error: "Teacher ID already exists" });
//             }
//             return res.status(500).json({ error: err.message });
//         }
//         res.json({ message: "Teacher added", id: this.lastID });
//     });
//     stmt.finalize();
// });

// // Update a teacher
// app.put("/api/teachers/:id", (req, res) => {
//     const { id } = req.params; // Old teacherId
//     const { teacherId, email } = req.body; // New values

//     const stmt = db.prepare("UPDATE allowed_teachers SET teacherId = ?, email = ? WHERE teacherId = ?");
//     stmt.run(teacherId, email, id, function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         if (this.changes === 0) return res.status(404).json({ error: "Teacher not found" });
//         res.json({ message: "Teacher updated" });
//     });
//     stmt.finalize();
// });

// Delete a teacher
// app.delete("/api/teachers/:id", (req, res) => {
//     const { id } = req.params;
//     const stmt = db.prepare("DELETE FROM allowed_teachers WHERE teacherId = ?");
//     stmt.run(id, function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         if (this.changes === 0) return res.status(404).json({ error: "Teacher not found" });
//         res.json({ message: "Teacher deleted" });
//     });
//     stmt.finalize();
// });

// 7. Student Management APIs

// Get all students
// app.get("/api/students", (req, res) => {
//     db.all("SELECT * FROM allowed_students", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// // Add a student
// app.post("/api/students", (req, res) => {
//     const { regNo, email } = req.body;
//     if (!regNo || !email) return res.status(400).json({ error: "Missing fields" });

//     const stmt = db.prepare("INSERT INTO allowed_students (registerNumber, email) VALUES (?, ?)");
//     stmt.run(regNo.toUpperCase(), email.toLowerCase(), function (err) {
//         if (err) {
//             if (err.message.includes("UNIQUE constraint failed")) {
//                 return res.status(400).json({ error: "Register Number already exists" });
//             }
//             return res.status(500).json({ error: err.message });
//         }
//         res.json({ message: "Student added", id: this.lastID });
//     });
//     stmt.finalize();
// });

// // Update a student
// app.put("/api/students/:id", (req, res) => {
//     const { id } = req.params; // Old registerNumber
//     const { regNo, email } = req.body; // New values

//     const stmt = db.prepare("UPDATE allowed_students SET registerNumber = ?, email = ? WHERE registerNumber = ?");
//     stmt.run(regNo.toUpperCase(), email.toLowerCase(), id, function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         if (this.changes === 0) return res.status(404).json({ error: "Student not found" });
//         res.json({ message: "Student updated" });
//     });
//     stmt.finalize();
// });

// Delete a student
// app.delete("/api/students/:id", (req, res) => {
//     const { id } = req.params;
//     const stmt = db.prepare("DELETE FROM allowed_students WHERE registerNumber = ?");
//     stmt.run(id, function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         if (this.changes === 0) return res.status(404).json({ error: "Student not found" });
//         res.json({ message: "Student deleted" });
//     });
//     stmt.finalize();
// });

// 8. Program Management APIs

// Get all programs
// app.get("/api/programs", (req, res) => {
//     db.all("SELECT * FROM programs", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         // Parse features JSON for each program
//         const programs = rows.map(p => ({
//             ...p,
//             features: JSON.parse(p.features || "[]")
//         }));
//         res.json(programs);
//     });
// });

// Add a program
// app.post("/api/programs", (req, res) => {
//     const {
//         name, category, image, brochure, title,
//         programDate, programTime, description, features
//     } = req.body;

//     const stmt = db.prepare(`
//         INSERT INTO programs (
//             name, category, image, brochure, title, 
//             programDate, programTime, description, features
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `);

//     stmt.run(
//         name, category, image, brochure, title,
//         programDate, programTime, description, JSON.stringify(features || []),
//         function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: "Program created successfully", id: this.lastID });
//         }
//     );
//     stmt.finalize();
// });

// // Update a program
// app.put("/api/programs/:id", (req, res) => {
//     const { id } = req.params;
//     const {
//         name, category, image, brochure, title,
//         programDate, programTime, description, features
//     } = req.body;

//     const stmt = db.prepare(`
//         UPDATE programs SET 
//             name = ?, category = ?, image = ?, brochure = ?, title = ?, 
//             programDate = ?, programTime = ?, description = ?, features = ?
//         WHERE id = ?
//     `);

//     stmt.run(
//         name, category, image, brochure, title,
//         programDate, programTime, description, JSON.stringify(features || []),
//         id,
//         function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             if (this.changes === 0) return res.status(404).json({ error: "Program not found" });
//             res.json({ message: "Program updated successfully" });
//         }
//     );
//     stmt.finalize();
// });

// Delete a program
// // Delete a program
// app.delete("/api/programs/:id", (req, res) => {
//     const { id } = req.params;

//     // First delete associated events
//     const deleteEventsStmt = db.prepare("DELETE FROM events WHERE programId = ?");
//     deleteEventsStmt.run(id, (err) => {
//         if (err) {
//             console.error("Error deleting associated events:", err);
//             // Continue to delete program even if event deletion fails (or handle as transaction)
//         }
//     });
//     deleteEventsStmt.finalize();

//     // Then delete the program
//     const stmt = db.prepare("DELETE FROM programs WHERE id = ?");
//     stmt.run(id, function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         if (this.changes === 0) return res.status(404).json({ error: "Program not found" });
//         res.json({ message: "Program and associated events deleted successfully" });
//     });
//     stmt.finalize();
// });

// 9. Event Management APIs



// Get all events
// app.get("/api/events", (req, res) => {
//     db.all("SELECT * FROM events", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         const events = rows.map(e => ({
//             ...e,
//             sponsorImages: JSON.parse(e.sponsorImages || "[]")
//         }));
//         res.json(events);
//     });
// });

// Add an event
// app.post("/api/events", (req, res) => {
//     const {
//         programId, programName, eventName, description, date,
//         startTime, endTime, venue, latitude, longitude,
//         incharge, department, participationType,
//         overallIndividualLimit, departmentIndividualLimit,
//         membersPerTeamFromDepartment, teamsPerDepartment,
//         poster, priceImage, sponsorImages, status
//     } = req.body;

//     const stmt = db.prepare(`
//         INSERT INTO events (
//             programId, programName, eventName, description, date,
//             startTime, endTime, venue, latitude, longitude,
//             incharge, department, participationType,
//             overallIndividualLimit, departmentIndividualLimit,
//             membersPerTeamFromDepartment, teamsPerDepartment,
//             poster, priceImage, sponsorImages, status
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `);

//     stmt.run(
//         programId, programName, eventName, description, date,
//         startTime, endTime, venue, latitude, longitude,
//         incharge, department, participationType,
//         overallIndividualLimit, departmentIndividualLimit,
//         membersPerTeamFromDepartment, teamsPerDepartment,
//         poster, priceImage, JSON.stringify(sponsorImages || []),
//         status || 'pending',
//         function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: "Event created successfully", id: this.lastID });
//         }
//     );
//     stmt.finalize();
// });

// Update an event
// app.put("/api/events/:id", (req, res) => {
//     const { id } = req.params;
//     const {
//         programId, programName, eventName, description, date,
//         startTime, endTime, venue, latitude, longitude,
//         incharge, department, participationType,
//         overallIndividualLimit, departmentIndividualLimit,
//         membersPerTeamFromDepartment, teamsPerDepartment,
//         poster, priceImage, sponsorImages, status
//     } = req.body;

//     const stmt = db.prepare(`
//         UPDATE events SET 
//             programId = ?, programName = ?, eventName = ?, description = ?, date = ?,
//             startTime = ?, endTime = ?, venue = ?, latitude = ?, longitude = ?,
//             incharge = ?, department = ?, participationType = ?,
//             overallIndividualLimit = ?, departmentIndividualLimit = ?,
//             membersPerTeamFromDepartment = ?, teamsPerDepartment = ?,
//             poster = ?, priceImage = ?, sponsorImages = ?, status = ?
//         WHERE id = ?
//     `);

//     stmt.run(
//         programId, programName, eventName, description, date,
//         startTime, endTime, venue, latitude, longitude,
//         incharge, department, participationType,
//         overallIndividualLimit, departmentIndividualLimit,
//         membersPerTeamFromDepartment, teamsPerDepartment,
//         poster, priceImage, JSON.stringify(sponsorImages || []),
//         status, id,
//         function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             if (this.changes === 0) return res.status(404).json({ error: "Event not found" });
//             res.json({ message: "Event updated successfully" });
//         }
//     );
//     stmt.finalize();
// });

// Update event status
// app.patch("/api/events/:id/status", (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body;

//     const stmt = db.prepare("UPDATE events SET status = ? WHERE id = ?");
//     stmt.run(status, id, function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         if (this.changes === 0) return res.status(404).json({ error: "Event not found" });
//         res.json({ message: "Event status updated" });
//     });
//     stmt.finalize();
// });

// Get registered teachers (with names)
// app.get("/api/registered-teachers", (req, res) => {
//     db.all("SELECT id, name, department, registerNumber FROM users WHERE role = 'teacher'", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// // Delete an event
// app.delete("/api/events/:id", (req, res) => {
//     const { id } = req.params;
//     const stmt = db.prepare("DELETE FROM events WHERE id = ?");
//     stmt.run(id, function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         if (this.changes === 0) return res.status(404).json({ error: "Event not found" });
//         res.json({ message: "Event deleted successfully" });
//     });
//     stmt.finalize();
// });

// 10. Registration Management APIs

// Create registrations table
// db.run(`
//     CREATE TABLE IF NOT EXISTS registrations (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         eventId INTEGER,
//         userId TEXT,
//         userName TEXT,
//         userEmail TEXT,
//         registeredUserDept TEXT,
//         participationType TEXT,
//         teamData TEXT, -- JSON string
//         status TEXT DEFAULT 'pending',
//         registeredAt TEXT DEFAULT CURRENT_TIMESTAMP
//     )
// `);

// Get all registrations
// app.get("/api/registrations", (req, res) => {
//     db.all("SELECT * FROM registrations", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         const processed = rows.map(r => ({
//             ...r,
//             teamData: JSON.parse(r.teamData || "null")
//         }));
//         res.json(processed);
//     });
// });

// Add a registration
// app.post("/api/registrations", (req, res) => {
//     const {
//         eventId, userId, userName, userEmail, registeredUserDept,
//         participationType, teamData, status
//     } = req.body;

//     const stmt = db.prepare(`
//         INSERT INTO registrations (
//             eventId, userId, userName, userEmail, registeredUserDept,
//             participationType, teamData, status
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `);

//     stmt.run(
//         eventId, userId, userName, userEmail, registeredUserDept,
//         participationType, JSON.stringify(teamData || null),
//         status || 'pending',
//         function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: "Registration successful", id: this.lastID });
//         }
//     );
//     stmt.finalize();
// });

// Get registrations for a specific user (including team memberships)
// app.get("/api/registrations/user/:userId", (req, res) => {
//     const { userId } = req.params;

//     // First get the user's register number to search in teamData JSON
//     db.get("SELECT registerNumber FROM users WHERE id = ?", [userId], (err, userRecord) => {
//         if (err) return res.status(500).json({ error: err.message });

//         let query = "SELECT * FROM registrations WHERE userId = ?";
//         let params = [userId];

//         if (userRecord && userRecord.registerNumber) {
//             // Search in teamData JSON string for the register number
//             query = `
//                 SELECT * FROM registrations 
//                 WHERE userId = ? 
//                 OR (participationType = 'team' AND teamData LIKE ?)
//             `;
//             params = [userId, `%${userRecord.registerNumber}%`];
//         }

//         db.all(query, params, (err, rows) => {
//             if (err) return res.status(500).json({ error: err.message });
//             const processed = rows.map(r => ({
//                 ...r,
//                 teamData: JSON.parse(r.teamData || "null")
//             }));
//             res.json(processed);
//         });
//     });
// });

// 11. Attendance Management APIs

// Create attendance table
// db.run(`
//     CREATE TABLE IF NOT EXISTS attendance (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         eventId INTEGER,
//         userId TEXT,
//         status TEXT DEFAULT 'pending',
//         date TEXT DEFAULT CURRENT_TIMESTAMP
//     )
// `);

// // Get all attendance records
// app.get("/api/attendance", (req, res) => {
//     db.all("SELECT * FROM attendance", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// Mark/Update attendance
// app.post("/api/attendance", (req, res) => {
//     const { eventId, userId, status } = req.body;
//     const stmt = db.prepare("INSERT INTO attendance (eventId, userId, status) VALUES (?, ?, ?)");
//     stmt.run(eventId, userId, status || 'pending', function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: "Attendance marked", id: this.lastID });
//     });
//     stmt.finalize();
// });

// // Update attendance status (Approve/Reject)
// app.patch("/api/attendance/:id", (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body;
//     db.run("UPDATE attendance SET status = ? WHERE id = ?", [status, id], function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: "Attendance status updated" });
//     });
// });

// 12. Rating & Review APIs

// Create ratings table
// db.run(`
//     CREATE TABLE IF NOT EXISTS ratings (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         eventId INTEGER,
//         userId TEXT,
//         rating INTEGER,
//         review TEXT,
//         createdAt TEXT DEFAULT CURRENT_TIMESTAMP
//     )
// `);

// // Get all ratings
// app.get("/api/ratings", (req, res) => {
//     db.all("SELECT * FROM ratings", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// Add/Update a rating
// app.post("/api/ratings", (req, res) => {
//     const { eventId, userId, rating, review } = req.body;

//     // Use an UPSERT-like logic (Delete existing and insert new for simplicity in SQLite < 3.24)
//     db.serialize(() => {
//         db.run("DELETE FROM ratings WHERE eventId = ? AND userId = ?", [eventId, userId]);
//         const stmt = db.prepare("INSERT INTO ratings (eventId, userId, rating, review) VALUES (?, ?, ?, ?)");
//         stmt.run(eventId, userId, rating, review, function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: "Rating submitted successfully", id: this.lastID });
//         });
//         stmt.finalize();
//     });
// });

// 13. Event Reports APIs

// Create reports table
// db.run(`
//     CREATE TABLE IF NOT EXISTS reports (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         programName TEXT,
//         image TEXT, -- Base64 for now as per frontend logic
//         description TEXT,
//         createdAt TEXT DEFAULT CURRENT_TIMESTAMP
//     )
// `);

// Get all reports
// app.get("/api/reports", (req, res) => {
//     db.all("SELECT * FROM reports ORDER BY createdAt DESC", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// Add a report
// app.post("/api/reports", (req, res) => {
//     const { programName, image, description } = req.body;
//     const stmt = db.prepare("INSERT INTO reports (programName, image, description) VALUES (?, ?, ?)");
//     stmt.run(programName, image, description, function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: "Report added successfully", id: this.lastID });
//     });
//     stmt.finalize();
// });

// Delete a report
// app.delete("/api/reports/:id", (req, res) => {
//     const { id } = req.params;
//     db.run("DELETE FROM reports WHERE id = ?", [id], function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: "Report deleted successfully" });
//     });
// });

// 14. Notification Management APIs

// Get all notifications
// app.get("/api/notifications", (req, res) => {
//     db.all("SELECT * FROM notifications ORDER BY timestamp DESC", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         const processed = rows.map(r => ({
//             ...r,
//             replies: JSON.parse(r.replies || "[]")
//         }));
//         res.json(processed);
//     });
// });

// Add a notification
// app.post("/api/notifications", (req, res) => {
//     const { subject, message, image, senderRole, recipientType, recipientId, canReply } = req.body;

//     const stmt = db.prepare(`
//         INSERT INTO notifications (
//             subject, message, image, senderRole, recipientType, recipientId, canReply, timestamp, replies
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `);

//     const timestamp = new Date().toISOString();
//     stmt.run(
//         subject, message, image, senderRole, recipientType, recipientId, canReply !== undefined ? canReply : 1, timestamp, JSON.stringify([]),
//         function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: "Notification sent successfully", id: this.lastID });
//         }
//     );
//     stmt.finalize();
// });

// Add a reply to a notification
// app.post("/api/notifications/:id/reply", (req, res) => {
//     const { id } = req.params;
//     const { message, senderId, senderName } = req.body;

//     db.get("SELECT replies FROM notifications WHERE id = ?", [id], (err, row) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (!row) return res.status(404).json({ error: "Notification not found" });

//         const replies = JSON.parse(row.replies || "[]");
//         const newReply = {
//             id: Date.now().toString(),
//             message,
//             sender: { id: senderId, name: senderName },
//             timestamp: new Date().toISOString()
//         };
//         replies.push(newReply);

//         const stmt = db.prepare("UPDATE notifications SET replies = ? WHERE id = ?");
//         stmt.run(JSON.stringify(replies), id, function (err) {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: "Reply added successfully", reply: newReply });
//         });
//         stmt.finalize();
//     });
// });

// 15. Event Results (Winners) APIs

// Get all event results
// app.get("/api/event-results", (req, res) => {
//     db.all("SELECT * FROM event_results ORDER BY announcedAt DESC", [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         const processed = rows.map(r => ({
//             ...r,
//             winners: JSON.parse(r.winners || "[]")
//         }));
//         res.json(processed);
//     });
// });

// Add event results (Multiple prize levels for an event)
// app.post("/api/event-results", (req, res) => {
//     const { eventId, eventName, results } = req.body; // results is [{ prizeLevel, winners: [{name, regNo}] }]

//     if (!eventId || !results || !Array.isArray(results)) {
//         return res.status(400).json({ error: "Invalid data format" });
//     }

//     const stmt = db.prepare(`
//             INSERT INTO event_results (eventId, eventName, prizeLevel, winners)
//             VALUES (?, ?, ?, ?)
//         `);

//     db.serialize(() => {
//         results.forEach(resItem => {
//             stmt.run(
//                 eventId,
//                 eventName,
//                 resItem.prizeLevel,
//                 JSON.stringify(resItem.winners || [])
//             );
//         });
//         stmt.finalize((err) => {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: "Results announced successfully" });
//         });
//     });
// });

// Delete an event result
// app.delete("/api/event-results/:id", (req, res) => {
//     const { id } = req.params;
//     db.run("DELETE FROM event_results WHERE id = ?", [id], function (err) {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: "Result deleted successfully" });
//     });
// });

// Home route
app.get("/", (req, res) => {
    res.send("Backend is running with Authentication");


});


// app.post("/addAdmin", (req, res) => {

// })

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
