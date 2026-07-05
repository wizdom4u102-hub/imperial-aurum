export async function sendEmail(to: string, subject: string, message: string) {
  try {
    // ✅ Replace with real provider later (Resend, SendGrid)
    console.log('📧 EMAIL SENT')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Message:', message)

    return true
  } catch (err) {
    console.error('Email error:', err)
    return false
  }
}