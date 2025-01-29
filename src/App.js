// App.js
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import 'jspdf-autotable';

// Import your components
import AndroidManifestAnalysis from './components/AndroidManifestAnalysis';
import LintAnalysis from './components/LintAnalysis';
import DependencyCheck from './components/DependencyCheck';
import MOBSFAnalysis from './components/MOBSFAnalysis';
import JsonUploader from './JsonUploader'; // Import JsonUploader
import Chatbot from './Chatbot'; // Import Chatbot
import Navbar from './Navbar'; // Import Navbar component
import Footer from './Footer'; // Import Footer component

const TypewriterText = () => {
  const typewriterRef = useRef(null);

  useEffect(() => {
    const element = typewriterRef.current;
    if (element) {
      const handleAnimationEnd = () => {
        element.classList.add('finished');
      };

      // Add event listener for animation end
      element.addEventListener('animationend', handleAnimationEnd);

      // Clean up the event listener
      return () => {
        element.removeEventListener('animationend', handleAnimationEnd);
      };
    }
  }, []);

  return (
    <header className="typewriter-container">
      <h1 ref={typewriterRef} className="typewriter">
        Hello, welcome to Static Analysis of APK
      </h1>
    </header>
  );
};

function App() {
  const [activeComponent, setActiveComponent] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false); // State for Chatbot visibility
  const [previousComponent, setPreviousComponent] = useState(null); // To track the previous component

  // Display buttons after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
      setActiveComponent('buttons');
      console.log("Buttons should now be visible");
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChatbot = () => setShowChatbot(true);
  const handleCloseChatbot = () => setShowChatbot(false);

  const handleBack = () => {
    setActiveComponent(previousComponent);
    setPreviousComponent(null); // Clear the previous component after navigating back
  };

  const handleComponentChange = (component) => {
    setPreviousComponent(activeComponent); // Set the current component as the previous one
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'manifest':
        return <AndroidManifestAnalysis />;
      case 'lint':
        return <LintAnalysis />;
      case 'dependency':
        return <DependencyCheck />;
      case 'mobsf':
        return <MOBSFAnalysis />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Navbar handleOpenChatbot={handleOpenChatbot} /> {/* Pass the handler to Navbar */}

      <video autoPlay loop muted className="background-video">
        <source src="/bg.mp4" type="video/mp4" /> 
        Your browser does not support the video tag.
      </video>

      <TypewriterText /> {/* Use the TypewriterText component here */}

      {showButtons && (
        <div className="button-group">
          <button onClick={() => handleComponentChange('manifest')}>Manifest Analysis</button>
          <button onClick={() => handleComponentChange('lint')}>Lint Analysis</button>
          <button onClick={() => handleComponentChange('dependency')}>Dependency Check</button>
          <button onClick={() => handleComponentChange('mobsf')}>In-depth Analysis</button>
        </div>
      )}

      {activeComponent && (
        <div className="component-container">
          {/* Render a back button if there is an active component */}
          {previousComponent && (
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
          )}
          {renderComponent()}
        </div>
      )}

      {/* Render the JsonUploader component */}
      <JsonUploader />

      {/* Render the Chatbot component */}
      {showChatbot && <Chatbot onClose={handleCloseChatbot} />}

      {/* Render the Footer component */}
      
    </div>
  );
}

export default App;
