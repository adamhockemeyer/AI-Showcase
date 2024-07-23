module.exports = {
    output: "standalone",
}

module.exports = {
    async redirects() {
        return [
            {
                source: '/((?!.swa).*)<YOUR MATCHING RULE>',
                destination: '<YOUR REDIRECT RULE>',
                permanent: false,
            },
        ]
    },
};