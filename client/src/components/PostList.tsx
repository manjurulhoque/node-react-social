import React, { useEffect } from "react";
import { usePost } from "../context";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import Message from "./Message";

const PostList: React.FC = () => {
    const { posts, loading, error, fetchPosts } = usePost();

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    if (loading && posts.length === 0) {
        return (
            <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </>
        );
    }

    if (error) {
        return <Message variant="danger">{error}</Message>;
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-5">
                <h4>No posts yet</h4>
                <p className="text-muted">Be the first to create a post!</p>
            </div>
        );
    }

    return (
        <>
            {posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </>
    );
};

export default PostList;
