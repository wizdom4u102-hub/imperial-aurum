export function emailLayout(title: string, content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,Helvetica,sans-serif;">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="padding:40px 20px;background:#0f0f0f;"
>
<tr>
<td align="center">

<table
  width="600"
  cellpadding="0"
  cellspacing="0"
  style="max-width:600px;background:#18181b;border:1px solid #27272a;border-radius:18px;overflow:hidden;"
>

<!-- HEADER -->
<tr>
<td
  style="background:linear-gradient(90deg,#facc15,#eab308);padding:30px;text-align:center;"
>

<img
  src="${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png"
  alt="Imperial Aurum Mining"
  width="80"
  style="display:block;margin:0 auto 15px;"
/>

<h1
  style="margin:0;color:#000;font-size:30px;font-weight:bold;"
>
Imperial Aurum
</h1>

<p
  style="margin:6px 0 0;font-size:14px;font-weight:bold;letter-spacing:6px;color:#3f2d00;text-transform:uppercase;"
>
Mining
</p>

</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px;color:#ffffff;">

<h2
  style="margin-top:0;margin-bottom:20px;color:#facc15;"
>
${title}
</h2>

${content}

<div
  style="margin-top:40px;text-align:center;"
>

<a
  href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
  style="
    display:inline-block;
    background:#facc15;
    color:#000;
    padding:14px 30px;
    border-radius:10px;
    text-decoration:none;
    font-weight:bold;
    font-size:16px;
  "
>
Go to Dashboard
</a>

</div>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td
style="
padding:25px;
text-align:center;
color:#a1a1aa;
font-size:13px;
border-top:1px solid #27272a;
line-height:1.7;
"
>

<strong style="color:#facc15;">
Imperial Aurum Mining
</strong>

<br>

Secure Gold Investment Platform

<br><br>

© ${new Date().getFullYear()} Imperial Aurum Mining

<br>

This is an automated email. Please do not reply.

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}

export function welcomeEmail(name?: string) {
  return emailLayout(
    "Welcome to Imperial Aurum Mining",
    `
<p>Hello <strong>${name || "Investor"}</strong>,</p>

<p>
Welcome to <strong>Imperial Aurum Mining</strong>.
Your account has been created successfully.
</p>

<p>
You can now:
</p>

<ul>
<li>Manage your investments</li>
<li>Track mining rewards</li>
<li>Make deposits</li>
<li>Request withdrawals</li>
<li>Monitor your portfolio</li>
</ul>

<p>
Thank you for choosing Imperial Aurum Mining.
We look forward to helping you grow your investment.
</p>

<p>
Best regards,<br>
<strong>Imperial Aurum Mining Team</strong>
</p>
`
  );
}

export function passwordChangedEmail(name?: string) {
  return emailLayout(
    "Your Password Has Been Changed",
    `
      <p>Hello <strong>${name || "Investor"}</strong>,</p>

      <p>
        This email confirms that the password for your
        <strong>Imperial Aurum Mining</strong> account has been changed successfully.
      </p>

      <p>
        If you made this change, no further action is required.
      </p>

      <p>
        <strong>Didn't change your password?</strong><br>
        Please reset your password immediately and contact our support team as soon as possible.
      </p>

      <p>
        Thank you for choosing Imperial Aurum Mining.
      </p>

      <p>
        Best regards,<br>
        <strong>Imperial Aurum Mining Team</strong>
      </p>
    `
  );
}

export function passwordResetSuccessEmail(name?: string) {
  return emailLayout(
    "Password Reset Successful",
    `
      <p>Hello <strong>${name || "Investor"}</strong>,</p>

      <p>
        Your <strong>Imperial Aurum Mining</strong> account password has been reset successfully.
      </p>

      <p>
        You can now sign in using your new password.
      </p>

      <p>
        If you did not perform this password reset, please contact our support team immediately.
      </p>

      <p>
        Your account security is very important to us.
      </p>

      <p>
        Best regards,<br>
        <strong>Imperial Aurum Mining Team</strong>
      </p>
    `
  );
}
/* ================================
   💰 DEPOSIT SUBMITTED
================================ */

export function depositSubmittedEmail(
  amount: number,
  method?: string,
  name?: string
) {
  return emailLayout(
    "Deposit Request Received",
    `
      <p>Hello <strong>${name || "Investor"}</strong>,</p>

      <p>
        We have successfully received your deposit request.
      </p>

      <table style="width:100%;border-collapse:collapse;margin:25px 0;">
        <tr>
          <td style="padding:12px;background:#27272a;color:#a1a1aa;">
            Amount
          </td>

          <td style="padding:12px;background:#18181b;color:#ffffff;font-weight:bold;">
            $${amount.toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="padding:12px;background:#27272a;color:#a1a1aa;">
            Payment Method
          </td>

          <td style="padding:12px;background:#18181b;color:#ffffff;">
            ${method || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="padding:12px;background:#27272a;color:#a1a1aa;">
            Status
          </td>

          <td style="padding:12px;background:#18181b;color:#facc15;">
            Pending Review
          </td>
        </tr>
      </table>

      <p>
        Our finance team will review your payment shortly.
      </p>

      <p>
        Once approved, your account balance will be updated automatically.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining.</strong>
      </p>
    `
  );
}

/* ================================
   ✅ DEPOSIT APPROVED
================================ */

export function depositApprovedEmail(
  amount: number,
  name?: string
) {
  return emailLayout(
    "Deposit Approved",
    `
      <p>Hello <strong>${name || "Investor"}</strong>,</p>

      <p>
        Congratulations!
      </p>

      <p>
        Your deposit has been approved successfully.
      </p>

      <table style="width:100%;border-collapse:collapse;margin:25px 0;">
        <tr>
          <td style="padding:12px;background:#27272a;color:#a1a1aa;">
            Approved Amount
          </td>

          <td style="padding:12px;background:#18181b;color:#22c55e;font-weight:bold;">
            $${amount.toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="padding:12px;background:#27272a;color:#a1a1aa;">
            Status
          </td>

          <td style="padding:12px;background:#18181b;color:#22c55e;">
            Approved
          </td>
        </tr>
      </table>

      <p>
        The funds have been credited to your Imperial Aurum Mining account.
      </p>

      <p>
        You can now continue investing and mining.
      </p>

      <p>
        Thank you for choosing us.
      </p>
    `
  );
}

/* ================================
   ❌ DEPOSIT REJECTED
================================ */

export function depositRejectedEmail(
  amount: number,
  reason?: string,
  name?: string
) {
  return emailLayout(
    "Deposit Rejected",
    `
      <p>Hello <strong>${name || "Investor"}</strong>,</p>

      <p>
        Unfortunately, your recent deposit request could not be approved.
      </p>

      <table style="width:100%;border-collapse:collapse;margin:25px 0;">
        <tr>
          <td style="padding:12px;background:#27272a;color:#a1a1aa;">
            Deposit Amount
          </td>

          <td style="padding:12px;background:#18181b;color:#ffffff;font-weight:bold;">
            $${amount.toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="padding:12px;background:#27272a;color:#a1a1aa;">
            Status
          </td>

          <td style="padding:12px;background:#18181b;color:#ef4444;">
            Rejected
          </td>
        </tr>

        ${
          reason
            ? `
        <tr>
          <td style="padding:12px;background:#27272a;color:#a1a1aa;">
            Reason
          </td>

          <td style="padding:12px;background:#18181b;color:#ffffff;">
            ${reason}
          </td>
        </tr>
        `
            : ""
        }
      </table>

      <p>
        If you believe this was a mistake, please contact our support team or submit a new deposit request.
      </p>

      <p>
        Thank you for choosing Imperial Aurum Mining.
      </p>
    `
  );
}
/* ================================
   💸 WITHDRAWAL SUBMITTED
================================ */

export function withdrawalSubmittedEmail(
  amount: number
) {
  return emailLayout(
    "Withdrawal Request Received",
    `
      <p>Hello Investor,</p>

      <p>
        We have successfully received your withdrawal request.
      </p>

      <div
        style="
          margin:30px 0;
          padding:20px;
          background:#18181b;
          border:1px solid #27272a;
          border-radius:12px;
        "
      >
        <p style="margin:0;">
          <strong>Amount:</strong>
          $${Number(amount).toFixed(2)}
        </p>

        <p style="margin:10px 0 0;">
          <strong>Status:</strong>
          Pending Approval
        </p>
      </div>

      <p>
        Your request has been forwarded to our administration team for review.
      </p>

      <p>
        Once it has been approved or rejected, you will receive another email
        with the outcome.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining</strong>.
      </p>
    `
  );
}

/* ================================
   ✅ WITHDRAWAL APPROVED
================================ */

export function withdrawalApprovedEmail(
  amount: number
) {
  return emailLayout(
    "Withdrawal Approved",
    `
      <p>Hello Investor,</p>

      <p>
        Your withdrawal request has been
        <strong style="color:#22c55e;">approved</strong>.
      </p>

      <div
        style="
          margin:30px 0;
          padding:20px;
          background:#18181b;
          border:1px solid #27272a;
          border-radius:12px;
        "
      >
        <p style="margin:0;">
          <strong>Amount:</strong>
          $${Number(amount).toFixed(2)}
        </p>

        <p style="margin:10px 0 0;">
          <strong>Status:</strong>
          Approved
        </p>
      </div>

      <p>
        Your payment is now being processed and
        will be sent to your selected wallet
        according to our withdrawal schedule.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining</strong>.
      </p>
    `
  );
}

/* ================================
   ❌ WITHDRAWAL REJECTED
================================ */

export function withdrawalRejectedEmail(
  amount: number
) {
  return emailLayout(
    "Withdrawal Request Rejected",
    `
      <p>Hello Investor,</p>

      <p>
        Unfortunately, your withdrawal request
        could not be approved.
      </p>

      <div
        style="
          margin:30px 0;
          padding:20px;
          background:#18181b;
          border:1px solid #27272a;
          border-radius:12px;
        "
      >
        <p style="margin:0;">
          <strong>Amount:</strong>
          $${Number(amount).toFixed(2)}
        </p>

        <p style="margin:10px 0 0;">
          <strong>Status:</strong>
          Rejected
        </p>
      </div>

      <p>
        If you believe this decision was made in
        error or you need more information,
        please contact our support team.
      </p>

      <p>
        Thank you for using
        <strong>Imperial Aurum Mining</strong>.
      </p>
    `
  );
}

/* ================================
   REFERRAL BONUS
================================ */
export function referralSignupBonusEmail({
  newUserEmail,
}: {
  newUserEmail: string;
}) {
  return emailLayout(
    "🎉 New Referral Joined",
    `
      <p>Hello Investor,</p>

      <p>
        Great news! A new investor has successfully registered using your
        referral link.
      </p>

      <div
        style="
          background:#27272a;
          border-left:4px solid #facc15;
          padding:18px;
          margin:25px 0;
          border-radius:8px;
        "
      >
        <strong>New Referral</strong><br>
        ${newUserEmail}
      </div>

      <div
        style="
          background:#27272a;
          border-left:4px solid #22c55e;
          padding:18px;
          margin:25px 0;
          border-radius:8px;
        "
      >
        <strong>Referral Reward</strong><br>
        1,000 Gold credited successfully.
      </div>

      <p>
        When your referral makes a qualifying deposit, you'll automatically
        receive your referral commission according to your referral level.
      </p>

      <p>
        Thank you for helping grow the Imperial Aurum Mining community.
      </p>
    `
  );
}

/* ================================
   REFERRAL COMMISSION
================================ */
export function referralCommissionEmail({
  level,
  depositAmount,
  commissionPercent,
  commissionAmount,
}: {
  level: number;
  depositAmount: number;
  commissionPercent: number;
  commissionAmount: number;
}) {
  return emailLayout(
    "Referral Commission Credited",
    `
      <p>Hello Investor,</p>

      <p>
        One of the investors in your referral network has completed
        a qualifying deposit.
      </p>

      <table
        width="100%"
        cellpadding="10"
        cellspacing="0"
        style="
          background:#27272a;
          border-radius:10px;
          margin:25px 0;
          color:#ffffff;
        "
      >
        <tr>
          <td><strong>Referral Level</strong></td>
          <td align="right">Level ${level}</td>
        </tr>

        <tr>
          <td><strong>Deposit Amount</strong></td>
          <td align="right">$${depositAmount.toFixed(2)}</td>
        </tr>

        <tr>
          <td><strong>Commission Rate</strong></td>
          <td align="right">${commissionPercent}%</td>
        </tr>

        <tr>
          <td><strong>Commission Earned</strong></td>
          <td
            align="right"
            style="
              color:#22c55e;
              font-weight:bold;
              font-size:18px;
            "
          >
            $${commissionAmount.toFixed(2)}
          </td>
        </tr>
      </table>

      <p>
        Your referral commission has already been credited to your account.
      </p>

      <p>
        Continue growing your referral network to earn even more rewards.
      </p>
    `
  );
}