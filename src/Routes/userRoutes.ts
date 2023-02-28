import express from "express";
import { createUser, logIn } from "../Controllers/userController";

const userRoutes = express.Router();

userRoutes.route("/signup").post(createUser);
userRoutes.route("/signin").post(logIn);

export default userRoutes;
