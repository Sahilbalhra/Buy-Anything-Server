import jwt from "jsonwebtoken";
// require("dotenv").config()
import dotenv from "dotenv";
import { Response, NextFunction } from "express";
dotenv.config();
const secretKey = process.env.SECRET_Key || "";
// console.log("Secret key: " , secretKey)
const sk = process.env.CLIENT_SECRET || "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";

export const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      res.json({
        message: "Please Login first",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token)
    if (!token) {
      res.json({
        message: "Please Login first",
      });
    }
    const isCustomAuth = token.length < 500;
    let decordedData:any;
    if (token && isCustomAuth) {
      // console.log("In Custom log In ")
      decordedData = jwt.verify(token, secretKey);
      // console.log("decordedData custom",decordedData)
      req.userId = decordedData?.id;
      // console.log("req userId: " + req.userId)
    } else {
      // console.log("In Google Auth")
      decordedData = jwt.verify(token, sk);
      // console.log("decordedData google",decordedData)
      //sub is like id for google auth
      req.userId = decordedData?.sub;
    }
    next();
  } catch (error) {
    console.log("Error in auth middleware", error);
  }
};
