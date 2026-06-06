'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import {
  generateProductDescription,
  GenerateProductDescriptionOutput,
} from '@/ai/flows/generate-product-descriptions';

export default function ProductDescriptionGeneratorPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateProductDescriptionOutput | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const keywords = formData.get('keywords') as string;

    if (!title || !keywords) {
      toast({
        title: 'Campos Obrigatórios',
        description: 'Por favor, preencha o título e as palavras-chave.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const generationResult = await generateProductDescription({ title, keywords });
      setResult(generationResult);
      toast({
        title: 'Descrição Gerada!',
        description: 'Sua nova descrição de produto está pronta.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro na Geração',
        description: 'Não foi possível gerar a descrição. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-5xl">Gerador de Descrição de Produto</h1>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-muted-foreground">
          Crie descrições de produtos atraentes e vendedoras com a ajuda da nossa IA.
        </p>
      </header>

      <div className="mx-auto max-w-2xl">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Detalhes do Produto</CardTitle>
              <CardDescription>
                Forneça um título e algumas palavras-chave para gerarmos a descrição perfeita.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Produto</Label>
                <Input id="title" name="title" placeholder="Ex: Caneca de Cerâmica Artesanal" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
                <Input id="keywords" name="keywords" placeholder="Ex: café, presente, único" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Gerando...' : 'Gerar Descrição'}
                {!loading && <Wand2 className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </form>

          {result && (
            <div className="border-t p-6">
              <h3 className="mb-2 text-lg font-semibold">Descrição Gerada:</h3>
              <Textarea value={result.description} readOnly rows={6} className="bg-secondary" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
