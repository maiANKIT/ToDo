const styles = require("./components/styles");

const header = require("./components/header");
const otpBox = require("./components/otpBox");
const button = require("./components/button");
const footer = require("./components/footer");

const forgetPasswordTemplate = (otp, name) => {

    return `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
/>

<title>

Reset Password

</title>

</head>

<body
    style="
        margin:0;
        padding:0;
        background:${styles.colors.background};
        font-family:
        Arial,
        Helvetica,
        sans-serif;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:${styles.colors.background};
        padding:40px 15px;
    "
>

<tr>

<td align="center">

<table

    width="620"

    cellpadding="0"

    cellspacing="0"

    border="0"

    style="
        background:${styles.colors.card};
        border:1px solid ${styles.colors.border};
        border-radius:22px;
        overflow:hidden;
    "

>

${header(

    "Reset Your Password",

    "Use the verification code below to securely reset your TodoFlow password."

)}

<tr>

<td
    style="
        padding:42px 42px 18px;
    "
>

<h2
    style="
        margin:0;
        color:${styles.colors.heading};
        font-size:28px;
        font-weight:700;
    "
>

Hello ${name},

</h2>

<p
    style="
        margin:22px 0 0;
        color:${styles.colors.text};
        font-size:16px;
        line-height:30px;
    "
>

We received a request to reset the password associated with your TodoFlow account.

</p>

<p
    style="
        margin:20px 0 0;
        color:${styles.colors.text};
        font-size:16px;
        line-height:30px;
    "
>

To continue, enter the verification code below inside TodoFlow.

</p>

</td>

</tr>

${otpBox(otp)}
<tr>

<td
    align="center"
    style="
        padding:0 42px 38px;
    "
>

<p
    style="
        margin:0;
        color:${styles.colors.text};
        font-size:15px;
        line-height:28px;
    "
>

This verification code is valid for

<strong>

5 minutes

</strong>

and can only be used once.

</p>

</td>

</tr>

${button(

    "Open TodoFlow",

    styles.website + "/login"

)}

<tr>

<td
    style="
        padding:0 42px 42px;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:#FEF2F2;
        border:1px solid #FECACA;
        border-left:5px solid ${styles.colors.danger};
        border-radius:16px;
    "
>

<tr>

<td
    style="
        padding:24px;
    "
>

<h3
    style="
        margin:0;
        color:${styles.colors.heading};
        font-size:18px;
        font-weight:700;
    "
>

Security Notice

</h3>

<p
    style="
        margin:14px 0 0;
        color:${styles.colors.text};
        font-size:15px;
        line-height:28px;
    "
>

If you didn't request a password reset, you can safely ignore this email.

Your password will remain unchanged until the verification code is successfully used.

</p>

</td>

</tr>

</table>

</td>

</tr>

<tr>

<td
    style="
        padding:0 42px 42px;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:#F8FAFC;
        border:1px solid ${styles.colors.border};
        border-radius:16px;
    "
>

<tr>

<td
    style="
        padding:24px;
    "
>

<h3
    style="
        margin:0;
        color:${styles.colors.heading};
        font-size:18px;
        font-weight:700;
    "
>

Keeping Your Account Secure

</h3>

<p
    style="
        margin:14px 0 0;
        color:${styles.colors.text};
        font-size:15px;
        line-height:28px;
    "
>

• Never share this verification code with anyone.

<br><br>

• TodoFlow will never ask you for this code by email or phone.

<br><br>

• If you believe someone else requested this reset, we recommend changing your password immediately after logging in.

</p>

</td>

</tr>

</table>

</td>

</tr>
${footer()}

</table>

</td>

</tr>

</table>

</body>

</html>

`;

};

module.exports = forgetPasswordTemplate;