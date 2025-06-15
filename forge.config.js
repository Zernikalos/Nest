const path = require('path');

module.exports = {
    packagerConfig: {
        dir: __dirname,
        // out: 'out',
        name: 'ZernikalosNest',
        icon: path.resolve(__dirname, './assets/icons/zklogo.icns'),
        // For testing is better setting this to false
        asar: false,
        //osxSign: {},
        appCategoryType: 'public.app-category.developer-tools',
        directories: {
            app: __dirname
        },
        extraResource: [
        ],
        
        ignore: (filePath) => {
            const ignorePatterns = [
                '.idea',
                'docs',
                'electronapp',
                'nestserver',
                'packages',
                'samples',
                '.gitignore',
                '.eslintrc',
                'forge.config.js',
                'nest-cli.json',
                'package-lock.json',
                'pnpm-lock.yaml',
                'pnpm-workspace.yaml',
                'tsconfig.electron.json',
                'tsconfig.json',
                'tsconfig.nest.json',
                'vite.preload.config.mjs',
                'vite.renderer.config.mjs',
                'vite.preload.config.js',
                'webpack.main.config.js'
            ]

            for (const pattern of ignorePatterns) {
                if (filePath.includes(pattern)) {
                    return true;
                }
            }

            return false;
        },

        fileAssociations: [
            {
                "ext": "zko",
                "name": "Zernikalos Engine scene object file",
                "perMachine": "true",
                "icon": "assets/icons/zklogo"
            }
        ]
    },
    makers: [
        {
            name: '@electron-forge/maker-dmg',
            config: {
                name: 'Zernikalos Nest',
                icon: './assets/icons/zklogo.icns',
                //overwrite: true
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['linux'],
            config: {
                name: 'Zernikalos Nest',
                icon: './assets/icons/zklogo.icns',
                //overwrite: true
            }
        }
    ],
    plugins: [

    ]
};
