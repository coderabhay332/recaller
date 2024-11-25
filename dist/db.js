"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = exports.Content = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = require("./config");
mongoose_1.default.connect(config_1.DB_URL)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
});
// User Schema
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true, // Remove extra spaces
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Add createdAt and updatedAt fields
exports.User = mongoose_1.default.model("User", userSchema);
// Content Schema
const contentSchema = new mongoose_1.Schema({
    link: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: [String], // Array of strings
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true }); // Add createdAt and updatedAt fields
exports.Content = mongoose_1.default.model("Content", contentSchema);
const LinkSchema = new mongoose_1.default.Schema({
    hash: String,
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
    }
});
exports.Link = (0, mongoose_1.model)("Link", LinkSchema);
