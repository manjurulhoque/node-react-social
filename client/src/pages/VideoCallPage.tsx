import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Peer from "simple-peer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPhoneSlash,
    faMicrophone,
    faMicrophoneSlash,
    faVideo,
    faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";

const VideoCallPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { socket } = useSocket();
    const { user } = useAuth();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance | null>(null);

    useEffect(() => {
        if (!socket || !userId || !user) return;

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }

                socket.emit("call_user", {
                    to: userId,
                    signalData: null,
                    from: user._id,
                    name: user.name,
                });
            })
            .catch((err) => {
                console.error("Error accessing media devices:", err);
            });

        socket.on("call_received", ({ signal, from, name }) => {
            if (!stream) return;

            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream,
            });

            peer.on("signal", (data) => {
                socket.emit("answer_call", { signal: data, to: from });
            });

            peer.on("stream", (remoteStream) => {
                setRemoteStream(remoteStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = remoteStream;
                }
            });

            peer.signal(signal);
            connectionRef.current = peer;
            setCallAccepted(true);
        });

        socket.on("call_accepted", (signal) => {
            if (!stream) return;

            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream,
            });

            peer.on("signal", (data) => {
                socket.emit("call_user", {
                    to: userId,
                    signalData: data,
                    from: user._id,
                    name: user.name,
                });
            });

            peer.on("stream", (remoteStream) => {
                setRemoteStream(remoteStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = remoteStream;
                }
            });

            peer.signal(signal);
            connectionRef.current = peer;
            setCallAccepted(true);
        });

        socket.on("call_ended", () => {
            endCall();
        });

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            if (connectionRef.current) {
                connectionRef.current.destroy();
            }
        };
    }, [socket, userId, user, stream]);

    const answerCall = () => {
        setCallAccepted(true);
    };

    const endCall = () => {
        setCallEnded(true);
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
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

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    return (
        <Container fluid className="video-call-container">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col md={8}>
                    <Card className="video-call-card">
                        <Card.Body>
                            <div className="video-grid">
                                <div className="video-container">
                                    <video
                                        playsInline
                                        muted
                                        ref={myVideo}
                                        autoPlay
                                        className="my-video"
                                    />
                                </div>
                                <div className="video-container">
                                    <video
                                        playsInline
                                        ref={userVideo}
                                        autoPlay
                                        className="user-video"
                                    />
                                </div>
                            </div>
                            <div className="controls mt-3">
                                <Button
                                    variant={isMuted ? "danger" : "primary"}
                                    onClick={toggleMute}
                                    className="mx-2"
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            isMuted
                                                ? faMicrophoneSlash
                                                : faMicrophone
                                        }
                                    />
                                </Button>
                                <Button
                                    variant={isVideoOff ? "danger" : "primary"}
                                    onClick={toggleVideo}
                                    className="mx-2"
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            isVideoOff ? faVideoSlash : faVideo
                                        }
                                    />
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={endCall}
                                    className="mx-2"
                                >
                                    <FontAwesomeIcon icon={faPhoneSlash} />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default VideoCallPage;
