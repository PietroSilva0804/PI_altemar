'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainNav from './main-nav';
import UserNav from '../user/user-nav';
import Logo from '../shared/logo';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '../ui/badge';

export default function Header() {
  const router = useRouter();
  const { cartCount } = useCart();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Logo />
              <MainNav className="mt-8 flex-col items-start space-y-4" />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:block">
          <MainNav />
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end space-x-2">
          <div className="flex-1" />
          <form onSubmit={handleSearch} className="hidden w-full max-w-xs items-center lg:flex">
            <Input type="search" name="search" placeholder="Buscar produtos..." className="pr-10" />
            <Button type="submit" size="icon" variant="ghost" className="-ml-10 h-10 w-10 text-muted-foreground">
              <Search className="h-5 w-5" />
            </Button>
          </form>
          <nav className="flex items-center space-x-1">
            <Button size="icon" variant="ghost" asChild className="md:hidden">
              <Link href="/products">
                <Search className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Buscar</span>
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild className="relative">
              <Link href="/cart">
                {cartCount > 0 && (
                    <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 text-xs">
                        {cartCount}
                    </Badge>
                )}
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Carrinho de Compras</span>
              </Link>
            </Button>
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
