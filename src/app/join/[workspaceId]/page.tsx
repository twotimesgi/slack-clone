"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import  VerificationInput  from "react-verification-input";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";
const JoinPage = () => {
    const router = useRouter();
    const workspaceId = useWorkSpaceId();  
    const {data, isLoading} = useGetWorkspaceInfo({workspaceId: workspaceId});
    const {mutate, isPending} = useJoin();
    const isMember = useMemo(() => data?.isMember, [data?.isMember]);

    useEffect(() => {
        if(isMember) {
            router.replace(`/workspace/${workspaceId}`);
        }
    }, [isMember, router, workspaceId]);

    const handleComplete = async (code: string) => {
        await mutate({workspaceId: workspaceId, joinCode: code}, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`);
                toast.success("Workspace joined.");
            },
            onError: () => {
                toast.error("Failed to join workspace.");
            }
        });
    }

    if(isLoading) return (
    <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground"/>
    </div>
    );

    

    return (
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white shadow-md p-8 rounded-lg">
            <div className="flex flex-col gap-y-4 justify-center items-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text-2xl font-bold">Join {data?.name}</h1>
                    <p className="text-md text-muted-foreground">Enter the workspace code to join.</p>
                </div>
                <VerificationInput onComplete={handleComplete} length={6} autoFocus classNames={{
                    container: cn('flex gap-x-2', isPending && 'opacity-50 cursor-not-allowed'),
                    character: 'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
                    characterInactive: 'bg-muted',
                    characterSelected: 'bg-white text-black',
                    characterFilled: 'bg-white text-black',
                }}/>
            </div>
            <div className="flex gap-x-4">
<Button size={"lg"} variant={"outline"} asChild>
    <Link href="/">Go back to home</Link>
</Button>
            </div>
        </div>
    );
}

export default JoinPage;