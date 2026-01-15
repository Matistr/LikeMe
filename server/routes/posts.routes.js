import express from "express";
import {
  getPosts,
  createPost,
  likePost,
  deletePost,
} from "../controllers/posts.controller.js";

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", createPost);
router.put("/posts/like/:id", likePost);
router.delete("/posts/:id", deletePost);

export default router;
