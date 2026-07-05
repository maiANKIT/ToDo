const styles = require("./components/styles");

const header = require("./components/header");
const featureCard = require("./components/featureCard");
const button = require("./components/button");
const footer = require("./components/footer");

const icons = require("./components/icons");

const welcomeEmailTemplate = (name) => {

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

Welcome to TodoFlow

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

    "Welcome to TodoFlow",

    "Your account has been successfully created. Let's make every day more productive."

)}

<tr>

<td
    style="
        padding:42px 42px 10px;
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

Welcome to <strong>TodoFlow</strong>.

We're excited to have you with us.

TodoFlow is designed to help you organize your work, stay focused, and accomplish more every day.

</p>

</td>

</tr>
<tr>

<td
    style="
        padding:0 0 18px;
    "
>

${featureCard(

    icons.calendar(),

    "Calendar Planning",

    "Visualize your daily, weekly and monthly schedule with an intuitive calendar designed to keep your tasks organized."

)}

${featureCard(

    icons.kanban(),

    "Kanban Workflow",

    "Organize tasks effortlessly using a modern drag-and-drop Kanban board built for speed and clarity."

)}

${featureCard(

    icons.analytics(),

    "Productivity Analytics",

    "Monitor your progress through detailed insights, completion statistics and productivity trends."

)}

${featureCard(

    icons.streak(),

    "Daily Streak",

    "Stay motivated by maintaining your productivity streak and building consistent work habits every day."

)}

</td>

</tr>

<tr>

<td
    style="
        padding:8px 42px 36px;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:#EEF2FF;
        border:1px solid #C7D2FE;
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
        font-size:22px;
        font-weight:700;
    "
>

Start Your Productivity Journey

</h3>

<p
    style="
        margin:18px 0 0;
        color:${styles.colors.text};
        font-size:16px;
        line-height:30px;
    "
>

Create your first task, organize your projects, monitor your progress and build momentum every single day.

Small consistent improvements lead to extraordinary results.

</p>

</td>

</tr>

</table>

</td>

</tr>

${button(

    "Open TodoFlow",

    styles.website

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
        background:#F9FAFB;
        border:1px solid ${styles.colors.border};
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

What You'll Love

</h3>

<p
    style="
        margin:18px 0 0;
        color:${styles.colors.text};
        font-size:15px;
        line-height:30px;
    "
>

• Beautiful modern interface

<br><br>

• Secure authentication

<br><br>

• Calendar & Kanban Views

<br><br>

• Smart analytics and productivity tracking

<br><br>

• Dark & Light themes

<br><br>

• Responsive experience across devices

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
        color:${styles.colors.text};
        font-size:16px;
        line-height:30px;
        text-align:center;
    "
>

Thank you for choosing
<strong>${styles.appName}</strong>.

<br><br>

We're excited to be part of your productivity journey.

Whether you're managing personal goals, college assignments, or professional projects,
TodoFlow is built to help you stay organized every step of the way.

</p>

</td>

</tr>

<tr>

<td
    align="center"
    style="
        padding:0 42px 50px;
    "
>

<p
    style="
        margin:0;
        color:${styles.colors.heading};
        font-size:22px;
        font-weight:700;
    "
>

Welcome aboard.

</p>

<p
    style="
        margin:16px 0 0;
        color:${styles.colors.text};
        font-size:16px;
        line-height:28px;
    "
>

Your productivity journey begins today.

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

module.exports = welcomeEmailTemplate;