'use client';

import { CreditCard, LogOut, Medal, Package, Settings, User as UserIcon, Store } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';

export default function UserNav() {
  const { isLoggedIn, logout, user: authUser } = useAuth();

  const user = { 
    name: authUser?.displayName || 'Usuário', 
    email: authUser?.email || 'usuario@email.com', 
    ecoCoins: 1250 
  };
  
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline">
            <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
            <Link href="/register">Cadastre-se</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={authUser?.photoURL || "https://picsum.photos/seed/main-user/40/40"} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="text-primary font-semibold">
            <Link href="/seller/dashboard">
              <Store className="mr-2 h-4 w-4" />
              <span>Painel do Vendedor</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/cart">
              <Package className="mr-2 h-4 w-4" />
              <span>Meus Pedidos</span>
            </Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild>
            <Link href="/gamification">
              <Medal className="mr-2 h-4 w-4" />
              <span>EcoCoins: {user.ecoCoins}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
         <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
         </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
