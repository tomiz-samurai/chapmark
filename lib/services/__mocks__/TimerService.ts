// TimerServiceのモック実装
import type { TimerCompletionResult } from '../../../types/models';

export class TimerServiceClassMock {
  public startTimer(bookId: string, currentPage?: number) {
    // ダミー: 何もしない
  }
  public pauseTimer() {
    // ダミー: 何もしない
  }
  public resumeTimer() {
    // ダミー: 何もしない
  }
  public resetTimer() {
    // ダミー: 何もしない
  }
  public completeReading(currentPage?: number): TimerCompletionResult {
    return {
      duration: 1000,
      startPage: 1,
      endPage: currentPage ?? 10,
    };
  }
  public setGoalTime(seconds: number) {
    // ダミー: 何もしない
  }
  public cleanup() {
    // ダミー: 何もしない
  }
  public static formatTime(seconds: number): string {
    return '00:00:00';
  }
  public static calculateProgress(currentPage?: number, totalPages?: number): number {
    return 50;
  }
  public static calculateReadPages(startPage: number | null | undefined, endPage: number | undefined): number {
    return (endPage ?? 0) - (startPage ?? 0);
  }
}

export const formatTime = TimerServiceClassMock.formatTime;
export const calculateProgress = TimerServiceClassMock.calculateProgress;
export const calculateReadPages = TimerServiceClassMock.calculateReadPages;

const TimerService = new TimerServiceClassMock();
export default TimerService; 