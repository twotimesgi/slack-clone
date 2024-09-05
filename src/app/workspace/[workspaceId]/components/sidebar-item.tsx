import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import {cva, type VariantProps} from "class-variance-authority";
import { cn } from "@/lib/utils";


const sidebarItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
    {
        variants: {
            variant:{
                default: "text-[#f9edffcc]",
                active: "text-[#481349] bg-white/90 hover:bg-white/90",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

interface SidebarItemProps {
    icon: LucideIcon | IconType;
    label: string;
    id: string;
    variant?: VariantProps<typeof sidebarItemVariants>["variant"]
    disabled?: boolean;
}

export const SidebarItem = ({ icon: Icon, label, id, variant, disabled }: SidebarItemProps) => {
    const workspaceId = useWorkspaceId();
    return (
        <Button variant={"transparent"} size={"sm"} className={cn(sidebarItemVariants({variant}))} asChild>
            <Link href={disabled ? "" : `/workspace/${workspaceId}/channel/${id}`}>
            <Icon className="size-3.5 shrink-0 mr-1"/>
            <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}