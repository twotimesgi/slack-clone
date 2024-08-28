"use client"
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import {toast} from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}

export const PreferencesModal = ({ open, setOpen, initialValue }: PreferencesModalProps) => {
    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);
    const workspaceId = useWorkSpaceId();
    
    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();
    const router = useRouter();

    const [ConfirmDialog, confirm] = useConfirm("Delete workspace", "Are you sure you want to delete this workspace?");

    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;
        
        removeWorkspace({ id: workspaceId }, {
            onSuccess: () => {
                toast.success("Workspace deleted successfully");
                router.replace("/")
            },
            onError: () => {
                toast.error("Failed to delete workspace");
            }
        });
    }

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
         updateWorkspace({ id: workspaceId, name: value }, {
            onSuccess: () => {
                toast.success("Workspace updated successfully");
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update workspace");
            }
        });
    }
    return <>
    <ConfirmDialog />
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
            <DialogHeader className='p-4 border-b bg-white'>
                <DialogTitle>Preferences</DialogTitle>
                <DialogClose />
            </DialogHeader>
            <div className='px-4 pb-4 flex flex-col gap-y-2'>
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                        <div className='px-5 py-4 rounded-lg border cursor-pointer hover:bg-gray-50'>
                            <div className='flex items-center justify-between'>
                                <p className='text-sm font-semibold'>Workspace name</p>
                                <p className='text-sm text-[#1264a3] hover:underline font-semibold'>Edit</p>
                            </div>
                            <p className='text-sm text-left'>{value}</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename this workspace</DialogTitle>
                            <DialogClose />
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={handleEdit}>
                            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Workspace name" type="text" required autoFocus minLength={3} maxLength={80} />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"outline"} disabled={isUpdatingWorkspace}>Cancel</Button>
                            </DialogClose>
                            <Button disabled={isUpdatingWorkspace}>Save</Button>

                        </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <button disabled={isRemovingWorkspace} onClick={handleDelete} className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600'>
                    <TrashIcon className='size-4' />
                    <p className='text-sm font-semibold'>Delete workspace</p>
                </button>
            </div>

        </DialogContent>
    </Dialog>
    </>
};