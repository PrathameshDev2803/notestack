import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Audio from './AudioExtension';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate} from 'react-router-dom';
import './AddNewNote.css';


function AddNewNote() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const noteToEdit = location.state?.noteToEdit || null;
  const [isEditing, setIsEditing] = useState(!!noteToEdit);
  const [bgTransition, setBgTransition] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const backgroundOptions = [
    { type: 'color', value: '#fff8dc' },
    { type: 'color', value: '#e0ffff' },
    { type: 'color', value: '#f0fff0' },
    { type: 'color', value: '#fdfd96' },
    { type: 'color', value: '#fbe4e2' },
    { type: 'image', value: '/backgrounds/bg1.png' },
    { type: 'image', value: '/backgrounds/bg2.png' },
    { type: 'image', value: '/backgrounds/bg3.png' },
    { type: 'image', value: '/backgrounds/bg4.png' },
  ];
  <style>{`
  
  .tiptap.is-editor-empty::before {
    content: attr(data-placeholder);
    color: #999;
    font-style: italic;
    position: absolute;
    pointer-events: none;
  }


    .ProseMirror:focus {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
  @media (max-width: 600px) {
    .ProseMirror {
      font-size: 16px !important;
      padding: 16px !important;
    }
    .tiptap.is-editor-empty::before {
      font-size: 15px;
      color: #aaa;
    }
  }


  button:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 14px rgba(0, 123, 255, 0.3);
  }
  button:active {
  transform: scale(0.95);
  }
  ::-webkit-scrollbar {
  display: none;
  }
  .fade-out {
  animation: fadeOut 0.6s ease forwards;
  }
  @keyframes fadeOut {
  0% {
  opacity: 1;
  transform: scale(1);
  }
  100% {
  opacity: 0;
  transform: scale(0.98);
  }
  }
`}</style>


  const editor = useEditor({
    extensions: [
      Audio,
      Image.configure({ allowBase64: true, HTMLAttributes: { class: 'custom-image' } }),
      TextStyle,
      Color,
      Highlight,
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: noteToEdit?.content || '',
    onUpdate: ({ editor }) => {
  const node = editor.view.domAtPos(editor.state.selection.from)?.node;

  if (!hasTyped && editor.getText().trim().length > 0) {
    setHasTyped(true); 
  }

  if (node?.tagName === 'IMG' || node?.tagName === 'AUDIO') {
    setSelectedImage(node);
  } else {
    setSelectedImage(null);
  }
}

  });

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.classList.contains('audio-delete-btn')) {
        const wrapper = e.target.closest('.audio-wrapper');
        if (wrapper) wrapper.remove();
      }
    };
    setTimeout(() => document.addEventListener('click', handleClick), 100);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  const handleSave = async () => {
  const content = editor.getHTML();
  console.log('Saving content:', content); // 👀 Check this in dev console
  setIsSaving(true);
  localStorage.setItem('hasSavedNote', 'true');

  try {
    if (isEditing) {
      await axios.put(`http://localhost:5000/api/notes/${noteToEdit._id}`, { content });
      toast.success('✏️ Note updated!');
      setIsEditing(false); 
    } else {
      await axios.post('http://localhost:5000/api/notes', { content });
      toast.success('💾 Note saved!');
      editor.commands.clearContent(); // ✅ Clear content
    }
    setIsFadingOut(true);
    setTimeout(() => {
    navigate('/');
    }, 600);


    
  } catch (error) {
    console.error('❌ Save failed:', error);
    toast.error('Save failed');
  } finally {
    setIsSaving(false);
  }
};


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        editor.chain().focus().insertContent(`
          <span class="audio-wrapper">
            <button class="audio-delete-btn">×</button>
            <audio controls src="${url}"></audio>
          </span>
        `).run();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or unavailable.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!editor) return null;

const getButtonStyle = (isActive) => ({
  height: '44px',
  width: '44px',
  minWidth: '44px',
  borderRadius: '12px',
  border: `1.8px solid ${isActive ? '#007bff' : '#ddd'}`,
  backgroundColor: isActive ? '#007bff' : '#fafafa',
  color: isActive ? '#fff' : '#444',
  fontWeight: 'bold',
  fontSize: '18px',
  margin: '0 4px',
  boxShadow: isActive ? '0 4px 12px rgba(0,123,255,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  transition: 'all 0.2s ease-in-out',
});



  const currentBg = backgroundOptions[bgIndex];
  const backgroundStyle = currentBg.type === 'color'
    ? { backgroundColor: currentBg.value }
    : {
        backgroundImage: `url(${currentBg.value})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      };

  return (
    <div
    className={isFadingOut? 'fade-out':''} style={{ height: '100vh', width: '100%', ...backgroundStyle, transition: 'background 0.3s ease-in-out, transform 0.4s ease',     transform: bgTransition ? 'scale(1.02)' : 'scale(1)',
    }}>
      <EditorContent
        editor={editor}
        className={`tiptap ProseMirror ${editor.isEmpty ? 'is-editor-empty' : ''}`}
        data-placeholder="Start writing your note..."
        style={{
          padding: 'clamp(1rem, 4vw, 2rem)',
          fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
          lineHeight: 1.6,
          fontFamily: 'Segoe UI, sans-serif',
          caretColor: '#000',
          minHeight: 'calc(100vh - 4rem)',
          opacity: hasTyped ? 1 : 0,
          transform: hasTyped ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
}}

      />

      <div style={{
         position: 'fixed',
         justifyContent:'center',
         bottom: '30px',
         left: '50%',
         transform: 'translateX(-50%)',
         display: 'flex',
         flexWrap: 'wrap',
         gap: '8px',
         padding: '10px 20px',
         background: '#fff',
         borderRadius: '16px',
         boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
         zIndex: 1000,
         alignItems: 'center',
         overflowX: 'auto',
         maxWidth: '90vw',
         scrollbarWidth: 'none',
         WebkitOverflowScrolling: 'touch',
         transform: `translateX(-50%) ${bgTransition ? 'scale(1.02)' : 'scale(1)'}`
      }}>
        <button style={getButtonStyle(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button style={getButtonStyle(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button style={getButtonStyle(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()}><span style={{ textDecoration: 'line-through' }}>S</span></button>

        <button style={getButtonStyle(false)} onClick={() => {setBgTransition(true); setTimeout(() => setBgTransition(false), 500); setBgIndex((bgIndex + 1) % backgroundOptions.length);
}}
 >🎨</button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
        <button style={getButtonStyle(false)} onClick={() => fileInputRef.current.click()}>🖼️</button>

        <button style={getButtonStyle(isRecording)} onClick={isRecording ? stopRecording : startRecording}>{isRecording ? '⏹️' : '🎤'}</button>

        <button
          disabled={isSaving}
          style={{ ...getButtonStyle(false), opacity: isSaving ? 0.6 : 1 }}
          onClick={handleSave}
        >
          {isSaving ? '⏳' : '💾'}
        </button>
      </div>

      {selectedImage && (
        <div style={{
          position: 'fixed',
          bottom: windowWidth <= 480 ? '160px' : '110px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          padding: '10px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: windowWidth <= 480 ? 'column' : 'row',
          gap: windowWidth <= 480 ? '8px' : '12px',
          width: windowWidth <= 480 ? '90%' : 'auto',
          maxWidth: '320px',
          zIndex: 1001,
        }}>
          <input type="number" placeholder="Width" onChange={(e) => selectedImage.style.width = `${e.target.value}px`} style={{ 
  width: windowWidth <= 480 ? '100%' : '80px',
  padding: '6px',
  border: '1px solid #ccc',
  borderRadius: '6px'
}}
/>
          <input type="number" placeholder="Height" onChange={(e) => selectedImage.style.height = `${e.target.value}px`} style={{ 
  width: windowWidth <= 480 ? '100%' : '80px',
  padding: '6px',
  border: '1px solid #ccc',
  borderRadius: '6px'
}}
 />
          <input type="number" placeholder="Rotate°" onChange={(e) => selectedImage.style.transform = `rotate(${e.target.value}deg)`}  />
        </div>
      )}
    </div>
    
  );
}

export default AddNewNote;
