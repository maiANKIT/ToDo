const styles = require("./styles");

const header = (title, subtitle) => {

    return `

    <!-- Header -->

    <tr>

        <td
            align="center"
            style="
                padding:50px 40px;
                background:
                linear-gradient(
                    135deg,
                    ${styles.colors.primary} 0%,
                    ${styles.colors.secondary} 100%
                );
            "
        >

            <img
                src="${styles.logo}"
                alt="${styles.appName}"
                width="78"
                style="
                    display:block;
                    margin-bottom:28px;
                "
            />

            <h1
                style="
                    margin:0;
                    color:#FFFFFF;
                    font-size:34px;
                    font-weight:700;
                    line-height:42px;
                    letter-spacing:-0.5px;
                "
            >

                ${title}

            </h1>

            <p
                style="
                    margin:18px 0 0;
                    color:rgba(255,255,255,.88);
                    font-size:17px;
                    line-height:28px;
                    max-width:460px;
                "
            >

                ${subtitle}

            </p>

        </td>

    </tr>

    `;

};

module.exports = header;