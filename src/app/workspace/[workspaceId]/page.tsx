"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
    const workspaceId = useWorkSpaceId();
    const {data, isLoading} = useGetWorkspace({id: workspaceId});

    return (<div>
        </div>);
    }

export default WorkspaceIdPage;