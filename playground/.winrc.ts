import { defineConfig } from 'win';
import type { Options as WebUpdateNotificationOptions } from '@winner-fed/plugin-web-update-notification';

export default defineConfig({
  plugins: ['../src'],
  webUpdateNotification: {
    logVersion: true,
    checkInterval: 0.5 * 60 * 1000,
    notificationProps: {
      title: '发现新版本',
      description: '系统更新啦！请刷新后使用。',
      buttonText: '刷新',
      dismissButtonText: '忽略',
    },
  } as WebUpdateNotificationOptions
});
