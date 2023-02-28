import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../Models/userModel";
import { Response, Request } from "express";
import axios from "axios";

const secretKey = process.env.SECRET_Key;

export const logIn = async (req: Request, res: Response) => {
  if (req.body.googleAccessToken) {
    // gogole-auth
    const { googleAccessToken } = req.body;
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const firstName = response.data.given_name;
        const lastName = response.data.family_name;
        const email = response.data.email;
        const picture = response.data.picture;

        const existingUser = await userModel.findOne({ email });

        if (!existingUser)
          return res.status(404).json({ message: "User don't exist!" });

        const token = jwt.sign(
          {
            email: existingUser.email,
            id: existingUser._id,
          },
          secretKey || "test",
          { expiresIn: "1h" }
        );

        res.status(200).json({ user: existingUser, token });
      })
      .catch((err) => {
        res.status(400).json({ message: "Invalid access token!" });
      });
  } else {
    //normal login
    const { email, password } = req.body;
    try {
      const existingUser = await userModel.findOne({ email });
      if (!existingUser) {
        return res.status(403).json({
          message: "User With This Email Does Not Exist",
        });
      }
      const check = await bcrypt.compare(
        password,
        existingUser.password || " "
      );
      if (check) {
        const token = jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          secretKey || "test",
          { expiresIn: "1hr" }
        );
        res.status(201).json({
          message: "User logged in successfully",
          user: existingUser,
          token,
        });
      } else {
        res.status(403).json({
          message: "Please enter correct password",
        });
      }
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  if (req.body.googleAccessToken) {
    const { googleAccessToken } = req.body;
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const firstName = response.data.given_name;
        const lastName = response.data.family_name;
        const email = response.data.email;
        const picture = response.data.picture;

        const existingUser = await userModel.findOne({ email });

        if (existingUser)
          return res.status(400).json({ message: "User already exist!" });

        const user = await userModel.create({
          verified: "true",
          email,
          name: `${firstName} ${lastName}`,
          profilePicture: picture,
        });

        const token = jwt.sign(
          {
            email: user.email,
            id: user._id,
          },
          secretKey || "test",
          { expiresIn: "1h" }
        );

        res.status(200).json({ user, token });
      })
      .catch((err) => {
        res.status(400).json({ message: "Invalid access token!" });
      });
  } else {
    // normal form signup
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    console.log("Request data", req.body);
    try {
      const existingUser = await userModel.findOne({
        email,
      });
      if (existingUser) {
        res.status(404).json({
          message: "User with this email already exists",
        });
      }
      if (password === confirmPassword) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await userModel.create({
          name: `${firstName} ${lastName}`,
          email,
          password: hashedPassword,
        });
        const token = jwt.sign(
          { email: email, id: newUser?._id },
          secretKey || "test",
          { expiresIn: "1hr" }
        );
        res.status(201).json({
          message: "User has been created",
          user: newUser,
          token,
        });
      } else {
        res.status(404).json({
          message: "Confirm Password and the password should be Same",
        });
      }
    } catch (error) {
      res.status(404).json({
        message: "Can not create user",
        error: error,
      });
    }
  }
};
