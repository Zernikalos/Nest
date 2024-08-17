module.exports = {
    packagerConfig: {
        name: 'ZernikalosNest',
        icon: './assets/icons/zklogo',
        asar: true,
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
        ],

        // mac: {
        //     "artifactName": "ZernikalosNest_${version}.${ext}",
        //     "target": [
        //         "dmg"
        //     ]
        // },
        // win: {
        //     "target": [{
        //         "target": "nsis",
        //         "arch": [
        //             "x64"
        //         ]
        //     }],
        //     "artifactName": "${productName}_${version}.${ext}"
        // },
        // nsis: {
        //     "oneClick": false,
        //     "perMachine": false,
        //     "allowToChangeInstallationDirectory": true,
        //     "deleteAppDataOnUninstall": false
        // }
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
            name: '@electron-forge/plugin-vite',
            config: {
                // `build` can specify multiple entry builds, which can be
                // Main process, Preload scripts, Worker process, etc.
                build: [
                    {
                        // `entry` is an alias for `build.lib.entry`
                        // in the corresponding file of `config`.
                        entry: './src/main.ts',
                        config: 'vite.main.config.js'
                    },
                    {
                        entry: './src/preload.ts',
                        config: 'vite.preload.config.js'
                    }
                ],
                renderer: [
                    {
                        name: 'nestui',
                        config: 'vite.renderer.config.js'
                    }
                ]
            }
        }
    ]
};
