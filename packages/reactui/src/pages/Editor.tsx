import React, { useState } from 'react';

import EditorView from '@/views/editor/EditorView';
import NewProject from '@/views/editor/NewProject';

const Editor: React.FC = () => {
    const [projectActive, setProjectActive] = useState(true);

    const handleNewProject = () => {
        setProjectActive(true);
    };

    return (
        <>
            {projectActive ? (
                <EditorView />
            ) : (
                <NewProject onNewProject={handleNewProject} />
            )}
        </>
    );
};

export default Editor;
