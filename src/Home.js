import React, { useRef, useState, useEffect} from 'react'
import Navbar from './components/Navbar'

import { useNavigate } from 'react-router-dom'
import axios from 'axios';


function Home() {
  const featureRefs = useRef([]);
  const [showSavedButton, setShowSavedButton] = useState(false);
  useEffect(() => {
  const hasSaved = localStorage.getItem('hasSavedNote');
  if (hasSaved === 'true') {
    setShowSavedButton(true);
  }
}, []);
  const [isPressed, setIsPressed]= useState(false);
  const cardRef= useRef(null);
  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  featureRefs.current.forEach((ref) => {
    if (ref) observer.observe(ref);
  });

  return () => {
    featureRefs.current.forEach((ref) => {
      if (ref) observer.unobserve(ref);
    });
  };
}, []);

    const navigate= useNavigate();

  const handleClick=()=>{
    navigate('/AddNewNote');
  }
  const getGreeting=()=>{
    const hour= new Date().getHours();
    if(hour<12) return 'Good Morning';
    if(hour<18) return 'Good Afternoon';
    return 'Good Evening';
  }
  
  const createRipple= (event)=>{
    const card= event.currentTarget;
    const circle= document.createElement('span');
    const diameter= Math.max(card.clientWidth, card.clientHeight);
    const radius= diameter/2;

    circle.style.width= circle.style.height=`${diameter}px`;
    circle.style.left= `${event.clientX - card.getBoundingClientRect().left-radius}px`;
    circle.style.top= `${event.clientY - card.getBoundingClientRect().top- radius}px`;
    circle.classList.add('ripple');

    const ripple= card.querySelectorAll('ripple')[0];
    if(ripple)ripple.remove();
    card.appendChild(circle);
  }
  return (
    <div style={{
      minHeight:'100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(145deg, #fefcfa, #f8f4f0)',
      color: '#2f2f2f',
      padding:'20px',
      boxSizing:'border-box'
    }}>
      <style>
        {`
        @media (max-width: 768px) {
  .note-card-wrapper {
    flex-direction: column !important;
    align-items: center !important;
    gap: 16px !important;
  }

  .note-card {
    width: 80% !important;
  }
}

        @media (max-width: 768px) {
  .feature-section, .value-section {
    padding: 20px 10px !important;
  }

  .feature-section h2,
  .value-section h2 {
    font-size: 20px !important;
  }

  .feature-section li,
  .value-section p,
  .value-section h3 {
    font-size: 14px !important;
  }
}

        .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in-up.visible {
        opacity: 1;
        transform: translateY(0);
        }

        .note-card:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        }

        @media (max-width: 600px) {
        .note-buttons {
        flex-direction: column;
        gap: 16px;
        }
        }

        @media (max-width: 768px) {
        .note-card h2 {
        font-size: 14px;
        }
        .note-card i {
        font-size: 22px;
        }
        }

        @keyframes slideFadeIn{
        0%{
        opacity: 0;
        transform: translateY(20px);
        }
        100%{
        opacity:1;
        transform: translateY(0);
        }
        }
         @keyframes fadeInUp{
          0%{
            opacity:0;
            transform:translateY(30px);
          }
            100%{
            opacity: 1;
            transform: translateY(0);
            }
        }
            @keyframes floatBlob{
            0%, 100%{
            transform: translate(0,0) scale(1);
            }
            50%{
            transform: translate(10px,-10px) scale(1.05);
            }
            
            }
            
            .note-card:before,
            .note-card::after{
            content:'';
            position:absolute;
            width:60px;
            height:60px;
            border-radius: 50%;
            background: rgba(255,182,193,0.2);
            animation: floatBlob 6s ease-in-out infinite;
            z-index:0;
            }
            
            .note-card:before{
            top:20px;
            left:20px;
            }
            
            .note-card::after{
            bottom:20px;
            right: 20px;
            background: rgba(173,216,230,0.2)
            }
            .note-card{
            overflow: hidden;
            position: relative;}
            
            .ripple{
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 600ms linear;
            background-color: rgba(0,0,0,0.15);
            pointer-events:none;
            }
            
            @keyframes rippleEffect{
            to{
            transform:scale(4),
            opacity:0;
            }
            }
            .note-card:hover .tooltip{
            opacity:1;
            transform: translateY(-5px);
            animation: popFadeIn 0.3s ease forwards;
            }
            .tooltip::after{
            content:'';
            position: absolute;
            top:-6px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: transparent transparent #333 transparent;
            }
            @keyframe popFadeIn{
            0%{
            opacity:0;
            transform: translateY(8px) scale(0.95);
            }
            100%{
            opacity:1;
            transform: translateY(0) scale(1);
            }
            }`
        }
      
      </style>
      <Navbar/>
      <div style={{
        animation: 'fadeInUp 0.8s ease',
        position:'relative',
        zIndex:1
      }}>
      <div style={{
        position:'absolute',
        top:'60px',
        left:'20px',
        width:'200px',
        height:'200px',
        background:'radial-gradient(circle at 30% 30%, rgba(255,183,197,0.4), transparent 60%)',
        borderRadius:'50%',
        filter:'blur(30px)',
        zIndex:0
      }}></div>
      <div style={{
        position:'absolute',
        bottom:'40px',
        right:'40px',
        width:'150px',
        height:'150px',
        background:'radial-gradient(circle at 70% 70%, rgba(173,216,230,0.3),transparent 60%)',
        borderRadius:'50%',
        filter:'blur(25px)',
        zIndex:0
      }}></div>
      <div style={{
        marginTop:'40px',
        textAlign:'center'
      }}>
        <h1 style={{
          fontSize:'clamp(28px, 5vw, 36px)',
          fontWeight:'600',
          marginBottom:'10px',
        }}>{getGreeting()}</h1>

        <p style={{
  fontSize: 'clamp(14px, 2.2vw, 18px)',
  color: '#555',
  marginTop: '4px',
  lineHeight: '1.6'
}}>
  Organize your thoughts. Express your ideas. Capture every detail with ease.
</p>

        </div>
      <div style={{
  marginTop: '50px',
  padding: '0 20px',
  textAlign: 'center',
  animation: 'fadeInUp 0.6s ease',
}}>
  <h2 style={{
    fontSize: 'clamp(20px, 4vw, 28px)',
    marginBottom: '12px',
    color: '#333'
  }}>
    ✨ What is NoteStack?
  </h2>
  <p style={{
    fontSize: 'clamp(14px, 2vw, 16px)',
    color: '#555',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: 1.6,
  }}>
    NoteStack is a beautiful and simple notepad app built for mindful writing. 
    Whether you’re jotting ideas, journaling, or organizing your thoughts, 
    NoteStack gives you a clean, creative, and calming space to do it all.
  </p>
</div>
       <div className='note-card-wrapper'style={{
        width:'100%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'40px 10px',
        flexWrap:'wrap',
        gap:'20px',
        marginTop:'80px'
    }}>
      <div id='AddItem' 
      ref={cardRef}
      className='note-card'
      style={{
        height:'120px',
        width:'clamp(100px, 22vw, 140px)',
        minWidth:'100px',
        border:'none',
        background:'white',
        position:'relative',
        cursor:'pointer',
        borderRadius:'20px',
        boxShadow:isPressed?'0 2px 6px rgba(0,0,0,0.08)':'0 4px 12px rgba(0,0,0,0.1)',
        transform: isPressed? 'scale(0.96)':'scale(1)',
        animation:'slideFadeIn 0.8s ease-out 0.4s',
        animationFillMode:'both',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        transition:'transform 0.3s ease, box-shadow 0.3s ease'
      }}

      
      onMouseDown={()=> setIsPressed(true)}
      onMouseUp={()=> setIsPressed(false)}
      onMouseLeave={()=> setIsPressed(false)}
    
       onClick={(e)=>{
        createRipple(e);
        handleClick();
      }}
    
      >
        <i className="fas fa-plus" style={{
          fontSize:'28px',
           marginBottom:'10px',
           color:'#333'}}></i>
        <h2 style={{
          fontSize:'16px',
          textAlign:'center',
          color:'#444',
          margin:0}}>Create New Note</h2>
          <span className='tooltip' style={{
            position:'absolute',
            bottom:'-30px',
            background:'#333',
            color:'#fff',
            padding:'6px 12px',
            borderRadius:'6px',
            fontSize:'12px',
            opacity:'0',
            transition:'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents:'none',
          }}>Click to add a new note
          </span>
        


      </div>
      {showSavedButton && (
  <div
    className='note-card'
    style={{
      height: '120px',
      width: 'clamp(100px, 22vw, 140px)',
      minWidth: '100px',
      border: 'none',
      background: '#fff',
      position: 'relative',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    onClick={() => {
     navigate('/saved-notes')
    }}
  >
    <i className="fas fa-eye" style={{
      fontSize: '28px',
      marginBottom: '10px',
      color: '#333'
    }}></i>
    <h2 style={{
      fontSize: '16px',
      textAlign: 'center',
      color: '#444',
      margin: 0
    }}>
      View Saved Notes
    </h2>
  </div>
)}

      </div>
      

      
    </div>
    <div 
    className='feature-section'style={{
  marginTop: '60px',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
  animation: 'fadeInUp 0.8s ease'
}}>
  <h2 style={{
    fontSize: '24px',
    marginBottom: '12px',
    textAlign: 'center'
  }}>✨ Features</h2>
  <ul style={{
    listStyle: 'none',
    padding: '0',
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#444'
  }}>
    <li>📝 Rich text editor with formatting</li>
    <li>🎨 Customizable background and themes</li>
    <li>🖼️ Insert images and audio easily</li>
    <li>🔒 Password protection for private notes</li>
    <li>💾 Auto-save to prevent data loss</li>
  </ul>
</div>
<div 
 className="value-section"
 style={{
  marginTop: '60px',
  padding: '40px 20px',
  background: 'linear-gradient(to right, #fefefe, #f9f9f9)',
  borderRadius: '20px',
  maxWidth: '1000px',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
}}>
  <h2 style={{
    textAlign: 'center',
    fontSize: 'clamp(22px, 5vw, 28px)',
    color: '#333',
    marginBottom: '30px',
  }}>
    💡 Why NoteStack?
  </h2>

  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  }}>
    {[
      { emoji: '🚀', title: 'Fast & Lightweight', desc: 'Blazing fast experience with no lag — just open and write!' },
      { emoji: '🔐', title: 'Safe & Secure', desc: 'Keep your private thoughts locked away with password protection.' },
      { emoji: '🎯', title: 'Distraction-Free', desc: 'Minimal UI focused on writing, not clutter.' },
      { emoji: '🌈', title: 'Highly Customizable', desc: 'Change background, insert images, or even voice notes.' }
    ].map((item, index) => (
      <div key={index}
      className="fade-in-up"
      ref={(el) => (featureRefs.current[index] = el)}
      style={{
        flex: '1 1 220px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
      }}>
        <div style={{ fontSize: '30px', marginBottom: '10px' }}>{item.emoji}</div>
        <h3 style={{ fontSize: '18px', marginBottom: '6px', color: '#222' }}>{item.title}</h3>
        <p style={{ fontSize: '14px', color: '#555' }}>{item.desc}</p>
      </div>
    ))}
  </div>
</div>


    </div>
  )
}

export default Home
