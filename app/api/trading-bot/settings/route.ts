import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { data, error } = await supabase
    .from("trading_bot_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }

  if (!data) {
    const { data: created, error: createError } = await supabase
      .from("trading_bot_settings")
      .insert({
        user_id: user.id,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        {
          error: createError.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        data: created,
        error: null,
      },
      {
        status: 200,
      }
    );
  }

  return NextResponse.json(
    {
      data,
      error: null,
    },
    {
      status: 200,
    }
  );
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const body = await request.json();

  const {
    auto_reinvest,
    auto_renew,
    email_notifications,
    notifications_enabled,
    preferred_currency,
    push_notifications,
    risk_level,
    timezone,
  } = body;

  const { data, error } = await supabase
    .from("trading_bot_settings")
    .update({
      auto_reinvest,
      auto_renew,
      email_notifications,
      notifications_enabled,
      preferred_currency,
      push_notifications,
      risk_level,
      timezone,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      data,
      error: null,
    },
    {
      status: 200,
    }
  );
}