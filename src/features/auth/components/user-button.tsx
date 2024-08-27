"use client"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader, LogOut } from "lucide-react";

export const UserButton = () => {
    const {signOut} = useAuthActions();
    const {data, isLoading} = useCurrentUser();
    if(isLoading) return <Loader className="size-4 animate-spin text-muted-foreground"/>;
    if(!data) return null;

    const {image, name, email} = data;
    const avatarFallback = name!.charAt(0).toUpperCase();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage src={image} alt={name}/>
                    <AvatarFallback className="bg-sky-500 text-white">{avatarFallback}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>signOut()} className="h-10">                <LogOut className="size-4 mr-2" />
                 Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}