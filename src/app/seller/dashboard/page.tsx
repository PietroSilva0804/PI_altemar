
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Package,
  Wand2,
  ArrowUpRight,
  Store,
  DollarSign,
  Boxes,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { getProductsBySeller, SellerProduct } from '@/lib/products-service';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function SellerDashboardPage() {
  const { user, profile, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !user) {
      router.push('/login');
      return;
    }
    (async () => {
      setLoading(true);
      try {
        setProducts(await getProductsBySeller(user.uid));
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, isLoggedIn, user, router]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.reduce((acc, p) => acc + p.stock, 0);
    const outOfStock = products.filter(p => p.stock === 0).length;
    const inventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
    return [
      { title: 'Produtos Publicados', value: String(totalProducts), icon: Package, trend: 'Total na sua vitrine' },
      { title: 'Itens em Estoque', value: String(inStock), icon: Boxes, trend: 'Unidades disponíveis' },
      { title: 'Sem Estoque', value: String(outOfStock), icon: AlertTriangle, trend: outOfStock > 0 ? 'Reponha para vender' : 'Tudo abastecido' },
      { title: 'Valor do Inventário', value: formatCurrency(inventoryValue), icon: DollarSign, trend: 'Preço × estoque' },
    ];
  }, [products]);

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="font-headline text-4xl">Painel do Vendedor</h1>
            <p className="text-muted-foreground">
              Boas vendas, {profile?.storeName || user?.displayName || 'Empreendedor'}!
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/tools/product-description-generator">
              <Wand2 className="mr-2 h-4 w-4" />
              IA Writer
            </Link>
          </Button>
          <Button asChild>
            <Link href="/seller/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Produto
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '—' : stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Produtos Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Meus Produtos</CardTitle>
                <CardDescription>Gerencie sua vitrine digital.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/seller/products">Ver inventário</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">Você ainda não publicou produtos.</p>
                <Button className="mt-4" asChild>
                  <Link href="/seller/products/new">Cadastrar primeiro produto</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((prod) => (
                  <div key={prod.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{prod.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(prod.price)} •
                          <span className={prod.stock === 0 ? 'text-destructive ml-1' : 'ml-1'}>
                            {prod.stock === 0 ? 'Sem estoque' : `${prod.stock} em estoque`}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/seller/products/${prod.id}/edit`}>Editar</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link href="/seller/products">Visualizar inventário completo <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dicas de IA */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Dicas do Léo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-background p-4 shadow-sm border border-primary/20">
                <p className="text-sm italic text-muted-foreground">
                  "Capriche nas descrições! Use o IA Writer para criar textos que vendem mais."
                </p>
              </div>
              <div className="rounded-lg bg-background p-4 shadow-sm border border-accent/20">
                <p className="text-sm italic text-muted-foreground">
                  "Produtos sem estoque perdem posição na busca. Mantenha seu inventário sempre atualizado!"
                </p>
              </div>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/tools/product-description-generator">Otimizar descrições</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
