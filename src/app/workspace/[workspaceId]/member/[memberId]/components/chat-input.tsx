import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState } from "react";
import { toast } from "sonner";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { Id } from "../../../../../../../convex/_generated/dataModel";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
    placeholder: string,
    conversationId: Id<"conversations">,
}

type CreateMessageValues = { 
    workspaceId: Id<"workspaces">,
    conversationId: Id<"conversations">,
    body: string,
    image?: Id<"_storage"> | undefined 
}

interface Message { body: string, image: File | null }

export const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
    const editorRef = useRef<Quill | null>(null);
    const {mutate: generateUploadUrl} = useGenerateUploadUrl();
    const { mutate: createMessage } = useCreateMessage();

    const workspaceId = useWorkspaceId();
    const [isPending, setIsPending] = useState(false);
    const [editorKey, setEditorKey] = useState(0);


    const handleSubmit = async ({ body, image }: Message) => {
        try {
            setIsPending(true);
            editorRef?.current?.enable(false);

            const values : CreateMessageValues = {
                conversationId,
                workspaceId,
                body,
                image: undefined
            };


            if(image) {
                const  url  = await generateUploadUrl({}, { throwError: true });
                if(!url) {
                    throw new Error("Failed to generate upload url");
                }
                const result = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": image.type
                    },
                    body: image
                });
                if(!result.ok) {
                    throw new Error("Failed to upload image");
                }
              const {storageId} = await result.json();
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
    return (
        <div className="px-5 w-full">
            <Editor key={editorKey} placeholder={placeholder} onSubmit={handleSubmit} disabled={isPending} innerRef={editorRef} />
        </div>
    );
}

