import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel"
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface HeaderProps {
    memberName?: string;
    memberImage?: string;
    onClick?: () => void;

}

const Header = ({ memberName = "Member", memberImage, onClick } : HeaderProps) => {
   const avatarFallback = memberName.charAt(0).toUpperCase();
    

    return (
        <div className="bg-white h-[49px] flex border-b items-center overflow-hidden px-4">
           <Button variant={"ghost"} size={"sm"} onClick={onClick} 
           className="text-lg font-semibold px-2 overflow-hidden w-auto">
            <Avatar className="size-6 mr-2">
                <AvatarImage src={memberImage}/>
                <AvatarFallback>{avatarFallback}</AvatarFallback>

            </Avatar>
            <span className="truncate">{memberName}</span>
            <FaChevronDown className="size-2.5 ml-2"/>
            </Button>
        </div>
    );
}

export default Header;