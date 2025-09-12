import logoSrc from '@/assets/zklogo.svg';
import { memo } from 'react';

export const Logo = memo(() => {
    return (
        <img
            src={logoSrc}
            alt="Logo"
            className="h-8 w-8 ml-1.5 select-none"
            width="32"
            height="32"
        />
    );
})

Logo.displayName = 'Logo';
