import db from "@/modules/db";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  console.log('in auth request', email, password);
  if (!email || !password) {
    throw new Error('Missing email or password')
  }

  try {
    const user = await db.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    if (user && user.password === hashPassword(password)) {
      return NextResponse.json(exclude(user, ["password"]));
    } else {
      return NextResponse.json({ message: "invalid credentials" });
    }
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        {
          message: e.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}

export const hashPassword = (password: string) => {
  return createHmac('sha256', password).digest('hex');
};

function exclude(user: any, keys: string[]) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}