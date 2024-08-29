"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import {useMemo, useEffect, use} from "react";
import {Loader} from "lucide-react";
import {AlertTriangle} from "lucide-react";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCurrentMember } from "@/features/members/api/use-current-member";
const WorkspaceIdPage = () => {
    const workspaceId = useWorkspaceId();
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId});
    const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId});
    const {data: member, isLoading: memberLoading} = useCurrentMember({workspaceId});
    const [open, setOpen] = useCreateChannelModal();
    const router = useRouter();

    const channleId = useMemo(() => channels?.[0]?._id, [channels]);
    const isAdmin = useMemo(() => member?.role === "admin", [member]);

    useEffect(() => {
        if(workspaceLoading || channelsLoading || !workspace || memberLoading || !member) return;
        if(channleId) {
            router.replace(`/workspace/${workspaceId}/channel/${channleId}`);
        }else if(!open && isAdmin){
            setOpen(true);
        }
    },[channleId, workspaceLoading, channelsLoading, workspace, open, setOpen, router, workspaceId, member, memberLoading, isAdmin]);

    if(workspaceLoading || channelsLoading) return (
        <div className="flex flex-col h-full items-center justify-center gap-2 flex-1">
            <Loader className="size-6 text-muted-foreground animate-spin"/>
        </div>
    )

    if(!workspace || !member) return (
        <div className="flex flex-col h-full items-center justify-center gap-2 flex-1">
            <AlertTriangle className="size-6 text-muted-foreground"/>
            <span className="text-md text-muted-foreground">Workspace not found</span>
        </div>
    )

   return (
        <div className="flex flex-col h-full items-center justify-center gap-2 flex-1">
            <AlertTriangle className="size-6 text-muted-foreground"/>
            <span className="text-md text-muted-foreground">No channel found</span>
        </div>
    )
}

export default WorkspaceIdPage;