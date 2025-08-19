import { useEffect } from 'react';
import { useNavigate } from './KeepAliveRouter';

interface NavigateProps {
    to: string;
    replace?: boolean;
}

/**
 * Navigate component for programmatic redirects
 * Similar to react-router-dom's Navigate component
 * Automatically navigates to the specified route when mounted
 */
export const Navigate = ({ to, replace }: NavigateProps) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate(to);
    }, [navigate, to]);

    return null; // This component renders nothing
};
