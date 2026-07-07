const styles = require("./components/styles");

const header = require("./components/header");
const button = require("./components/button");
const footer = require("./components/footer");

const workspaceInvitationTemplate = ({
    invitedBy,
    workspaceName,
    role,
    acceptUrl
}) => {

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

Workspace Invitation

</title>

</head>

<body
    style="
        margin:0;
        padding:0;
        background:${styles.colors.background};
        font-family:Arial, Helvetica, sans-serif;
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

    "Workspace Invitation",

    "You've been invited to collaborate on a TodoFlow workspace."

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

You're Invited!

</h2>

<p
    style="
        margin:22px 0 0;
        color:${styles.colors.text};
        font-size:16px;
        line-height:30px;
    "
>

<strong>${invitedBy}</strong> has invited you to join a workspace on
<strong>${styles.appName}</strong>.

</p>

</td>

</tr>

<tr>

<td
    style="
        padding:0 42px 35px;
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

<p
    style="
        margin:0;
        color:${styles.colors.muted};
        font-size:13px;
        text-transform:uppercase;
        letter-spacing:1px;
    "
>

Workspace

</p>

<p
    style="
        margin:10px 0 22px;
        color:${styles.colors.heading};
        font-size:24px;
        font-weight:700;
    "
>

${workspaceName}

</p>

<p
    style="
        margin:0;
        color:${styles.colors.muted};
        font-size:13px;
        text-transform:uppercase;
        letter-spacing:1px;
    "
>

Role

</p>

<p
    style="
        margin:10px 0 0;
        display:inline-block;
        background:#EEF2FF;
        color:${styles.colors.primary};
        padding:8px 18px;
        border-radius:999px;
        font-size:15px;
        font-weight:600;
    "
>

${role}

</p>

</td>

</tr>

</table>

</td>

</tr>

${button(

    "Accept Invitation",

    acceptUrl

)}

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
        font-size:15px;
        line-height:30px;
        text-align:center;
    "
>

This invitation will expire in
<strong>7 days</strong>.

<br><br>

If you weren't expecting this invitation,
you can safely ignore this email.

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

module.exports = workspaceInvitationTemplate;