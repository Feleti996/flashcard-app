import React from "react";

function Flashcard({
  card,
  isFlipped,
  toggleFlip,
  removeCard,
  startEdit,
  editingId,
  editQuestion,
  editAnswer,
  editCategory,
  setEditQuestion,
  setEditAnswer,
  setEditCategory,
  saveEdit,
  cancelEdit,
}) {
  // 🚨 CRASH PREVENTION
  if (!card) return null;

  // ⭐ Auto-grow function (must be ABOVE return)
  const autoGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="card">
      {editingId === card._id ? (
        <>
          <textarea
            value={editQuestion}
            onChange={(e) => setEditQuestion(e.target.value)}
            onInput={autoGrow}
            className="input-box auto-grow editing"
          />

          <textarea
            value={editAnswer}
            onChange={(e) => setEditAnswer(e.target.value)}
            onInput={autoGrow}
            className="input-box auto-grow editing"
          />

          <textarea
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            onInput={autoGrow}
            className="input-box auto-grow editing"
          />

          <button className="btn btn-green" onClick={saveEdit}>
            Save
          </button>

          <button className="btn btn-grey" onClick={cancelEdit}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <div
            className={`card-inner ${isFlipped ? "flipped" : ""}`}
            onClick={() => toggleFlip(card._id)}
          >
            <div className="card-face saved">{card.question}</div>
            <div className="card-face saved card-back">{card.answer}</div>
          </div>

          <div className="card-category">{card.category}</div>

          <div className="actions">
            <button
              className="btn btn-yellow"
              onClick={(e) => {
                e.stopPropagation();
                startEdit(card);
              }}
            >
              Edit
            </button>

            <button
              className="btn btn-red"
              onClick={(e) => {
                e.stopPropagation();
                removeCard(card._id);
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Flashcard;
