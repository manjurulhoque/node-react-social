import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { User } from "../interfaces/user.interface";
import {
    Card,
    Button,
    Spinner,
    Alert,
    Container,
    Row,
    Col,
    Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMessage,
    faVideo,
    faPhone,
    faUserPlus,
    faUserMinus,
} from "@fortawesome/free-solid-svg-icons";
import AxiosConfig from "../AxiosConfig";

const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { fetchUserById, followUser, unfollowUser, loading, error } =
        useUser();
    const { isAuthenticated, user: currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const loadUserProfile = async () => {
            if (!userId) return;

            setIsLoading(true);
            try {
                await fetchUserById(userId);
                // Find the user in the users array
                const user = await fetchUserProfile(userId);
                setProfileUser(user);

                // Check if current user is following this user
                if (currentUser && user) {
                    const isUserFollowing = user.followers?.includes(
                        currentUser._id
                    );
                    setIsFollowing(!!isUserFollowing);
                }
            } catch (err) {
                console.error("Error loading user profile:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserProfile();
    }, [userId, isAuthenticated, currentUser]);

    const fetchUserProfile = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await AxiosConfig.get(
                `/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status !== 200) {
                throw new Error("Failed to fetch user profile");
            }

            const data = response.data;
            return data.data;
        } catch (err) {
            console.error("Error fetching user profile:", err);
            return null;
        }
    };

    const handleFollow = async () => {
        if (!userId) return;

        try {
            if (isFollowing) {
                await unfollowUser(userId);
            } else {
                await followUser(userId);
            }
            setIsFollowing(!isFollowing);

            // Refresh user profile
            const updatedUser = await fetchUserProfile(userId);
            setProfileUser(updatedUser);
        } catch (err) {
            console.error("Error following/unfollowing user:", err);
        }
    };

    const handleMessage = () => {
        navigate(`/chat/${userId}`);
    };

    const handleAudioCall = () => {
        navigate(`/call/${userId}?type=audio`);
    };

    const handleVideoCall = () => {
        navigate(`/call/${userId}?type=video`);
    };

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "80vh" }}
            >
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="m-3">
                {error}
            </Alert>
        );
    }

    if (!profileUser) {
        return (
            <Alert variant="warning" className="m-3">
                User not found
            </Alert>
        );
    }

    const isOwnProfile = currentUser && currentUser._id === userId;

    return (
        <Container className="mt-4" style={{ maxWidth: "800px" }}>
            <Card>
                {/* Cover Image */}
                <div
                    style={{
                        height: "200px",
                        backgroundImage: `url(${
                            profileUser.coverPicture ||
                            "https://via.placeholder.com/1200x300"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Profile Info */}
                <Card.Body className="position-relative">
                    <Image
                        src={
                            profileUser.profilePicture ||
                            `https://ui-avatars.com/api/?name=${profileUser.name}`
                        }
                        roundedCircle
                        style={{
                            width: "120px",
                            height: "120px",
                            border: "4px solid white",
                            position: "absolute",
                            top: "-60px",
                            left: "24px",
                        }}
                    />

                    <div className="ms-5 pt-5">
                        <h2>{profileUser.name}</h2>
                        <p className="text-muted">
                            @{profileUser.username || "username"}
                        </p>
                    </div>

                    <div className="mt-3">
                        <p>
                            {profileUser.description ||
                                "No description available"}
                        </p>
                    </div>

                    <Row className="mt-2">
                        <Col>
                            <strong>{profileUser.followersCount}</strong>{" "}
                            Followers
                        </Col>
                        <Col>
                            <strong>{profileUser.followingsCount}</strong>{" "}
                            Following
                        </Col>
                    </Row>

                    {/* Action Buttons */}
                    {!isOwnProfile && (
                        <div className="mt-3 d-flex gap-2">
                            <Button
                                variant={
                                    isFollowing ? "outline-primary" : "primary"
                                }
                                onClick={handleFollow}
                            >
                                <FontAwesomeIcon
                                    icon={
                                        isFollowing ? faUserMinus : faUserPlus
                                    }
                                    className="me-2"
                                />
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={handleMessage}
                                title="Send Message"
                            >
                                <FontAwesomeIcon icon={faMessage} />
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={handleVideoCall}
                                title="Video Call"
                            >
                                <FontAwesomeIcon icon={faVideo} />
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={handleAudioCall}
                                title="Audio Call"
                            >
                                <FontAwesomeIcon icon={faPhone} />
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfilePage;
