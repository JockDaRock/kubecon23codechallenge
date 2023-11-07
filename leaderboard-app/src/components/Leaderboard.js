import React, { useState, useEffect, useRef } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import Player from './Player';
import '../styles/Leaderboard.css';
import io from 'socket.io-client';  // Import the socket.io-client

function Leaderboard() {
    const totalAvatars = 25;  // Assuming you have 25 avatar images
    const assignRandomAvatar = () => Math.floor(Math.random() * totalAvatars) + 1;

    const initialPlayers = Array.from({ length: 25 }, (_, index) => ({
        id: `someid${index.toString().padStart(3, '0')}`, // Creates IDs like 'someid000', 'someid001', etc.
        firstName: `FirstName${index + 1}`,
        lastName: `LastName${index + 1}`,
        completionTime: (Math.random() * (12 - 5) + 5).toFixed(2), // Random time between 5 and 12 minutes
        email: `email${index + 1}@example.com`,
        avatar: assignRandomAvatar()
    }));

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
        const socket = io('http://localhost:8181');

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
                                <Player
                                    rank={index + 1}
                                    firstName={player.firstName}
                                    lastName={player.lastName}
                                    completionTime={player.completionTime}
                                    email={player.email}
                                    avatar={player.avatar}
                                />
                            </div>
                        </Flipped>
                    ))}
                </Flipper>
            </div>
        </div>
    );
}

export default Leaderboard;