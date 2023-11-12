import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise(
  resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const { fiscalIdCode } = await request.json();

    if (fiscalIdCode === null) {
      throw new Error('Invalid Fiscal ID Code')
    }
    await sleep(1000)

    return NextResponse.json(Math.random() < 0.5);
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