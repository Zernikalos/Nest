import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { useKeepAliveRouter } from './KeepAliveRouter';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
    children: ReactNode;
    className?: string;
    activeClassName?: string;
    onClick?: (e?: React.MouseEvent) => void;
}

/**
 * Link component for KeepAlive Router
 * Similar to react-router-dom's Link but works with our keep-alive system
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ 
    to, 
    children, 
    className = '', 
    activeClassName = '',
    onClick,
    ...rest
}, ref) => {
    const { navigate, isRouteActive } = useKeepAliveRouter();
    const isActive = isRouteActive(to);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(to);
        onClick?.(e);
    };

    // Combine base className with active className if active
    const finalClassName = isActive && activeClassName 
        ? `${className} ${activeClassName}`.trim()
        : className;

    return (
        <a
            ref={ref}
            href={to}
            onClick={handleClick}
            className={finalClassName}
            data-active={isActive}
            data-to={to}
            {...rest}
        >
            {children}
        </a>
    );
});

Link.displayName = 'Link';

interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
    to: string;
    children: ReactNode | ((props: { isActive: boolean }) => ReactNode);
    className?: string;
    activeClassName?: string;
    onClick?: (e?: React.MouseEvent) => void;
}

/**
 * NavLink component for KeepAlive Router
 * Similar to react-router-dom's NavLink with render prop support
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(({ 
    to, 
    children, 
    className = '', 
    activeClassName = '',
    onClick,
    ...rest
}, ref) => {
    const { navigate, isRouteActive } = useKeepAliveRouter();
    const isActive = isRouteActive(to);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(to);
        onClick?.(e);
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
            ref={ref}
            href={to}
            onClick={handleClick}
            className={finalClassName}
            data-active={isActive}
            data-to={to}
            {...rest}
        >
            {content}
        </a>
    );
});

NavLink.displayName = 'NavLink';
