import { AppState, AppStateStatus } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import * as Haptics from 'expo-haptics';
import { RootState } from '../store';
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
import NotificationService, { NotificationServiceClass } from './NotificationService';
import { TimerCompletionResult } from '../../types/models';
import type { Store } from '@reduxjs/toolkit';

// タイマー更新の間隔（ミリ秒）
const TIMER_INTERVAL = 1000;

// クラスを公開
export class TimerServiceClass {
  private timerId: number | null = null;
  private appState: AppStateStatus = AppState.currentState;
  private appStateSubscription: { remove: () => void } | null = null;
  private notificationService: NotificationServiceClass;
  private store: Store;

  constructor(store: Store, notificationService: NotificationServiceClass = NotificationService) {
    this.store = store;
    this.notificationService = notificationService;
    // AppStateの監視を初期化
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  // AppStateの変更を処理
  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    const state = this.store.getState(); // RootState型
    const { timer } = state;

    // アプリがバックグラウンドに移動した場合
    if (this.appState === 'active' && nextAppState.match(/inactive|background/)) {
      // バックグラウンド状態をマーク
      this.store.dispatch(setBackgroundActive(true));
    }
    
    // バックグラウンドからフォアグラウンドに戻った場合
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (timer.isRunning) {
        // タイマーの状態を同期
        this.store.dispatch(syncTimerFromBackground());
        
        // 目標時間に達したかチェック
        if (timer.goalTime && timer.displaySeconds >= timer.goalTime && !timer.goalReached) {
          this.handleGoalReached();
        }
      }
      
      // バックグラウンド状態を解除
      this.store.dispatch(setBackgroundActive(false));
    }

    // 現在のアプリ状態を更新
    this.appState = nextAppState;
  };

  // 目標時間の設定
  public setGoalTime(seconds: number) {
    const state = this.store.getState(); // RootState型
    const { timer } = state;
    
    // タップ感触フィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // 目標時間を設定
    this.store.dispatch(setGoalTime(seconds));
  }

  // 目標時間到達時の処理
  private handleGoalReached() {
    const state = this.store.getState(); // RootState型
    const { timer, book } = state;
    
    // 目標達成を記録
    this.store.dispatch(setGoalReached(true));
    
    // 触覚フィードバック（アプリがフォアグラウンドにいる場合のみ）
    if (this.appState === 'active') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // 通知送信
    const selectedBook = book.books.find((b) => b.id === timer.activeBook);
    if (selectedBook) {
      this.notificationService.showGoalNotification(selectedBook.title);
    }
  }

  // タイマーを開始
  public startTimer(bookId: string, currentPage?: number) {
    // タップ感触フィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Reduxアクションをディスパッチ
    this.store.dispatch(startTimer({ bookId, currentPage }));

    // バックグラウンドタイマーの開始
    if (this.timerId === null) {
      this.timerId = BackgroundTimer.setInterval(() => {
        // タイマーを更新
        this.store.dispatch(updateTimer());
        
        // 目標時間に達したかチェック
        const state = this.store.getState(); // RootState型
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
    this.store.dispatch(pauseTimer());

    // バックグラウンドタイマーの停止
    if (this.timerId !== null) {
      BackgroundTimer.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // タイマーを再開
  public resumeTimer() {
    const state = this.store.getState(); // RootState型
    const { timer } = state;
    
    // タップ感触フィードバック
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!timer.isRunning) {
      // Reduxアクションをディスパッチ
      this.store.dispatch(startTimer({ 
        bookId: timer.activeBook || '', 
        currentPage: timer.startPage || undefined 
      }));

      // バックグラウンドタイマーの開始
      if (this.timerId === null) {
        this.timerId = BackgroundTimer.setInterval(() => {
          this.store.dispatch(updateTimer());
          
          // 目標時間に達したかチェック
          const currentState = this.store.getState(); // RootState型
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
    this.store.dispatch(resetTimer());

    // バックグラウンドタイマーの停止
    if (this.timerId !== null) {
      BackgroundTimer.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // 読書セッションを完了
  public completeReading(currentPage?: number): TimerCompletionResult {
    const state = this.store.getState();
    
    // タイマー情報を取得
    const timerState = state.timer;
    const { displaySeconds, startPage } = timerState;
    
    // セッション完了アクションをディスパッチ
    this.store.dispatch(completeReadingSession());
    
    // 現在のページ情報でセッションを保存
    const completionResult: TimerCompletionResult = {
      duration: displaySeconds,
      startPage,
      endPage: currentPage
    };
    
    return completionResult;
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