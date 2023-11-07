const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MURL || "localhost:27017";

app.use(bodyParser.json());

mongoose.connect('mongodb://' + mongoUrl + '/leader', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected successfully to MongoDB");
});

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
});
const counter = mongoose.model('counter', counterSchema);

const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await counter.findOneAndUpdate(
    {_id: sequenceName },
    {$inc: {seq: 1}},
    {new: true, upsert: true}
  );
  return sequenceDocument.seq;
};

const leaderSchema = new mongoose.Schema({
    id: Number,
    firstName: String,
    lastName: String,
    completionTime: Number,
    email: String,
    avatar: Number
}, { timestamps: true });

leaderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const seqValue = await getNextSequenceValue('leaders');
    this.id = seqValue;
  }
  next();
});

leaderSchema.statics.generateRandomAvatar = function() {
  return Math.floor(Math.random() * 22) + 1;
};

const Leader = mongoose.model('Leader', leaderSchema);

app.post('/api/leaders', async (req, res) => {
  try {
    const bodyWithScoreAndAvatar = {
      ...req.body,
      completionTime: req.body.timeElapsed,
      avatar: Leader.generateRandomAvatar()
    };

    const newLeader = new Leader(bodyWithScoreAndAvatar);
    await newLeader.save();
    res.status(201).json(newLeader);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
