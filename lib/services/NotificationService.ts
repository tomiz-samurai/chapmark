import * as Notifications from 'expo-notifications';
import i18n from '../../config/i18n';
import { Platform } from 'react-native';

// 通知の設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * 通知サービスクラス
 * アプリ内の通知機能を一元管理
 */
export class NotificationServiceClass {
  // 通知許可をリクエスト
  public async requestPermissions() {
    try {
      // Android向けの通知チャンネル設定
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('reading-timer', {
          name: '読書タイマー',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.error('通知許可の取得に失敗しました:', error);
      return false;
    }
  }

  // 目標達成通知の表示
  public async showGoalNotification(bookTitle: string) {
    await this.requestPermissions();

    try {
      await Notifications.presentNotificationAsync({
        title: i18n.t('common.success'),
        body: i18n.t('timer.goalNotification', { book: bookTitle }),
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