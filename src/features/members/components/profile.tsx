import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { Loader, MailIcon } from "lucide-react";
import { AlertTriangle, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link  from"next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
interface ProfileProps {
    memberId: Id<"members">;
    onClose: () => void;
}

export const Profile = ({memberId, onClose} : ProfileProps) => {
    const {data: member, isLoading: isLoadingMember} = useGetMember({id: memberId});
    const avatarFallback = member?.user.name?.charAt(0).toUpperCase() ?? "M";
    const workspaceId = useWorkspaceId();
    const {data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({workspaceId})
    const { mutate: updateMember , isPending: isUpdatingMember} = useUpdateMember()
    const {mutate: removeMember, isPending: isRemovingMember} = useRemoveMember()
    if (isLoadingMember) {
        return (
            <div className="h-full flex flex-col ">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}><XIcon className="size-5 stroke-[1.5]"></XIcon></Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    if (!member) {
        return (
            <div className="h-full flex flex-col ">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}><XIcon className="size-5 stroke-[1.5]"></XIcon></Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <AlertTriangle className="size-5 text-muted-foreground " />
                    <p className="text-sm text-muted-foreground">Profile not found</p>
                </div>
            </div>
        )
    }

    return (
<div className="h-full flex flex-col ">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}><XIcon className="size-5 stroke-[1.5]"></XIcon></Button>
                </div>
                <div className="flex flex-col  items-center justify-center p-4">
                    <Avatar className="max-w-[256px] max-h-[256px] size-full">
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback className="aspect-square text-6xl">{avatarFallback}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-col p-4">
<p className={"text-xl font-bold"}>{member.user.name}</p>
                </div>
                <Separator />
                <div className="flex flex-col p-4">
                    <p className="text-sm font-bold mb-4">Contact information</p>
                    <div className="flex items-center gap-2">
<div className="size-9 rounded-md bg-muted flex items-center justify-center">
    <MailIcon className="size-4" />
</div>
<div className="flex flex-col ">
<p className="text-[13px] font-semibold text-muted-foreground">Email Address</p><Link className="text-sm hover:underline text-[#126483]"
href={`mailto:${member.user.email}`}>{member.user.email}</Link> 
</div>
                    </div>
                </div>
            </div>
    )
}