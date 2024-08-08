import express from "express";
import {
  createNote, 
  getNote,
  deleteNote,
  searchNote,
  updateNote,
  getAllNotes,
  updateIsPinned,
} from "../controllers/NoteController.js";
import { authenticatedToken } from "../midleware/verifyToken.js";

const router = express.Router();

router.route('/add-note').post(authenticatedToken ,createNote);
router.route('/:id').get(getNote)
router.route('/delete-note/:id').delete(authenticatedToken, deleteNote);
router.route('/edit-note/:id').put(authenticatedToken, updateNote);
router.route('/update-note-pinned/:id').put(authenticatedToken, updateIsPinned);
router.route('/notes/all').get(authenticatedToken, getAllNotes);

export default router