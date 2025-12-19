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
export const Navigate = ({ to, replace = false }: NavigateProps) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate(to);
        
        // Handle replace functionality by replacing current history entry
        if (replace) {
            window.history.replaceState(null, '', to);
        }
    }, [navigate, to, replace]);

    return null; // This component renders nothing
};
