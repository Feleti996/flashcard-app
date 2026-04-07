import axios from "axios";

// 🔥 IMPORTANT: use full backend URL
const API = "http://localhost:5000/flashcards"; 
// OR try: "http://localhost:5000/api/flashcards"
// (depends on your backend)

export const getFlashcards = () => axios.get(API);

export const createFlashcard = (data) => axios.post(API, data);

export const updateFlashcard = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteFlashcard = (id) =>
  axios.delete(`${API}/${id}`);
