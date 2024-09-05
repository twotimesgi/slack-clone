import { Id } from "../../../../../../convex/_generated/dataModel";
import { useMemberId } from "@/hooks/use-member-id";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import Header from "./components/header";
import { ChatInput } from "./components/chat-input";
import { MessageList } from "@/components/message-list";
import  {usePanel}  from "@/hooks/use-panel";

interface ConversationProps {
    id: Id<"conversations">;
}

export const Conversation = ({id}: ConversationProps) => {
    const memberId = useMemberId();
    const {data: member, isLoading: isMemberLoading} = useGetMember({id: memberId});
    const {results, status, loadMore} = useGetMessages({conversationId: id});
    const {onOpenProfile} = usePanel();

    if(isMemberLoading || status === "LoadingFirstPage") {
        return <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground"/>
    </div>
    }

    return (
        <div className="flex flex-col h-full">
            <Header memberName={member?.user.name} memberImage={member?.user.image} onClick={() => onOpenProfile(memberId)}/>
                <MessageList memberName={member?.user.name} memberImage={member?.user.image} data={results} loadMore={loadMore} isLoadingMore={status === "LoadingMore"} canLoadMore={status === "CanLoadMore"} variant="conversation"/>
                <ChatInput 
                placeholder={`Message ${member?.user.name}`} 
                conversationId={id}
                />
            </div>
    )
}