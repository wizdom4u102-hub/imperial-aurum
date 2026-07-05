'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addPaymentMethod(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const details = formData.get('details') as string

  // ==========================
  // SAFE INSERT (NO DESTRUCTURING)
  // ==========================
  const result = await supabase
    .from('payment_methods')
    .insert([{ name, type, details }])

  const error = result.error

  if (error) {
    console.error('ADD PAYMENT METHOD ERROR:', error)
    throw new Error(error.message || 'Insert failed')
  }

  revalidatePath('/admin/payment-methods', 'layout')
}

export async function deletePaymentMethod(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/payment-methods', 'layout')
}

export async function togglePaymentMethod(id: string, current: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('payment_methods')
    .update({ is_active: !current })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/payment-methods', 'layout')
}

export async function updatePaymentMethod(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const details = formData.get('details') as string

  const { error } = await supabase
    .from('payment_methods')
    .update({ name, type, details })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/payment-methods', 'layout')
}