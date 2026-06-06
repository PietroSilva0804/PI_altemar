'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { verifyMeiDetails, VerifyMeiDetailsOutput } from '@/ai/flows/mei-verification-tool';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function MeiVerificationForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyMeiDetailsOutput | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const cnpj = formData.get('cnpj') as string;
    const address = formData.get('address') as string;

    if (!cnpj || !address) {
      toast({
        title: 'Erro de Validação',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const verificationResult = await verifyMeiDetails({ cnpj, address });
      setResult(verificationResult);
      toast({
        title: 'Verificação Concluída',
        description: 'O resultado da verificação está disponível abaixo.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro na Verificação',
        description: 'Não foi possível completar a verificação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramenta de Verificação MEI</CardTitle>
        <CardDescription>
          Cruze os dados do seu MEI (CNPJ, endereço) com registros públicos para garantir a conformidade.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" name="cnpj" placeholder="00.000.000/0001-00" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input id="address" name="address" placeholder="Rua, Número, Bairro, Cidade - Estado, CEP" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Verificando...' : 'Verificar MEI'}
          </Button>
        </CardFooter>
      </form>
      {result && (
        <div className="px-6 pb-6">
            <Alert variant={result.isValid ? 'default' : 'destructive'} className={result.isValid ? 'border-green-500 bg-green-50' : ''}>
                {result.isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{result.isValid ? 'MEI Válido' : 'Verificação Falhou'}</AlertTitle>
                <AlertDescription>
                    {result.verificationDetails}
                </AlertDescription>
            </Alert>
        </div>
      )}
    </Card>
  );
}

// Dummy components for other tabs
const PersonalData = () => (
    <Card>
        <CardHeader><CardTitle>Dados Pessoais</CardTitle><CardDescription>Gerencie suas informações pessoais.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Nome</Label><Input defaultValue="Usuário Teste" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue="usuario@email.com" /></div>
        </CardContent>
        <CardFooter><Button>Salvar Alterações</Button></CardFooter>
    </Card>
);
const OrderHistory = () => <Card><CardHeader><CardTitle>Histórico de Pedidos</CardTitle></CardHeader><CardContent><p>Você ainda não fez nenhum pedido.</p></CardContent></Card>;
const Favorites = () => <Card><CardHeader><CardTitle>Favoritos</CardTitle></CardHeader><CardContent><p>Você não tem produtos favoritos.</p></CardContent></Card>;

export default function ProfilePage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-8">
        <h1 className="font-headline text-5xl">Meu Perfil</h1>
      </header>
      <Tabs defaultValue="mei-verification" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal-data">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="order-history">Histórico de Pedidos</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="mei-verification">Verificação MEI</TabsTrigger>
        </TabsList>
        <TabsContent value="personal-data" className="mt-6"><PersonalData /></TabsContent>
        <TabsContent value="order-history" className="mt-6"><OrderHistory /></TabsContent>
        <TabsContent value="favorites" className="mt-6"><Favorites /></TabsContent>
        <TabsContent value="mei-verification" className="mt-6"><MeiVerificationForm /></TabsContent>
      </Tabs>
    </div>
  );
}
