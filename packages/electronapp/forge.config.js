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
            app: path.join(__dirname, 'dist')
        },

        ignore: (filePath) => {
            const keepPatterns = [
                'dist/',
                'package.json',
                'node_modules/@nestjs/common',
                'node_modules/@nestjs/core',
                'node_modules/@zernikalos/nestserver',
            ];

            for (const pattern of keepPatterns) {
                if (filePath.includes(pattern)) {
                    return false;
                }
            }

            if (filePath.includes('node_modules')) {
                return true;
            }

            return false; // No ignorar otros archivos del proyecto
        },
        extraResource: [
            path.resolve(__dirname, '../nestserver')
        ],

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
