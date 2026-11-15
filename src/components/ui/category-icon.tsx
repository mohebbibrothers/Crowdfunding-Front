import {
  BookOpen,
  Briefcase,
  Droplets,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Home,
  Stethoscope,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

/**
 * نگاشت نام آیکون قرارداد (`icon_name`) به آیکون lucide.
 * چرا نگاشت دستی و نه import پویا: باندل کوچک می‌ماند و نام ناشناخته هم
 * به‌جای شکستن صفحه، آیکون پیش‌فرض می‌گیرد.
 */
const ICONS: Record<string, LucideIcon> = {
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  "hand-heart": HandHeart,
  home: Home,
  utensils: Utensils,
  stethoscope: Stethoscope,
  "book-open": BookOpen,
  droplet: Droplets,
  users: Users,
  briefcase: Briefcase,
  droplets: Droplets,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string | null | undefined;
  className?: string;
}) {
  const Icon = (name ? ICONS[name] : undefined) ?? HandHeart;
  return <Icon className={cn("size-5", className)} aria-hidden />;
}
