/** All valid application pipeline statuses. */
export const APPLICATION_STATUSES = [
  'Applied',
  'Screening',
  'Interview',
  'Technical',
  'HR Round',
  'Offer',
  'Rejected',
  'Withdrawn',
];

/** Job platforms where applications are submitted. */
export const PLATFORMS = [
  'LinkedIn',
  'Indeed',
  'Naukri',
  'Glassdoor',
  'Company Website',
  'Referral',
  'Internshala',
  'AngelList',
  'Other',
];

/** Work arrangement options. */
export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];

/** Status to color token mapping for badge rendering. */
export const STATUS_COLORS = {
  Applied:    'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  Screening:  'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  Interview:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  Technical:  'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
  'HR Round': 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
  Offer:      'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  Rejected:   'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  Withdrawn:  'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400',
};
