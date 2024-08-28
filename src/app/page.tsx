"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/auth/components/user-button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const {signOut} = useAuthActions();
  const {data, isLoading} = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);
  const [open, setOpen] = useCreateWorkspaceModal();
  const router = useRouter();

  useEffect(() => {
    if(isLoading) return;
    if(workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    }else if(!open){
      setOpen(true);
    }
  }
  , [workspaceId, isLoading, open, setOpen]);  
  return (
      <div></div>
  );
}
