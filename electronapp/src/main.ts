if (process.env.DEBUG === 'true') {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
}

import {ZernikalosNest} from "./ZernikalosNest";

const zernikalosNest = new ZernikalosNest()
zernikalosNest.initialize()
