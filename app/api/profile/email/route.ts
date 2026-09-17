import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

import { sendEmail } from "@/lib/email/sendEmail";
import {
  emailChangedSuccessfullyEmail,
  emailChangeSecurityAlertEmail,
} from "@/lib/email/templates";

const supabaseAdmin = createSupabaseAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    /*
     * Get the currently authenticated user.
     */
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be logged in to change your email.",
        },
        { status: 401 }
      );
    }

    /*
     * Read the requested new email.
     */
    const body = (await request.json()) as {
      email?: string;
    };

    const newEmail = body.email
      ?.trim()
      .toLowerCase();

    if (!newEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter an email address.",
        },
        { status: 400 }
      );
    }

    /*
     * Basic email validation.
     */
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(newEmail)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    /*
     * Get the user's current Auth email.
     */
    const oldEmail =
      user.email?.trim().toLowerCase() ?? "";

    /*
     * If the email has not changed, there is
     * nothing to do.
     */
    if (newEmail === oldEmail) {
      return NextResponse.json({
        success: true,
        emailUpdated: false,
        notificationSent: false,
        message:
          "Your email address is already up to date.",
      });
    }

    /*
     * Get the username for the email messages.
     */
    const {
      data: profile,
      error: profileFetchError,
    } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    if (profileFetchError) {
      console.error(
        "Profile lookup error:",
        profileFetchError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load your profile.",
        },
        { status: 500 }
      );
    }

    const username =
      profile?.username || "Investor";

    /*
     * ==================================================
     * STEP 1
     * Send security notification to OLD EMAIL.
     * ==================================================
     *
     * This is intentionally sent BEFORE changing
     * the Auth email.
     */
    if (oldEmail) {
      const oldEmailResult = await sendEmail({
        to: oldEmail,
        subject:
          "Security Alert: Email Change Requested",
        html: emailChangeSecurityAlertEmail({
          name: username,
          oldEmail,
          newEmail,
        }),
      });

      /*
       * We stop here if the security email could not
       * be sent.
       *
       * This means the account email will NOT be changed
       * if the old-email security notification fails.
       */
      if (!oldEmailResult.success) {
        console.error(
          "Old email security notification failed:",
          oldEmailResult.error
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "We could not send the security notification to your current email address. Your email address has not been changed.",
          },
          { status: 500 }
        );
      }
    }

    /*
     * ==================================================
     * STEP 2
     * Update Supabase Authentication email.
     * ==================================================
     *
     * This uses the service-role admin client and
     * therefore runs only on the server.
     *
     * email_confirm: true means the new email does
     * not require a confirmation-link step.
     */
    const {
      error: authUpdateError,
    } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        email: newEmail,
        email_confirm: true,
      }
    );

    if (authUpdateError) {
      console.error(
        "Supabase Auth email update error:",
        authUpdateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            authUpdateError.message ||
            "Unable to update your email address.",
        },
        { status: 400 }
      );
    }

    /*
     * ==================================================
     * STEP 3
     * Synchronize profiles.email.
     * ==================================================
     */
    const {
      error: profileUpdateError,
    } = await supabaseAdmin
      .from("profiles")
      .update({
        email: newEmail,
      })
      .eq("id", user.id);

    if (profileUpdateError) {
      console.error(
        "Profile email synchronization error:",
        profileUpdateError
      );

      return NextResponse.json(
        {
          success: false,
          emailUpdated: true,
          error:
            "Your authentication email was changed, but your profile could not be synchronized. Please contact support.",
        },
        { status: 500 }
      );
    }

    /*
     * ==================================================
     * STEP 4
     * Send success notification to NEW EMAIL.
     * ==================================================
     */
    const newEmailResult = await sendEmail({
      to: newEmail,
      subject:
        "Your Imperial Aurum Mining Email Has Been Changed",
      html: emailChangedSuccessfullyEmail({
        name: username,
        newEmail,
      }),
    });

    /*
     * The account email has already been successfully
     * changed even if the notification email fails.
     */
    if (!newEmailResult.success) {
      console.error(
        "New email success notification failed:",
        newEmailResult.error
      );

      return NextResponse.json({
        success: true,
        emailUpdated: true,
        notificationSent: false,
        message:
          "Your email address has been changed successfully, but we could not send the confirmation email to your new email address.",
      });
    }

    /*
     * ==================================================
     * COMPLETE
     * ==================================================
     */
    return NextResponse.json({
      success: true,
      emailUpdated: true,
      notificationSent: true,
      message:
        "Your email address has been changed successfully. Security notifications were sent to your old and new email addresses.",
    });
  } catch (error) {
    console.error(
      "Email change route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "An unexpected error occurred while changing your email address.",
      },
      { status: 500 }
    );
  }
}