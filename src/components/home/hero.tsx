import {
  CircuitBoard,
  FileText,
  MessageCircle,
  ShieldCheck,
  Store,
  Truck,
  Wrench,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";
import { LogoMark } from "@/components/layout/logo";

export function Hero() {
  return (
    <section className="brand-glow circuit-grid relative overflow-hidden bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-28">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-surface/80 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden />
            Robotics · Electronics · Intelligent Systems
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Build the Future with Robotics and{" "}
            <span className="text-brand-300">Intelligent Systems</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-muted">
            Discover robotics kits, electronic components, IoT devices and embedded
            systems for students, engineers, institutions and innovators.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop/electronic-components" size="lg">
              Shop Components
            </ButtonLink>
            <ButtonLink href="/shop/robotics-kits" size="lg" variant="inverted">
              Explore Robotics Kits
            </ButtonLink>
            <ButtonLink
              href="/quote"
              size="lg"
              variant="outline"
              className="border-ink-border text-ink-foreground hover:border-brand-500 hover:bg-ink-surface"
            >
              Request a Custom Solution
            </ButtonLink>
          </div>
        </div>
        <div className="hidden justify-center lg:flex" aria-hidden>
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-brand-500/10 blur-3xl" />
            <LogoMark size={200} className="relative drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

const trustItems = [
  { icon: Truck, label: "Nationwide delivery", detail: "Across Zimbabwe" },
  { icon: ShieldCheck, label: "Secure payment options", detail: "Confirmed at checkout" },
  { icon: Wrench, label: "Technical product support", detail: "From real engineers" },
  { icon: Store, label: "Store collection", detail: "Park City Village Mall, Harare" },
  { icon: FileText, label: "Institutional quotations", detail: "Schools, industry & government" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="border-b border-border bg-surface">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
        {trustItems.map(({ icon: Icon, label, detail }) => (
          <li key={label} className="flex items-start gap-3">
            <Icon size={20} aria-hidden className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium leading-tight">{label}</p>
              <p className="mt-0.5 text-xs text-muted">{detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="brand-glow circuit-grid bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center">
        <CircuitBoard size={36} aria-hidden className="text-brand-300" />
        <h2 className="text-3xl font-semibold sm:text-4xl">Have an idea? Let&apos;s engineer it.</h2>
        <p className="max-w-xl text-ink-muted">
          From a single prototype to a full institutional rollout — talk to our
          engineering team about what you want to build.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/quote" size="lg">
            Request a Quote
          </ButtonLink>
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-base font-medium text-ink transition-colors hover:bg-white/90"
          >
            <MessageCircle size={18} aria-hidden />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
