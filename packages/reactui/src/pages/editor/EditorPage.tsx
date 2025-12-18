import React, { useEffect } from 'react';
import { useNavigate } from '@/keepaliverouter';
import { useZkProject } from '@/providers/ZkProject/useZkProject';
import { EditorView } from '@/pages/editor/EditorView';

export const EditorPage: React.FC = () => {
    const navigate = useNavigate();
    const { zkResult } = useZkProject();

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
