
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Slider } from '@/components/ui/slider';
import { Moon, Sun, Languages, Palette, Accessibility, LogOut, Loader2, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { updateUserPreference, getUserPreferences, UserPreferences } from '@/lib/user-preferences';
import { cn } from '@/lib/utils';

const languages = [
  { id: 'pt-BR', label: 'Português (Brasil)', desc: 'Português do Brasil', flagClass: 'bg-gradient-to-r from-[#009c3b] via-[#ffdf00] to-[#002776]' },
  { id: 'en-US', label: 'English (US)', desc: 'US English', flagClass: 'bg-gradient-to-b from-[#b22234] via-white to-[#b22234]' },
  { id: 'es-ES', label: 'Español (España)', desc: 'Español de España', flagClass: 'bg-gradient-to-b from-[#ad1519] via-[#f1bf00] to-[#ad1519]' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout, isLoggedIn } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'pt-BR',
    region: 'BR',
    fontSize: 16,
    highContrast: false,
  });

  useEffect(() => {
    async function loadPrefs() {
      if (isLoggedIn && user) {
        const prefs = await getUserPreferences(user.uid);
        setPreferences(prefs);
        applyVisualPrefs(prefs);
      } else {
        const localPrefs = localStorage.getItem('user-prefs');
        if (localPrefs) {
          const parsed = JSON.parse(localPrefs);
          setPreferences(parsed);
          applyVisualPrefs(parsed);
        }
      }
      setLoading(false);
    }
    loadPrefs();
  }, [isLoggedIn, user]);

  const applyVisualPrefs = (prefs: UserPreferences) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${prefs.fontSize}px`;
      document.body.classList.toggle('high-contrast', prefs.highContrast);
    }
  };

  const handleUpdate = async (updates: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);
    applyVisualPrefs(newPrefs);

    if (updates.language) {
        setSaving(true);
    }

    if (isLoggedIn && user) {
      try {
        await updateUserPreference(user.uid, updates);
        if (updates.language) {
            toast({ title: "Sucesso", description: "Preferências atualizadas na sua conta." });
        }
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível sincronizar.", variant: "destructive" });
      }
    } else {
      localStorage.setItem('user-prefs', JSON.stringify(newPrefs));
      if (updates.language) {
        toast({ title: "Salvo localmente", description: "Faça login para sincronizar suas preferências." });
      }
    }
    setSaving(false);
  };

  if (loading) {
    return (
        <div className="container flex h-[60vh] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <header className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-emerald-600 p-8 text-white shadow-lg">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Configurações</h1>
        <p className="mt-2 text-lg opacity-90">
          Personalize sua experiência no Empreenda+.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Language Selection */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
               <Languages className="h-6 w-6 text-primary" />
               <CardTitle>Idioma e Região</CardTitle>
            </div>
            <CardDescription>
              Escolha o idioma e a região da sua preferência.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  onClick={() => handleUpdate({ language: lang.id })}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all hover:scale-[1.02] hover:shadow-md",
                    preferences.language === lang.id 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className={cn("h-6 w-10 shrink-0 rounded-sm shadow-sm", lang.flagClass)} />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-sm truncate">{lang.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{lang.desc}</p>
                  </div>
                  {preferences.language === lang.id && (
                    <div className="absolute top-2 right-2 rounded-full bg-primary p-0.5">
                        <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {saving && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando preferências...
                </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance & Theme */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
               <Palette className="h-6 w-6 text-primary" />
               <CardTitle>Aparência</CardTitle>
            </div>
            <CardDescription>
              Personalize o visual da plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Tema do Sistema</Label>
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                <Button
                  variant={theme === 'light' ? 'default' : 'ghost'}
                  onClick={() => setTheme('light')}
                  className="flex justify-center gap-2"
                >
                  <Sun className="h-4 w-4" /> Claro
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'ghost'}
                  onClick={() => setTheme('dark')}
                  className="flex justify-center gap-2"
                >
                  <Moon className="h-4 w-4" /> Escuro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
           <CardHeader>
             <div className="flex items-center gap-3">
                <Accessibility className="h-6 w-6 text-primary" />
                <CardTitle>Acessibilidade</CardTitle>
             </div>
            <CardDescription>
              Ajuste para melhor legibilidade.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <Label htmlFor="font-size">Tamanho do Texto</Label>
                <span>{preferences.fontSize}px</span>
              </div>
              <Slider
                id="font-size"
                min={14}
                max={20}
                step={1}
                value={[preferences.fontSize]}
                onValueChange={(val) => handleUpdate({ fontSize: val[0] })}
              />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">Alto Contraste</Label>
                <p className="text-xs text-muted-foreground">
                  Cores mais fortes para melhor visão.
                </p>
              </div>
              <Switch 
                id="high-contrast" 
                checked={preferences.highContrast}
                onCheckedChange={(val) => handleUpdate({ highContrast: val })}
              />
            </div>
          </CardContent>
        </Card>

         {/* Account Security */}
         {isLoggedIn && (
            <Card className="md:col-span-2 border-destructive/20 bg-destructive/5">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <LogOut className="h-6 w-6 text-destructive" />
                    <CardTitle className="text-destructive">Conta e Segurança</CardTitle>
                </div>
                <CardDescription>
                Gerencie sua sessão e segurança.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive" className="shadow-sm">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair da Conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deseja encerrar sua sessão?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Você precisará fazer login novamente para acessar seus dados e preferências sincronizadas.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={logout} className="bg-destructive hover:bg-destructive/90">Confirmar Saída</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardContent>
            </Card>
         )}
      </div>
    </div>
  );
}
