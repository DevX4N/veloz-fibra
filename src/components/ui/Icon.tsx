import {
  Activity, Bell, Briefcase, Building2, Cable, Calendar, CircleCheck, CircleHelp, CircleX, Clock,
  CreditCard, Download, FileText, Film, Gamepad2, Gauge, Globe, HardDrive, Headphones, House, Info,
  LayoutDashboard, LayoutGrid, LifeBuoy, Lightbulb, Lock, Mail, Map, MapPin, MessageCircle, Monitor,
  Network, Phone, Plug, Receipt, RefreshCw, Router, Server, Shield, ShieldCheck, Smartphone, Sparkles,
  Speaker, Tablet, Timer, TriangleAlert, Tv, Upload, User, Users, Video, Wifi, WifiOff, Wrench, Zap,
  Laptop, Award, TrendingUp, Cpu, Signal, Rocket, Heart, Store, Stethoscope, Settings, QrCode,
  Barcode, History, Unplug, Power, Radio, type LucideProps,
} from "lucide-react";

/**
 * Registro único de ícones (Lucide). Dados centralizados referenciam ícones por nome,
 * mantendo traço, tamanho e estilo consistentes em toda a interface.
 */
const registry = {
  activity: Activity, bell: Bell, briefcase: Briefcase, building: Building2, cable: Cable,
  calendar: Calendar, check: CircleCheck, help: CircleHelp, x: CircleX, clock: Clock,
  card: CreditCard, download: Download, "file-text": FileText, film: Film, gamepad: Gamepad2,
  gauge: Gauge, globe: Globe, drive: HardDrive, headphones: Headphones, home: House, info: Info,
  layout: LayoutDashboard, grid: LayoutGrid, "life-buoy": LifeBuoy, bulb: Lightbulb, lock: Lock,
  mail: Mail, map: Map, "map-pin": MapPin, message: MessageCircle, monitor: Monitor,
  network: Network, phone: Phone, plug: Plug, receipt: Receipt, refresh: RefreshCw, router: Router,
  server: Server, shield: Shield, "shield-check": ShieldCheck, smartphone: Smartphone,
  sparkles: Sparkles, speaker: Speaker, tablet: Tablet, timer: Timer, alert: TriangleAlert, tv: Tv,
  upload: Upload, user: User, users: Users, video: Video, wifi: Wifi, "wifi-off": WifiOff,
  wrench: Wrench, zap: Zap, laptop: Laptop, award: Award, trending: TrendingUp, cpu: Cpu,
  signal: Signal, rocket: Rocket, heart: Heart, store: Store, stethoscope: Stethoscope,
  settings: Settings, qr: QrCode, barcode: Barcode, history: History, unplug: Unplug, power: Power,
  radio: Radio,
} as const;

export type IconName = keyof typeof registry;

export function Icon({ name, size = 20, strokeWidth = 1.75, ...rest }: { name: IconName } & LucideProps) {
  const Cmp = registry[name];
  return <Cmp size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...rest} />;
}

/** Ícones de marcas sociais (removidos do Lucide 1.x) desenhados no mesmo traço. */
export function SocialIcon({ name, size = 20 }: { name: "instagram" | "facebook" | "linkedin"; size?: number }) {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "instagram")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  if (name === "facebook")
    return (
      <svg {...common}>
        <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h3.5v-7.5H14l.6-3.5h-3.1V8a1 1 0 0 1 1-1H15z" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 7.5v.01M12 16v-3.2a2.3 2.3 0 0 1 4.6 0V16M12 10.5V16" />
    </svg>
  );
}
