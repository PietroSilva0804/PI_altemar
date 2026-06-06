import { Medal, Trophy, Gem, HeartHandshake, ShoppingBag, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const achievements = [
  { icon: Gem, title: 'Primeiro Passo', description: 'Realizou sua primeira compra de um microempreendedor.', achieved: true },
  { icon: ShoppingBag, title: 'Cliente Fiel', description: 'Fez 5 ou mais compras para apoiar negócios locais.', achieved: true },
  { icon: HeartHandshake, title: 'Apoiador de Sonhos', description: 'Comprou de 3 categorias diferentes de microempreendedores.', achieved: false },
  { icon: Medal, title: 'Guia da Comunidade', description: 'Contribuiu com 10 ou mais avaliações detalhadas para ajudar outros.', achieved: true },
  { icon: Users, title: 'Embaixador Local', description: 'Convidou 3 novos amigos para conhecerem a plataforma.', achieved: false },
  { icon: Trophy, title: 'Mestre do Desconto', description: 'Economizou usando 5 cupons exclusivos de parceiros.', achieved: false },
];

const leaderboard = [
    { rank: 1, name: 'Ana Silva', ecoCoins: 12500, avatar: 'https://picsum.photos/seed/leader1/40/40' },
    { rank: 2, name: 'Bruno Costa', ecoCoins: 11800, avatar: 'https://picsum.photos/seed/leader2/40/40' },
    { rank: 3, name: 'Carla Dias', ecoCoins: 10500, avatar: 'https://picsum.photos/seed/leader3/40/40' },
    { rank: 4, name: 'Daniel Alves', ecoCoins: 9800, avatar: 'https://picsum.photos/seed/leader4/40/40' },
    { rank: 5, name: 'Você', ecoCoins: 1250, avatar: 'https://picsum.photos/seed/currentuser/40/40', isCurrentUser: true },
];

export default function GamificationPage() {
  const userEcoCoins = 1250;
  const nextLevelCoins = 2000;
  const progress = (userEcoCoins / nextLevelCoins) * 100;

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-5xl">Sua Jornada de <span className="text-primary">Impacto</span></h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Apoie microempreendedores, ganhe EcoCoins e ajude a economia local a crescer!
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content: Achievements and Leaderboard */}
        <main className="lg:col-span-2 space-y-8">
            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Trophy className="text-accent" />
                        Minhas Conquistas como Comprador
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((ach, i) => (
                        <div key={i} className={`flex items-center gap-4 rounded-lg border p-4 ${ach.achieved ? 'bg-card' : 'bg-muted/50'}`}>
                            <ach.icon className={`h-8 w-8 shrink-0 ${ach.achieved ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div>
                                <p className="font-semibold">{ach.title}</p>
                                <p className="text-xs text-muted-foreground">{ach.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

             {/* Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Ranking de Apoiadores</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {leaderboard.map(user => (
                            <li key={user.rank} className={`flex items-center gap-4 rounded-lg p-3 ${user.isCurrentUser ? 'bg-primary/10 border border-primary' : ''}`}>
                                <span className="text-lg font-bold w-6 text-center">{user.rank}</span>
                                <Avatar>
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold flex-1">{user.name}</p>
                                <div className="flex items-center gap-2 font-bold text-primary">
                                    <Medal className="h-5 w-5"/>
                                    <span>{user.ecoCoins.toLocaleString('pt-BR')}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </main>
        
        {/* Sidebar: EcoCoins and Progress */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <Card className="text-center bg-gradient-to-br from-primary to-orange-500 text-primary-foreground">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Seus EcoCoins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-2">
                  <Medal className="h-16 w-16" />
                  <p className="text-6xl font-bold">{userEcoCoins.toLocaleString('pt-BR')}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Próximo Nível</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={progress} className="w-full" />
                    <p className="mt-2 text-sm text-center text-muted-foreground">
                        Faltam { (nextLevelCoins - userEcoCoins).toLocaleString('pt-BR') } EcoCoins para você se tornar um Super Apoiador!
                    </p>
                </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
