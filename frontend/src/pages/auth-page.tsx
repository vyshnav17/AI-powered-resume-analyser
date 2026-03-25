import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { useLocation } from "wouter";
import { FileText, Loader2 } from "lucide-react";

export default function AuthPage() {
    const { user, loginMutation, registerMutation } = useAuth();
    const [, setLocation] = useLocation();

    if (user) {
        setLocation("/");
        return null;
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="flex items-center justify-center p-8 bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome to Resume Grader
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <LoginForm />
                            </TabsContent>

                            <TabsContent value="register">
                                <RegisterForm />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <div className="hidden lg:flex flex-col justify-center p-12 bg-primary text-white">
                <div className="max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                        <FileText className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-6">
                        Land your dream job with AI-powered resume analysis.
                    </h1>
                    <p className="text-xl text-white/80 leading-relaxed">
                        Upload your resume and get instant feedback on your scores, strengths,
                        and tailored recommendations to stand out from the crowd.
                    </p>
                    <div className="mt-12 grid grid-cols-2 gap-8">
                        <div>
                            <div className="text-3xl font-bold mb-1">100/100</div>
                            <div className="text-white/60">ATS Optimized Scores</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold mb-1">Groq AI</div>
                            <div className="text-white/60">Blazing Fast Inference</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoginForm() {
    const { loginMutation } = useAuth();
    const form = useForm<InsertUser>({
        resolver: zodResolver(insertUserSchema),
        defaultValues: { username: "", password: "" },
    });

    return (
        <form
            className="space-y-4"
            onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}
        >
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    {...form.register("username")}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    required
                />
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
            >
                {loginMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
            </Button>
        </form>
    );
}

function RegisterForm() {
    const { registerMutation } = useAuth();
    const form = useForm<InsertUser>({
        resolver: zodResolver(insertUserSchema),
        defaultValues: { username: "", password: "" },
    });

    return (
        <form
            className="space-y-4"
            onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}
        >
            <div className="space-y-2">
                <Label htmlFor="reg-username">Username</Label>
                <Input
                    id="reg-username"
                    {...form.register("username")}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                    id="reg-password"
                    type="password"
                    {...form.register("password")}
                    required
                />
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
            >
                {registerMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Register
            </Button>
        </form>
    );
}
