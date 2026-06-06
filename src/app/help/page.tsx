'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  smartFAQChatbot,
  SmartFAQChatbotOutput,
} from '@/ai/flows/smart-faq-chatbot';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqData = `
P: Como posso me tornar um vendedor?
R: Para se tornar um vendedor, clique em "Seja um Vendedor" no topo da página e preencha o formulário de cadastro. Você precisará do seu CNPJ MEI.

P: Quais são as taxas para vender na plataforma?
R: Cobramos uma pequena taxa de 5% sobre cada venda realizada, uma das menores do mercado, para cobrir os custos de operação e reinvestir na plataforma.

P: Como funciona a entrega dos produtos?
R: A entrega é de responsabilidade do vendedor. Oferecemos integração com os Correios e outras transportadoras para facilitar o cálculo do frete e o envio.

P: Como posso pagar minhas compras?
R: Aceitamos cartão de crédito, PIX e boleto bancário. Todas as transações são processadas de forma segura.

P: O que são EcoCoins?
R: EcoCoins são pontos que você ganha ao realizar certas ações na plataforma, como comprar, vender e avaliar produtos. Eles podem ser trocados por descontos e outros benefícios.
`;

export default function HelpPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmartFAQChatbotOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await smartFAQChatbot({ query, faq: faqData });
      setResult(response);
    } catch (err) {
      setError('Desculpe, não consegui encontrar uma resposta. Tente reformular sua pergunta.');
      toast({
        title: 'Erro no Chatbot',
        description: 'Não foi possível obter uma resposta da IA.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-5xl">Central de Ajuda</h1>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-muted-foreground">
          Tem alguma dúvida? Encontre respostas aqui ou fale com nosso
          assistente virtual.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-headline text-3xl">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Como posso me tornar um vendedor?</AccordionTrigger>
              <AccordionContent>
                Para se tornar um vendedor, clique em "Seja um Vendedor" no topo
                da página e preencha o formulário de cadastro. Você precisará do
                seu CNPJ MEI.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Quais são as taxas para vender na plataforma?
              </AccordionTrigger>
              <AccordionContent>
                Cobramos uma pequena taxa de 5% sobre cada venda realizada, uma
                das menores do mercado, para cobrir os custos de operação e
                reinvestir na plataforma.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Como funciona a entrega dos produtos?
              </AccordionTrigger>
              <AccordionContent>
                A entrega é de responsabilidade do vendedor. Oferecemos
                integração com os Correios e outras transportadoras para
                facilitar o cálculo do frete e o envio.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>
                Como posso pagar minhas compras?
              </AccordionTrigger>
              <AccordionContent>
                Aceitamos cartão de crédito, PIX e boleto bancário. Todas as transações são processadas de forma segura.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>
                O que são EcoCoins?
              </AccordionTrigger>
              <AccordionContent>
                EcoCoins são pontos que você ganha ao realizar certas ações na plataforma, como comprar, vender e avaliar produtos. Eles podem ser trocados por descontos e outros benefícios.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">
              Assistente Virtual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChatSubmit} className="flex flex-col gap-4">
              <Textarea
                placeholder="Digite sua pergunta aqui..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Pensando...' : 'Perguntar à IA'}
              </Button>
            </form>
            {result && (
              <div className="mt-6 rounded-md border bg-background p-4">
                <p className="font-semibold">Resposta:</p>
                <p>{result.answer}</p>
              </div>
            )}
             {error && (
              <div className="mt-6 rounded-md border border-destructive bg-destructive/10 p-4">
                <p className="font-semibold text-destructive">Erro:</p>
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
