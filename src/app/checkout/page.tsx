import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Landmark, QrCode } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="container py-8 md:py-12">
       <header className="mb-8 text-center">
        <h1 className="font-headline text-5xl">Finalizar Compra</h1>
      </header>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Shipping and Payment Forms */}
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input id="cep" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input id="address" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input id="complement" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup defaultValue="card" className="space-y-4">
                        <Label htmlFor="payment-card" className="flex items-center gap-4 rounded-md border p-4 hover:bg-accent/10 has-[[data-state=checked]]:border-primary">
                            <CreditCard className="h-6 w-6"/>
                            <div className="flex-1">
                                <p className="font-semibold">Cartão de Crédito</p>
                                <p className="text-sm text-muted-foreground">Pague em até 12x</p>
                            </div>
                            <RadioGroupItem value="card" id="payment-card"/>
                        </Label>
                         <Label htmlFor="payment-pix" className="flex items-center gap-4 rounded-md border p-4 hover:bg-accent/10 has-[[data-state=checked]]:border-primary">
                            <QrCode className="h-6 w-6"/>
                             <div className="flex-1">
                                <p className="font-semibold">PIX</p>
                                <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                            </div>
                            <RadioGroupItem value="pix" id="payment-pix"/>
                        </Label>
                         <Label htmlFor="payment-boleto" className="flex items-center gap-4 rounded-md border p-4 hover:bg-accent/10 has-[[data-state=checked]]:border-primary">
                            <Landmark className="h-6 w-6"/>
                             <div className="flex-1">
                                <p className="font-semibold">Boleto Bancário</p>
                                <p className="text-sm text-muted-foreground">Confirmação em até 3 dias úteis</p>
                            </div>
                            <RadioGroupItem value="boleto" id="payment-boleto"/>
                        </Label>
                    </RadioGroup>
                </CardContent>
            </Card>
        </div>

        {/* Order Summary */}
        <aside>
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex justify-between"><span>Caneca de Cerâmica</span> <span>R$ 49,90</span></li>
                        <li className="flex justify-between"><span>Mel Orgânico</span> <span>R$ 35,00</span></li>
                        <li className="flex justify-between"><span>Camiseta "Empreenda"</span> <span>R$ 79,90</span></li>
                    </ul>
                    <hr className="my-4"/>
                    <div className="space-y-2">
                        <div className="flex justify-between"><span>Subtotal</span> <span>R$ 164,80</span></div>
                        <div className="flex justify-between"><span>Frete</span> <span>R$ 15,00</span></div>
                        <div className="flex justify-between font-bold text-lg text-foreground"><span>Total</span> <span>R$ 179,80</span></div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button size="lg" className="w-full">Pagar e Finalizar Pedido</Button>
                </CardFooter>
            </Card>
        </aside>
      </div>
    </div>
  );
}
