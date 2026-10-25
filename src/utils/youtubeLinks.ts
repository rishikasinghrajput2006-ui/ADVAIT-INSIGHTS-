/**
 * Verified YouTube URLs and canonical deep links.
 * Fixes YouTube 404 errors caused by:
 * 1. Missing 'www.' in domain
 * 2. Unofficial query parameters ('?si=...') on channel handles triggering YouTube mobile app routing bugs
 * 3. Broken direct video IDs
 * 4. Using canonical immutable channel ID 'UCaEO5yq1mT50Tv76XAAhUcg' for Advait Insights
 */

export const ADVAIT_INSIGHTS_CHANNEL_URL = 'https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg';
export const ADVAIT_INSIGHTS_HANDLE_URL = 'https://www.youtube.com/@AdvaitInsights_AI';

export const TEACHER_CHANNELS: Record<string, { name: string; url: string; handle: string; badge: string }> = {
  math: {
    name: 'Advait Insights (Sir)',
    url: ADVAIT_INSIGHTS_CHANNEL_URL,
    handle: '@AdvaitInsights_AI',
    badge: '👑 Official Dedicated Faculty: Advait Insights',
  },
  science: {
    name: 'Physics Wallah (Alakh Pandey Sir & PW Foundation)',
    url: 'https://www.youtube.com/@PhysicsWallahFoundation',
    handle: '@PhysicsWallahFoundation',
    badge: '🎓 Top Recommended Faculty: Physics Wallah Foundation',
  },
  social: {
    name: 'Digraj Singh Rajput Sir (Social School)',
    url: 'https://www.youtube.com/@DigrajSinghRajput24',
    handle: '@DigrajSinghRajput24',
    badge: '🌍 India\'s #1 SST Educator: Digraj Singh Rajput Sir',
  },
  english: {
    name: 'Dear Sir',
    url: 'https://www.youtube.com/@DearSir',
    handle: '@DearSir',
    badge: '📖 Premier English Faculty: Dear Sir',
  },
};

export const getTeacherChannelUrl = (subjectId?: string): string => {
  if (!subjectId) return ADVAIT_INSIGHTS_CHANNEL_URL;
  return TEACHER_CHANNELS[subjectId]?.url || ADVAIT_INSIGHTS_CHANNEL_URL;
};

export const getTeacherChannelHandle = (subjectId?: string): string => {
  if (!subjectId) return '@AdvaitInsights_AI';
  return TEACHER_CHANNELS[subjectId]?.handle || '@AdvaitInsights_AI';
};

export const getChapterYouTubeSearchUrl = (chapterTitle: string, grade: string, subjectId: string): string => {
  const gradeLabel = grade === 'class10' ? 'Class 10' : 'Class 9';
  let teacher = 'Advait Insights';
  if (subjectId === 'science') teacher = 'Physics Wallah Foundation';
  else if (subjectId === 'social') teacher = 'Digraj Singh Rajput';
  else if (subjectId === 'english') teacher = 'Dear Sir';

  const query = `${teacher} ${gradeLabel} ${chapterTitle} NCERT`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

export const getSubjectPlaylistSearchUrl = (subjectName: string, grade: string): string => {
  const gradeLabel = grade === 'class10' ? 'Class 10' : 'Class 9';
  const query = `Advait Insights ${gradeLabel} ${subjectName} full playlist`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};
