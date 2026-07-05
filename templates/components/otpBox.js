const styles = require("./styles");

const otpBox = (otp) => {

    const digits = otp.toString().split("");

    const boxes = digits.map((digit) => {

        return `

            <td
                align="center"
                width="52"
                height="58"
                style="
                    background:${styles.colors.card};
                    border:1px solid ${styles.colors.border};
                    border-radius:12px;
                    font-size:28px;
                    font-weight:700;
                    color:${styles.colors.primary};
                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;
                    box-shadow:
                        0 4px 12px rgba(0,0,0,.05);
                "
            >

                ${digit}

            </td>

        `;

    }).join(`

        <td width="8"></td>

    `);

    return `

<tr>

<td
    align="center"
    style="
        padding:30px 40px;
    "
>

<table
    cellpadding="0"
    cellspacing="0"
>

<tr>

${boxes}

</tr>

</table>

</td>

</tr>

`;

};

module.exports = otpBox;