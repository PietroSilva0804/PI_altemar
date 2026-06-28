
'use client';

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/placeholder-data';
import type { Product } from '@/lib/placeholder-data';
import { getProductById } from '@/lib/products-service';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, StarHalf, ShoppingCart, Heart, MessageSquare, Truck, ShieldCheck, Tag, Loader2 } from 'lucide-react';
import ProductCard from '@/components/products/product-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { generateProductReviews, ProductReview } from '@/ai/flows/generate-product-reviews';
import { Skeleton } from '@/components/ui/skeleton';

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center gap-1 text-primary">
      {Array(fullStars).fill(0).map((_, i) => <Star key={`full_${i}`} className="h-5 w-5 fill-current" />)}
      {halfStar && <StarHalf key="half" className="h-5 w-5 fill-current" />}
      {Array(emptyStars).fill(0).map((_, i) => <Star key={`empty_${i}`} className="h-5 w-5 text-muted-foreground/30" />)}
    </div>
  );
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // No Next.js 15, params é uma Promise que deve ser desembrulhada com React.use()
  const { id: productId } = use(params);

  const [product, setProduct] = useState<Product | null>(() => products.find((p) => p.id === productId) ?? null);
  const [productLoading, setProductLoading] = useState(!product);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fromMock = products.find((p) => p.id === productId) ?? null;
    if (fromMock) {
      setProduct(fromMock);
      setProductLoading(false);
      return;
    }
    setProductLoading(true);
    getProductById(productId)
      .then((p) => setProduct(p))
      .catch(() => setProduct(null))
      .finally(() => setProductLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const result = await generateProductReviews({
          productName: product.name,
          productCategory: product.category,
        });
        setReviews(result.reviews);
        setAverageRating(result.averageRating);
      } catch (error) {
        console.error("Failed to generate reviews:", error);
        setAverageRating(product.rating);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product]);

  if (productLoading) {
    return (
      <div className="container flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }
  
  const toggleFavorite = () => setIsFavorited(!isFavorited);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
        title: "Produto Adicionado!",
        description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const displayRating = averageRating !== null ? averageRating : product.rating;
  const displayReviewCount = reviews.length > 0 ? reviews.length : product.reviewCount;

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-lg border shadow-lg">
            <Image
              src={product.images[0].imageUrl}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-cover"
              data-ai-hint={product.images[0].imageHint}
              priority
            />
          </div>
        </div>

        <div className="flex flex-col">
           <Badge variant="secondary" className="w-fit">{product.category.toUpperCase()}</Badge>
          <h1 className="mt-2 font-headline text-4xl lg:text-5xl">{product.name}</h1>
          
          <div className="mt-4 flex items-center gap-4">
            {renderStars(displayRating)}
            <a href="#reviews" className="text-sm text-muted-foreground hover:underline">({displayReviewCount} avaliações)</a>
          </div>

          <p className="mt-6 text-4xl font-bold text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary"/>
              <span className="text-sm font-medium">Envio para todo o Brasil</span>
            </div>
             <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary"/>
              <span className="text-sm font-medium">Compra segura e garantida</span>
            </div>
             <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-primary"/>
              <span className="text-sm font-medium">Produto artesanal de alta qualidade</span>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={toggleFavorite}>
              <Heart className={cn("h-5 w-5", isFavorited && 'fill-primary text-primary')} />
            </Button>
          </div>
          
           <Card className="mt-8 bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={product.store.avatarUrl} alt={product.store.name} />
                        <AvatarFallback>{product.store.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm text-muted-foreground">Vendido e entregue por</p>
                        <p className="font-bold text-foreground">{product.store.name}</p>
                    </div>
                 </div>
                 <Button variant="outline" asChild>
                    <Link href={`/seller-chat?productId=${product.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Falar com vendedor
                    </Link>
                 </Button>
              </div>
            </CardContent>
           </Card>
        </div>
      </div>
      
      <div id="reviews" className="mt-16 md:mt-24">
        <h2 className="mb-8 text-center font-headline text-3xl">Avaliações dos Clientes</h2>
        {reviewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-4/5" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://picsum.photos/seed/review${i}/40/40`} />
                      <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{review.userName}</p>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 md:mt-24">
        <h2 className="mb-8 text-center font-headline text-3xl">Você também pode gostar</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </div>
    </div>
  );
}
