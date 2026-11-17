
import cookieParser from "cookie-parser";
import express, {Application, Request, Response} from "express";
import config from "./config";
import cors from "cors";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";


const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/",(req: Request, res: Response) => {
    res.send("Hello World");
});



app.post("/api/users/register", async (req: Request, res: Response) => {
  const {name,email,password, profilePhoto} = req.body;
  const isUserExit = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if(isUserExit) {
   throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  const createdUser = await prisma.user.create({
    data: {
      name,
        email,
        password: hashedPassword,
      
    },
  }); 

  const profile= await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

//   console.log(payload);

  res.status(httpStatus.CREATED).json({
   success: true,
   statusCode: httpStatus.CREATED,
   message: "User created successfully",
    data: user,
     });
});
export default app;