import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";


export async function GET() {

  const supabase =
    await createClient();


  const {
    data,
    error,
  } =
    await supabase
      .from("payment_methods")
      .select(
        "id, name, type, details"
      )
      .eq(
        "is_active",
        true
      )
      .order(
        "name"
      );


  if (error) {

    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );

  }


  return NextResponse.json(
    {
      methods:
        data ?? [],
    }
  );

}