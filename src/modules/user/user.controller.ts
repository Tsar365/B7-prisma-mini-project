import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { userservice } from "./user.service";

const registerUser =async (req: Request, res: Response) => {
 try{
     const payload = req.body;

  const user = await userservice.registerUserIntoDB(payload);
  
  res.status(httpStatus.CREATED).json({
   success: true,
   statusCode: httpStatus.CREATED,
   message: "User created successfully",
    data: user,
     });
 } catch (error) {
    console.error("Error creating user:", error);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
   success: false,
   statusCode: httpStatus.INTERNAL_SERVER_ERROR,
   message: "Failed to create user",
   error: (error as Error).message,
    });
 }
}

export const userController = {
  registerUser,
};