import { ICONS } from '../constants/icons.js';

const FEEDBACK_DATA = [
  { id: 'helpful', label: 'Helpful', iconKey: 'ThumbsUp' },
  { id: 'wrong', label: 'Wrong', iconKey: 'ThumbsDown' },
  { id: 'incomplete', label: 'Incomplete', iconKey: 'CircleAlert' },
  { id: 'outdated', label: 'Outdated', iconKey: 'History' },
];

export const FEEDBACK_OPTIONS = FEEDBACK_DATA.map((opt) => ({
  ...opt,
  icon: ICONS[opt.iconKey],
}));
