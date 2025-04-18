import { TimerServiceClass } from '../services/TimerService';
import NotificationService, { NotificationServiceClass } from '../services/NotificationService';

/**
 * ChapMarkアプリ用サービスDIコンテナ
 * - サービスのインスタンス生成・依存注入を一元管理
 * - テストや将来の差し替えも容易
 */
export class ServiceContainer {
  private _notificationService: NotificationServiceClass;
  private _timerService: TimerServiceClass;

  constructor() {
    // NotificationServiceはシングルトン
    this._notificationService = NotificationService;
    // TimerServiceはNotificationServiceをDI
    this._timerService = new TimerServiceClass(this._notificationService);
  }

  get notificationService(): NotificationServiceClass {
    return this._notificationService;
  }

  get timerService(): TimerServiceClass {
    return this._timerService;
  }
}

// デフォルトのServiceContainerインスタンスをexport
export const serviceContainer = new ServiceContainer(); 