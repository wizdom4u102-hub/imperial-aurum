// app/api/admin/seed/route.ts
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";

export async function POST(request: Request) {
  const admin = await requireAdminApi();

  if (!admin.ok) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status },
    );
  }

  if (!admin.supabase) {
    return NextResponse.json(
      { error: "Admin database client unavailable" },
      { status: 500 },
    );
  }

  const { supabase } = admin;

  let body: { walletId?: string; password?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 },
    );
  }

  const { walletId, password } = body;

  if (!walletId) {
    return NextResponse.json(
      { error: "Wallet ID is required" },
      { status: 400 },
    );
  }

  if (!password) {
    return NextResponse.json(
      { error: "Security password is required" },
      { status: 401 },
    );
  }

  const adminSeedPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminSeedPassword) {
    return NextResponse.json(
      { error: "Seed security password not configured" },
      { status: 500 },
    );
  }

  if (password.trim() !== adminSeedPassword.trim()) {
    return NextResponse.json(
      { error: "Incorrect security password" },
      { status: 403 },
    );
  }

  // Debug log to trace requested wallet ID in server terminal
  console.log("Fetching seed for wallet ID:", walletId);

  // 1. Try querying by primary key 'id'
  let { data: wallet, error } = await supabase
    .from("wallets")
    .select("id, address, seed_phrase, created_at")
    .eq("id", walletId.trim())
    .maybeSingle();

  // 2. Fallback: Query by 'user_id' if not found by primary key 'id'
  if (!wallet && !error) {
    const { data: fallbackWallet, error: fallbackError } = await supabase
      .from("wallets")
      .select("id, address, seed_phrase, created_at")
      .eq("user_id", walletId.trim())
      .maybeSingle();

    wallet = fallbackWallet;
    error = fallbackError;
  }

  if (error) {
    console.error("ADMIN SEED LOAD ERROR:", error);
    return NextResponse.json(
      { error: "Database error fetching seed: " + error.message },
      { status: 500 },
    );
  }

  if (!wallet) {
    console.error(`Wallet record not found for query ID: ${walletId}`);
    return NextResponse.json(
      { error: `Wallet record not found for ID: ${walletId}` },
      { status: 404 },
    );
  }

  return NextResponse.json({
    id: wallet.id,
    address: wallet.address,
    seed_phrase: wallet.seed_phrase,
    created_at: wallet.created_at,
  });
}