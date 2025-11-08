// instal;
const express = require('express');
const app = express();
// import env variables
require('dotenv').config();


app.use(express.json());

// fake database 
const tweets = [
    { id: 1, user: 'Alice', tweet: 'Hello World!' },
    { id: 2, user: 'Bob', tweet: 'My second tweet' },
];

// Middleware to validate tweet input
const validateInput = (req, res, next) => {
    const { user, tweet } = req.body;
    if (!user || !tweet) {
        res.status(400).json({ error: "User and tweet content are required" });
    }
    else{
        next();
    }

 }

app.post("/api/tweets", validateInput, (req, res) => {
    const newTweet = {
        id: tweets.length + 1,
        user: req.body.user,
        tweet: req.body.tweet
    };
    tweets.push(newTweet);
    res.send(newTweet);
});

// GET /tweets - Retrieve all tweets
app.get("/api/tweets/:user", (req, res) => {
    let target = tweets.find(t => t.user === req.params.user);
    if (!target) {
        res.status(404).json({ error: "Tweet not found" });
    }
    else {
        res.send(target);
    }
    res.send(tweets);
});

app.post("/api/tweets", (req, res) => {
    const newTweet = {
        id: tweets.length + 1,
        user: req.body.user,
        tweet: req.body.tweet
    };
    tweets.push(newTweet);
    res.send(newTweet);
}
);

app.delete("/api/tweets/:id", (req, res) => {
    const tweetId = parseInt(req.params.id);
    const tweetIndex = tweets.findIndex(t => t.id === tweetId);
    if (tweetIndex === -1) {
        res.status(404).json({ error: "Tweet not found" });
    } else {
        const deletedTweet = tweets.splice(tweetIndex, 1);
        res.send(deletedTweet);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
});