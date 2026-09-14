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
 <p>Hello <strong>${name}</strong>,</p>

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
       <p>Hello <strong>${name}</strong>,</p>

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
       <p>Hello <strong>${name}</strong>,</p>

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
       <p>Hello <strong>${name}</strong>,</p>

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
       <p>Hello <strong>${name}</strong>,</p>

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
       <p>Hello <strong>${name}</strong>,</p>

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
  amount: number,
  username: string
) {
  return emailLayout(
    "Withdrawal Request Received",
    `
      <p>Hello <strong>${username}</strong>,</p>

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
        The requested amount has been reserved from your available
        cash balance while your withdrawal is being reviewed.
      </p>

      <p>
        Your request has been forwarded to our administration team
        for review.
      </p>

      <p>
        Once your withdrawal has been approved or rejected, you will
        receive another email with the outcome.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining</strong>.
      </p>

      <p>
        Best regards,<br>
        <strong>Imperial Aurum Mining Team</strong>
      </p>
    `
  );
}


/* ================================
   ✅ WITHDRAWAL APPROVED
================================ */

export function withdrawalApprovedEmail(
  amount: number,
  username: string
) {
  return emailLayout(
    "Withdrawal Approved",
    `
      <p>Hello <strong>${username}</strong>,</p>

      <p>
        Your withdrawal request has been
        <strong style="color:#22c55e;">approved</strong>
        successfully.
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
        The withdrawal amount has already been deducted from your
        available cash balance when the request was submitted.
        No additional deduction was made when the withdrawal was approved.
      </p>

      <p>
        Your payment is now being processed and will be sent to your
        selected wallet according to our withdrawal process.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining</strong>.
      </p>

      <p>
        Best regards,<br>
        <strong>Imperial Aurum Mining Team</strong>
      </p>
    `
  );
}


/* ================================
   ❌ WITHDRAWAL REJECTED
================================ */

export function withdrawalRejectedEmail(
  amount: number,
  username: string
) {
  return emailLayout(
    "Withdrawal Request Rejected",
    `
      <p>Hello <strong>${username}</strong>,</p>

      <p>
        Unfortunately, your withdrawal request could not be approved
        by our administration team.
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
          <strong>Withdrawal Amount:</strong>
          $${Number(amount).toFixed(2)}
        </p>

        <p style="margin:10px 0 0;">
          <strong>Status:</strong>
          <span style="color:#ef4444;font-weight:bold;">
            Rejected
          </span>
        </p>
      </div>

      <div
        style="
          margin:30px 0;
          padding:20px;
          background:#27272a;
          border-left:4px solid #22c55e;
          border-radius:8px;
        "
      >
        <p
          style="
            margin:0;
            color:#22c55e;
            font-size:17px;
            font-weight:bold;
          "
        >
          Amount Returned to Your Balance
        </p>

        <p style="margin:12px 0 0;color:#ffffff;">
          The full withdrawal amount of
          <strong>$${Number(amount).toFixed(2)}</strong>
          has been returned to your account cash balance.
        </p>
      </div>

      <p>
        No funds have been lost as a result of this rejected
        withdrawal request.
      </p>

      <p>
        You can check your updated cash balance from your dashboard.
      </p>

      <p>
        If you believe this withdrawal was rejected in error or you
        need additional information, please contact our support team.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining</strong>.
      </p>

      <p>
        Best regards,<br>
        <strong>Imperial Aurum Mining Team</strong>
      </p>
    `
  );
}

/* ================================
   REFERRAL BONUS
================================ */
export function referralSignupBonusEmail({
  name,
  newUserName,
}: {
  name: string;
  newUserName: string;
}) {
  return emailLayout(
    "🎉 New Referral Joined",
    `
      <p>Hello <strong>${name}</strong>,</p>

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
         ${newUserName}
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
  username,
}: {
  level: number;
  depositAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  username: string;
}) {
  return emailLayout(
    "Referral Commission Credited",
    `
      <p>Hello <strong>${username}</strong>,</p>

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

/* ================================
   BOT PROFIT TRANSFER
================================ */

export function botProfitTransferEmail({
  botName,
  amount,
  remainingBalance,
  username,
}: {
  botName: string;
  amount: number;
  remainingBalance: number;
  username: string;
}) {
  return emailLayout(
    "Bot Profit Transfer Successful",
    `
      <p>Hello <strong>${username}</strong>,</p>

      <p>
        Your profit transfer has been completed successfully.
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
          <td><strong>Trading Bot</strong></td>
          <td align="right">${botName}</td>
        </tr>

        <tr>
          <td><strong>Transferred Amount</strong></td>
          <td align="right" style="color:#22c55e;font-weight:bold;">
            $${amount.toFixed(2)}
          </td>
        </tr>

        <tr>
          <td><strong>Remaining Available Balance</strong></td>
          <td align="right">
            $${remainingBalance.toFixed(2)}
          </td>
        </tr>

        <tr>
          <td><strong>Status</strong></td>
          <td align="right" style="color:#22c55e;">
            Completed
          </td>
        </tr>

      </table>

      <p>
        The transferred funds have been credited to your
        <strong>Cash Balance</strong>.
      </p>

      <p>
        You can now use your cash balance to make withdrawals
        or invest in other products.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining</strong>.
      </p>
    `
  );
}

/* -------------------------------------------------------------------------- */
/*                 Dashboard Profit Transfer Email Template                    */
/* -------------------------------------------------------------------------- */

export function dashboardProfitTransferEmail({
  name,
  amount,
  remainingBalance,
}: {
  name: string;
  amount: number;
  remainingBalance: number;
}) {
  return emailLayout(
    "Funds Successfully Transferred",
    `
      <p>Hello <strong>${name}</strong>,</p>

      <p>
        Your trading bot profit transfer has been completed successfully.
        The requested funds have been transferred from your available
        trading bot balance to your dashboard cash balance.
      </p>

      <table
        width="100%"
        cellpadding="12"
        cellspacing="0"
        style="
          background:#27272a;
          border-radius:10px;
          margin:25px 0;
          color:#ffffff;
        "
      >
        <tr>
          <td style="color:#a1a1aa;">
            Transferred Amount
          </td>

          <td
            align="right"
            style="color:#22c55e;font-weight:bold;"
          >
            $${amount.toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Remaining Bot Balance
          </td>

          <td
            align="right"
            style="color:#ffffff;font-weight:bold;"
          >
            $${remainingBalance.toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Destination
          </td>

          <td
            align="right"
            style="color:#ffffff;font-weight:bold;"
          >
            Dashboard Cash Balance
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Status
          </td>

          <td
            align="right"
            style="color:#22c55e;font-weight:bold;"
          >
            Completed
          </td>
        </tr>
      </table>

      <p>
        Your dashboard balance has been updated immediately and is now
        available for withdrawal or reinvestment.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining.</strong>
      </p>
    `
  );
}

/* ================================
   ⛏️ DAILY MINING REMINDER
================================ */

export function dailyMiningReminderEmail({
  name,
  planName,
  miningDate,
  goldAmount,
}: {
  name: string;
  planName: string;
  miningDate: string;
  goldAmount: number;
}) {
  return emailLayout(
    "Your Daily Mining Reward Is Ready",
    `
      <p>Hello <strong>${name}</strong>,</p>

      <p>
        Your daily mining period has ended and your mining reward for
        <strong>${miningDate}</strong> is ready to be claimed.
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
          <td>
            <strong>Mining Plan</strong>
          </td>

          <td align="right">
            ${planName}
          </td>
        </tr>

        <tr>
          <td>
            <strong>Mining Date</strong>
          </td>

          <td align="right">
            ${miningDate}
          </td>
        </tr>

        <tr>
          <td>
            <strong>Daily Gold Reward</strong>
          </td>

          <td
            align="right"
            style="
              color:#facc15;
              font-weight:bold;
              font-size:18px;
            "
          >
            ${goldAmount.toFixed(2)} Gold
          </td>
        </tr>

        <tr>
          <td>
            <strong>Status</strong>
          </td>

          <td
            align="right"
            style="
              color:#facc15;
              font-weight:bold;
            "
          >
            Ready to Claim
          </td>
        </tr>
      </table>

      <p>
        Please visit your dashboard to claim your available mining reward.
      </p>

      <p>
        If you are using a paid Mining Plan, your mining continues according
        to your active plan even if you do not visit the dashboard.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining.</strong>
      </p>

      <p>
        Best regards,<br>
        <strong>Imperial Aurum Mining Team</strong>
      </p>
    `
  );
}

/* ================================
   👤 ADMIN — NEW SIGNUP
================================ */

export function adminNewSignupEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return emailLayout(
    "New User Registration",
    `
      <p>Hello Admin,</p>

      <p>
        A new user has successfully registered on
        <strong>Imperial Aurum Mining</strong>.
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
          <td style="color:#a1a1aa;">
            Name
          </td>

          <td align="right" style="font-weight:bold;">
            ${name}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Email
          </td>

          <td align="right">
            ${email}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Status
          </td>

          <td
            align="right"
            style="color:#22c55e;font-weight:bold;"
          >
            Registered
          </td>
        </tr>
      </table>

      <p>
        You can log in to the administration dashboard to view
        the user's account and activity.
      </p>
    `
  );
}


/* ================================
   💰 ADMIN — NEW DEPOSIT
================================ */

export function adminNewDepositEmail({
  name,
  email,
  amount,
  method,
}: {
  name: string;
  email: string;
  amount: number;
  method?: string;
}) {
  return emailLayout(
    "New Deposit Request",
    `
      <p>Hello Admin,</p>

      <p>
        A new deposit request has been submitted by a user
        and is awaiting review.
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
          <td style="color:#a1a1aa;">
            User
          </td>

          <td align="right" style="font-weight:bold;">
            ${name}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Email
          </td>

          <td align="right">
            ${email}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Amount
          </td>

          <td
            align="right"
            style="
              color:#22c55e;
              font-weight:bold;
              font-size:18px;
            "
          >
            $${Number(amount).toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Payment Method
          </td>

          <td align="right">
            ${method || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Status
          </td>

          <td
            align="right"
            style="color:#facc15;font-weight:bold;"
          >
            Pending Review
          </td>
        </tr>
      </table>

      <p>
        Please log in to the administration dashboard to review
        and process this deposit.
      </p>
    `
  );
}


/* ================================
   💸 ADMIN — NEW WITHDRAWAL
================================ */

export function adminNewWithdrawalEmail({
  name,
  email,
  amount,
}: {
  name: string;
  email: string;
  amount: number;
}) {
  return emailLayout(
    "New Withdrawal Request",
    `
      <p>Hello Admin,</p>

      <p>
        A new withdrawal request has been submitted and is
        awaiting approval.
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
          <td style="color:#a1a1aa;">
            User
          </td>

          <td align="right" style="font-weight:bold;">
            ${name}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Email
          </td>

          <td align="right">
            ${email}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Withdrawal Amount
          </td>

          <td
            align="right"
            style="
              color:#facc15;
              font-weight:bold;
              font-size:18px;
            "
          >
            $${Number(amount).toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Status
          </td>

          <td
            align="right"
            style="color:#facc15;font-weight:bold;"
          >
            Pending Approval
          </td>
        </tr>
      </table>

      <p>
        Please log in to the administration dashboard to review
        and process this withdrawal request.
      </p>
    `
  );
}

/* ================================
   🤖 ADMIN — NEW TRADING BOT DEPOSIT
================================ */

export function adminNewTradingBotDepositEmail({
  name,
  email,
  amount,
  method,
  botName,
  planName,
  txid,
}: {
  name: string;
  email: string;
  amount: number;
  method?: string;
  botName?: string;
  planName?: string;
  txid?: string;
}) {
  return emailLayout(
    "New Trading Bot Deposit",
    `
      <p>Hello Admin,</p>

      <p>
        A new <strong>Trading Bot deposit</strong> has been submitted
        and is awaiting review.
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
          <td style="color:#a1a1aa;">
            User
          </td>

          <td align="right" style="font-weight:bold;">
            ${name}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Email
          </td>

          <td align="right">
            ${email}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Trading Bot
          </td>

          <td align="right" style="font-weight:bold;">
            ${botName || "New Trading Bot"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Investment Amount
          </td>

          <td
            align="right"
            style="
              color:#22c55e;
              font-weight:bold;
              font-size:18px;
            "
          >
            $${Number(amount).toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Payment Method
          </td>

          <td align="right">
            ${method || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Type
          </td>

          <td align="right">
            New Trading Bot
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Status
          </td>

          <td
            align="right"
            style="
              color:#facc15;
              font-weight:bold;
            "
          >
            Pending Review
          </td>
        </tr>
      </table>

      <p>
        Please log in to the administration dashboard to review
        and process this Trading Bot deposit.
      </p>
    `
  );
}

/* ================================
   🤖 ADMIN — NEW TRADING BOT TOP-UP
================================ */

export function adminNewTradingBotTopUpEmail({
  name,
  email,
  amount,
  method,
  botName,
  planName,
  txid,
}: {
  name: string;
  email: string;
  amount: number;
  method?: string;
  botName?: string;
  planName?: string;
  txid?: string;
}) {
  return emailLayout(
    "New Trading Bot Top-Up",
    `
      <p>Hello Admin,</p>

      <p>
        A user has submitted a new
        <strong>Trading Bot top-up</strong>
        and it is awaiting review.
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
          <td style="color:#a1a1aa;">
            User
          </td>

          <td align="right" style="font-weight:bold;">
            ${name}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Email
          </td>

          <td align="right">
            ${email}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Trading Bot
          </td>

          <td align="right" style="font-weight:bold;">
            ${botName || "Trading Bot"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Plan
          </td>

          <td align="right">
            ${planName || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Top-Up Amount
          </td>

          <td
            align="right"
            style="
              color:#22c55e;
              font-weight:bold;
              font-size:18px;
            "
          >
            $${Number(amount).toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Payment Method
          </td>

          <td align="right">
            ${method || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Transaction Hash
          </td>

          <td
            align="right"
            style="
              font-size:13px;
              word-break:break-all;
            "
          >
            ${txid || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Type
          </td>

          <td align="right">
            Trading Bot Top-Up
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Status
          </td>

          <td
            align="right"
            style="
              color:#facc15;
              font-weight:bold;
            "
          >
            Pending Review
          </td>
        </tr>
      </table>

      <p>
        Please log in to the administration dashboard to review
        and process this Trading Bot top-up.
      </p>
    `
  );
}

/* ================================
   🤖 USER — TRADING BOT DEPOSIT SUBMITTED
================================ */

export function tradingBotDepositSubmittedEmail({
  name,
  amount,
  botName,
  planName,
  txid,
}: {
  name: string;
  amount: number;
  botName?: string;
  planName?: string;
  txid?: string;
}) {
  return emailLayout(
    "Trading Bot Deposit Received",
    `
      <p>Hello <strong>${name}</strong>,</p>

      <p>
        We have successfully received your
        <strong>Trading Bot deposit request</strong>.
      </p>

      <p>
        Your payment has been submitted and is currently
        <strong style="color:#facc15;">pending review</strong>
        by our administration team.
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
          <td style="color:#a1a1aa;">
            Trading Bot
          </td>

          <td align="right" style="font-weight:bold;">
            ${botName || "New Trading Bot"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Plan
          </td>

          <td align="right">
            ${planName || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Deposit Amount
          </td>

          <td
            align="right"
            style="
              color:#22c55e;
              font-weight:bold;
              font-size:18px;
            "
          >
            $${Number(amount).toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Transaction Hash
          </td>

          <td
            align="right"
            style="
              font-size:13px;
              word-break:break-all;
            "
          >
            ${txid || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Status
          </td>

          <td
            align="right"
            style="
              color:#facc15;
              font-weight:bold;
            "
          >
            Pending Review
          </td>
        </tr>
      </table>

      <p>
        Our administration team will review your payment.
        You will receive another email once your Trading Bot
        deposit has been approved or rejected.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining.</strong>
      </p>

      <p>
        Best regards,<br>
        <strong>Imperial Aurum Mining Team</strong>
      </p>
    `
  );
}


/* ================================
   🤖 USER — TRADING BOT TOP-UP SUBMITTED
================================ */

export function tradingBotTopUpSubmittedEmail({
  name,
  amount,
  botName,
  planName,
  txid,
}: {
  name: string;
  amount: number;
  botName?: string;
  planName?: string;
  txid?: string;
}) {
  return emailLayout(
    "Trading Bot Top-Up Received",
    `
      <p>Hello <strong>${name}</strong>,</p>

      <p>
        We have successfully received your
        <strong>Trading Bot top-up request</strong>.
      </p>

      <p>
        Your top-up payment has been submitted and is currently
        <strong style="color:#facc15;">pending review</strong>
        by our administration team.
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
          <td style="color:#a1a1aa;">
            Trading Bot
          </td>

          <td align="right" style="font-weight:bold;">
            ${botName || "Trading Bot"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Plan
          </td>

          <td align="right">
            ${planName || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Top-Up Amount
          </td>

          <td
            align="right"
            style="
              color:#22c55e;
              font-weight:bold;
              font-size:18px;
            "
          >
            $${Number(amount).toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Transaction Hash
          </td>

          <td
            align="right"
            style="
              font-size:13px;
              word-break:break-all;
            "
          >
            ${txid || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Status
          </td>

          <td
            align="right"
            style="
              color:#facc15;
              font-weight:bold;
            "
          >
            Pending Review
          </td>
        </tr>
      </table>

      <p>
        Our administration team will review your payment.
        You will receive another email once your Trading Bot
        top-up has been approved or rejected.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining.</strong>
      </p>

      <p>
        Best regards,<br>
        <strong>Imperial Aurum Mining Team</strong>
      </p>
    `
  );
}


/* ================================
   🤖 USER — TRADING BOT DEPOSIT/TOP-UP APPROVED
================================ */

export function tradingBotDepositApprovedEmail({
  name,
  amount,
  botName,
  planName,
  type,
}: {
  name: string;
  amount: number;
  botName?: string;
  planName?: string;
  type: "deposit" | "top_up";
}) {
  const isTopUp = type === "top_up";

  return emailLayout(
    isTopUp
      ? "Trading Bot Top-Up Approved"
      : "Trading Bot Deposit Approved",
    `
      <p>Hello <strong>${name}</strong>,</p>

      <p>
        Congratulations!
      </p>

      <p>
        Your
        <strong>
          ${isTopUp ? "Trading Bot top-up" : "Trading Bot deposit"}
        </strong>
        has been successfully approved.
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
          <td style="color:#a1a1aa;">
            Trading Bot
          </td>

          <td align="right" style="font-weight:bold;">
            ${botName || "Trading Bot"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Plan
          </td>

          <td align="right">
            ${planName || "N/A"}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            ${isTopUp ? "Top-Up Amount" : "Deposit Amount"}
          </td>

          <td
            align="right"
            style="
              color:#22c55e;
              font-weight:bold;
              font-size:18px;
            "
          >
            $${Number(amount).toFixed(2)}
          </td>
        </tr>

        <tr>
          <td style="color:#a1a1aa;">
            Status
          </td>

          <td
            align="right"
            style="
              color:#22c55e;
              font-weight:bold;
            "
          >
            Approved
          </td>
        </tr>
      </table>

      <p>
        ${
          isTopUp
            ? "Your Trading Bot balance has been updated with the approved top-up amount."
            : "Your Trading Bot deposit has been approved and your Trading Bot is now active according to your selected plan."
        }
      </p>

      <p>
        You can log in to your dashboard to view your
        Trading Bot balance and activity.
      </p>

      <p>
        Thank you for choosing
        <strong>Imperial Aurum Mining.</strong>
      </p>

      <p>
        Best regards,<br>
        <strong>Imperial Aurum Mining Team</strong>
      </p>
    `
  );
}