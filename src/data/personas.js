import { ICONS } from '../constants/icons.js';

const PERSONA_DATA = [
  {
    id: 'quality_manager',
    label: 'Maria — Quality Manager',
    iconKey: 'ShieldCheck',
    need: 'Keep procedures accurate and audit-ready',
    dept: 'Quality',
  },
  {
    id: 'supervisor',
    label: 'James — Production Supervisor',
    iconKey: 'Factory',
    need: 'Get answers during production without stopping the line',
    dept: 'Production',
  },
  {
    id: 'supplier_engineer',
    label: 'Anika — Supplier Quality Engineer',
    iconKey: 'Boxes',
    need: 'Review defects and start corrective actions',
    dept: 'Supply Chain',
  },
  {
    id: 'operator',
    label: 'Carlos — Operator / Inspector',
    iconKey: 'HardHat',
    need: 'Follow the correct, current work instruction',
    dept: 'Production',
  },
];

export const PERSONAS = PERSONA_DATA.map((p) => ({
  ...p,
  icon: ICONS[p.iconKey],
}));
