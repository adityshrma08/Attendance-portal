const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the `hostel_management` directory
app.use(express.static(__dirname));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Your MySQL username
    password: 'Aditya@123', // Your MySQL password
    database: 'hostel_management'
});

db.connect(err => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err);
        return;
    }
    console.log('✅ MySQL Connected...');
});

// Route to serve `attendance.html` from `hostel_management` directory
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'attendance.html'));
// });


// Route to serve login.html initially
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route to serve attendance.html after login
app.get('/attendance.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'attendance.html'));
});


// API to fetch students
// API to fetch students based on logged-in warden's hostel
app.get('/students', (req, res) => {
    const hostelName = req.query.hostel_name; // Get hostel name from request

    if (!hostelName) {
        return res.status(400).json({ error: 'Hostel name required' });
    }

    db.query('SELECT * FROM students WHERE hostel_name = ?', [hostelName], (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});



// API to fetch attendance history
// API to fetch attendance history for a student
app.get('/attendance-history', (req, res) => {
    const studentId = req.query.student_id;

    if (!studentId) {
        return res.status(400).json({ error: 'Student ID required' });
    }

    db.query('SELECT date, status FROM attendance_history WHERE student_id = ? ORDER BY date DESC', [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching attendance history:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});




// API to fetch a single student's details by ID
// API to fetch a student's name by ID
app.get('/student/:id', (req, res) => {
    const studentId = req.params.id;

    db.query('SELECT name FROM students WHERE id = ?', [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching student details:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        if (results.length > 0) {
            res.json({ name: results[0].name });
        } else {
            res.json({ name: null });
        }
    });
});

// login 

// API to handle warden login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.query('SELECT hostel_name FROM warden WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            const hostelName = results[0].hostel_name;
            res.json({ success: true, hostel: hostelName });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});


// API to handle login (plain text comparison)
// API to save attendance records
app.post('/save-attendance', (req, res) => {
    const attendanceData = req.body;

    if (!attendanceData || !Array.isArray(attendanceData)) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    let values = attendanceData.map(record => [
        record.student_id,
        record.date,
        record.status,
        record.hostel_name
    ]);

    if (values.length === 0) {
        return res.status(400).json({ error: 'No attendance records to save' });
    }

    let query = 'INSERT INTO attendance_history (student_id, date, status, hostel_name) VALUES ?';

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error('❌ Error saving attendance:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: '✅ Attendance saved successfully' });
    });
});




// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});


