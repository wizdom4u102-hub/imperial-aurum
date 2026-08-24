import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);

  const walletId = searchParams.get("walletId");
  const password = searchParams.get("password");

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

  const adminSeedPassword =
    process.env.ADMIN_SEED_PASSWORD;

  if (!adminSeedPassword) {
    console.error(
      "ADMIN_SEED_PASSWORD is not configured",
    );

    return NextResponse.json(
      { error: "Seed security is not configured" },
      { status: 500 },
    );
  }

  if (password !== adminSeedPassword) {
    return NextResponse.json(
      { error: "Incorrect security password" },
      { status: 403 },
    );
  }

  const { data: wallet, error } = await supabase
    .from("wallets")
    .select(
      "id, address, seed_phrase, created_at",
    )
    .eq("id", walletId)
    .single();

  if (error) {
    console.error(
      "ADMIN SEED LOAD ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "Wallet not found" },
      { status: 404 },
    );
  }

  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet not found" },
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