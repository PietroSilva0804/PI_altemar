'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Ghost } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const shipping = cartItems.length > 0 ? 15.00 : 0;
  const total = totalPrice + shipping;

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-8">
        <h1 className="font-headline text-5xl">Seu Carrinho</h1>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {cartItems.length > 0 ? (
                <ul className="divide-y">
                  {cartItems.map(item => (
                    <li key={item.id} className="flex items-center gap-4 p-4">
                      <Image src={item.images[0].imageUrl} alt={item.name} width={100} height={100} className="rounded-md object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.store.name}</p>
                        <p className="mt-2 font-bold text-lg text-accent">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><MinusCircle className="h-5 w-5"/></Button>
                        <Input type="number" value={item.quantity} className="w-16 h-10 text-center" readOnly />
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}><PlusCircle className="h-5 w-5"/></Button>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-5 w-5"/>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center p-16 text-center">
                    <Ghost className="h-16 w-16 text-muted-foreground/50"/>
                    <h3 className="mt-4 font-semibold text-xl">Seu carrinho está vazio</h3>
                    <p className="text-muted-foreground mt-2">Parece que você ainda não adicionou nenhum produto.</p>
                    <Button asChild className="mt-6">
                        <Link href="/products">Explorar Produtos</Link>
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Frete</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shipping)}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button asChild size="lg" className="w-full" disabled={cartItems.length === 0}><Link href="/checkout">Finalizar Compra</Link></Button>
                    <Button asChild variant="outline" className="w-full"><Link href="/products">Continuar Comprando</Link></Button>
                </CardFooter>
            </Card>
        </aside>
      </div>
    </div>
  );
}
