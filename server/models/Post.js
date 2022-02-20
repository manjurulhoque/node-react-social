const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        description: {
            type: String,
        },
        images: {
            type: Array,
            default: []
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = Post = mongoose.model("Post", PostSchema);
