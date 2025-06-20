import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SavedNotes() {
    const navigate= useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('https://notestack-zfde.onrender.com/api/notes');
        setNotes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);
const handleEdit = (note) => {
    navigate('/AddNewNote', { state: { noteToEdit: note } });
};

  const handleDelete = async (noteId) => {
  if (!window.confirm("Are you sure you want to delete this note?")) return;
  try {
    await axios.delete(`https://notestack-zfde.onrender.com/api/notes/${noteId}`);
    setNotes(notes.filter(note => note._id !== noteId));
    toast.success("Note deleted!");
  } catch (error) {
    console.error("Failed to delete note:", error);
    toast.error("Failed to delete note.");
  }
};

  <style>{`
    .saved-note h2 {
    font-size: 16px;
  }
    .saved-note h2 {
    font-size: 16px;
  }
    @media (max-width: 768px) {
      .saved-note {
        padding: 12px;
        font-size: 15px;
      }

      .saved-note .buttons {
        flex-direction: column;
        gap: 6px;
        top: 10px;
        right: 10px;
      }

      .saved-note audio {
        width: 100%;
      }
    }
  `}</style>


  return (
    
    <div style={{ padding: '20px' }}>
      <h2>📚 Saved Notes</h2>
      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No saved notes found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notes.map((note) => (
          <div key={note._id} className='saved-note'style={{
  background: '#fff',
  borderRadius: '12px',
  padding: '16px',
  margin: '12px 0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  position: 'relative',
}}>
  <div dangerouslySetInnerHTML={{ __html: note.content }} style={{
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#333',
  }} />

  <div className='buttons' style={{
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    gap: '8px',
  }}>
    <button
      onClick={() => handleDelete(note._id)}
      style={{
        background: '#ff4d4f',
        color: '#fff',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      🗑️ Delete
    </button>

     {<button
      onClick={() => handleEdit(note)}
      style={{
        background: '#1890ff',
        color: '#fff',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      ✏️ Edit
    </button> }
    
  </div>
</div>

          ))}
        </ul>
      )}
      
    </div>
  );
}

export default SavedNotes;
