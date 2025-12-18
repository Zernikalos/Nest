import React, { useEffect } from 'react';
import { useNavigate } from '@/keepaliverouter';
import { useAssetToZko } from '@/hooks/useAssetToZko';
import { EditorView } from '@/pages/editor/EditorView';

export const EditorPage: React.FC = () => {
    const navigate = useNavigate();
    const { zkResult } = useAssetToZko();

    useEffect(() => {
        if (!zkResult) {
            navigate('/projects');
        }
    }, [zkResult, navigate]);

    if (!zkResult) {
        return null;
    }

    return <EditorView />;
};
