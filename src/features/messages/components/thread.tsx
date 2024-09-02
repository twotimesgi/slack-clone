import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, XIcon } from "lucide-react";
import { useGetMessage } from "../api/use-get-message";
import { Loader } from "lucide-react";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { Message } from "@/components/message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { toast } from "sonner";
import Quill from "quill";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetMessages } from "../api/use-get-messages";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";

const TIME_THRESHOLD = 5;

type CreateMessageValues = {
    channelId: Id<"channels">,
    workspaceId: Id<"workspaces">,
    body: string,
    parentMessageId: Id<"messages">,
    image?: Id<"_storage"> | undefined
}

interface Message { body: string, image: File | null }


const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
interface ThreadProps {
    messageId: Id<"messages">;
    onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
    const formatDateLabel = (date: string) => {
        const _date = new Date(date);
        if (isToday(_date)) {
            return "Today";
        }
        if (isYesterday(_date)) {
            return "Yesterday";
        }
        return format(date, "EEEE, MMMM d");
    }
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)
    const workspaceId = useWorkspaceId();
    const [isPending, setIsPending] = useState(false);
    const [editorKey, setEditorKey] = useState(0);
    const editorRef = useRef<Quill | null>(null);
    const { mutate: generateUploadUrl } = useGenerateUploadUrl();
    const { mutate: createMessage } = useCreateMessage();
    const channelId = useChannelId();
    const { data: currentMember, isLoading: currentMemberIsLoading } = useCurrentMember({ workspaceId });
    const { results, status, loadMore } = useGetMessages({ channelId, parentMessageId: messageId });
    const canLoadMore = status === "CanLoadMore";
    const isLoadingMore = status === "LoadingMore";

    const group = results?.reduce((groups, message) => {
        const date = new Date(message._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].unshift(message);
        return groups;
    }, {} as Record<string, typeof results>);

    const handleSubmit = async ({ body, image }: Message) => {
        try {
            setIsPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                channelId,
                workspaceId,
                body,
                parentMessageId: messageId,
                image: undefined
            };


            if (image) {
                const url = await generateUploadUrl({}, { throwError: true });
                if (!url) {
                    throw new Error("Failed to generate upload url");
                }
                const result = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": image.type
                    },
                    body: image
                });
                if (!result.ok) {
                    throw new Error("Failed to upload image");
                }
                const { storageId } = await result.json();
                values.image = storageId;
            }
            await createMessage(values, { throwError: true });
            setEditorKey((prev) => prev + 1);

        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
            editorRef?.current?.enable(true);
        }
    }


    const { data: message, isLoading: messageLoading } = useGetMessage({ id: messageId });
    if (messageLoading || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex flex-col ">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}><XIcon className="size-5 stroke-[1.5]"></XIcon></Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    if (!message) {
        return (
            <div className="h-full flex flex-col ">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}><XIcon className="size-5 stroke-[1.5]"></XIcon></Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <AlertTriangle className="size-5 text-muted-foreground " />
                    <p className="text-sm text-muted-foreground">Message not found</p>
                </div>
            </div>
        )
    }
    return (
        <div className="h-full flex flex-col ">
            <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button onClick={onClose} size={"iconSm"} variant={"ghost"}><XIcon className="size-5 stroke-[1.5]"></XIcon></Button>
            </div>
            <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">

                {Object.entries(group || {}).map(([dateKey, messages]) => (
                    <div key={dateKey}>
                        <div className="text-center my-2 relative">
                            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border-gray-300 border shadow-sm">{formatDateLabel(dateKey)}</span>
                        </div>
                        {messages.map((message, index) => {
                            const prevMessage = messages[index - 1];
                            const isCompact = prevMessage && prevMessage.user?._id === message.user?._id && differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHOLD;
                            return (
                                <Message
                                    key={message._id}
                                    id={message._id}
                                    memberId={message.memberId}
                                    authorImage={message.user.image}
                                    isAuthor={message.memberId === currentMember?._id}
                                    authorName={message.user.name}
                                    reactions={message.reactions}
                                    body={message.body}
                                    image={message.image}
                                    updatedAt={message.updatedAt}
                                    createdAt={message._creationTime}
                                    threadCount={message.threadCount}
                                    threadImage={message.threadImage}
                                    threadTimestamp={message.threadTimestamp}
                                    isEditing={editingId === message._id}
                                    setEditingId={setEditingId}
                                    isCompact={isCompact}
                                    hideThreadButton={true}

                                />)
                        })}
                        <div className="h-1"
                            ref={(el) => {
                                if (el) {
                                    const observer = new IntersectionObserver(([entry]) => {
                                        if (entry.isIntersecting && canLoadMore) {
                                            loadMore();
                                        }
                                    }, { threshold: 1.0 });
                                    observer.observe(el);
                                    return () => observer.disconnect();
                                }
                            }} />
                        {isLoadingMore && (
                            <div className="text-center my-2 relative">
                                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                                <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border-gray-300 border shadow-sm"><Loader className="animate-spin size-4"></Loader></span>
                            </div>
                        )}
                        
                    </div>
                ))}
                <Message
                            key={message._id}
                            id={message._id}
                            memberId={message.memberId}
                            authorImage={message.user.image}
                            isAuthor={message.memberId === currentMember?._id}
                            authorName={message.user.name}
                            reactions={message.reactions}
                            body={message.body}
                            image={message.image}
                            updatedAt={message.updatedAt}
                            createdAt={message._creationTime}
                            isEditing={editingId === message._id}
                            setEditingId={setEditingId}
                        />

            </div>
            
            <div className="px-4" >
                <Editor onSubmit={handleSubmit} key={editorKey} innerRef={editorRef} disabled={isPending} placeholder="Reply" />

            </div>
        </div>
    );
}