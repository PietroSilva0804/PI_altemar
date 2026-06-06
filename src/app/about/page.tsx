import Image from 'next/image';
import { Building, Target, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-5xl">
          Sobre o Empreenda<span className="text-primary">+</span>
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          Nossa missão é fortalecer o microempreendedor individual, criando um
          ecossistema de comércio justo, crescimento sustentável e colaboração.
        </p>
      </header>

      <div className="relative mb-16 h-80 w-full overflow-hidden rounded-lg shadow-lg md:h-[450px]">
        <Image
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
          alt="Equipe Empreenda+ colaborando"
          fill
          className="object-cover"
          data-ai-hint="team collaboration"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card>
          <CardHeader className="items-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="pt-4 font-headline text-2xl">
              Nossa História
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            O Empreenda+ nasceu da vontade de criar uma vitrine digital para o
            talento de milhões de MEIs no Brasil. Acreditamos no poder do
            pequeno negócio para transformar a economia e a vida das pessoas.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="items-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="pt-4 font-headline text-2xl">
              Nossa Missão
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Empoderar microempreendedores, oferecendo uma plataforma com taxas
            justas, ferramentas de gestão e uma comunidade de apoio,
            incentivando o consumo consciente e a economia local.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="items-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="pt-4 font-headline text-2xl">
              Nossos Valores
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Colaboração, sustentabilidade, transparência e inovação são os
            pilares que guiam cada uma de nossas decisões e funcionalidades na
            plataforma.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
