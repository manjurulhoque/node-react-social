import React, { useEffect, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { Phone, X } from "react-bootstrap-icons";
import "../styles/IncomingCallNotification.css";

interface IncomingCallNotificationProps {
    callerName: string;
    onAccept: () => void;
    onReject: () => void;
}

const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({
    callerName,
    onAccept,
    onReject,
}) => {
    // const audioRef = useRef<HTMLAudioElement>(null);

    // useEffect(() => {
    //     const audio = audioRef.current;
    //     // Play caller tune when component mounts
    //     if (audio) {
    //         audio.loop = true;
    //         audio.play().catch((err) => {
    //             console.error("Error playing caller tune:", err);
    //         });
    //     }

    //     // Cleanup function to stop audio when component unmounts
    //     return () => {
    //         if (audio) {
    //             audio.pause();
    //             audio.currentTime = 0;
    //         }
    //     };
    // }, []);

    const handleAccept = () => {
        // if (audioRef.current) {
        //     audioRef.current.pause();
        //     audioRef.current.currentTime = 0;
        // }
        onAccept();
    };

    const handleReject = () => {
        // if (audioRef.current) {
        //     audioRef.current.pause();
        //     audioRef.current.currentTime = 0;
        // }
        onReject();
    };

    return (
        <div className="incoming-call-overlay">
            <Card className="incoming-call-card">
                <Card.Body>
                    <div className="caller-info">
                        <h4>Incoming Call</h4>
                        <p>{callerName}</p>
                    </div>
                    <div className="call-actions">
                        <Button
                            variant="success"
                            className="accept-btn"
                            onClick={handleAccept}
                        >
                            <Phone size={24} />
                        </Button>
                        <Button
                            variant="danger"
                            className="reject-btn"
                            onClick={handleReject}
                        >
                            <X size={24} />
                        </Button>
                    </div>
                </Card.Body>
            </Card>
            {/* <audio ref={audioRef} src="/sounds/caller-tune.mp3" /> */}
        </div>
    );
};

export default IncomingCallNotification;
