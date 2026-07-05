const styles = require("./components/styles");

const header = require("./components/header");
const button = require("./components/button");
const footer = require("./components/footer");

const resetSuccessTemplate = (name) => {

    return `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8"/>

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
/>

<title>

Password Reset Successful

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

    "Password Updated",

    "Your TodoFlow account password has been changed successfully."

)}

<tr>

<td
    style="
        padding:42px;
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

This email confirms that your TodoFlow password has been updated successfully.

</p>

<p
    style="
        margin:20px 0 0;
        color:${styles.colors.text};
        font-size:16px;
        line-height:30px;
    "
>

Your account is now protected with your new password.

</p>

</td>

</tr>
<tr>

<td
    style="
        padding:0 42px 40px;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        background:#F0FDF4;
        border:1px solid #BBF7D0;
        border-left:5px solid ${styles.colors.success};
        border-radius:18px;
    "
>

<tr>

<td
    style="
        padding:28px;
    "
>

<h3
    style="
        margin:0;
        color:${styles.colors.heading};
        font-size:20px;
        font-weight:700;
    "
>

Security Confirmation

</h3>

<p
    style="
        margin:18px 0 0;
        color:${styles.colors.text};
        font-size:15px;
        line-height:30px;
    "
>

Your previous password is no longer valid.

Only your new password can now be used to access your account.

</p>

</td>

</tr>

</table>

</td>

</tr>

${button(

    "Login to TodoFlow",

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
    style="
        background:#FEF2F2;
        border:1px solid #FECACA;
        border-left:5px solid ${styles.colors.danger};
        border-radius:18px;
    "
>

<tr>

<td
    style="
        padding:28px;
    "
>

<h3
    style="
        margin:0;
        color:${styles.colors.heading};
        font-size:20px;
        font-weight:700;
    "
>

Didn't make this change?

</h3>

<p
    style="
        margin:18px 0 0;
        color:${styles.colors.text};
        font-size:15px;
        line-height:30px;
    "
>

If you didn't change your password, immediately reset it again and contact our support team.

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

<p
    style="
        margin:0;
        text-align:center;
        color:${styles.colors.text};
        font-size:16px;
        line-height:30px;
    "
>

Thank you for keeping your TodoFlow account secure.

</p>

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

module.exports = resetSuccessTemplate;