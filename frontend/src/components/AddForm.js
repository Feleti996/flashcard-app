import React, { useState } from "react";

function AddForm({ addCard }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  // ⭐ Auto-grow function (must be ABOVE return)
  const autoGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim() || !category.trim()) {
      alert("⚠️ Please fill in Question, Answer, and Category!");
      return;
    }

    addCard({ question, answer, category });

    setQuestion("");
    setAnswer("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-box">
      <textarea
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onInput={autoGrow}
        className="input-box auto-grow"
      />

      <textarea
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onInput={autoGrow}
        className="input-box auto-grow"
      />

      <textarea
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        onInput={autoGrow}
        className="input-box auto-grow"
      />

      <button type="submit" className="add-btn">
        + Add
      </button>
    </form>
  );
}

export default AddForm;
