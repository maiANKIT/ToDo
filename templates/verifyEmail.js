const verifyEmailTemplate = (otp, name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body{
                font-family:Arial,sans-serif;
                background:#f5f5f5;
                padding:30px;
            }

            .container{
                max-width:600px;
                margin:auto;
                background:#fff;
                padding:30px;
                border-radius:12px;
            }

            .otp{
                font-size:32px;
                font-weight:bold;
                letter-spacing:8px;
                text-align:center;
                margin:30px 0;
            }

            .footer{
                color:#666;
                font-size:14px;
                margin-top:25px;
            }
        </style>
    </head>

    <body>

        <div class="container">

            <h2>Hello ${name}</h2>

            <p>
                Welcome to <b>TodoFlow</b>.
            </p>

            <p>
                Use the OTP below to verify your email.
            </p>

            <div class="otp">
                ${otp}
            </div>

            <p>
                This OTP will expire in <b>5 minutes</b>.
            </p>

            <p>
                If you didn't request this OTP, you can safely ignore this email.
            </p>

            <div class="footer">
                Team TodoFlow
            </div>

        </div>

    </body>
    </html>
    `;
};

module.exports = verifyEmailTemplate;