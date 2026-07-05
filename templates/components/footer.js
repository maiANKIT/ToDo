const styles = require("./styles");

const footer = () => {

    return `

<tr>

    <td
        align="center"
        style="
            padding:40px;
            background:#FAFBFC;
            border-top:1px solid ${styles.colors.border};
        "
    >

        <img

            src="${styles.logo}"

            alt="${styles.appName}"

            width="42"

            style="
                display:block;
                margin:0 auto 18px;
            "

        />

        <p
            style="
                margin:0;
                color:${styles.colors.heading};
                font-size:16px;
                font-weight:600;
            "
        >

            ${styles.appName}

        </p>

        <p
            style="
                margin:12px 0 0;
                color:${styles.colors.text};
                font-size:14px;
                line-height:24px;
            "
        >

            Built for productivity.<br>

            Designed for focus.

        </p>

        <table
            cellpadding="0"
            cellspacing="0"
            style="
                margin:28px auto;
            "
        >

            <tr>

                <td>

                    <a

                        href="${styles.website}"

                        style="
                            color:${styles.colors.primary};
                            text-decoration:none;
                            font-size:14px;
                            font-weight:600;
                        "

                    >

                        Website

                    </a>

                </td>

                <td width="24"></td>

                <td>

                    <a

                        href="mailto:${styles.support}"

                        style="
                            color:${styles.colors.primary};
                            text-decoration:none;
                            font-size:14px;
                            font-weight:600;
                        "

                    >

                        Support

                    </a>

                </td>

            </tr>

        </table>

        <p
            style="
                margin:0;
                color:${styles.colors.muted};
                font-size:13px;
                line-height:22px;
            "
        >

            © ${new Date().getFullYear()} ${styles.appName}. All rights reserved.

        </p>

    </td>

</tr>

`;

};

module.exports = footer;