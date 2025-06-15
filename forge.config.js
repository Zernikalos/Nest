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
