declare module 'react-native-background-timer' {
  export default {
    /**
     * 指定された間隔で繰り返し実行されるタイマーを設定します
     * @param callback 実行する関数
     * @param delay 実行間隔（ミリ秒）
     * @returns タイマーID
     */
    setInterval(callback: () => void, delay: number): number,
    
    /**
     * 指定されたタイマーIDのインターバルタイマーをクリアします
     * @param intervalId タイマーID
     */
    clearInterval(intervalId: number): void,
    
    /**
     * 指定された遅延後に一度だけ実行されるタイマーを設定します
     * @param callback 実行する関数
     * @param delay 遅延時間（ミリ秒）
     * @returns タイマーID
     */
    setTimeout(callback: () => void, delay: number): number,
    
    /**
     * 指定されたタイマーIDのタイムアウトタイマーをクリアします
     * @param timeoutId タイマーID
     */
    clearTimeout(timeoutId: number): void,
    
    /**
     * バックグラウンドタイマーを開始します
     */
    startBackgroundTimer(callback: () => void, delay: number): void,
    
    /**
     * バックグラウンドタイマーを停止します
     */
    stopBackgroundTimer(): void
  };
} 