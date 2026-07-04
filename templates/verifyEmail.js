const verifyEmailTemplate = (otp, name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                background: #f4f4f6;
            }

            .wrapper {
                width: 100%;
                padding: 40px 16px;
            }

            .container {
                max-width: 480px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 28px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0,0,0,0.06);
            }

            .header {
                padding: 32px 32px 24px;
                text-align: center;
            }

            .logo-badge img {
                width: 40px;
                height: 40px;
                margin-bottom: 12px;
            }

            .header h1 {
                color: #111111;
                font-size: 20px;
                font-weight: 800;
                margin: 0;
                letter-spacing: -0.02em;
            }

            .body-content {
                padding: 8px 32px 8px;
            }

            .body-content h2 {
                font-size: 20px;
                font-weight: 800;
                color: #111111;
                margin: 0 0 6px;
            }

            .body-content h2 .accent {
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .body-content p {
                font-size: 14.5px;
                line-height: 1.65;
                color: #666666;
                margin: 0 0 20px;
            }

            .otp-card {
                background: #f7f7f9;
                border-radius: 20px;
                padding: 26px;
                text-align: center;
                margin-bottom: 22px;
            }

            .otp-label {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #999999;
                margin-bottom: 12px;
            }

            .otp-code {
                font-size: 34px;
                font-weight: 800;
                letter-spacing: 10px;
                color: #111111;
                font-family: 'Courier New', monospace;
            }

            .otp-expiry {
                display: inline-block;
                margin-top: 16px;
                font-size: 12px;
                font-weight: 700;
                color: #d97706;
                background: rgba(245, 158, 11, 0.12);
                padding: 6px 16px;
                border-radius: 999px;
            }

            .divider {
                height: 1px;
                background: #eeeeee;
                margin: 8px 32px 0;
            }

            .footer-note {
                padding: 20px 32px 30px;
                font-size: 12.5px;
                line-height: 1.6;
                color: #aaaaaa;
                text-align: center;
            }

            .footer-brand {
                padding: 20px 32px;
                background: #fafafa;
                text-align: center;
                font-size: 12px;
                font-weight: 700;
                color: #bbbbbb;
                letter-spacing: 0.04em;
            }

            .footer-brand span {
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        </style>
    </head>

    <body>
        <div class="wrapper">
            <div class="container">

                <div class="header">
                    <div class="logo-badge">
                        <img src="https://to-do-eight-plum.vercel.app/assets/logo-CKcmC0VG.png" alt="TodoFlow" />
                    </div>
                    <h1>TodoFlow</h1>
                </div>

                <div class="body-content">
                    <h2>Hello <span class="accent">${name}</span>!</h2>
                    <p>Welcome to TodoFlow — let's get your account verified so you can start organizing your tasks.</p>

                    <div class="otp-card">
                        <div class="otp-label">Your Verification Code</div>
                        <div class="otp-code">${otp}</div>
                        <div class="otp-expiry">Expires in 5 minutes</div>
                    </div>

                    <p>Enter this code in TodoFlow to verify your email address. If you didn't request this, you can safely ignore this email.</p>
                </div>

                <div class="divider"></div>

                <div class="footer-note">
                    This is an automated message — please don't reply directly to this email.
                </div>

                <div class="footer-brand">
                    Team <span>TodoFlow</span>
                </div>

            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = verifyEmailTemplate;