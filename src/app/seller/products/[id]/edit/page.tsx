'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/placeholder-data';
import { useAuth } from '@/context/auth-context';
import { getProductById, updateProduct, ProductType } from '@/lib/products-service';

const productTypes: ProductType[] = ['Novo', 'Usado', 'Serviço'];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: 'Novo' as ProductType,
    price: '',
    stock: '',
    description: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !user) {
      router.push('/login');
      return;
    }
    (async () => {
      setFetching(true);
      try {
        const product = await getProductById(id);
        if (!product || product.sellerId !== user.uid) {
          toast({ title: 'Não encontrado', description: 'Produto inexistente ou sem permissão.', variant: 'destructive' });
          router.push('/seller/products');
          return;
        }
        setFormData({
          name: product.name,
          category: product.category,
          type: product.type,
          price: String(product.price),
          stock: String(product.stock),
          description: product.description,
        });
      } finally {
        setFetching(false);
      }
    })();
  }, [authLoading, isLoggedIn, user, id, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProduct(id, {
        name: formData.name,
        category: formData.category,
        type: formData.type,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock, 10) || 0,
        description: formData.description,
      });
      toast({ title: 'Produto atualizado!', description: 'As alterações foram salvas.' });
      router.push('/seller/products');
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar as alterações.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8 md:py-12">
      <Link href="/seller/products" className="mb-6 flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Meus Produtos
      </Link>

      <header className="mb-8">
        <h1 className="font-headline text-4xl">Editar Produto</h1>
        <p className="text-muted-foreground">Atualize as informações do seu item.</p>
      </header>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={val => setFormData(p => ({ ...p, category: val }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (<SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={val => setFormData(p => ({ ...p, type: val as ProductType }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {productTypes.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Quantidade em estoque</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" rows={6} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} required />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/seller/products">Cancelar</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
