import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

function AddNewNote() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  if (!editor) return null;

  const getButtonStyle = (isActive) => ({
    height: '50px',
    width: '50px',
    borderRadius: '12px',
    border: `1.8px solid ${isActive ? '#007bff' : '#ddd'}`,
    margin: '0 6px',
    backgroundColor: isActive ? '#007bff' : '#fafafa',
    boxShadow: isActive 
      ? '0 4px 12px rgba(0,123,255,0.3)' 
      : '0 2px 8px rgba(0,0,0,0.08)',
    fontSize: '20px',
    fontWeight: 'bold',
    color: isActive ? '#fff' : '#444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    userSelect: 'none',
    outline: 'none',
    transform: 'scale(1)',
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#fffefb' }}>
      <div style={{ height: '100%', position: 'relative' }}>
        <EditorContent
          editor={editor}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            padding: '2rem',
            fontSize: '1.7rem',
            lineHeight: 1.6,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: '#fffefb',
            color: '#2f2f2f',
            caretColor: '#a07be2',
            minHeight: 'calc(100vh - 4rem)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div
        style={{
          height: '70px',
          maxWidth: '90vw',
          padding: '10px 20px',
          border: '2px solid #e0e0e0',
          borderRadius: '16px',
          backgroundColor: '#fff',
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
        }}
      >
        <button
          style={getButtonStyle(editor.isActive('bold'))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>

        <button
          style={getButtonStyle(editor.isActive('italic'))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </button>

        <button
          style={getButtonStyle(editor.isActive('strike'))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </button>

        <div style={{ width: '1px', height: '30px', backgroundColor: '#ddd', margin: '0 5px' }} />

        <button
          style={getButtonStyle(false)}
        >
          🎨
        </button>

        <button
          style={getButtonStyle(false)}
        >
          🖼️
        </button>

        <button
          style={getButtonStyle(false)}
        >
          🎤
        </button>

        <div style={{ width: '1px', height: '30px', backgroundColor: '#ddd', margin: '0 5px' }} />

        <button
          style={getButtonStyle(false)}
          onClick={() => {
            const html = editor.getHTML();
            console.log('Saved:', html);
            alert('Note saved!');
          }}
        >
          💾
        </button>

        <button
          style={getButtonStyle(false)}
        >
          ❌
        </button>
      </div>
    </div>
  );
}

export default AddNewNote;
