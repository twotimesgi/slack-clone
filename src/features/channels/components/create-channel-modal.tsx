import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogHeader,
    DialogClose,
    DialogFooter
}
from '@/components/ui/dialog';
import { useState } from 'react';
import { useCreateChannelModal } from '../store/use-create-channel-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateChannel } from '../api/use-create-channel';
import { useWorkSpaceId } from '@/hooks/use-workspace-id';

export const CreateChannelModal = () => {
    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState('');
    const workspaceId = useWorkSpaceId();
 const {mutate, isPending} = useCreateChannel()
    const handleClose = () => {
        setName("")
        setOpen(false);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replaceAll(' ', '-').toLowerCase();
        setName(value);
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(
            {name: name,
            workspaceId: workspaceId},
            {onSuccess: () => {
                //TODO: redirect to new channel
                handleClose()
            }}
        )
    }

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a Channel</DialogTitle>
                        <DialogClose />
                    </DialogHeader>
                    <form onSubmit={handleSubmit}className='space-y-4'>
                        <Input 
                        value={name}
                        disabled={isPending} 
                        onChange={handleChange} 
                        minLength={3} 
                        required
                        autoFocus
                        maxLength={80}
                        placeholder='Channel Name e.g. "Plan Budget' />
                        <div className='flex justify-end'>
                            <Button disabled={false}>Create</Button>
                        </div>
                    </form>
                    
                </DialogContent>
            </Dialog>
        </>
    )
}