import {
  LayoutDashboard,
  FileStack,
  MessageSquareText,
  ClipboardList,
  ShieldCheck,
  Factory,
  Boxes,
  HardHat,
  Inbox,
  ThumbsUp,
  ThumbsDown,
  CircleAlert,
  History,
} from 'lucide-react';

export const ICONS = {
  LayoutDashboard,
  FileStack,
  MessageSquareText,
  ClipboardList,
  ShieldCheck,
  Factory,
  Boxes,
  HardHat,
  Inbox,
  ThumbsUp,
  ThumbsDown,
  CircleAlert,
  History,
};

export function getIcon(name) {
  return ICONS[name];
}
