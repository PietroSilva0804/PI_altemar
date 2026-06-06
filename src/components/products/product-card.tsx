import Image from 'next/image';
import Link from 'next/link';
import { Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/placeholder-data';
import { Badge } from '../ui/badge';

interface ProductCardProps {
  product: Product;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <>
      {Array(fullStars).fill(0).map((_, i) => <Star key={`full_${i}`} className="h-4 w-4 fill-primary text-primary" />)}
      {halfStar && <StarHalf key="half" className="h-4 w-4 fill-primary text-primary" />}
      {Array(emptyStars).fill(0).map((_, i) => <Star key={`empty_${i}`} className="h-4 w-4 text-muted-foreground/50" />)}
    </>
  );
};

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0] ?? {
    imageUrl: 'https://picsum.photos/seed/placeholder/600/400',
    imageHint: 'product placeholder',
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block overflow-hidden">
          <Image
            src={firstImage.imageUrl}
            alt={product.name}
            width={600}
            height={400}
            className="aspect-video w-full object-cover transition-transform duration-300 hover:scale-105"
            data-ai-hint={firstImage.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
        <CardTitle className="mb-2 text-lg leading-tight">
          <Link href={`/products/${product.id}`} className="hover:text-primary">
            {product.name}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating)}
          </div>
          <span>({product.reviewCount})</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-bold text-accent">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </p>
        <Button asChild size="sm">
          <Link href={`/products/${product.id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
