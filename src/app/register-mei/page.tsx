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
import { ArrowRight, Store, User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function RegisterMeiPage() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Store className="mx-auto mb-4 h-12 w-12 text-primary" />
          <CardTitle className="font-headline text-3xl">
            Torne-se um Vendedor
          </CardTitle>
          <CardDescription>
            Junte-se à nossa comunidade e comece a vender seus produtos hoje
            mesmo!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                   <Input id="fullName" placeholder="Seu nome" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ (MEI)</Label>
                <Input id="cnpj" placeholder="00.000.000/0001-00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
               <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="seu@email.com" className="pl-10" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                   <Input id="password" type="password" placeholder="********" className="pl-10"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="confirmPassword" type="password" placeholder="********" className="pl-10"/>
                </div>
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full">
              Criar Conta de Vendedor
              <ArrowRight className="ml-2" />
            </Button>
          </form>
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
