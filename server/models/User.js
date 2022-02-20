const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        coverPicture: {
            type: String,
            default: "",
        },
        followers: {
            type: Array,
            default: [],
        },
        followings: {
            type: Array,
            default: [],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            max: 100,
            default: "",
        },
        from: {
            type: String,
            max: 100,
            default: "",
        },
        relationship: {
            type: Number,
            enum: [1, 2, 3],
        },
    },
    { timestamps: true }
);

module.exports = User = mongoose.model("User", UserSchema);
