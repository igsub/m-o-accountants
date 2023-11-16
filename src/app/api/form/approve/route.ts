import { NextResponse } from "next/server";
import db from "@/modules/db";

export async function POST(request: Request) {
  try {
    const id = await request.json();

    if (id === null) {
      throw new Error('Invalid form id')
    }

    const updatedForm = await db.form.update({
      where: { id },
      data: {
        approved: true
      }
    })

    return NextResponse.json(updatedForm);
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