'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { products, Product } from '@/lib/placeholder-data';
import { smartFAQChatbot } from '@/ai/flows/smart-faq-chatbot';

const SellerChatContent = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setMessages([
        { sender: 'ai', text: `Olá! Sou o Léo, seu assistente virtual. Como posso ajudar com o produto "${foundProduct.name}"?` }
      ]);
    } else {
       setMessages([
        { sender: 'ai', text: 'Olá! Sou o Léo. Selecione um produto para que eu possa te ajudar.' }
      ]);
    }
  }, [productId]);


  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !product) return;

    const userMessage = { sender: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    // Create context from product data
    const productContext = `
      Nome do Produto: ${product.name}
      Descrição: ${product.description}
      Preço: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
      Categoria: ${product.category}
      Avaliação: ${product.rating} de 5 estrelas
      Vendido por: ${product.store.name}
    `;

    try {
      const response = await smartFAQChatbot({ query: currentInput, faq: productContext });
      const aiMessage = { sender: 'ai' as const, text: response.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro no Chat',
        description: 'Não foi possível obter uma resposta do assistente. Tente novamente.',
        variant: 'destructive',
      });
      // Add a generic error message to the chat
      const errorMessage = { sender: 'ai' as const, text: 'Desculpe, estou com problemas para me conectar. Tente novamente mais tarde.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  const productPath = productId ? `/products/${productId}` : '/products';

  return (
    <div className="container flex h-[calc(100vh-5rem)] flex-col bg-muted/20 p-0">
        {/* Header */}
        <header className="flex w-full items-center gap-3 bg-background p-3 shadow-md border-b">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
                <Link href={productPath}>
                    <ArrowLeft />
                </Link>
            </Button>
            <Avatar>
                <AvatarImage src="https://picsum.photos/seed/aiseller/40/40" />
                <AvatarFallback>L</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-bold">Léo</p>
                <p className="text-xs text-green-500">online</p>
            </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="space-y-4 p-4">
                 {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={cn(
                            'flex max-w-[80%] items-end gap-2',
                            msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'
                        )}
                    >
                         {msg.sender === 'ai' && (
                             <Avatar className="h-6 w-6">
                                <AvatarImage src="https://picsum.photos/seed/aiseller/40/40" />
                                <AvatarFallback>L</AvatarFallback>
                            </Avatar>
                         )}
                        <div
                        className={cn(
                            'rounded-lg px-3 py-2 shadow-sm',
                            msg.sender === 'user'
                            ? 'rounded-br-none bg-primary text-primary-foreground'
                            : 'rounded-bl-none bg-background'
                        )}
                        >
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex max-w-[80%] items-end mr-auto flex-row gap-2">
                         <Avatar className="h-6 w-6">
                            <AvatarImage src="https://picsum.photos/seed/aiseller/40/40" />
                            <AvatarFallback>L</AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg rounded-bl-none bg-background px-3 py-2 shadow-sm">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>

        {/* Input */}
        <footer className="p-4 bg-background border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={product ? "Digite sua mensagem..." : "Selecione um produto para começar"}
                disabled={loading || !product}
                autoComplete="off"
                className="flex-1 rounded-full bg-muted focus-visible:ring-offset-0 focus-visible:ring-1"
                />
                <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-full bg-primary h-10 w-10">
                <Send className="h-5 w-5" />
                </Button>
            </form>
        </footer>
    </div>
  );
};

export default function SellerChatPage() {
  return (
    <Suspense fallback={<div>Carregando chat...</div>}>
      <SellerChatContent />
    </Suspense>
  );
}
