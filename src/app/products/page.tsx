'use client';

import { useSearchParams } from 'next/navigation';
import { products as mockProducts, categories } from '@/lib/placeholder-data';
import type { Product } from '@/lib/placeholder-data';
import { getAllProducts } from '@/lib/products-service';
import ProductCard from '@/components/products/product-card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ListFilter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Suspense, useState, useMemo, useEffect } from 'react';

const MAX_PRICE = 500;

function Filters({
  selectedCategories,
  onCategoryChange,
  price,
  onPriceChange,
  selectedRatings,
  onRatingChange,
  searchTerm,
  onSearchChange,
}: {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  price: number;
  onPriceChange: (value: number) => void;
  selectedRatings: number[];
  onRatingChange: (rating: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) {
  return (
    <>
      <div className="relative mb-6">
        <Input
          type="search"
          placeholder="Buscar produtos..."
          className="pr-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <span className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-muted-foreground">
          <Search className="h-5 w-5" />
        </span>
      </div>
      <Accordion type="multiple" defaultValue={['categories', 'price']} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base">Categorias</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.name}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => onCategoryChange(category.name)}
                  />
                  <Label htmlFor={category.name} className="font-normal leading-tight cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-base">Faixa de Preço</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 pt-2">
              <Slider
                value={[price]}
                onValueChange={(value) => onPriceChange(value[0])}
                max={MAX_PRICE}
                step={10}
              />
              <div className="mt-3 flex justify-between text-sm text-muted-foreground">
                <span>R$0</span>
                <span>R${price}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rating">
          <AccordionTrigger className="text-base">Avaliação</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={() => onRatingChange(rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="font-normal cursor-pointer">
                    {rating} estrelas ou mais
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [price, setPrice] = useState<number>(MAX_PRICE);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAllProducts()
      .then(setSellerProducts)
      .catch(() => setSellerProducts([]));
  }, []);

  const products = useMemo(() => [...sellerProducts, ...mockProducts], [sellerProducts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const filteredProducts = useMemo(() => {
    const minRating = selectedRatings.length > 0 ? Math.min(...selectedRatings) : 0;
    
    return products.filter((product: Product) => {
      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesCategory = selectedCategories.length > 0
        ? selectedCategories.includes(product.category)
        : true;
        
      const matchesPrice = product.price <= price;
      
      const matchesRating = product.rating >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [products, searchTerm, selectedCategories, price, selectedRatings]);


  const filterProps = {
    selectedCategories,
    onCategoryChange: handleCategoryChange,
    price,
    onPriceChange: setPrice,
    selectedRatings,
    onRatingChange: handleRatingChange,
    searchTerm,
    onSearchChange: setSearchTerm,
  };

  return (
    <div className="container py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-5xl">Nossos Produtos</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          {searchTerm
            ? `Exibindo resultados para "${searchTerm}"`
            : "Encontre o que há de melhor, feito por empreendedores locais de todo o Brasil."
          }
        </p>
      </header>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-headline text-xl">Filtros</h3>
            <Filters {...filterProps} />
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="flex justify-end mb-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" />Filtros</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <Filters {...filterProps} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
           {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <ProductCard key={`${product.id}-${index}`} product={product} />
              ))}
            </div>
           ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold">Nenhum produto encontrado</h3>
              <p className="text-lg text-muted-foreground mt-2">Tente ajustar seus filtros para encontrar o que procura.</p>
            </div>
           )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
