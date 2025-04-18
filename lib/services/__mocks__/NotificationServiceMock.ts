import { NotificationServiceClass } from '../NotificationService';

export class NotificationServiceMock extends NotificationServiceClass {
  public goalNotificationCalledWith: string[] = [];
  public notificationCalled: { title: string; body: string }[] = [];

  async showGoalNotification(bookTitle: string): Promise<boolean> {
    this.goalNotificationCalledWith.push(bookTitle);
    return true;
  }

  async showNotification(title: string, body: string): Promise<boolean> {
    this.notificationCalled.push({ title, body });
    return true;
  }
} 