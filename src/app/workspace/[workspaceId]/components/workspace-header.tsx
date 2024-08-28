import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Doc } from "../../../../../convex/_generated/dataModel"
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Hint } from "@/components/hint";
import { PreferencesModal } from "./preferences-modal";
import { useState } from "react";

interface WorkspaceHeaderProps {
    workspace: Doc<"workspaces">;
    isAdmin: boolean;
}
export const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
    const [open, setOpen] = useState(false);
    return <>
    <PreferencesModal open={open} setOpen={setOpen} initialValue={workspace.name}/>
    <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="transparent" size="sm" className="font-semibold text-lg w-auto overflow-hidden p-1.5">
                    <span className="truncate">{workspace.name}</span>
                    <ChevronDown className="size-4 ml-1 shrink-0"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem className="cursor-pointer capitalize">
                    <div className="size-9 relative overflow-hidden bg-[#616061] font-semibold text-white text-xl rounded-md flex items-center justify-center mr-2">
                        {workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="font-bold">{workspace.name}</p>
                        <p className="text-xs text-muted-foreground">Active workspace</p>
                    </div>
                    </DropdownMenuItem>
                    {isAdmin && <>
                        <DropdownMenuSeparator/>
                    <DropdownMenuItem className="cursor-pointer py-2" onClick={() => {}}>
                        <p className="truncate">Invite people to {workspace.name}</p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setOpen(true)}>
                       Preferences
                    </DropdownMenuItem>

                    </>}

        
            </DropdownMenuContent>
            <div className="flex items-center gap-0.5">
                <Hint label="New message" side="bottom">
                <Button size={"iconSm"} variant={"transparent"}><SquarePen className="size-4"/></Button>
                </Hint>
                <Hint label="Filter conversations" side="bottom">
                <Button size={"iconSm"} variant={"transparent"}><ListFilter className="size-4"/></Button>
                </Hint>
            </div>
        </DropdownMenu>
    </div></>
}