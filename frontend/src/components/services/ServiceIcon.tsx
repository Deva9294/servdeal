import {
  Snowflake, Zap, Droplets, Sparkles, Bug, Car, Sparkle, Bike,
  WashingMachine, Paintbrush, Hammer, Cctv, Droplet, Truck, Laptop, Smartphone,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const icons: Record<string, LucideIcon> = {
  Snowflake, Zap, Droplets, Sparkles, Bug, Car, Sparkle, Bike,
  WashingMachine, Paintbrush, Hammer, Cctv, Droplet, Truck, Laptop, Smartphone,
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
