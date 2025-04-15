import { AppState, AppStateStatus } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import * as Haptics from 'expo-haptics';
import { store } from '../store';
import { 
  startTimer, 
  pauseTimer, 
  updateTimer, 
  resetTimer,
  syncTimerFromBackground, 
  completeReadingSession,
  setGoalTime,
  setGoalReached,
  setBackgroundActive
} from '../store/timerSlice';
import { completeSession } from '../store/sessionSlice';
import NotificationService from './NotificationService';

// タイマー更新の間隔（ミリ秒）
const TIMER_INTERVAL = 1000;

// クラスを公開
export class TimerServiceClass {
  private timerId: number | null = null;
  private appState: AppStateStatus = AppState.currentState;
  private appStateSubscription: any = null;

  constructor() {
    // AppStateの監視を初期化
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  // AppStateの変更を処理
  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    // 型アサーションを使ってエラーを回避
    const state = store.getState() as any;
    const { timer } = state;

    // アプリがバックグラウンドに移動した場合
    if (this.appState === 'active' && nextAppState.match(/inactive|background/)) {
      // バックグラウンド状態をマーク
      store.dispatch(setBackgroundActive(true));
    }
    
    // バックグラウンドからフォアグラウンドに戻った場合
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (timer.isRunning) {
        // タイマーの状態を同期
        store.dispatch(syncTimerFromBackground());
        
        // 目標時間に達したかチェック
        if (timer.goalTime && timer.displaySeconds >= timer.goalTime && !timer.goalReached) {
          this.handleGoalReached();
        }
      }
      
      // バックグラウンド状態を解除
      store.dispatch(setBackgroundActive(false));
    }

    // 現在のアプリ状態を更新
    this.appState = nextAppState;
  };

  // 目標時間の設定
  public setGoalTime(seconds: number) {
    // 型アサーションを使ってエラーを回避
    const state = store.getState() as any;
    const { timer } = state;
    
    // タップ感触フィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // 目標時間を設定
    store.dispatch(setGoalTime(seconds));
  }

  // 目標時間到達時の処理
  private handleGoalReached() {
    // 型アサーションを使ってエラーを回避
    const state = store.getState() as any;
    const { timer, book } = state;
    
    // 目標達成を記録
    store.dispatch(setGoalReached(true));
    
    // 触覚フィードバック（アプリがフォアグラウンドにいる場合のみ）
    if (this.appState === 'active') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // 通知送信
    const selectedBook = book.books.find((b: any) => b.id === timer.activeBook);
    if (selectedBook) {
      NotificationService.showGoalNotification(selectedBook.title);
    }
  }

  // タイマーを開始
  public startTimer(bookId: string, currentPage?: number) {
    // タップ感触フィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Reduxアクションをディスパッチ
    store.dispatch(startTimer({ bookId, currentPage }));

    // バックグラウンドタイマーの開始
    if (this.timerId === null) {
      this.timerId = BackgroundTimer.setInterval(() => {
        // タイマーを更新
        store.dispatch(updateTimer());
        
        // 目標時間に達したかチェック
        const state = store.getState() as any;
        const { timer } = state;
        
        if (timer.goalTime && timer.displaySeconds >= timer.goalTime && !timer.goalReached) {
          // 目標時間達成
          this.handleGoalReached();
        }
      }, TIMER_INTERVAL);
    }
  }

  // タイマーを一時停止
  public pauseTimer() {
    // タップ感触フィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Reduxアクションをディスパッチ
    store.dispatch(pauseTimer());

    // バックグラウンドタイマーの停止
    if (this.timerId !== null) {
      BackgroundTimer.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // タイマーを再開
  public resumeTimer() {
    // 型アサーションを使ってエラーを回避
    const state = store.getState() as any;
    const { timer } = state;
    
    // タップ感触フィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!timer.isRunning) {
      // Reduxアクションをディスパッチ
      store.dispatch(startTimer({ 
        bookId: timer.activeBook || '', 
        currentPage: timer.startPage || undefined 
      }));

      // バックグラウンドタイマーの開始
      if (this.timerId === null) {
        this.timerId = BackgroundTimer.setInterval(() => {
          store.dispatch(updateTimer());
          
          // 目標時間に達したかチェック
          const currentState = store.getState() as any;
          const { timer: currentTimer } = currentState;
          
          if (currentTimer.goalTime && currentTimer.displaySeconds >= currentTimer.goalTime && !currentTimer.goalReached) {
            // 目標時間達成
            this.handleGoalReached();
          }
        }, TIMER_INTERVAL);
      }
    }
  }

  // タイマーをリセット
  public resetTimer() {
    // タップ感触フィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Reduxアクションをディスパッチ
    store.dispatch(resetTimer());

    // バックグラウンドタイマーの停止
    if (this.timerId !== null) {
      BackgroundTimer.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // 読書セッションを完了
  public completeReading(endPage?: number) {
    // タップ感触フィードバック
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // 型アサーションを使ってエラーを回避
    const state = store.getState() as any;
    const { timer, book } = state;
    const selectedBook = book.books.find((b: any) => b.id === timer.activeBook);
    
    // タイマーの状態を更新
    store.dispatch(completeReadingSession());
    
    // バックグラウンドタイマーの停止
    if (this.timerId !== null) {
      BackgroundTimer.clearInterval(this.timerId);
      this.timerId = null;
    }
    
    // セッション情報を保存
    if (timer.startTime && timer.activeBook) {
      const endTime = new Date();
      const startTime = new Date(timer.startTime);
      
      // 経過時間（秒数）を計算
      const duration = timer.pausedTime + 
        Math.floor((endTime.getTime() - new Date(timer.startTime).getTime()) / 1000);
      
      // セッション完了アクションをディスパッチ
      store.dispatch(completeSession({
        endTime,
        endPage: endPage || selectedBook?.currentPage
      }));
      
      return {
        duration,
        startPage: timer.startPage,
        endPage: endPage || selectedBook?.currentPage
      };
    }
    
    return null;
  }

  // リソースのクリーンアップ
  public cleanup() {
    if (this.timerId !== null) {
      BackgroundTimer.clearInterval(this.timerId);
      this.timerId = null;
    }
    
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
  }

  // 経過時間を人間が読める形式に変換
  public static formatTime(seconds: number): string {
    if (!seconds) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  }

  // 読書の進捗率を計算
  public static calculateProgress(currentPage?: number, totalPages?: number): number {
    if (!currentPage || !totalPages || totalPages === 0) {
      return 0;
    }
    return Math.min(Math.round((currentPage / totalPages) * 100), 100);
  }

  // 読んだページ数を計算
  public static calculateReadPages(startPage: number | null | undefined, endPage: number | undefined): number {
    if (startPage == null || endPage == null) {
      return 0;
    }
    return Math.max(0, endPage - startPage);
  }
}

// 静的メソッドを直接エクスポート
export const formatTime = TimerServiceClass.formatTime;
export const calculateProgress = TimerServiceClass.calculateProgress;
export const calculateReadPages = TimerServiceClass.calculateReadPages;

// シングルトンインスタンスをエクスポート
const TimerService = new TimerServiceClass();
export default TimerService; 