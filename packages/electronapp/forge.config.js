const path = require('path');

module.exports = {
    packagerConfig: {
        name: 'ZernikalosNest',
        icon: path.resolve(__dirname, './assets/icons/zklogo.icns'),
        // For testing is better setting this to false
        asar: false,
        osxSign: {},
        appCategoryType: 'public.app-category.developer-tools',
        directories: {
            "buildResources": "assets",
            "output": "release/${version}"
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
                overwrite: true
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['linux'],
            config: {
                name: 'Zernikalos Nest',
                icon: './assets/icons/zklogo.icns',
                overwrite: true
            }
        }
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-webpack',
            config: {
                mainConfig: './webpack.main.config.js',
                devContentSecurityPolicy: "default-src 'self' 'unsafe-eval' 'unsafe-inline' blob: http://localhost:* ws://localhost:*;",
                renderer: {
                    config: './webpack.renderer.config.js',
                    entryPoints: [{
                        name: 'zernikalos_nest_main_window',
                        html: '../nestui/dist/index.html',
                        js: '../nestui/dist/assets/index.js',
                        preload: {
                            js: './src/preload.ts'
                        }
                    }]
                }
            }
        }
    ]
};
