const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://localhost:27017/";
const dbName = "github";

// Middleware
app.use(express.json());

let db, students;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        students = db.collection("users");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all users
app.get('/users', async (req, res) => {
    try {
        const allUsers = await students.find().toArray();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

// GET: Get user by ID
app.get('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await students.findOne({ userId });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send("Error fetching user: " + err.message);
    }
});

// POST: Add a new user
app.post('/users', async (req, res) => {
    try {
        const newUser = req.body;
        const result = await students.insertOne(newUser);
        res.status(201).send(`User added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding user: " + err.message);
    }
});

// PATCH: Update user by ID
app.patch('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;
        const result = await students.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updates }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating user: " + err.message);
    }
});

// DELETE: Remove user by ID
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await students.deleteOne({ userId });
        if (result.deletedCount === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).send("User deleted");
    } catch (err) {
        res.status(500).send("Error deleting user: " + err.message);
    }
});
