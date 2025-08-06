import React, { useState } from 'react';

import EditorView from '@/pages/editor/EditorView';
import NewProject from '@/pages/editor/NewProject';

const EditorPage: React.FC = () => {
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

export default EditorPage;
