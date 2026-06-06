
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck } from 'lucide-react';
import emailjs from '@emailjs/browser';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Por favor, insira um email válido.'),
  title: z.string().min(5, 'O assunto deve ter pelo menos 5 caracteres.'),
  message: z
    .string()
    .min(10, 'A mensagem deve ter pelo menos 10 caracteres.')
    .max(500, 'A mensagem não pode exceder 500 caracteres.'),
});

export default function SupportPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      title: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const serviceId = 'service_klyyljp';
    const templateId = 'template_grtlgsv';
    const publicKey = 'QEo6lBYCTv6QUZPuC';

    const currentDate = new Date().toLocaleDateString('pt-BR');

    const templateParams = {
      name: values.name,
      email: values.email,
      title: values.title,
      message: values.message,
      date: currentDate,
      reply_to: values.email,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      toast({
        title: 'Mensagem Enviada!',
        description: 'Obrigado pelo seu contato! Responderemos em breve.',
      });
      form.reset();
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: 'Erro ao Enviar Mensagem',
        description: 'Não foi possível enviar sua mensagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <MailCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
          <CardTitle className="font-headline text-3xl">
            Entre em Contato
          </CardTitle>
          <CardDescription>
            Tem alguma dúvida ou sugestão? Preencha o formulário abaixo e nossa
            equipe entrará em contato.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Sobre o que você quer falar?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sua Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite sua mensagem aqui..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
