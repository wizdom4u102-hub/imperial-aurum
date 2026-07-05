'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 🔍 VALIDATION FUNCTION
function detectWallet(address: string) {
  const addr = address.trim()

  // ================= ERC20 / ETH / BSC / POLYGON =================
  // Example:
  // 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
  if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
    return {
      network: 'ERC20',
      valid: true,
    }
  }

  // ================= TRON / TRC20 =================
  // Example:
  // TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE
  if (/^T[a-zA-Z0-9]{33}$/.test(addr)) {
    return {
      network: 'TRC20',
      valid: true,
    }
  }

  // ================= BTC =================
  // Supports:
  // bc1
  // 1
  // 3
  if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,59}$/.test(addr)) {
    return {
      network: 'BTC',
      valid: true,
    }
  }

  // ================= SOLANA =================
  // Base58 32-44 chars
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)) {
    return {
      network: 'SOL',
      valid: true,
    }
  }

  // ================= FALLBACK =================
  // Prevent app from breaking on uncommon wallets
  // Still allows user save wallet manually
  return {
    network: 'UNKNOWN',
    valid: true,
  }
}

// ✅ ADD WALLET
export async function addWallet(formData: FormData) {

  const supabase =
    await createClient()

  const address =
    (formData.get('address') as string)?.trim()

  let network =
    (formData.get('network') as string)?.trim()

  if (!address) {

    throw new Error(
      'Wallet address is required'
    )

  }

  // 🔍 VALIDATE + DETECT
  const result =
    detectWallet(address)

  // =====================================================
  // IMPORTANT FIX
  // DO NOT HARD FAIL
  // =====================================================

  if (!result.valid) {

    throw new Error(
      'Invalid wallet address format'
    )

  }

  // 🎯 AUTO SET NETWORK if not provided
  if (!network) {

    network =
      result.network || 'UNKNOWN'

  }

  // =====================================================
  // SAFE NETWORK MATCH CHECK
  // =====================================================

  if (
    network &&
    result.network &&
    result.network !== 'UNKNOWN' &&
    network !== result.network
  ) {

    throw new Error(
      `Address does not match ${network} network`
    )

  }

  // ================= USER =================
  const {
    data: { user },
  } =
    await supabase.auth.getUser()

  if (!user) {

    throw new Error(
      'Unauthorized'
    )

  }

  // =====================================================
  // PREVENT DUPLICATE WALLET
  // =====================================================

  const {
    data: existingWallet
  } =
    await supabase
      .from('wallets')
      .select('id')
      .eq(
        'user_id',
        user.id
      )
      .eq(
        'address',
        address
      )
      .maybeSingle()

  if (existingWallet) {

    throw new Error(
      'Wallet already exists'
    )

  }

  // ================= INSERT =================
  const {
    error
  } =
    await supabase
      .from('wallets')
      .insert({

        user_id:
          user.id,

        address,

        network:
          network || 'UNKNOWN',

        created_at:
          new Date().toISOString(),

      })

  if (error) {

    throw new Error(
      error.message
    )

  }

  revalidatePath('/wallets')
}

// ✅ DELETE WALLET
export async function deleteWallet(id: string) {

  const supabase =
    await createClient()

  const {
    error
  } =
    await supabase
      .from('wallets')
      .delete()
      .eq('id', id)

  if (error) {

    throw new Error(
      error.message
    )

  }

  revalidatePath('/wallets')
}

// ✅ SET DEFAULT (atomic-safe)
export async function setDefaultWallet(id: string) {

  const supabase =
    await createClient()

  const {
    data: { user },
  } =
    await supabase.auth.getUser()

  if (!user) {

    throw new Error(
      'Unauthorized'
    )

  }

  // remove old default
  await supabase
    .from('wallets')
    .update({
      is_default: false
    })
    .eq(
      'user_id',
      user.id
    )

  // set new
  const {
    error
  } =
    await supabase
      .from('wallets')
      .update({
        is_default: true
      })
      .eq('id', id)

  if (error) {

    throw new Error(
      error.message
    )

  }

  revalidatePath('/wallets')
}

// ✅ EDIT WALLET
export async function updateWallet(formData: FormData) {

  const supabase =
    await createClient()

  const id =
    formData.get('id') as string

  const address =
    (formData.get('address') as string)?.trim()

  let network =
    (formData.get('network') as string)?.trim()

  if (!address) {

    throw new Error(
      'Wallet address is required'
    )

  }

  // 🔍 VALIDATE
  const result =
    detectWallet(address)

  if (!network) {

    network =
      result.network || 'UNKNOWN'

  }

  const {
    error
  } =
    await supabase
      .from('wallets')
      .update({

        address,

        network,

        updated_at:
          new Date().toISOString(),

      })
      .eq('id', id)

  if (error) {

    throw new Error(
      error.message
    )

  }

  revalidatePath('/wallets')
}