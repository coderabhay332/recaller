"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use(express_1.default.json());
//@ts-ignore
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }
    try {
        // Check if user already exists
        const currentUser = yield db_1.User.findOne({ username });
        if (currentUser) {
            return res.status(409).send("User already exists.");
        }
        // Create a new user
        const newUser = yield db_1.User.create({
            username,
            password,
        });
        return res.status(201).send({
            message: "User created successfully.",
            user: newUser,
        });
    }
    catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).send("Server error");
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const checkUserName = yield db_1.User.findOne({ username });
    const existingUser = yield db_1.User.findOne({
        username,
        password
    });
    if (!checkUserName) {
        res.send("user not exists");
        return;
    }
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, config_1.JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Incorrrect credentials"
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, title, tags } = req.body;
    //@ts-ignore
    const userId = req.userId;
    try {
        yield db_1.Content.create({
            link,
            title,
            tags,
            userId,
        });
        res.status(201).json({
            message: "Content added successfully",
        });
    }
    catch (error) {
        console.error("Error while adding content:", error);
        res.status(500).json({
            message: "Error while adding content",
        });
    }
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.Content.find({ userId }).populate("userId", "username");
    res.json({
        content
    });
}));
app.post("/api/v1/delete/", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    try {
        yield db_1.Content.deleteMany({
            contentId,
            //@ts-ignore
            userId
        });
        res.json({
            message: "content deleted"
        });
    }
    catch (error) {
        res.json({
            message: "error while deleting content"
        });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    //@ts-ignore
    const userId = req.userId;
    try {
        if (share) {
            const existingLink = yield db_1.Link.findOne({ userId });
            if (existingLink) {
                res.json({ hash: existingLink.hash });
            }
            const hash = (0, utils_1.hashGenerator)(10);
            yield db_1.Link.create({ userId, hash });
            res.json({ hash });
        }
        else {
            yield db_1.Link.deleteOne({ userId });
            res.json({ message: "Link removed." });
        }
    }
    catch (error) {
        console.error("Error sharing link:", error);
        res.status(500).json({ message: "Error while processing share link." });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.Link.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    // userId
    const content = yield db_1.Content.find({
        userId: link.userId
    });
    console.log(link);
    const user = yield db_1.User.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
app.listen(3000, () => {
    console.log("listning to port 3000");
});
