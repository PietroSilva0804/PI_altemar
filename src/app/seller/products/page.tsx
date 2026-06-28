'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Plus, Package, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { getProductsBySeller, deleteProduct, SellerProduct } from '@/lib/products-service';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function SellerProductsPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = useCallback(async (sellerId: string) => {
    setLoading(true);
    try {
      const items = await getProductsBySeller(sellerId);
      setProducts(items);
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível carregar seus produtos.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !user) {
      router.push('/login');
      return;
    }
    loadProducts(user.uid);
  }, [authLoading, isLoggedIn, user, router, loadProducts]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Produto removido', description: 'O produto foi excluído da sua vitrine.' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível remover o produto.', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <Link href="/seller/dashboard" className="mb-6 flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Painel
      </Link>

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-4xl">Meus Produtos</h1>
          <p className="text-muted-foreground">Gerencie todos os itens da sua vitrine digital.</p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">
            <Plus className="mr-2 h-4 w-4" /> Cadastrar Produto
          </Link>
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
            <CardTitle className="mb-2">Nenhum produto cadastrado</CardTitle>
            <CardDescription className="mb-6">Comece a vender publicando seu primeiro produto.</CardDescription>
            <Button asChild>
              <Link href="/seller/products/new">
                <Plus className="mr-2 h-4 w-4" /> Cadastrar primeiro produto
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Inventário ({products.length})</CardTitle>
            <CardDescription>Edite ou remova seus produtos publicados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="flex flex-col gap-4 border-b pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={product.images[0].imageUrl}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{product.name}</p>
                        <Badge variant="secondary">{product.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(product.price)} •{' '}
                        <span className={product.stock === 0 ? 'text-destructive' : ''}>
                          {product.stock === 0 ? 'Sem estoque' : `${product.stock} em estoque`}
                        </span>{' '}
                        • {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/seller/products/${product.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={deletingId === product.id}>
                          {deletingId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover produto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O produto "{product.name}" será removido permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)}>Remover</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
