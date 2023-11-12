import { NextResponse } from "next/server"
import db from "@/modules/db"

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const newForm = await db.form.create({
      data,
    });

    return NextResponse.json(newForm);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function GET() {
  try {
    const forms = await db.form.findMany();
    return NextResponse.json(forms);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}