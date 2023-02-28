import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectToMongoose } from "./src/config/database";
const app: Application = express();
import userRoutes from "./src/Routes/userRoutes";
import { auth } from "./src/middleware/authMiddleware";

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());
app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome to auth middleware is working");
});
app.use("/auth", userRoutes);

connectToMongoose(app);
