import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import Logo from '../shared/logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          
          <div className="md:col-span-3 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              O marketplace justo para o microempreendedor.
            </p>
             <div className="flex space-x-3">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20}/></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20}/></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20}/></Link>
               <Link href="#" className="text-muted-foreground hover:text-primary"><Youtube size={20}/></Link>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-headline text-base font-semibold">Plataforma</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">Sobre Nós</Link></li>
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">Produtos</Link></li>
              <li><Link href="/gamification" className="text-sm text-muted-foreground hover:text-foreground">Gamificação</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-headline text-base font-semibold">Vendedores</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/register-mei" className="text-sm text-muted-foreground hover:text-foreground">Seja um Vendedor</Link></li>
              <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">Painel do Vendedor</Link></li>
              <li><Link href="/tools/product-description-generator" className="text-sm text-muted-foreground hover:text-foreground">Gerador de Descrição</Link></li>
              <li><Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">Central de Ajuda</Link></li>
               <li><Link href="/support" className="text-sm text-muted-foreground hover:text-foreground">Suporte</Link></li>
            </ul>
          </div>

           <div className="md:col-span-2">
            <h3 className="font-headline text-base font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Termos de Serviço</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Política de Privacidade</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
             <h3 className="font-headline text-base font-semibold">Fique por dentro</h3>
             <p className="mt-4 text-sm text-muted-foreground">Receba novidades e promoções exclusivas no seu email.</p>
             <form className="mt-4 flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Seu melhor email" />
                <Button type="submit">Inscrever</Button>
            </form>
          </div>
          
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Empreenda+. Todos os direitos reservados. Feito com ❤️ para MEIs do Brasil.</p>
        </div>
      </div>
    </footer>
  );
}
