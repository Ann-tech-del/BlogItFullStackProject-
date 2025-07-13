import { Request, Response, NextFunction } from "express";
import zxcvbn from "zxcvbn";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
export function verifyUserInformation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { firstName, lastName, email, username, password } = req.body;

  if (!firstName) {
    res.status(400).json({ message: "First name is required" });
    return;
  }

  if (!lastName) {
    res.status(400).json({ message: "Last name is required" });
    return;
  }

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  if (!username) {
    res.status(400).json({ message: "Username is required" });
    return;
  }

  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }

  next();
}
export function verifyPasswordStrength(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { password } = req.body;
  const result = zxcvbn(password);
  if (result.score < 3) {
    res.status(400).json({ message: "please choose a strong password" });
    return;
  }
  next();
}
export async function checkUserNameAndPasswordReuse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username, email } = req.body;
  const userWithUserName = await client.user.findFirst({ where: { username } });
  if (userWithUserName) {
    res
      .status(400)
      .json({ message: "Username is in use pick another username" });
    return;
  }
  const userWithEmail = await client.user.findFirst({ where: { email } });
  if (userWithEmail) {
    res.status(400).json({ message: "Email is in use pick another email" });
    return;
  }
  next();
}
