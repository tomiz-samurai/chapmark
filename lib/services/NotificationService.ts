import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 通知の設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationServiceClass {
  // 通知権限をリクエスト
  public async requestPermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reading-timer', {
        name: '読書タイマー',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  // 目標達成通知の表示
  public async showGoalNotification(bookTitle: string) {
    await this.requestPermissions();

    try {
      await Notifications.presentNotificationAsync({
        title: '目標達成！',
        body: `${bookTitle}の読書目標時間に到達しました！`,
        data: { type: 'goal-reached' },
      });
      return true;
    } catch (error) {
      console.error('通知の表示に失敗しました:', error);
      return false;
    }
  }

  // 通知を表示（汎用）
  public async showNotification(title: string, body: string, data = {}) {
    await this.requestPermissions();

    try {
      await Notifications.presentNotificationAsync({
        title,
        body,
        data,
      });
      return true;
    } catch (error) {
      console.error('通知の表示に失敗しました:', error);
      return false;
    }
  }
}

// シングルトンインスタンス
const NotificationService = new NotificationServiceClass();
export default NotificationService; 