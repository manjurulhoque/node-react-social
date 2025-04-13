import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { usePost } from "../context";
import { Post as PostType } from "../interfaces/post.interface";
import { formatDistanceToNow } from "date-fns";

interface PostProps {
    post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
    const { likePost, deletePost, loading } = usePost();
    const [isLiking, setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        await likePost(post._id);
        setIsLiking(false);
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        if (window.confirm("Are you sure you want to delete this post?")) {
            setIsDeleting(true);
            await deletePost(post._id);
            setIsDeleting(false);
        }
    };

    const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
    });

    return (
        <Card className="card-block card-stretch card-height mb-4">
            <Card.Body>
                <div className="d-flex align-items-center mb-3">
                    <Link to={`/profile/${post.user?._id}`}>
                        <img
                            src={
                                post.user?.profilePicture ||
                                "/default-avatar.png"
                            }
                            alt={post.user?.name || "User"}
                            className="rounded-circle"
                            style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                            }}
                        />
                    </Link>
                    <div className="ms-3">
                        <Link
                            to={`/profile/${post.user?._id}`}
                            className="text-dark fw-bold text-decoration-none"
                        >
                            {post.user?.name || "User"}
                        </Link>
                        <div className="text-muted small">{formattedDate}</div>
                    </div>
                </div>

                <div className="post-content mb-3">{post.description}</div>

                {post.images && post.images.length > 0 && (
                    <div className="post-images mb-3">
                        {post.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className="img-fluid rounded mb-2"
                                style={{ maxHeight: "300px", width: "auto" }}
                            />
                        ))}
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleLike}
                        disabled={isLiking || loading}
                    >
                        {isLiking ? (
                            <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        ) : (
                            <i className="ri-heart-line me-1"></i>
                        )}
                        {post.likesCount} Likes
                    </Button>

                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting || loading}
                    >
                        {isDeleting ? (
                            <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        ) : (
                            <i className="ri-delete-bin-line me-1"></i>
                        )}
                        Delete
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Post;
