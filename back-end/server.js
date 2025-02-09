const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb://localhost:27017";
const client = new MongoClient(MONGO_URI);
let db;

client.connect().then(() => {
    db = client.db("studentsDB");
    console.log("✅ MongoDB connected");
}).catch((err) => {
    console.error("❌ MongoDB unconnect", err);
});

// 📌 ดึงข้อมูลนักศึกษาทั้งหมด
app.get('/students', async (req, res) => {
    try {
        const students = await db.collection("students").find().toArray();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// 📌 เพิ่มนักศึกษาใหม่
app.post('/students', async (req, res) => {
    try {
        const { name, age, phone, major } = req.body;
        if (!name || !age || !phone || !major) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newStudent = { _id: new Date().getTime().toString(), name, age: parseInt(age), phone, major };
        await db.collection("students").insertOne(newStudent);
        res.json({ message: "Student added", student: newStudent });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// 📌 ลบนักศึกษา
app.delete('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.collection("students").deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ message: "Student deleted" });
    } catch (err) {
        res.status(500).json({ error: "Invalid ID format" });
    }
});

// 📌 แก้ไขข้อมูลนักศึกษา
app.put('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        if (!updateData.name && !updateData.age && !updateData.phone && !updateData.major) {
            return res.status(400).json({ error: "No fields to update" });
        }
        if (updateData.age) updateData.age = parseInt(updateData.age);
        await db.collection("students").updateOne({ _id: id }, { $set: updateData });
        res.json({ message: "Student updated" });
    } catch (err) {
        res.status(500).json({ error: "Invalid ID format" });
    }
});

// 📌 เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log("✅ Server started on port 3000");
});