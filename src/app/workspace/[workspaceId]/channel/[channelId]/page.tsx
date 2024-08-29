"use client" 
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { Loader, TriangleAlert } from "lucide-react";
import Header from "./components/Header";
import {ChatInput} from "./components/chat-input";
const ChannelIdPage = () => {
    const channelId = useChannelId();
    const {data: channel, isLoading: channelLoading} = useGetChannel({id: channelId});

    if(channelLoading) return (
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
        <div className="flex-1"/>
        <ChatInput placeholder={`Message # ${channel.name}`}/>
        </div>
    );
    }

export default ChannelIdPage;