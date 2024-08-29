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
interface HeaderProps {
    title: string;
}

const Header = ({ title } : HeaderProps) => {
    const [value, setValue] = useState(title);
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const {mutate, isPending} = useUpdateChannel(); 
    const {mutate: removeChannel, isPending: isRemovingChannel} = useRemoveChannel();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const { data:member, isLoading: memberLoading} = useCurrentMember({workspaceId});
    const [ConfirmDialog, confirm] = useConfirm("Delete channel", "Are you sure you want to delete this channel?");

    const handleEditOpen = (value: boolean) => {
        if(member?.role !== "admin") return;
        setEditOpen(true);
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replaceAll(" ", "-").toLowerCase();
        setValue(value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({id: channelId, name: value}, {
            onSuccess: () => {
                toast.success("Channel updated successfully");
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update channel");
            }
        });
        setEditOpen(false);
    }

    const handleDelete = async () => {
         const ok = await confirm();
         if (!ok) return;
        
        removeChannel({id: channelId}, {
            onSuccess: () => {
                toast.success("Channel deleted successfully");
                router.replace(`/workspace/${workspaceId}`);
            },
            onError: () => {
                toast.error("Failed to delete channel");
            }});
     }

    

    return (<>
        <ConfirmDialog />
        <div className="bg-white h-[49px] flex border-b items-center overflow-hidden px-4">
            <Dialog>
                <DialogTrigger asChild>
            <Button variant={"ghost"} size={"sm"} className="text-lg font-semibold px-2 overflow-hidden w-auto">
                <span className="truncate"># {title}</span>
                <FaChevronDown className="size-2.5 ml-2 "/>
            </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle># {title}</DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                        <DialogTrigger asChild>
                        <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">Channel name</p>
                                {member?.role === "admin" && 
                                <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>}
                            </div>
                            <p className="text-sm text-left"># {title}</p>

                        </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Rename this channel</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input disabled={isPending} value={value} onChange={handleChange} placeholder="Channel name" type="text" required autoFocus minLength={3} maxLength={80} />
                            <DialogFooter>
                                <DialogClose><Button variant={"outline"} disabled={isPending}>Cancel</Button></DialogClose>
                                <Button disabled={isPending}>Save</Button>
                            </DialogFooter>
                            </form>
                        </DialogContent>
                        </Dialog>
                        {member?.role === "admin" && 
                        <button disabled={isRemovingChannel} onClick={handleDelete} className="flex items-center gap-x-2 px-5 py-4 rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600">
                            <TrashIcon className="size-4" />
                            <p className="text-sm font-semibold">Delete channel</p>
                        </button>}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        </>
    );
}

export default Header;