import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { welcomeEmail } from "@/lib/email/templates";

export async function GET() {
  // 👇 Replace with the email address you want to receive the test
  const email = "wizdom4u102@gmail.com";

  const result = await sendEmail({
    to: email,
    subject: "Welcome to Imperial Aurum Mining",
    html: welcomeEmail("Imperial Aurum User"),
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Test email sent successfully.",
    data: result.data,
  });
}