import { resend } from "@/lib/email/resend";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions) {
  try {
    console.log('EMAIL DEBUG:', {
  hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
  emailFrom: process.env.EMAIL_FROM,
  emailTo: to,
  subject,
})
    const { data, error } = await resend.emails.send({
      // For development/testing
      // Change this after verifying your domain.
      from: process.env.EMAIL_FROM!,

      to,

      subject,

      html,
    });

    if (error) {
      console.error("Resend Error:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Email Send Error:", err);

    return {
      success: false,
      error: "Failed to send email.",
    };
  }
}