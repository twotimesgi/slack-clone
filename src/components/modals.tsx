"use client";

import { CreateWorkspaceModal
 } from "@/features/workspaces/components/create-workspace-modal";
import React from "react";
import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";

 export const Modals = () => {
        const [mounted, setMounted] = React.useState(false);
        React.useEffect(() => {
            setMounted(true);
        }, []);

        if(!mounted) return null;   
        return <>
        <CreateWorkspaceModal/>
        <CreateChannelModal/>
        </>
    }