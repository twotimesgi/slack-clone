import { UserButton } from "@/features/auth/components/user-button"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react"
import { SidebarButton } from "./sidebar-button"

export const Sidebar = () => {
    
    return (
      <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
        <WorkspaceSwitcher/>
        <SidebarButton icon={Home} label="Home" isActive={true} />
        <SidebarButton icon={MessagesSquare} label="DMs" isActive={false} />
        <SidebarButton icon={Bell} label="Activity" isActive={false} />
        <SidebarButton icon={MoreHorizontal} label="More" isActive={false} />

        <div className="flex flex-col items-center justify-center mt-auto gap-y-1"><UserButton></UserButton></div>
        </aside>)
}