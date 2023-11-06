import React, { useState, useEffect, useRef } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import Player from './Player';
import '../styles/Leaderboard.css';
import io from 'socket.io-client';  // Import the socket.io-client

function Leaderboard() {
    const totalAvatars = 10;
    const assignRandomAvatar = () => Math.floor(Math.random() * totalAvatars) + 1;
    const initialPlayers = [
        // Mock data
        { id: 1, name: 'Clifford James', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 2, name: 'Edgar Soto', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 3, name: 'Nevaeh Silva', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 4, name: 'Clayton Watson', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 5, name: 'Debbie Lane', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 6, name: 'Gabriella Steward', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 7, name: 'Nina Perkins', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 8, name: 'Dennis Henry', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 9, name: 'Courtney Fuller', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 10, name: 'Joan Wood', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 11, name: 'Isaac Mitchell', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 12, name: 'Natalie Reyes', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 13, name: 'Harold Ford', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 14, name: 'Bethany Lane', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 15, name: 'Leonardo Garcia', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 16, name: 'Samantha Paul', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 17, name: 'Oliver Lee', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 18, name: 'Katherine Brooks', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 19, name: 'Jordan Bell', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 20, name: 'Bianca Hall', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 21, name: 'Julian Torres', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 22, name: 'Alyssa Rogers', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 23, name: 'Ethan Gomez', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 24, name: 'Vivian Knight', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        { id: 25, name: 'Benjamin Hughes', completionTime: Math.floor(Math.random() * 841) + 60, avatar: assignRandomAvatar() },
        // ..more players
    ];

    const [menuOpen, setMenuOpen] = useState(false);  // New state for controlling the menu's visibility

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    }

    const menuRef = useRef(null); // Add this ref to attach it to the menu div
    const hamburgerRef = useRef(null); // Add this ref to attach it to the hamburger button

    const outsideClickListener = (event) => {
        if (
            menuRef.current && 
            !menuRef.current.contains(event.target) && 
            !hamburgerRef.current.contains(event.target)  // Exclude hamburger button
        ) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', outsideClickListener);
        return () => {
            document.removeEventListener('mousedown', outsideClickListener);
        };
    }, []);
    
    const [players, setPlayers] = useState(initialPlayers);
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        const socket = io('http://localhost:3002');

        socket.on('connect', () => {
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            setSocketConnected(false);
        });

        socket.on('updatePlayers', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const updateRandomPlayerCompletionTime = () => {
        let updatedPlayers = [...players];
        const randomPlayerIndex = Math.floor(Math.random() * updatedPlayers.length);
        updatedPlayers[randomPlayerIndex].completionTime += Math.floor(Math.random() * 841) + 60;

        // Sort players based on completion time (ascending)
        updatedPlayers.sort((a, b) => a.completionTime - b.completionTime);
    
        setPlayers(updatedPlayers);
    };

    // Leaderboard player sizing

    // Leaderboard expand/collapse logic
    const [showAll, setShowAll] = useState(false);

    const displayedPlayers = showAll ? players : players.slice(0, 10);

    useEffect(() => {
        // Close the leaderboard if clicked outside
        const handleClickOutside = event => {
            if (!event.target.closest('.leaderboard')) {
                setShowAll(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="leaderboard">
            <button 
                className="hamburger-menu" 
                onClick={toggleMenu} 
                ref={hamburgerRef}  // Attach the ref here
            >
                ☰
            </button>

            {menuOpen && (
                <div className="menu" ref={menuRef}> {/* Attach the ref here */}
                    {!socketConnected && 
                        <button onClick={updateRandomPlayerCompletionTime}>Update Random Player Completion Time</button>
                    }
                    {players.length > 10 && !showAll &&
                        <button onClick={() => setShowAll(true)}>Expand</button>
                    }
                    {showAll &&
                        <button onClick={() => setShowAll(false)}>Collapse</button>
                    }
                </div>
            )}
            <div className="leaders">
                <Flipper flipKey={displayedPlayers.map(p => p.completionTime).join('')}>
                    {displayedPlayers.map((player, index) => (
                        <Flipped key={player.id} flipId={player.id}>
                            <div>
                                <Player rank={index + 1} avatar={player.avatar} {...player} />
                            </div>
                        </Flipped>
                    ))}
                </Flipper>
            </div>
        </div>
    );
}

export default Leaderboard;