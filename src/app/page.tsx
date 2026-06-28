
import Image from 'next/image';
import Link from 'next/link';
import { UtensilsCrossed, Shirt, Paintbrush, Wrench, Sparkles, Home as HomeIcon, Package, ArrowRight, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categories, products } from '@/lib/placeholder-data';
import ProductCard from '@/components/products/product-card';

const iconMap: { [key: string]: LucideIcon } = {
  UtensilsCrossed,
  Shirt,
  Paintbrush,
  Wrench,
  Sparkles,
  Home: HomeIcon,
  Package,
};

const DynamicIcon = ({ name }: { name: string }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return <Package className="h-8 w-8 text-primary" />;
  }
  return <IconComponent className="h-8 w-8 text-primary" />;
};

export default function HomePage() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section>
        <div className="container grid grid-cols-1 items-center gap-12 py-12 md:grid-cols-2 lg:py-24">
          <div className="flex flex-col items-start">
             <h1 className="font-headline text-4xl leading-tight md:text-6xl md:leading-tight">
              O marketplace <span className="text-primary">justo</span> para o <span className="text-primary">MEI</span>.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Conectamos microempreendedores a um universo de oportunidades. Compre, venda e cresça com o Empreenda+.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg">
                <Link href="/products">Explorar Produtos <ArrowRight className="ml-2" /></Link>
              </Button>
               <Button asChild size="lg" variant="outline">
                <Link href="/seller/dashboard">Seja um Vendedor</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-2xl md:h-[450px]">
             <Image
                src="https://images.unsplash.com/photo-1594679085391-0ea2baba0145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtdWxoZXIlMjBzb3JyaW5kbyUyMG51bWElMjBsb2phfGVufDB8fHx8MTc1NzU5NjQ5NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Mulher empreendedora sorrindo em sua loja de varejo"
                fill
                className="object-cover"
                priority
                data-ai-hint="entrepreneur business"
              />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-y border-border">
        <div className="container py-12">
           <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link href={`/products?category=${category.name}`} key={category.name} className="group flex flex-col items-center gap-3">
                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary">
                  <DynamicIcon name={category.icon} />
                 </div>
                <p className="font-semibold text-muted-foreground transition-colors group-hover:text-primary">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-4xl">Produtos em Destaque</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Descubra os produtos mais amados e bem avaliados da nossa comunidade de empreendedores.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">Ver Todos os Produtos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Impact Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container grid grid-cols-1 items-center gap-12 md:grid-cols-2">
           <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-lg md:h-[400px]">
             <Image
                src="https://images.unsplash.com/photo-1727653662044-48a024b28d27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxDb21wcmlyJTIwdW0lMjBwcm9wb3NpdG98ZW58MHx8fHwxNzU3Njc1NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Mãos segurando um broto de planta"
                fill
                className="object-cover"
                data-ai-hint="sustainability growth"
              />
          </div>
          <div>
            <h2 className="font-headline text-4xl">Compre com Propósito</h2>
             <p className="mt-4 text-lg text-muted-foreground">
              Apoiamos os Objetivos de Desenvolvimento Sustentável (ODS) da ONU. Cada compra na Empreenda+ é um passo em direção a um futuro mais justo e sustentável.
            </p>
            <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                    <Check className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span><strong className="font-semibold">Trabalho Decente e Crescimento Econômico (ODS 8):</strong> Empoderamos pequenos negócios e fortalecemos a economia local.</span>
                </li>
            </ul>
             <Button asChild size="lg" variant="link" className="px-0 text-base">
                <Link href="/about">Saiba mais sobre nosso impacto <ArrowRight className="ml-2"/></Link>
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
