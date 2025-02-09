const API_URL = "http://localhost:3000/students";

// 📌 ดึงข้อมูลนักศึกษา
async function fetchStudents() {
    const res = await fetch(API_URL);
    const students = await res.json();
    const list = document.getElementById("studentList");
    list.innerHTML = "";
    students.forEach(student => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <div>
                <strong>${student.name}</strong> (Age: ${student.age}) <br>
                📞 ${student.phone} | 🎓 ${student.major} <br>
                <small class="text-muted">ID: ${student._id}</small>
            </div>
            <div>
                <button class="btn btn-warning btn-sm me-2" onclick="editStudent('${student._id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student._id}')">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// 📌 เพิ่มนักศึกษาใหม่
async function addStudent() {
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const phone = document.getElementById("phone").value;
    const major = document.getElementById("major").value;

    if (!name || !age || !phone || !major) {
        alert("⚠️ Please fill all fields!");
        return;
    }

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, phone, major })
    });

    if (res.ok) {
        fetchStudents();
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("major").value = "";
    }
}

// 📌 ลบนักศึกษา
async function deleteStudent(id) {
    if (confirm("⚠️ Are you sure you want to delete this student?")) {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) fetchStudents();
    }
}

// 📌 แก้ไขข้อมูลนักศึกษา
async function editStudent(id) {
    const newName = prompt("Enter new name:");
    const newAge = prompt("Enter new age:");
    const newPhone = prompt("Enter new phone:");
    const newMajor = prompt("Enter new major:");

    if (!newName || !newAge || !newPhone || !newMajor) return;

    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, age: newAge, phone: newPhone, major: newMajor })
    });

    if (res.ok) fetchStudents();
}

// 📌 โหลดข้อมูลเมื่อลงหน้าเว็บ
fetchStudents();