const styles = require("./components/styles");

const header = require("./components/header");

const otpBox = require("./components/otpBox");

const button = require("./components/button");

const footer = require("./components/footer");

const verifyEmailTemplate = (otp, name) => {

    return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<title>

Verify Your Email

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
style="
padding:40px 15px;
"
>

<tr>

<td align="center">

<table

width="620"

cellpadding="0"

cellspacing="0"

style="
background:${styles.colors.card};
border:1px solid ${styles.colors.border};
border-radius:22px;
overflow:hidden;
"

>

${header(

"Verify Your Email",

"Complete your TodoFlow account setup by entering the verification code below."

)}

<tr>

<td
style="
padding:40px;
"
>

<h2
style="
margin-top:0;
margin-bottom:18px;
color:${styles.colors.heading};
font-size:26px;
"
>

Hello ${name},

</h2>

<p
style="
margin:0;
font-size:16px;
line-height:30px;
color:${styles.colors.text};
"
>

Thank you for joining

<strong>

TodoFlow

</strong>.

To activate your account, please use the verification code below.

</p>

</td>

</tr>

${otpBox(otp)}

<tr>

<td
align="center"
style="
padding:0 40px 35px;
"
>

<p
style="
margin:0;
font-size:15px;
line-height:28px;
color:${styles.colors.text};
"
>

This verification code will expire in

<strong>

5 minutes

</strong>.

</p>

</td>

</tr>

${button(

"Open TodoFlow",

styles.website

)}

<tr>

<td
style="
padding:0 40px 45px;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#EEF2FF;
border-left:4px solid ${styles.colors.primary};
border-radius:14px;
"
>

<tr>

<td
style="
padding:22px;
"
>

<p
style="
margin:0;
font-size:15px;
line-height:28px;
color:${styles.colors.text};
"
>

If you didn't create this account,

you can safely ignore this email.

No further action is required.

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

module.exports = verifyEmailTemplate;