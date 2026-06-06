import Link from 'next/link';
import { Store } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Store className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold tracking-tight">
        Empreenda<span className="text-primary">+</span>
      </span>
    </Link>
  );
}