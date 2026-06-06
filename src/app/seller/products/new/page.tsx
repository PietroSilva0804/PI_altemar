'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateProductDescription } from '@/ai/flows/generate-product-descriptions';
import { categories } from '@/lib/placeholder-data';

export default function NewProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    keywords: ''
  });

  const handleAiDescription = async () => {
    if (!formData.name || !formData.keywords) {
      toast({
        title: "Atenção",
        description: "Preencha o nome e palavras-chave para a IA te ajudar.",
        variant: "destructive"
      });
      return;
    }

    setIaLoading(true);
    try {
      const result = await generateProductDescription({ 
        title: formData.name, 
        keywords: formData.keywords 
      });
      setFormData(prev => ({ ...prev, description: result.description }));
      toast({ title: "Descrição Gerada!", description: "A IA criou uma descrição incrível para você." });
    } catch (error) {
      toast({ title: "Erro na IA", description: "Não foi possível gerar a descrição no momento.", variant: "destructive" });
    } finally {
      setIaLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Sucesso!", description: "Produto cadastrado com sucesso." });
      router.push('/seller/dashboard');
    }, 1500);
  };

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <Link href="/seller/dashboard" className="mb-6 flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Painel
      </Link>

      <header className="mb-8">
        <h1 className="font-headline text-4xl">Novo Produto</h1>
        <p className="text-muted-foreground">Cadastre um novo item na sua vitrine digital.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Lado Esquerdo: Imagem e Dados Básicos */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Caneca de Cerâmica Artesanal" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0,00" 
                    required 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Descrição do Produto</CardTitle>
                <CardDescription>Use nossa IA para criar um texto vendedor.</CardDescription>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAiDescription}
                disabled={iaLoading}
              >
                {iaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                Sugestão da IA
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Palavras-chave para a IA (ex: feito à mão, café, presente)</Label>
                <Input 
                  id="keywords" 
                  value={formData.keywords}
                  onChange={e => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="Separadas por vírgula" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Texto Final</Label>
                <Textarea 
                  id="description" 
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={8} 
                  placeholder="Descreva seu produto..." 
                  required 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lado Direito: Fotos e Estoque */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted transition-colors hover:border-primary/50">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Clique para enviar</p>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground text-center">Tamanho recomendado: 800x800px (JPG/PNG)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="stock">Quantidade</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  value={formData.stock}
                  onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  placeholder="0" 
                  required 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Publicar Produto'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
