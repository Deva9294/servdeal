import {
  Snowflake, Zap, Droplets, Sparkles, Bug, Car, Sparkle, Bike,
  WashingMachine, Paintbrush, Hammer, Cctv, Droplet, Truck, Laptop, Smartphone,
  Home, Wrench, Refrigerator, Cpu, HardHat, Shield, Camera, Package,
  GraduationCap, Heart, Monitor, FileText, Sun, TreePine, Plug, CircleDot,
  Bath, Scissors, ChefHat, Landmark, Flame, Pickaxe, Wifi, CloudRain,
  Palette, Activity, TrendingUp, UtensilsCrossed, PartyPopper, Recycle,
  Pencil, Lock, Sofa, Battery, Fan, Printer, Dog, Shirt, PenTool, Scale,
  PanelsTopLeft, Grid3x3, Layers, CookingPot, Sprout, Tractor, Siren,
  Briefcase, Building2, LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const icons: Record<string, LucideIcon> = {
  Snowflake, Zap, Droplets, Sparkles, Bug, Car, Sparkle, Bike,
  WashingMachine, Paintbrush, Hammer, Cctv, Droplet, Truck, Laptop, Smartphone,
  Home, Wrench, Refrigerator, Cpu, HardHat, Shield, Camera, Package,
  GraduationCap, Heart, Monitor, FileText, Sun, TreePine, Plug, CircleDot,
  Bath, Scissors, ChefHat, Landmark, Flame, Pickaxe, Wifi, CloudRain,
  Palette, Activity, TrendingUp, UtensilsCrossed, PartyPopper, Recycle,
  Pencil, Lock, Sofa, Battery, Fan, Printer, Dog, Shirt, PenTool, Scale,
  PanelsTopLeft, Grid3x3, Layers, CookingPot, Sprout, Tractor, Siren,
  Briefcase, Building2,
};

export function ServiceIcon({
  name,
  className,
  iconClassName,
}: {
  name: string;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = icons[name] || Sparkles;
  return (
    <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl', className)}>
      <Icon className={cn('h-7 w-7', iconClassName)} />
    </div>
  );
}
