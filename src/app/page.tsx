import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main
      id="conteudo"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-4 py-16 sm:px-6"
    >
      <p className="text-muted-foreground text-sm font-medium">
        Base técnica pronta
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
        SaaS Template
      </h1>
      <p className="text-muted-foreground max-w-prose text-base sm:text-lg">
        Next.js, PostgreSQL e Docker configurados. Os fluxos do produto estão
        registrados em <code className="font-mono text-sm">PRODUCT.md</code> e
        serão implementados um por vez.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/api/health" className={cn(buttonVariants({ size: "lg" }))}>
          <Activity data-icon="inline-start" aria-hidden="true" />
          Status da aplicação
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
