import { Landmark, ShoppingCart, Send, MessageSquare, Layers, type LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { ServiceDefinition } from '@/data/services';

const ICONS: Record<ServiceDefinition['icon'], LucideIcon> = {
  landmark: Landmark,
  'shopping-cart': ShoppingCart,
  send: Send,
  'message-square': MessageSquare,
  layers: Layers,
};

export function ServiceIcon({
  icon,
  className,
  style,
}: {
  icon: ServiceDefinition['icon'];
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = ICONS[icon];
  return <Icon className={className} style={style} />;
}
