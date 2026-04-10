export interface CalendarEvent {
  date: string;        // 날짜 (YYYY-MM-DD or raw)
  dayOfWeek: string;   // 요일
  time: string;        // 시간
  title: string;       // 주요 일정/내용
  department: string;  // 담당 부서
  status: string;      // 진행 상태 (완료 여부)
  note: string;        // 비고
}

export type ViewMode = 'month' | 'list';

export interface ParsedDate {
  year: number;
  month: number;
  day: number;
}
