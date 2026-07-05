const stroke = "#4F46E5";

const svg = (body) => `
<svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
${body}
</svg>
`;

module.exports = {

    calendar: () =>
        svg(`
            <rect x="3" y="5" width="18" height="16" rx="3" stroke="${stroke}" stroke-width="2"/>
            <path d="M3 9H21" stroke="${stroke}" stroke-width="2"/>
            <path d="M8 3V7" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 3V7" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
        `),

    kanban: () =>
        svg(`
            <rect x="4" y="5" width="6" height="14" rx="2" stroke="${stroke}" stroke-width="2"/>
            <rect x="14" y="5" width="6" height="8" rx="2" stroke="${stroke}" stroke-width="2"/>
            <rect x="14" y="15" width="6" height="4" rx="2" stroke="${stroke}" stroke-width="2"/>
        `),

    analytics: () =>
        svg(`
            <path d="M5 18V12" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 18V6" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
            <path d="M19 18V9" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
        `),

    streak: () =>
        svg(`
            <path
                d="M12 3C10 6 8 8 8 11C8 13.8 9.8 16 12 16C14.2 16 16 13.8 16 11C16 8 14 6 12 3Z"
                stroke="${stroke}"
                stroke-width="2"
                fill="none"
            />
            <path
                d="M12 16V21"
                stroke="${stroke}"
                stroke-width="2"
                stroke-linecap="round"
            />
        `),

    lock: () =>
        svg(`
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="${stroke}" stroke-width="2"/>
            <path d="M8 11V8a4 4 0 118 0v3" stroke="${stroke}" stroke-width="2"/>
        `),

    shield: () =>
        svg(`
            <path
                d="M12 3L5 6V11C5 16 8.4 19.8 12 21C15.6 19.8 19 16 19 11V6L12 3Z"
                stroke="${stroke}"
                stroke-width="2"
                fill="none"
            />
        `),

    success: () =>
        svg(`
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="${stroke}"
                stroke-width="2"
            />
            <path
                d="M8 12L11 15L16 9"
                stroke="${stroke}"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        `),

    user: () =>
        svg(`
            <circle
                cx="12"
                cy="8"
                r="4"
                stroke="${stroke}"
                stroke-width="2"
            />
            <path
                d="M5 20C6.5 16.8 9 15.5 12 15.5C15 15.5 17.5 16.8 19 20"
                stroke="${stroke}"
                stroke-width="2"
                stroke-linecap="round"
            />
        `),

    mail: () =>
        svg(`
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="${stroke}"
                stroke-width="2"
            />
            <path
                d="M4 7L12 13L20 7"
                stroke="${stroke}"
                stroke-width="2"
            />
        `),

    check: () =>
        svg(`
            <path
                d="M5 12L10 17L19 7"
                stroke="${stroke}"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        `),

    arrow: () =>
        svg(`
            <path
                d="M5 12H19"
                stroke="${stroke}"
                stroke-width="2"
                stroke-linecap="round"
            />
            <path
                d="M13 6L19 12L13 18"
                stroke="${stroke}"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        `)

};