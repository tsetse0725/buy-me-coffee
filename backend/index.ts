import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { prisma } from "./utils/prisma";

const app = express();
app.use(express.json());
dotenv.config();

app.get("/", async (_req: Request, res: Response) => {
  console.log(process.env.DATABASE_URL);

  res.json("hello");
});

app.post("/createUser", async (_req: Request, res: Response) => {
  await prisma.user.create({
    data: {
      username: "asd",
      email: "asd@yahoo.com",
      password: "asd",
    },
  });
  res.send("success");
});

app.listen(8000, () => {
  console.log("Server is running on port 3000");
});
