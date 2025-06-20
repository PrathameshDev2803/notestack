const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});
router.post('/', async (req, res) => {
  console.log("📥 Incoming body:", req.body); // 👈 IMPORTANT for debugging

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const savedNote = await Note.create({ content });
    res.status(201).json(savedNote);
  } catch (err) {
    console.error('❌ Error saving note:', err);
    res.status(500).json({ message: 'Error saving note', error: err.message });
  }
});
// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, { content }, { new: true });
    res.json(updatedNote);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ message: 'Error updating note' });
  }
});
// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ message: 'Error deleting note' });
  }
});



module.exports = router; 

