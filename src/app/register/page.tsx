
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, User, Mail, Lock, Store, Building2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getAuthErrorMessage } from '@/lib/firebase-errors';
import type { UserRole } from '@/context/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>,
    role: UserRole
  ) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const storeName = (formData.get('storeName') as string) || '';
    const cnpj = (formData.get('cnpj') as string) || '';

    if (password !== confirmPassword) {
      toast({ title: 'Erro', description: 'As senhas não coincidem.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Senha muito curta', description: 'A senha deve ter pelo menos 6 caracteres.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      await setDoc(doc(db, 'users', user.uid), {
        name: fullName,
        email: email,
        role,
        ...(role === 'seller' ? { storeName, cnpj } : {}),
        createdAt: serverTimestamp(),
      });

      if (role === 'seller') {
        toast({ title: 'Loja criada!', description: 'Bem-vindo, empreendedor! Vamos cadastrar seu primeiro produto.' });
        router.push('/seller/dashboard');
      } else {
        toast({ title: 'Conta criada!', description: 'Bem-vindo à comunidade Empreenda+.' });
        router.push('/');
      }
    } catch (error) {
      toast({
        title: 'Erro no Cadastro',
        description: getAuthErrorMessage(error, 'Não foi possível criar sua conta.'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-primary" />
          <CardTitle className="font-headline text-3xl">Crie sua Conta</CardTitle>
          <CardDescription>
            Escolha como você quer participar do Empreenda+.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buyer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="buyer">
                <User className="mr-2 h-4 w-4" /> Comprador
              </TabsTrigger>
              <TabsTrigger value="seller">
                <Store className="mr-2 h-4 w-4" /> Vendedor
              </TabsTrigger>
            </TabsList>

            {/* Comprador */}
            <TabsContent value="buyer">
              <form onSubmit={(e) => handleRegister(e, 'buyer')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="fullName" name="fullName" placeholder="Seu nome" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" className="pl-10" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="password" name="password" type="password" placeholder="********" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="********" className="pl-10" required />
                    </div>
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (<>Criar Conta<ArrowRight className="ml-2" /></>)}
                </Button>
              </form>
            </TabsContent>

            {/* Vendedor */}
            <TabsContent value="seller">
              <form onSubmit={(e) => handleRegister(e, 'seller')} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="seller-fullName">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="seller-fullName" name="fullName" placeholder="Seu nome" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nome da Loja</Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="storeName" name="storeName" placeholder="Ex: Ateliê Criativo" className="pl-10" required />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ (MEI)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="cnpj" name="cnpj" placeholder="00.000.000/0001-00" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seller-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="seller-email" name="email" type="email" placeholder="seu@email.com" className="pl-10" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="seller-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="seller-password" name="password" type="password" placeholder="********" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seller-confirmPassword">Confirme a Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="seller-confirmPassword" name="confirmPassword" type="password" placeholder="********" className="pl-10" required />
                    </div>
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (<>Criar Conta de Vendedor<ArrowRight className="ml-2" /></>)}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
