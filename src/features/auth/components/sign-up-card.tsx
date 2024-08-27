import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
interface SignUpCardProps {
    setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
    const {signIn} = useAuthActions();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const onProviderSignUp = (value: "google" | "github") => {
        setPending(true);
        signIn(value).finally(() => setPending(false));
    }
    
    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setPending(true);
        signIn("password", {name, email, password, flow: "signUp"}).catch(()=> {
            setError("Something went wrong");
        }).finally(() => setPending(false));
    }
    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Create an account to continue
                </CardTitle>
                <CardDescription>
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md text-sm flex items-center gap-x-2 text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                    </div>
            )}

            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={(e) => onPasswordSignUp(e)} className="space-y-2.5">
                <Input disabled={pending} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" type="text" required />
                    <Input disabled={pending} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
                    <Input disabled={pending} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
                    <Input disabled={pending} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" type="password" required />
                    <Button type="submit" size="lg" className="w-full" disabled={false}>Continue</Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button disabled={pending} className="w-full relative" size="lg" variant="outline" onClick={() => onProviderSignUp("google")}>
                        <FcGoogle className="absolute left-2.5 top-3 size-5" />
                        Continue with Google
                    </Button>
                    <Button disabled={pending} className="w-full relative" size="lg" variant="outline" onClick={() => onProviderSignUp("github")}>
                        <FaGithub className="absolute left-2.5 top-3 size-5" />
                        Continue with Github
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Already have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signIn")}>Sign In</span>
                </p>
            </CardContent>
        </Card>
    );
};