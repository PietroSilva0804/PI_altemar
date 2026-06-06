import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const imagesById = PlaceHolderImages.reduce((acc, img) => {
  acc[img.id] = img;
  return acc;
}, {} as Record<string, ImagePlaceholder>);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  store: {
    name: string;
    avatarUrl: string;
  };
  images: ImagePlaceholder[];
};

export const categories = [
  { name: 'Alimentação', icon: 'UtensilsCrossed' },
  { name: 'Moda', icon: 'Shirt' },
  { name: 'Artesanato', icon: 'Paintbrush' },
  { name: 'Serviços', icon: 'Wrench' },
  { name: 'Cosméticos', icon: 'Sparkles' },
  { name: 'Casa & Decoração', icon: 'Home' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Caneca de Cerâmica Artesanal',
    description: 'Caneca de cerâmica feita à mão, perfeita para o seu café da manhã. Cada peça é única e carrega a essência do trabalho artesanal.',
    price: 49.9,
    category: 'Artesanato',
    rating: 4.8,
    reviewCount: 124,
    store: { name: 'Ateliê Criativo', avatarUrl: 'https://picsum.photos/seed/store1/40/40' },
    images: [imagesById['prod_1']],
  },
  {
    id: '2',
    name: 'Mel Orgânico de Laranjeira',
    description: 'Mel puro e orgânico, colhido de flores de laranjeira. Sabor suave e adocicado, ideal para adoçar suas bebidas e receitas.',
    price: 35.0,
    category: 'Alimentação',
    rating: 4.9,
    reviewCount: 230,
    store: { name: 'Apiário Doce Flor', avatarUrl: 'https://picsum.photos/seed/store2/40/40' },
    images: [imagesById['prod_2']],
  },
  {
    id: '3',
    name: 'Camiseta "Empreenda"',
    description: 'Camiseta de algodão com estampa exclusiva para inspirar seu dia a dia. Confortável e cheia de estilo.',
    price: 79.9,
    category: 'Moda',
    rating: 4.7,
    reviewCount: 88,
    store: { name: 'Visto Estilo', avatarUrl: 'https://picsum.photos/seed/store3/40/40' },
    images: [imagesById['prod_3']],
  },
  {
    id: '4',
    name: 'Barra de Chocolate Vegano 70%',
    description: 'Chocolate intenso e vegano, com 70% de cacau de origem amazônica. Sem lactose e sem glúten.',
    price: 22.0,
    category: 'Alimentação',
    rating: 4.9,
    reviewCount: 156,
    store: { name: 'Cacau Ancestral', avatarUrl: 'https://picsum.photos/seed/store4/40/40' },
    images: [imagesById['prod_4']],
  },
  {
    id: '5',
    name: 'Vela Aromática de Soja',
    description: 'Vela feita com cera de soja e óleos essenciais, com aroma relaxante de lavanda. Perfeita para criar um ambiente aconchegante.',
    price: 59.9,
    category: 'Casa & Decoração',
    rating: 4.8,
    reviewCount: 95,
    store: { name: 'Aconchego Velas', avatarUrl: 'https://picsum.photos/seed/store5/40/40' },
    images: [imagesById['prod_5']],
  },
  {
    id: '6',
    name: 'Carteira de Couro Minimalista',
    description: 'Carteira compacta e funcional, feita em couro legítimo. Design moderno para quem busca praticidade.',
    price: 119.9,
    category: 'Moda',
    rating: 4.9,
    reviewCount: 210,
    store: { name: 'Couro & Arte', avatarUrl: 'https://picsum.photos/seed/store6/40/40' },
    images: [imagesById['prod_6']],
  },
  {
    id: '7',
    name: 'Caixa de Brigadeiros Gourmet',
    description: 'Uma seleção de brigadeiros gourmet com sabores incríveis: tradicional, pistache, e crème brûlée. Feitos com chocolate belga.',
    price: 55.0,
    category: 'Alimentação',
    rating: 5.0,
    reviewCount: 312,
    store: { name: 'Doce Encanto', avatarUrl: 'https://picsum.photos/seed/store7/40/40' },
    images: [imagesById['prod_7']],
  },
  {
    id: '8',
    name: 'Pôster Ilustrado "Botânica"',
    description: 'Impressão de arte em alta qualidade com ilustração botânica autoral. Adicione um toque de natureza à sua decoração.',
    price: 89.9,
    category: 'Artesanato',
    rating: 4.9,
    reviewCount: 78,
    store: { name: 'Estúdio Papel & Tinta', avatarUrl: 'https://picsum.photos/seed/store8/40/40' },
    images: [imagesById['prod_8']],
  },
];
