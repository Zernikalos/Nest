import { useNavigate } from "@/keepaliverouter";
import { useProjectCreationStore } from "@/stores";

export function useCreateProject() {
    const navigate = useNavigate();
    const {
        isDialogOpen,
        setIsDialogOpen,
        isCreating,
        error,
        createProject: createProjectAction,
    } = useProjectCreationStore();

    const handleCreate = async (projectName: string) => {
        await createProjectAction(projectName, () => {
            navigate("/editor");
        });
    };

    return {
        isDialogOpen,
        setIsDialogOpen,
        isCreating,
        error,
        handleCreate,
    };
}

