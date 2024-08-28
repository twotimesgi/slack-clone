import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";

export const WorkspaceSidebar = () => {
    const workspaceId = useWorkSpaceId();
    const {data: member, isLoading: memberLoading} = useCurrentMember({workspaceId});
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId});

    if(memberLoading || workspaceLoading) return (
    <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
       <Loader className="size-5 text-white animate-spin"/>
        </div>
    );
if(!workspace || !member) return (
    <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
       <AlertTriangle className="size-5 text-white"/>
       <p className="text-sm text-white">Workspace not found</p>
        </div>
);
    return (
        <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full">
        <WorkspaceHeader isAdmin={member.role === "admin"} workspace={workspace}/>  
        </div>

    );
    }