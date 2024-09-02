import { ChevronRightIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback} from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
interface ThreadBarProps {
    count?: number;
    image?: string;
    name?: string;
    timestamp?: number;
    onClick?: () => void;
}

export const ThreadBar = ({ count, image, timestamp, name="Member", onClick }: ThreadBarProps) => {
    const avatarFallback = name.charAt(0).toUpperCase();
    if(!count || !timestamp || !image) {
        return null;
    }

    return <button onClick={onClick} className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transiton max-w-[600px]:">
        <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className=" size-6 shrink-0 ">
                        <AvatarImage className="rounded-md" src={image}  />
                        <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs" >{avatarFallback}
                        </AvatarFallback>               
                         </Avatar>
                         <span className="text-sm text-sky-700 hover:underline font-bold truncate">
                            {count} {count>1 ? "replies" : "reply"}
                            </span>
                            <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
                            Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
                            </span>
                            <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">View thread</span>

    </div>
    <ChevronRightIcon className="size-4 text-muted-foregroun ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0"/>
    </button>
}