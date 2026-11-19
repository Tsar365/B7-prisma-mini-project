import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);

  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      message: "Token verified successfully",
      data: verifiedToken,
    };
  } catch (error: any) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      message: error.message || "Token verification failed",
      data: null,
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
