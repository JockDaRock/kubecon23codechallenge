import React , { useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { marked as markdownProcessor } from 'marked';
// import sampleMarkdown from './content/sample.md';
// import tutorialConfig from './contentConfig/pages.json';
import './CodingChallenge.css';  // importing our styles
import IFrameComponent from './IFrameComponent';

const leaderboardPostUrl = "http://localhost:5000/leaderboard"


function CodingChallenge({ onSignDown }) {
  const [width, setWidth] = useState(800);
  const [markdownContent, setMarkdownContent] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    //
    // Set up custom renderer for code blocks
    const renderer = new markdownProcessor.Renderer();
    renderer.code = (code, language) => {
      const languageClass = language ? `language-${language}` : 'language-plaintext';
      return `<pre><code class="${languageClass}">${code}</code></pre>`;
    };

    // Set options for marked with our custom renderer
    markdownProcessor.setOptions({ renderer });
    //
    fetch(`/content/pages.json`)
        .then(response => response.json())
        .then(data => {
            setTutorials(data.tutorial_pages);
            if (data.tutorial_pages.length > 0) {
                fetchMarkdownContent(data.tutorial_pages[0].location);
            }
        });
  }, []);
  
  const fetchMarkdownContent = (location) => {
      fetch(`/content/${location}`)
          .then(response => response.text())
          .then(text => setMarkdownContent(markdownProcessor(text)));
  }

  const nextPage = () => {
      const newIndex = pageIndex + 1;
      if (newIndex < tutorials.length) {
          setPageIndex(newIndex);
          let pageContent = tutorials[newIndex].location
          fetchMarkdownContent(pageContent);
      }
  }

  const prevPage = () => {
      const newIndex = pageIndex - 1;
      if (newIndex >= 0) {
          setPageIndex(newIndex);
          let pageContent = tutorials[newIndex].location
          fetchMarkdownContent(pageContent);
      }
  }

  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 15 minutes in seconds

  useEffect(() => {
      const timer = setInterval(() => {
          setTimeRemaining(prevTime => {
              if (prevTime <= 0) {
                  clearInterval(timer);
                  handleTimesUp();
                  return 0;
              }
              return prevTime - 1;
          });
      }, 1000);

      return () => clearInterval(timer);
  }, []);

  const handleTimesUp = async () => {
    const timeElapsed = 5 * 60 - timeRemaining;
    const postData = {
      timeElapsed,
      firstName: sessionStorage.getItem('firstName'),
      lastName: sessionStorage.getItem('lastName'),
      email: sessionStorage.getItem('email')
    };

    await fetch(leaderboardPostUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    // Clearing session storage
    sessionStorage.clear();

    onSignDown();

    // Navigating to SignUp page. This requires React Router or another method, using history.push as an example:
    // history.push('/signup');
    // window.location.href = '/signup';
    // Redirect to SignUp without using a router

  };

  const handleSubmitClick = async () => {
    // Calculate the time elapsed
    const timeElapsed = 10 * 60 - timeRemaining + ((Math.floor(Math.random() * 99))/100);
  
    // Create the data to send
    const postData = {
      timeElapsed,
      firstName: sessionStorage.getItem('firstName'),
      lastName: sessionStorage.getItem('lastName'),
      email: sessionStorage.getItem('email')
    };
  
    // Post the data to the server
    await fetch(leaderboardPostUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
  
    // Clear session storage
    sessionStorage.clear();
  
    // Sign down the user
    onSignDown();
  
    // Redirect to the sign-up page
    // Use history.push('/signup') if you're using React Router
    // Or window.location.href = '/signup' for a hard redirect
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="full-header">
        {/* This is where you'll add buttons later */}
        Cisco DevNet Coding Challenge
      </div>

      <div style={{ display: 'flex', height: '100vh' }}>
      
      <Resizable 
        width={width} 
        height={Infinity} 
        axis="x"
        onResize={(_event, { size }) => setWidth(size.width)}
        resizeHandles={['e']}
      >
        <div style={{ width, height: '100%', marginRight: '1px' }}>
            <div className="left-header">
              Instructions
            </div>
            <div className="panel-content text-content" dangerouslySetInnerHTML={{ __html: markdownContent }}>
                {/* Processed markdown will appear here */}
            </div>
            
            {/* Navigation Buttons */}
            { tutorials.length > 1 &&
                <div className="navigation-buttons">
                    <button onClick={prevPage} disabled={pageIndex === 0}>Previous</button>
                    <button onClick={nextPage} disabled={pageIndex === tutorials.length - 1}>Next</button>
                </div>
            }

            {/* Conditionally render Submit button at the bottom of the last markdown page */}
            { pageIndex === tutorials.length - 1 &&
                <button className="challenge-submit-button" onClick={handleSubmitClick}>Submit</button>
            }
            
        </div>
      </Resizable>

    {/* Divider (optional for visual separation) */}
    {/* <div style={{ width: "5px", cursor: "ew-resize", backgroundColor: "purple" }}></div> */}
    
    {/* Right Panel */}
    <div style={{ flex: 1, width: `calc(100% - ${width}px)`}} className="right-panel-content">
        {/* <IFrameComponent src="https://httpbin.org" title="HTTP Bin" /> */}
        <IFrameComponent src="http://localhost:8080" title="HTTP Bin" />
    </div>
      
    </div>
    <div className="timer">
        {formatTime(timeRemaining)}
    </div>
    </div>
  );
}

export default CodingChallenge;
