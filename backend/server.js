const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/flashcards")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ✅ Schema (FIXED: added category)
const FlashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
  category: String,

  // ✅ improved fields
  used: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});
const Flashcard = mongoose.model("Flashcard", FlashcardSchema);

app.get("/flashcards", async (req, res) => {
  const cards = await Flashcard.find().sort({ _id: -1 }); // oldest → newest
  res.json(cards);
});


app.post("/flashcards", async (req, res) => {
  const card = new Flashcard({
    question: req.body.question,
    answer: req.body.answer,
    category: req.body.category, // ✅ ADD THIS
    used: false,
    created_at: new Date(),
  });
  await card.save();
  res.json(card);
});

app.put("/flashcards/:id", async (req, res) => {
  const updated = await Flashcard.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

app.delete("/flashcards/:id", async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✅ Start server
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
