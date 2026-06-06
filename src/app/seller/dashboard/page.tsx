
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Plus, 
  TrendingUp, 
  Users, 
  Package, 
  Wand2,
  ArrowUpRight,
  Store,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function SellerDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { title: 'Saldo a Receber', value: 'R$ 845,20', icon: DollarSign, trend: 'Próximo saque: 05/10' },
    { title: 'Vendas do Mês', value: 'R$ 1.250,00', icon: TrendingUp, trend: '+12% vs mês anterior' },
    { title: 'Pedidos Pendentes', value: '3', icon: ShoppingBag, trend: 'Envie hoje para ganhar EcoCoins' },
    { title: 'Visitas na Loja', value: '1.240', icon: Users, trend: 'Pico às 19h ontem' },
  ];

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="font-headline text-4xl">Painel do Vendedor</h1>
            <p className="text-muted-foreground">Boas vendas, {user?.displayName || 'Empreendedor'}!</p>
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend}
              </p>
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
                <Link href="/products">Ver no Marketplace</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Caneca de Cerâmica', price: 49.90, stock: 15 },
                { name: 'Mel Orgânico', price: 35.00, stock: 8 },
                { name: 'Vela Aromática', price: 59.90, stock: 0 }
              ].map((prod, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{prod.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price)} • 
                        <span className={prod.stock === 0 ? 'text-destructive ml-1' : 'ml-1'}>
                          {prod.stock === 0 ? 'Sem estoque' : `${prod.stock} em estoque`}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 p-0" asChild>
              <Link href="/seller/products">Visualizar inventário completo <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
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
                  "Seu produto **'Caneca de Cerâmica'** é o mais visitado! Que tal criar um combo com o **'Mel Orgânico'** para aumentar seu ticket médio?"
                </p>
              </div>
              <div className="rounded-lg bg-background p-4 shadow-sm border border-accent/20">
                <p className="text-sm italic text-muted-foreground">
                  "Você tem 1 produto sem estoque. Reponha logo para não perder posições no ranking de busca!"
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
