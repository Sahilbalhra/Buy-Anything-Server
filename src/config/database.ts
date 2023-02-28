import mongoose from "mongoose";
import { Application } from "express";

import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;
const URL = process.env.URL || "";

export const connectToMongoose = (app: Application) => {
  try {
    mongoose
      .connect(URL)
      .then(() => {
        app.listen(PORT, () =>
          console.log(`Server Running here 👉 http://localhost:${PORT}`)
        );
      })
      .catch(() => console.log("Error while connecting to the DataBase"));
  } catch (error: any) {
    console.log(`Error while connecting to Server: ${error.message}`);
  }
};
