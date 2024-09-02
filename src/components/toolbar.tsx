import { MessageSquareIcon, Pencil, SmileIcon, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./ui/emoji-popover";

interface ToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    handleEdit: () => void;
    handleThread: () => void;
    handleDelete: () => void;
    handleReaction: (value:string) => void;
    hideThreadButton?: boolean;
}

export const Toolbar = ({
    isAuthor,
    isPending,
    handleEdit,
    handleThread,
    handleDelete,
    handleReaction,
    hideThreadButton
}: ToolbarProps) => {
    return (
        <div className="absolute top-0 right-5">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white shadow-sm rounded-md">
                <EmojiPopover hint="Add reaction" onEmojiSelect={(emoji) => handleReaction(emoji.native)}>
                <Button variant={"ghost"} disabled={isPending} size={"iconSm"}>
                    <SmileIcon className="size-4"/>
                </Button>
                </EmojiPopover>
                {!hideThreadButton && <Hint label="Reply in thread"><Button onClick={handleThread } variant={"ghost"} disabled={isPending} size={"iconSm"}>
                    <MessageSquareIcon className="size-4"/>
                </Button>
                </Hint>
                                }

                {isAuthor && <Hint label="Edit message"><Button onClick={handleEdit }variant={"ghost"} disabled={isPending} size={"iconSm"}>
                    <Pencil className="size-4"/>
                </Button>
                </Hint>
}
{isAuthor &&  <Hint label="Delete message"><Button onClick={handleDelete } variant={"ghost"} disabled={isPending} size={"iconSm"}>
                    <Trash className="size-4"/>
                </Button></Hint>}
            </div>
        </div>
    )
}