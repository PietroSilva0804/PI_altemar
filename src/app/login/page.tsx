
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Store, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getAuthErrorMessage } from '@/lib/firebase-errors';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
            router.push('/');
        } catch (error) {
            toast({
                title: "Erro no Login",
                description: getAuthErrorMessage(error, "E-mail ou senha incorretos. Tente novamente."),
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (error) {
            toast({ title: "Erro", description: getAuthErrorMessage(error, "Falha na autenticação com Google."), variant: "destructive" });
        }
    };

    return (
        <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Store className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="font-headline text-3xl">Faça Login</CardTitle>
                    <CardDescription>Bem-vindo de volta ao Empreenda+!</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input id="email" name="email" type="email" placeholder="seu@email.com" className="pl-10" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input id="password" name="password" type="password" placeholder="Sua senha" className="pl-10" required />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full font-semibold" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'ENTRAR'}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Ou continue com
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex justify-center">
                            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
                               Login com Google
                            </Button>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            Não tem uma conta?{' '}
                            <Link href="/register" className="font-semibold text-primary hover:underline">
                                Crie uma conta
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
