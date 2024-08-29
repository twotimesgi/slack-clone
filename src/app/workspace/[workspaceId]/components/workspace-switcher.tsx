import { UserButton } from "@/features/auth/components/user-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspace"
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal"
import { Loader, Plus } from "lucide-react"
import { useRouter } from "next/navigation"


export const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId});
    const {data: workspaces, isLoading: workspacesLoading} = useGetWorkspaces();
    const [_open, setOpen] = useCreateWorkspaceModal();
    const filteredWorkspaces = workspaces?.filter((w) => w._id !== workspaceId);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className="size-9 relative overflow-hidden bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 font-semibold text-xl">
                {workspaceLoading ? (<Loader className="size-5 animate-spin shrink-0"/>) :  workspace?.name.charAt(0).toUpperCase()} 
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem onClick={() => router.push(`/workspace/${workspaceId}`)}className="cursor-pointer flex-col justify-start items-start capitalize">{workspace?.name}
            <span className="text-xs text-muted-foreground">Active workspace</span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((w) => (
            <DropdownMenuItem key={w._id} onClick={() => router.push(`/workspace/${w._id}`)} className="cursor-pointer capitalize overflow-hidden">
            <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">            {w?.name?.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{w?.name}</p>
            </DropdownMenuItem>
        ))}
        <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
            <div className="size-9 relative overflow-hidden bg-[#F2f2f2] text-slate-800 font-semibold text-xl rounded-md flex items-center justify-center mr-2"><Plus></Plus></div>
        Create Workspace
        </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    )
}