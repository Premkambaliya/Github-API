const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017';
const dbName = "Github";

let mongodb;
let client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    mongodb = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

connectDB();




//Task-1 to Task-5

app.get('/users', async (req, res) => {
  try {
    const users = await mongodb.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await mongodb.collection('users').findOne({ userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
    try {
        await mongodb.collection('users').insertOne(req.body);
        res.status(201).send("User added in your file");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

  
app.patch('/users/:userId', async (req, res) => {
    try {
        const result = await mongodb.collection('users').updateOne(
            { userId: req.params.userId },
            { $set: req.body }
        );
        res.status(200).send(`${result.modifiedCount}updated`);
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

app.delete('/users/:userId', async (req, res) => {
    try {
        const result = await mongodb.collection('users').deleteOne({ userId: req.params.userId });
        result.deletedCount > 0 ? res.status(200).send(`${result.deletedCount} document deleted`) : res.status(404).send("User not found");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});





//Task-6 to Task-10


app.get('/repositories', async (req, res) => {
  try {
    const repositories = await mongodb.collection('repositories').find().toArray();
    res.json(repositories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get('/repositories/:repoId', async (req, res) => {
    try {
      const repoId = req.params.repoId;
  
      const repository = await mongodb.collection('repositories').findOne({ repoId });
      if (!repository) {
        res.status(404).json({ error: 'Repository not found' });
      } else {
        res.json(repository);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  app.post('/repositories', async (req, res) => {
    try {
      const newRepo = req.body;
      const result = await mongodb.collection('repositories').insertOne(newRepo);
      res.status(201).send({ message: 'Repository created  in your file', repoId: result.insertedId });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  

  app.patch('/repositories/:repoId', async (req, res) => {
    try {
      const repoId = req.params.repoId;
      const updates = req.body;
      const result = await mongodb.collection('repositories').updateOne({ repoId }, { $set: updates });
      res.status(200).send(`{ message: ${result.modifiedCount}updated }`);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
  app.delete('/repositories/:repoId', async (req, res) => {
    try {
      const repoId = req.params.repoId;
      const result = await mongodb.collection('repositories').deleteOne({ repoId });
      if (result.deletedCount > 0) {
        res.status(200).send({ message: 'Repository deleted' });
      } else {
        res.status(404).send({ error: 'Repository not found' });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  


  // Task-11 to Task-14



app.get('/issues', async (req, res) => {
  try {
    const issues = await mongodb.collection('issues').find().toArray();
    res.json(issues);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/issues', async (req, res) => {
    try {
        const issue = { ...req.body, createdAt: new Date(), closedAt: null };
        const result = await mongodb.collection('issues').insertOne(issue);
        res.status(201).json({ message: 'issue added', issueId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/issues/:issueId/status', async (req, res) => {
    try {
        const result = await mongodb.collection('issues').updateOne(
            { issueId: req.params.issueId },
            { $set: { status: req.body.status } }
        );
        res.status(200).json({ message: 'issue status updated', modifiedCount: result.modifiedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/issues/:issueId', async (req, res) => {
    try {
        const result = await mongodb.collection('issues').deleteOne({ issueId: req.params.issueId });
        res.status(200).json({ message: 'issue deleted', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//Task-15 to Task-17


app.get('/pullRequests', async (req, res) => {
  try {
    const pullRequests = await mongodb.collection('pullRequests').find().toArray();
    res.json(pullRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/pullRequests', async (req, res) => {
    try {
        const result = await mongodb.collection('pullRequests').insertOne({
            prId: req.body.prId,
            repoId: req.body.repoId,
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            status: "open",
            createdAt: new Date().toISOString(),
            mergedAt: null
        });
        res.status(201).send(`Pull requestcreated in your file that ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error creating pull request: " + err.message);
    }
});



app.delete('/pullRequests/:prId', async (req, res) => {
    try {
        const result = await mongodb.collection('pullRequests').deleteOne({ prId: req.params.prId });
        res.status(200).json({ message: 'Pull request deleted on my file', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//Task-18 to Task-20


app.get('/commits', async (req, res) => {
  try {
    const commits = await mongodb.collection('commits').find().toArray();
    res.json(commits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/commits', async (req, res) => {
    try {
        const result = await mongodb.collection('commits').insertOne({
            commitId: req.body.commitId,
            repoId: req.body.repoId,
            userId: req.body.userId,
            message: req.body.message,
            createdAt: new Date().toISOString()
        });
        res.status(201).send(`Commit created with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error creating commit: " + err.message);
    }
});


app.delete('/commits/:commitId', async (req, res) => {
    try {
        const result = await mongodb.collection('commits').deleteOne({ commitId: req.params.commitId });
        if (result.deletedCount > 0) {
            res.status(200).send(`Commit with ID: ${req.params.commitId} deleted`);
        } else {
            res.status(404).send("No commit found with the specified ID");
        }
    } catch (err) {
        res.status(500).send("Error deleting commit: " + err.message);
    }
});


//Task-21 And Task-22


app.post('/forks', async (req, res) => {
    try {
                // Validate the required fields
      const { forkId, repoId, userId, forkedAt } = req.body;
      await mongodb.collection('forks').insertOne({ forkId, repoId, userId, forkedAt });
              // Insert a new fork into the database
      res.status(201).send('Fork created in your collection');
              // Respond with the inserted document ID
    } catch (err) {
      res.status(500).send("Error creating fork: " + err.message);
    }
  });

app.post('/stars', async (req, res) => {
    try {
        // Validate the required fields
      const { starId, repoId, userId, starredAt } = req.body;
      await mongodb.collection('stars').insertOne({ starId, repoId, userId, starredAt });
       // Insert a new fork into the database
      res.status(201).send('Star added');
      // Respond with the inserted document ID
    } catch (err) {
      res.status(500).send("Error adding star: " + err.message);
    }
  });
  

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });