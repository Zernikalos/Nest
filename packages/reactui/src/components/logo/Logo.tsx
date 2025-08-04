import logoSrc from '@/assets/zklogo.svg';

export function Logo() {
    return (
        <img
            src={logoSrc}
            alt="Logo"
            className="h-8 w-8 ml-1.5 select-none"
            width="32"
            height="32"
        />
    );
}
