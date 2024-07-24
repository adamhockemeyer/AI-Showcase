module.exports = {
    output: "standalone",
}

// module.exports = {
//     async redirects() {
//         return [
//             {
//                 source: '/((?!.swa).*)/health.html',
//                 destination: '/health.html',
//                 permanent: false,
//             },
//         ]
//     },
// };

// module.exports = {
//     async rewrites() {
//         return {
//             beforeFiles: [
//                 {
//                     source: '/((?!.swa).*)/health.html',
//                     destination: '/health.html',
//                 }
//             ]
//         }
//     },
// };