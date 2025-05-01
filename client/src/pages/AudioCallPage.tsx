import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { Container, Card, Button } from "react-bootstrap";
import { Mic, MicMute, Phone } from "react-bootstrap-icons";
import Peer from "simple-peer";
import "../styles/AudioCallPage.css";

interface CallSignalData {
    to: string;
    signalData: any;
    from: string;
    name: string;
}

const AudioCallPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { socket } = useSocket();
    const { user } = useAuth();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const connectionRef = useRef<Peer.Instance | null>(null);

    const cleanup = () => {
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
                track.enabled = false;
            });
        }
        if (connectionRef.current) {
            try {
                connectionRef.current.removeAllListeners();
                connectionRef.current.destroy();
            } catch (err) {
                console.error("Error destroying peer connection:", err);
            }
        }
        if (socket) {
            socket.off("call_accepted");
            socket.off("call_ended");
        }
    };

    useEffect(() => {
        if (!socket || !userId || !user) return;

        let peer: Peer.Instance | null = null;

        navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then((currentStream) => {
                setStream(currentStream);
                if (localAudioRef.current) {
                    localAudioRef.current.srcObject = currentStream;
                }

                peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: currentStream,
                });

                peer.on("signal", (data) => {
                    socket.emit("call_user", {
                        to: userId,
                        signalData: data,
                        from: user._id,
                        name: user.name,
                    } as CallSignalData);
                });

                peer.on("stream", (remoteStream) => {
                    setRemoteStream(remoteStream);
                    if (remoteAudioRef.current) {
                        remoteAudioRef.current.srcObject = remoteStream;
                    }
                });

                peer.on("error", (err) => {
                    console.error("Peer connection error:", err);
                    endCall();
                });

                connectionRef.current = peer;
            })
            .catch((err) => {
                console.error("Error accessing media devices:", err);
                endCall();
            });

        socket.on("call_accepted", (signal) => {
            if (!stream || !connectionRef.current) return;
            try {
                connectionRef.current.signal(signal);
                setCallAccepted(true);
            } catch (err) {
                console.error("Error handling call acceptance:", err);
                endCall();
            }
        });

        socket.on("call_ended", () => {
            endCall();
        });

        return () => {
            cleanup();
        };
    }, [socket, userId, user]);

    const endCall = () => {
        setCallEnded(true);
        cleanup();
        if (socket && userId) {
            socket.emit("end_call", { to: userId });
        }
        navigate("/");
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    return (
        <Container className="audio-call-container">
            <Card className="audio-call-card">
                <div className="call-status">
                    <h3>Audio Call</h3>
                    <p>
                        {callAccepted ? "Call in progress..." : "Connecting..."}
                    </p>
                </div>
                <div className="audio-elements">
                    <audio ref={localAudioRef} autoPlay muted />
                    <audio ref={remoteAudioRef} autoPlay />
                </div>
                <div className="controls">
                    <Button
                        variant={isMuted ? "danger" : "primary"}
                        onClick={toggleMute}
                        disabled={!callAccepted}
                    >
                        {isMuted ? <MicMute /> : <Mic />}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={endCall}
                        disabled={!callAccepted}
                    >
                        <Phone />
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default AudioCallPage;
