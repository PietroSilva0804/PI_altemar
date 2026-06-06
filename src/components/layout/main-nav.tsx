import Link from 'next/link';
import { cn } from '@/lib/utils';

const routes = [
  { href: '/', label: 'Início' },
  { href: '/products', label: 'Produtos' },
  { href: '/gamification', label: 'Gamificação' },
  { href: '/about', label: 'Sobre Nós' },
  { href: '/help', label: 'Ajuda' },
  { href: '/settings', label: 'Configurações' },
];

export default function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
