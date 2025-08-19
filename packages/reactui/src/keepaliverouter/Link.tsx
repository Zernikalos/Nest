import type { ReactNode } from 'react';
import { useKeepAliveRouter } from './KeepAliveRouter';

interface LinkProps {
    to: string;
    children: ReactNode;
    className?: string;
    activeClassName?: string;
    onClick?: () => void;
}

/**
 * Link component for KeepAlive Router
 * Similar to react-router-dom's Link but works with our keep-alive system
 */
export const Link = ({ 
    to, 
    children, 
    className = '', 
    activeClassName = '',
    onClick 
}: LinkProps) => {
    const { navigate, isRouteActive } = useKeepAliveRouter();
    const isActive = isRouteActive(to);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
    };

    // Combine base className with active className if active
    const finalClassName = isActive && activeClassName 
        ? `${className} ${activeClassName}`.trim()
        : className;

    return (
        <a
            href={to}
            onClick={handleClick}
            className={finalClassName}
            data-active={isActive}
            data-to={to}
        >
            {children}
        </a>
    );
};

interface NavLinkProps {
    to: string;
    children: ReactNode | ((props: { isActive: boolean }) => ReactNode);
    className?: string;
    activeClassName?: string;
    onClick?: () => void;
}

/**
 * NavLink component for KeepAlive Router
 * Similar to react-router-dom's NavLink with render prop support
 */
export const NavLink = ({ 
    to, 
    children, 
    className = '', 
    activeClassName = '',
    onClick 
}: NavLinkProps) => {
    const { navigate, isRouteActive } = useKeepAliveRouter();
    const isActive = isRouteActive(to);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
    };

    // Combine base className with active className if active
    const finalClassName = isActive && activeClassName 
        ? `${className} ${activeClassName}`.trim()
        : className;

    // Handle render prop pattern (children as function)
    const content = typeof children === 'function' 
        ? children({ isActive })
        : children;

    return (
        <a
            href={to}
            onClick={handleClick}
            className={finalClassName}
            data-active={isActive}
            data-to={to}
        >
            {content}
        </a>
    );
};
