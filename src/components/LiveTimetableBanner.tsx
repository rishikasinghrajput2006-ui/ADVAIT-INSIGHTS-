import React, { useState, useEffect } from 'react';

export interface TimetableSlot {
  day: string;
  dayIndex: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  time: string;
  timeISTHour24: number;
  timeISTMinute: number;
  class9: string | null;
  class9Sub?: string;
  class10: string | null;
  class10Sub?: string;
  specialEvent: string | null;
}

export const TIMETABLE_DATA: TimetableSlot[] = [
  {
    day: 'MONDAY',
    dayIndex: 1,
    time: '6:00 pm',
    timeISTHour24: 18,
    timeISTMinute: 0,
    class9: 'Live Doubt Session',
    class10: null,
    specialEvent: null,
  },
  {
    day: 'TUESDAY',
    dayIndex: 2,
    time: '7:00 pm',
    timeISTHour24: 19,
    timeISTMinute: 0,
    class9: null,
    class10: 'Live Doubt Session',
    specialEvent: null,
  },
  {
    day: 'WEDNESDAY',
    dayIndex: 3,
    time: '6:00 pm',
    timeISTHour24: 18,
    timeISTMinute: 0,
    class9: 'Live Doubt Session',
    class10: null,
    specialEvent: null,
  },
  {
    day: 'THURSDAY',
    dayIndex: 4,
    time: '7:00 pm',
    timeISTHour24: 19,
    timeISTMinute: 0,
    class9: null,
    class10: 'Live Doubt Session',
    specialEvent: null,
  },
  {
    day: 'FRIDAY',
    dayIndex: 5,
    time: '6:00 pm',
    timeISTHour24: 18,
    timeISTMinute: 0,
    class9: 'Live Chapters',
    class9Sub: 'One-Shot / questions / revision',
    class10: null,
    specialEvent: null,
  },
  {
    day: 'SATURDAY',
    dayIndex: 6,
    time: '7:00 pm',
    timeISTHour24: 19,
    timeISTMinute: 0,
    class9: null,
    class10: 'Live Chapters',
    class10Sub: 'One-Shot / questions / revision',
    specialEvent: null,
  },
  {
    day: 'SUNDAY',
    dayIndex: 0,
    time: '8:00 pm',
    timeISTHour24: 20,
    timeISTMinute: 0,
    class9: null,
    class10: null,
    specialEvent: '8:00 pm: Game ✨',
  },
];

interface LiveTimetableBannerProps {
  onOpenAIGuru?: () => void;
  onOpenLiveClass?: () => void;
}

export const LiveTimetableBanner: React.FC<LiveTimetableBannerProps> = ({ onOpenAIGuru, onOpenLiveClass }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [currentISTDay, setCurrentISTDay] = useState<number>(1);
  const [currentISTTimeStr, setCurrentISTTimeStr] = useState<string>('');
  const [nextSessionLabel, setNextSessionLabel] = useState<string>('Live Session Starting Soon');

  // Calculate IST day and active/upcoming session
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const istFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
        const istParts = istFormatter.formatToParts(now);
        const weekdayStr = istParts.find((p) => p.type === 'weekday')?.value || 'Mon';
        const dayMap: Record<string, number> = {
          Sun: 0,
          Mon: 1,
          Tue: 2,
          Wed: 3,
          Thu: 4,
          Fri: 5,
          Sat: 6,
        };
        const currentDayIndex = dayMap[weekdayStr] ?? 1;
        setCurrentISTDay(currentDayIndex);
        setCurrentISTTimeStr(istFormatter.format(now) + ' IST');

        // Find today's session
        const todaySlot = TIMETABLE_DATA.find((s) => s.dayIndex === currentDayIndex);
        if (todaySlot) {
          const sessionDetails =
            todaySlot.class9 || todaySlot.class10 || todaySlot.specialEvent || 'Scheduled Session';
          const targetClass = todaySlot.class9
            ? 'Class 9 CBSE'
            : todaySlot.class10
            ? 'Class 10 CBSE'
            : 'Special';
          setNextSessionLabel(`Today at ${todaySlot.time}: ${targetClass} - ${sessionDetails}`);
        }
      } catch {
        setCurrentISTDay(1);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#050B18] border-b-2 border-amber-500/40 text-slate-100 shadow-2xl relative overflow-hidden select-none">
      {/* Background Starfield & Subtle Cosmic Radial Gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 80px, #7dd3fc, rgba(0,0,0,0)), radial-gradient(1px 1px at 320px 45px, #fde047, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 600px 120px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 850px 30px, #38bdf8, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 1100px 70px, #ffffff, rgba(0,0,0,0))',
          backgroundSize: '1200px 160px',
        }}
      />

      {/* Top Bar / Quick Summary Ticker */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Glowing Live Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-red-300 font-bold uppercase tracking-wider text-[10px] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-ping" />
            <span>LIVE SCHEDULE</span>
          </div>

          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <span className="text-amber-400 font-extrabold tracking-wide uppercase">
              ASIIMITTS: Class 9 &amp; 10 CBSE
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-sky-300 text-[11px] font-mono">
              {nextSessionLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          {currentISTTimeStr && (
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
              🕒 {currentISTTimeStr}
            </span>
          )}

          {onOpenLiveClass && (
            <button
              onClick={onOpenLiveClass}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-[11px] rounded-lg transition-all shadow-md shadow-red-950/60 cursor-pointer animate-pulse"
              title="Open Website Direct Live Video Class"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>🔴 Live Video Page</span>
            </button>
          )}

          <a
            href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502-5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>YouTube Live</span>
          </a>

          {onOpenAIGuru && (
            <button
              onClick={onOpenAIGuru}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-900/60 hover:bg-sky-800/80 text-sky-200 border border-sky-600/50 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
            >
              <span>🤖 Ask Doubt</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/80 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            title={isExpanded ? 'Collapse Timetable' : 'View Full Timetable'}
          >
            <span>{isExpanded ? 'Hide Table ▲' : 'Show Timetable ▼'}</span>
          </button>
        </div>
      </div>

      {/* Full Timetable Card matching the uploaded poster */}
      {isExpanded && (
        <div className="border-t border-slate-800/80 bg-gradient-to-b from-[#070E20] to-[#040814] px-3 sm:px-6 py-4 relative z-10 transition-all">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Left Brand Badge */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
                <div className="flex items-center gap-3">
                  {/* Circular Advait Insights Logo Badge */}
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-sky-950 via-slate-900 to-sky-900 border-2 border-amber-400/80 flex items-center justify-center shadow-lg shadow-sky-950/60 p-1">
                    <div className="w-full h-full rounded-full border border-sky-400/50 flex flex-col items-center justify-center">
                      {/* Sun rays & Triangle */}
                      <div className="w-4 h-4 flex items-center justify-center text-amber-400 mb-0.5">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-amber-400">
                          <path d="M12 2L15 9H9L12 2Z" />
                          <circle cx="12" cy="14" r="3" fill="#38bdf8" />
                        </svg>
                      </div>
                      <span className="text-[7px] font-black uppercase tracking-tighter text-white leading-tight">
                        ADVAIT
                      </span>
                      <span className="text-[6px] font-bold uppercase tracking-widest text-sky-300 leading-none">
                        INSIGHTS
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-amber-400 uppercase tracking-wide leading-tight">
                      ADVAIT INSIGHTS:
                    </h2>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-100 tracking-wide">
                      ASIIMITTS: CLASS 9 &amp; 10 CBSE
                    </h3>
                  </div>
                </div>

                <div className="text-xs font-black uppercase tracking-wider text-amber-300/90 pt-0.5">
                  WEEKLY LIVE SESSIONS TIMETABLE
                </div>
                <div className="text-[10px] text-slate-400 font-mono italic">
                  *All times are in IST (Indian Standard Time)
                </div>
              </div>

              {/* Right Timetable Table Grid */}
              <div className="lg:col-span-8 overflow-x-auto rounded-xl border border-amber-500/40 shadow-xl bg-slate-950/90">
                <table className="w-full text-left border-collapse text-xs">
                  {/* Table Headers */}
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black tracking-wider text-center divide-x divide-amber-600/30 text-[11px] sm:text-xs">
                      <th className="py-2 px-2.5 sm:px-3 uppercase w-[18%]">DAY</th>
                      <th className="py-2 px-2.5 sm:px-3 uppercase w-[15%]">TIME</th>
                      <th className="py-2 px-2.5 sm:px-3 uppercase w-[27%]">CLASS 9 CBSE</th>
                      <th className="py-2 px-2.5 sm:px-3 uppercase w-[27%]">CLASS 10 CBSE</th>
                      <th className="py-2 px-2.5 sm:px-3 uppercase w-[13%]">SPECIAL EVENTS</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {TIMETABLE_DATA.map((row) => {
                      const isToday = row.dayIndex === currentISTDay;

                      return (
                        <tr
                          key={row.day}
                          className={`transition-colors divide-x divide-slate-800/80 ${
                            isToday
                              ? 'bg-amber-500/15 border-l-4 border-l-amber-400 font-medium'
                              : 'hover:bg-slate-900/60'
                          }`}
                        >
                          {/* DAY */}
                          <td className="py-2 sm:py-2.5 px-2.5 sm:px-3 font-extrabold text-slate-100 whitespace-nowrap text-center text-[11px] sm:text-xs">
                            <div className="flex items-center justify-center gap-1.5">
                              {isToday && (
                                <span
                                  className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block"
                                  title="Today's Session!"
                                />
                              )}
                              <span className={isToday ? 'text-amber-300 font-black' : ''}>
                                {row.day}
                              </span>
                            </div>
                            {isToday && (
                              <span className="block text-[9px] uppercase tracking-wider text-amber-400 font-bold">
                                (TODAY)
                              </span>
                            )}
                          </td>

                          {/* TIME */}
                          <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-center font-mono text-sky-300 font-bold whitespace-nowrap text-[11px]">
                            {row.time}
                          </td>

                          {/* CLASS 9 CBSE */}
                          <td className="py-2 sm:py-2.5 px-2.5 sm:px-3 text-center">
                            {row.class9 ? (
                              <div>
                                <span className="font-bold text-emerald-300 block text-xs">
                                  {row.class9}
                                </span>
                                {row.class9Sub && (
                                  <span className="text-[10px] text-slate-400 block leading-tight">
                                    {row.class9Sub}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-600 font-mono">—</span>
                            )}
                          </td>

                          {/* CLASS 10 CBSE */}
                          <td className="py-2 sm:py-2.5 px-2.5 sm:px-3 text-center">
                            {row.class10 ? (
                              <div>
                                <span className="font-bold text-sky-300 block text-xs">
                                  {row.class10}
                                </span>
                                {row.class10Sub && (
                                  <span className="text-[10px] text-slate-400 block leading-tight">
                                    {row.class10Sub}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-600 font-mono">—</span>
                            )}
                          </td>

                          {/* SPECIAL EVENTS */}
                          <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-center whitespace-nowrap">
                            {row.specialEvent ? (
                              <span className="font-extrabold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] inline-block shadow-sm">
                                {row.specialEvent}
                              </span>
                            ) : (
                              <span className="text-slate-600 font-mono">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
