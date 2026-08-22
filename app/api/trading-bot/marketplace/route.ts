import {
  NextResponse,
} from "next/server";


import {
  getMarketplace,
} from "@/lib/trading-bot/marketplace.service";


export async function GET() {

  const result =
    await getMarketplace();


  if (result.error) {

    return NextResponse.json(
      {
        error:
          result.error,
      },
      {
        status: 500,
      }
    );

  }


  return NextResponse.json(
    result.data,
    {
      status: 200,
    }
  );
}