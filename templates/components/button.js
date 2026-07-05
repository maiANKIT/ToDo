const styles = require("./styles");

const button = (text, url) => {

    return `

    <tr>

        <td
            align="center"
            style="
                padding:10px 40px 45px;
            "
        >

            <a

                href="${url}"

                target="_blank"

                style="
                    display:inline-block;
                    background:
                    linear-gradient(
                        135deg,
                        ${styles.colors.primary} 0%,
                        ${styles.colors.secondary} 100%
                    );
                    color:#FFFFFF;
                    text-decoration:none;
                    font-size:16px;
                    font-weight:600;
                    padding:16px 34px;
                    border-radius:14px;
                    letter-spacing:.2px;
                    box-shadow:
                        0 10px 25px rgba(79,70,229,.28);
                "

            >

                ${text}

            </a>

        </td>

    </tr>

    `;

};

module.exports = button;