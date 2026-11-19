import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userservice } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;

//     const user = await userservice.registerUserIntoDB(payload);

//     res.status(httpStatus.CREATED).json({
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to create user",
//       error: (error as Error).message,
//     });
//   }
// };

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userservice.registerUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const { accessToken } = req.cookies;
    console.log(accessToken);

    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

    if(typeof verifiedToken === "string"){
      throw new Error(verifiedToken);
    }
const profile = await userservice.getMyProfileFromDB(verifiedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile retrieved successfully",
        data: { profile }
    });
});

export const userController = {
  registerUser,
  getMyProfile,
};
