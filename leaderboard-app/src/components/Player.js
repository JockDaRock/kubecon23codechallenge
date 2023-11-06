import React from 'react';
import '../styles/Player.css';

function timeFormatter(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const Player = React.forwardRef(({ rank, name, completionTime, avatar }, ref) => {
    const avatarUrlJPG = `/avatars/avatar${avatar}.jpg`;
    const avatarUrlPNG = `/avatars/avatar${avatar}.png`;

    return (
        <div className="player">
            <div className="avatar">
                {/* Use the avatar in JPG format, if it doesn't exist, fallback to PNG */}
                <img src={avatarUrlJPG} onError={(e) => { e.target.onerror = null; e.target.src = avatarUrlPNG }} alt={name} />
            </div>
            <div className="player-info">
                <span className="rank">{rank}</span>
                <span className="name">{name}</span>
                <span className="completion-time">{timeFormatter(completionTime)}</span>
            </div>
        </div>
    );
});

export default Player;