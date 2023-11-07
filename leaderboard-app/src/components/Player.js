import React from 'react';
import '../styles/Player.css';

function timeFormatter(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const Player = React.forwardRef(({ id, firstName, lastName, completionTime, email, avatar }, ref) => {
    // Assuming the avatar image files are named as "avatar1.jpg", "avatar2.jpg", etc.
    // and are placed in the "public/avatars" directory.
    const avatarUrl = `/avatars/avatar${avatar}.png`; // or `.png` if they are png images

    return (
        <div className="player" ref={ref}>
            <div className="avatar">
                <img src={avatarUrl} alt={`${firstName} ${lastName}`} />
            </div>
            <div className="player-info">
                <span className="rank">{id}</span> {/* Rank can be replaced by ID or another prop if needed */}
                <span className="name">{firstName} {lastName}</span>
                <span className="completion-time">{timeFormatter(completionTime)}</span>
                {/* <span className="email">{email}</span> */}
            </div>
        </div>
    );
});

export default Player;
