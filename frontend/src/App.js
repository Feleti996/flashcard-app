import React, { useState, useEffect } from "react";
import "./App.css";
import {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "./services/flashcardService";

function App() {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  const [flippedId, setFlippedId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [studyMode, setStudyMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [studyFlipped, setStudyFlipped] = useState(false);

  useEffect(() => {
    if (studyMode) {
      document.body.className = darkMode ? "dark study" : "light study";
    } else {
      document.body.className = darkMode ? "dark" : "light";
    }
  }, [darkMode, studyMode]);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const res = await getFlashcards();
      setCards(res.data);
    } catch (err) {
      console.error("❌ Error loading cards:", err);
      alert("Failed to load flashcards. Please try again.");
    }
  };

  const addCard = async () => {
    if (!question.trim() || !answer.trim() || !category.trim()) {
      alert("⚠️ Please fill in Question, Answer, and Category!");
      return;
    }

    try {
      await createFlashcard({ question, answer, category });
      loadCards();

      setQuestion("");
      setAnswer("");
      setCategory("");
    } catch (err) {
      alert("❌ Error adding card");
    }
  };

  const removeCard = (id) => {
    // Add fade-out class
    const cardElement = document.getElementById(id);
    if (cardElement) {
      cardElement.classList.add("fade-out");
    }

    // Wait for animation to finish
    setTimeout(async () => {
      try {
        await deleteFlashcard(id);
        await loadCards();
      } catch (err) {
        console.error("❌ Error deleting card:", err);
        alert("Failed to delete card. Please try again.");
      }
    }, 300);
  };

  const toggleFlip = (id) => {
    setFlippedId(flippedId === id ? null : id);
  };

  const startEdit = (card) => {
    setEditingId(card._id);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    setEditCategory(card.category);
  };

  const startStudyMode = async () => {
    if (!cards.length) {
      alert("No more cards left in Study Mode!");
      return;
    }

    const selected = cards[Math.floor(Math.random() * cards.length)];

    try {
      // Mark card as viewed
      await updateFlashcard(selected._id, { used: true });
    } catch (err) {
      console.error("❌ Error marking card as used:", err);
      alert("Failed to update card. Please try again.");
      return;
    }

    setCurrentCard(selected);
    setStudyFlipped(false);

    const remaining = cards.filter((c) => c._id !== selected._id);
    setCards(remaining);

    setStudyMode(true);
  };

  const saveEdit = async () => {
    try {
      await updateFlashcard(editingId, {
        question: editQuestion,
        answer: editAnswer,
        category: editCategory,
      });

      setEditingId(null);
      loadCards();
    } catch (err) {
      console.error("❌ Error saving edit:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  // STUDY MODE
  if (studyMode) {
    return (
      <>
        <div className="header">
          <h1>Flashcards</h1>
        </div>

        <div className="container">
          <h1>Study Mode</h1>

          {currentCard && (
            <div
              className="card study-card"
              onClick={() => setStudyFlipped(!studyFlipped)}
            >
              <div className={`card-inner ${studyFlipped ? "flipped" : ""}`}>
                <div className="card-face card-front">
                  {currentCard.question}
                </div>

                <div className="card-face card-back">
                  {currentCard.answer}
                </div>
              </div>
            </div>
          )}

          <button
            className="btn btn-blue"
            onClick={startStudyMode}
            aria-label="Next flashcard"
          >
            Next
          </button>

          <button
            className="btn btn-grey"
            onClick={() => setStudyMode(false)}
            aria-label="Exit study mode"
          >
            Exit
          </button>
        </div>
      </>
    );
  }

  // NORMAL MODE
  return (
    <>
      <div className={`container page-transition ${studyMode ? "study" : ""}`}>
        <div className="section">
          <h1 className="page-title">Flashcards</h1>
        </div>

        <div className="toolbar">
          <button
            className="btn btn-grey"
            onClick={() => setDarkMode(!darkMode)}
          >
            Toggle Theme
          </button>

          <button
            className="btn btn-green"
            onClick={startStudyMode}
            aria-label="Start study mode"
          >
            Study Mode
          </button>
        </div>

        {/* FORM */}
        <div className="input-box">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCard();
            }}
          >
            <input
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <input
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <button className="btn btn-blue" aria-label="Add flashcard">
              <span className="plus">+</span> Add
            </button>
          </form>
        </div>

        {/* CARDS */}
        <div className="card-grid">
          {cards.length === 0 ? (
            <div className="empty-state">
              <img src="/pen.png" alt="empty" className="empty-icon" />
              <p>No flashcards yet. Add one above!</p>
            </div>
          ) : (
            cards.map((card) => {
              const isFlipped = flippedId === card._id;

              return (
                <div
                  key={card._id}
                  id={card._id}
                  className={`card ${card.used ? "viewed" : ""} ${
                    editingId === card._id ? "editing" : ""
                  }`}
                >
                  {editingId === card._id ? (
                    <>
                      <textarea
                        className="edit-area"
                        onFocus={(e) =>
                          e.target.classList.add("expanded")
                        }
                        onBlur={(e) =>
                          e.target.classList.remove("expanded")
                        }
                        value={editQuestion}
                        onChange={(e) =>
                          setEditQuestion(e.target.value)
                        }
                      />

                      <textarea
                        className="edit-area"
                        onFocus={(e) =>
                          e.target.classList.add("expanded")
                        }
                        onBlur={(e) =>
                          e.target.classList.remove("expanded")
                        }
                        value={editAnswer}
                        onChange={(e) =>
                          setEditAnswer(e.target.value)
                        }
                      />

                      <textarea
                        className="edit-area"
                        onFocus={(e) =>
                          e.target.classList.add("expanded")
                        }
                        onBlur={(e) =>
                          e.target.classList.remove("expanded")
                        }
                        value={editCategory}
                        onChange={(e) =>
                          setEditCategory(e.target.value)
                        }
                      />

                      <button type="button" className="btn btn-green" onClick={saveEdit}>Save</button>
<button type="button" className="btn btn-grey" onClick={() => setEditingId(null)}>Cancel</button>

                    </>
                  ) : (
                    <>
                      <div
                        className={`card-inner ${
                          isFlipped ? "flipped" : ""
                        }`}
                        onClick={() => toggleFlip(card._id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="card-face card-front">
                          <p className="flashcard-text">
                            {card.question}
                          </p>
                        </div>

                        <div className="card-face card-back">
                          <p className="flashcard-text">
                            {card.answer}
                          </p>
                        </div>
                      </div>

                      <div className="card-category">
                        {card.category}
                      </div>

                      <div className="actions">
                        <button
                          className="btn btn-yellow"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(card);
                          }}
                          aria-label="Edit flashcard"
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-red"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCard(card._id);
                          }}
                          aria-label="Delete flashcard"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default App;
