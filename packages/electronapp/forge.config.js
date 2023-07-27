module.exports = {
    packagerConfig: {
        icon: './assets/zklogo.icns'
    },
    makers: [
        {
            name: '@electron-forge/maker-dmg',
            config: {
                name: 'Zernikalos Studio',
                icon: './assets/zklogo.icns',
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
                        name: 'studio',
                        config: '../studio/vite.config.js'
                    }
                ]
            }
        }
    ]
};