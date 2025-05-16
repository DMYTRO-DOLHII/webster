module.exports = {
    content: ["./public/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            animation: {
                'slow-pulse': 'pulse-slow 3s ease-in-out infinite',
                'gradientBlur': 'gradientBlur 8s ease infinite', // ✨ added
                'spin-slow': 'spin 30s linear infinite',
                'float-y': 'floatY 6s ease-in-out infinite',
                'float-x': 'floatX 10s ease-in-out infinite',
                'animate-marquee': 'marquee 60s linear infinite',
            },
            keyframes: {
                'pulse-slow': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.9 },
                },
                gradientBlur: { // ✨ added
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                floatY: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                floatX: {
                    '0%, 100%': { transform: 'translateX(0px)' },
                    '50%': { transform: 'translateX(20px)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' }
                },
            },
            backgroundSize: { // ✨ added
                'gradient': '200% 200%',
            },
            screens: {
                'mbl': { 'max': '639px' },
                'tbl': { 'max': '1023px' },
                '2tbl': { 'max': '1279px' },
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: true,
    },
};
