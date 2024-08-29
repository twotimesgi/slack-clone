

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CopyIcon, RefreshCcw } from 'lucide-react';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {toast} from 'sonner';
interface InviteModalProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    name: string;
    joinCode: string;
}
import { useResetCode } from '@/features/workspaces/api/use-reset-code';
import { DialogClose } from '@radix-ui/react-dialog';
import { useConfirm } from '@/hooks/use-confirm';

export const InviteModal = ({open, setOpen, name, joinCode}: InviteModalProps) => {
    const [ConfirmDialog, confirm] = useConfirm("Reset invite code", "Are you sure you want to reset the invite code?");
    const workspaceId = useWorkspaceId();
    const {mutate, isPending} = useResetCode();
    const handleCopy = () => {
        const link = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard.writeText(link).then(() => {
            toast.success("Link copied to clipboard");
        });
    }

    const handleNewCode = async () => {
        const ok = await confirm();
        if (!ok) return;

        mutate({workspaceId: workspaceId}, {
            onSuccess: () => {
                toast.success("Invite code reset successfully.");
            },
            onError: () => {
                toast.error("Failed to reset invite code.");
            }
        });
    }

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to {name}</DialogTitle>
                        <DialogDescription>Use the code below to invite people to your workspace.</DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-y-4 items-center justify-center py-10'>
                        <p className='text-4xl font-bold tracking-widest uppercase'>{joinCode}</p>
                        <Button variant="ghost" size="sm" className="" onClick={handleCopy}>
                            Copy link
                            <CopyIcon className="size-4 ml-2"/>
                            </Button>
                    </div>
                    <div className='flex items-center justify-between w-full'>
<Button disabled={isPending} variant="outline" size="sm" onClick={handleNewCode}>
    Reset invite code
    <RefreshCcw className="size-4 ml-2"/>
    </Button>
<DialogClose asChild>
<Button size="sm" onClick={() => setOpen(false)}>Close</Button>
</DialogClose>
                    </div>
                       
                </DialogContent>
            </Dialog>
        </>
    );
}