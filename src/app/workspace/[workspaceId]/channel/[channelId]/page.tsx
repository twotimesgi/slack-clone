"use client" 
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { Loader, TriangleAlert } from "lucide-react";
import Header from "./components/header";
import {ChatInput} from "./components/chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import {MessageList} from "@/components/message-list"
const ChannelIdPage = () => {
    const channelId = useChannelId();
    const {data: channel, isLoading: channelLoading} = useGetChannel({id: channelId});
    const {results, status, loadMore} = useGetMessages({channelId});

    if(channelLoading && status === "LoadingFirstPage") return (
        <div className="flex-1 h-full flex items-center justify-center">
            <Loader className="size-5 text-muted-foreground animate-spin"/>
        </div>
    )

    if(!channel) return (
        <div className="flex-1 h-full flex flex-col  gap-y-2 items-center justify-center">
            <TriangleAlert className="size-5 text-muted-foreground"/>
            <span className="text-muted-foreground text-sm">Channel not found</span>
        </div>
    )
    return (
        <div className="flex flex-col h-full">
        <Header title={channel.name} />
        <MessageList channelName={channel.name} variant="channel" channelCreationTime={channel._creationTime} data={results} loadMore={loadMore} isLoadingMore={status === "LoadingMore"} canLoadMore={status === "CanLoadMore"}/>
        <ChatInput placeholder={`Message # ${channel.name}`}/>
        </div>
    );
    }

export default ChannelIdPage;