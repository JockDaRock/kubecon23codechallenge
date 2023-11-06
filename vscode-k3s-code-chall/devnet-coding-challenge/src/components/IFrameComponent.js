// src/components/IFrameComponent.js
import React from 'react';

function IFrameComponent(props) {
    return (
        <iframe 
            src={props.src}
            title={props.title}
            width="100%" 
            height="100%"
            frameBorder="0"  // This is to remove the default border around iframes.
            allowFullScreen  // This allows the iframe content to be viewed in full screen.
        ></iframe>
    );
}

export default IFrameComponent;
