const styles = require("./styles");

const featureCard = (

    icon,

    title,

    description

) => {

    return `

<tr>

    <td
        style="
            padding:0 40px 18px;
        "
    >

        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
                background:${styles.colors.card};
                border:1px solid ${styles.colors.border};
                border-radius:18px;
            "
        >

            <tr>

                <td
                    width="82"
                    align="center"
                    valign="middle"
                    style="
                        padding:22px;
                    "
                >

                    <div
                        style="
                            width:54px;
                            height:54px;
                            border-radius:16px;
                            background:#EEF2FF;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                        "
                    >

                        ${icon}

                    </div>

                </td>

                <td
                    style="
                        padding:22px 22px 22px 0;
                    "
                >

                    <h3
                        style="
                            margin:0;
                            font-size:18px;
                            font-weight:700;
                            color:${styles.colors.heading};
                        "
                    >

                        ${title}

                    </h3>

                    <p
                        style="
                            margin:10px 0 0;
                            font-size:15px;
                            line-height:1.8;
                            color:${styles.colors.text};
                        "
                    >

                        ${description}

                    </p>

                </td>

            </tr>

        </table>

    </td>

</tr>

`;

};

module.exports = featureCard;