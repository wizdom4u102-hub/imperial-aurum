import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { getTradingBotDetails } from '@/lib/trading-bot/service';
import { validateTradingBotId } from '@/lib/trading-bot/validators';

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const botId = url.searchParams.get('id');

  if (!botId) {
    return NextResponse.json(
      { error: 'Trading bot ID is required' },
      { status: 400 }
    );
  }

  const validation = validateTradingBotId(botId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.errors },
      { status: 400 }
    );
  }

  const result = await getTradingBotDetails(
  botId,
  user.id
);

  if (result.error) {
  return NextResponse.json(
    result,
    { status: 404 }
  );
}

  return NextResponse.json(result);
}