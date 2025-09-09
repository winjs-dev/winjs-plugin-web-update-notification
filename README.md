# winjs-plugin-web-update-notification

🚀 **Web应用更新通知插件** - 为 WinJS 应用提供智能的版本更新检测和用户友好的更新提醒

<p align="center">
  <a href="https://npmjs.com/package/@winner-fed/plugin-web-update-notification">
   <img src="https://img.shields.io/npm/v/@winner-fed/plugin-web-update-notification?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@winner-fed/plugin-web-update-notification?minimal=true">
    <img src="https://img.shields.io/npm/dm/@winner-fed/plugin-web-update-notification.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-ready-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Production-Only-green.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="Production Only" />
</p>

## ✨ 特性

- 🔄 **自动检测** - 智能检测 Web 应用版本更新
- 🎯 **多种策略** - 支持多种版本检测策略（时间戳、版本号、Git哈希等）
- 💬 **友好提醒** - 美观的更新通知界面，提升用户体验
- 🎨 **高度定制** - 支持自定义通知样式、文案和行为
- 🌍 **国际化** - 内置多语言支持，支持自定义语言包
- ⚡ **轻量级** - 最小化打包体积，不影响应用性能
- 🛡️ **生产专用** - 仅在生产环境生效，开发环境自动禁用
- 📱 **响应式** - 完美适配移动端和桌面端

## 🎯 应用场景

- **SPA应用** - 单页应用版本更新提醒
- **PWA应用** - 渐进式Web应用更新通知
- **企业内部系统** - 内部管理系统版本升级提醒
- **电商平台** - 商城系统功能更新通知
- **在线工具** - 在线编辑器、设计工具等更新提醒

## 📦 安装

```bash
# npm
npm install @winner-fed/plugin-web-update-notification @plugin-web-update-notification/core -D

# yarn
yarn add @winner-fed/plugin-web-update-notification @plugin-web-update-notification/core -D

# pnpm
pnpm add @winner-fed/plugin-web-update-notification @plugin-web-update-notification/core -D
```

## 🚀 快速开始

### 1. 配置插件

在 `.winrc.ts` 中启用插件：

```typescript
// .winrc.ts
import { defineConfig } from '@winner-fed/winjs';
import type { Options as WebUpdateNotificationOptions } from '@winner-fed/plugin-web-update-notification';

export default defineConfig({
  plugins: ['@winner-fed/plugin-web-update-notification'],
  webUpdateNotification: {
    // 检测间隔（毫秒）
    checkInterval: 10 * 60 * 1000, // 10分钟
    // 版本检测策略
    versionType: 'build_timestamp',
    // 通知文案
    notificationProps: {
      title: '发现新版本',
      description: '系统已更新，请刷新页面获取最新功能。',
      buttonText: '立即刷新',
      dismissButtonText: '稍后提醒'
    }
  } as WebUpdateNotificationOptions
});
```

### 2. 构建部署

```bash
# 构建应用（仅在生产环境生效）
npm run build

# 部署到服务器
# 插件会自动生成版本检测文件和更新通知功能
```

### 3. 效果预览

用户访问应用时，插件会：
1. 定期检测服务器上的版本信息
2. 发现新版本时显示更新通知
3. 用户点击刷新按钮后重新加载页面

## ⚙️ 配置选项

### 基础配置

| 参数              | 类型                      | 默认值            | 描述                       |
| ----------------- | ------------------------- | ----------------- | -------------------------- |
| `versionType`   | `string`                | `'build_timestamp'` | 版本检测策略               |
| `customVersion` | `string`                | -                 | 自定义版本号               |
| `checkInterval` | `number`                | `600000`        | 检测间隔（毫秒）           |
| `logVersion`    | `boolean`               | `false`         | 是否在控制台输出版本信息   |
| `silence`       | `boolean`               | `false`         | 静默模式，不显示通知       |

### 检测行为配置

| 参数                    | 类型        | 默认值    | 描述                     |
| ----------------------- | ----------- | --------- | ------------------------ |
| `checkOnWindowFocus`  | `boolean` | `true`  | 窗口获得焦点时检测       |
| `checkImmediately`    | `boolean` | `true`  | 页面加载后立即检测       |
| `checkOnLoadFileError` | `boolean` | `false` | 资源加载失败时检测       |

### 通知界面配置

| 参数                         | 类型        | 默认值    | 描述               |
| ---------------------------- | ----------- | --------- | ------------------ |
| `hiddenDefaultNotification` | `boolean` | `false` | 隐藏默认通知界面   |
| `hiddenDismissButton`       | `boolean` | `false` | 隐藏忽略按钮       |
| `customNotificationHTML`    | `string`  | -         | 自定义通知HTML内容 |

### 通知文案配置

```typescript
interface NotificationProps {
  title?: string;           // 通知标题
  description?: string;     // 通知描述
  buttonText?: string;      // 刷新按钮文本
  dismissButtonText?: string; // 忽略按钮文本
}
```

### 样式配置

```typescript
interface NotificationConfig {
  primaryColor?: string;    // 主色调
  secondaryColor?: string;  // 辅助色
  placement?: 'top' | 'bottom' | 'left' | 'right'; // 显示位置
}
```

### 国际化配置

| 参数           | 类型       | 默认值 | 描述           |
| -------------- | ---------- | ------ | -------------- |
| `locale`     | `string` | `'zh'` | 语言设置       |
| `localeData` | `object` | -      | 自定义语言包   |

## 📝 使用示例

### 基础配置

```typescript
// .winrc.ts
export default defineConfig({
  plugins: ['@winner-fed/plugin-web-update-notification'],
  webUpdateNotification: {
    checkInterval: 5 * 60 * 1000, // 5分钟检测一次
    versionType: 'build_timestamp', // 使用构建时间戳
    logVersion: true, // 控制台输出版本信息
    notificationProps: {
      title: '系统更新',
      description: '发现新版本，建议立即更新以获得最佳体验。',
      buttonText: '立即更新',
      dismissButtonText: '稍后'
    }
  }
});
```

### 自定义版本号

```typescript
// .winrc.ts
export default defineConfig({
  plugins: ['@winner-fed/plugin-web-update-notification'],
  webUpdateNotification: {
    versionType: 'custom',
    customVersion: '2.1.0', // 自定义版本号
    checkInterval: 2 * 60 * 1000, // 2分钟检测一次
    notificationProps: {
      title: 'v2.1.0 版本更新',
      description: '新增了用户反馈功能，修复了已知问题。',
      buttonText: '更新到 v2.1.0'
    }
  }
});
```

### 自定义样式

```typescript
// .winrc.ts
export default defineConfig({
  plugins: ['@winner-fed/plugin-web-update-notification'],
  webUpdateNotification: {
    notificationConfig: {
      primaryColor: '#007aff',
      secondaryColor: '#f0f0f0',
      placement: 'top'
    },
    notificationProps: {
      title: '🎉 发现新版本',
      description: '系统已升级，点击更新体验新功能！',
      buttonText: '🔄 立即更新',
      dismissButtonText: '⏰ 稍后提醒'
    }
  }
});
```

### 多语言配置

```typescript
// .winrc.ts
export default defineConfig({
  plugins: ['@winner-fed/plugin-web-update-notification'],
  webUpdateNotification: {
    locale: 'en',
    localeData: {
      en: {
        title: 'New Version Available',
        description: 'A new version is available. Please refresh to get the latest features.',
        buttonText: 'Refresh Now',
        dismissButtonText: 'Later'
      },
      zh: {
        title: '发现新版本',
        description: '系统已更新，请刷新页面获取最新功能。',
        buttonText: '立即刷新',
        dismissButtonText: '稍后提醒'
      }
    }
  }
});
```

### 静默模式

```typescript
// .winrc.ts - 仅检测版本，不显示通知
export default defineConfig({
  plugins: ['@winner-fed/plugin-web-update-notification'],
  webUpdateNotification: {
    silence: true, // 静默模式
    logVersion: true, // 仅在控制台输出
    checkInterval: 30 * 1000 // 30秒检测一次
  }
});
```

### 自定义通知界面

```typescript
// .winrc.ts
export default defineConfig({
  plugins: ['@winner-fed/plugin-web-update-notification'],
  webUpdateNotification: {
    hiddenDefaultNotification: true, // 隐藏默认通知
    customNotificationHTML: `
      <div id="custom-update-notice" style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="font-weight: 600; margin-bottom: 8px;">🎉 更新可用</div>
        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">
          发现新版本，点击更新获取最新功能
        </div>
        <button onclick="window.location.reload()" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          margin-right: 8px;
        ">立即更新</button>
        <button onclick="this.parentElement.style.display='none'" style="
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        ">稍后</button>
      </div>
    `
  }
});
```

## 🎯 版本检测策略

### 1. 构建时间戳（推荐）

```typescript
webUpdateNotification: {
  versionType: 'build_timestamp'
}
```

**原理**：使用构建时的时间戳作为版本标识
**优点**：简单可靠，每次构建都会生成新版本
**适用**：大多数场景

### 2. 自定义版本号

```typescript
webUpdateNotification: {
  versionType: 'custom',
  customVersion: '1.2.3'
}
```

**原理**：使用自定义的版本号
**优点**：语义化版本，便于管理
**适用**：需要精确控制版本的场景

### 3. Git 提交哈希

```typescript
webUpdateNotification: {
  versionType: 'commit_hash'
}
```

**原理**：使用 Git 提交的哈希值
**优点**：与代码变更直接关联
**适用**：Git 管理的项目

### 4. 包版本号

```typescript
webUpdateNotification: {
  versionType: 'package_version'
}
```

**原理**：使用 package.json 中的版本号
**优点**：与项目版本同步
**适用**：规范的版本管理流程

## 🔧 高级用法

### 编程式控制

```typescript
// 在运行时控制更新检测
declare global {
  interface Window {
    pluginWebUpdateNotice_version?: string;
  }
}

// 获取当前版本
console.log('当前版本:', window.pluginWebUpdateNotice_version);

// 手动触发版本检测
if (window.webUpdateNoticeInstance) {
  window.webUpdateNoticeInstance.checkUpdate();
}
```

### 事件监听

```typescript
// 监听版本更新事件
window.addEventListener('web-update-notice', (event) => {
  console.log('检测到新版本:', event.detail);
  
  // 自定义处理逻辑
  if (event.detail.hasUpdate) {
    // 显示自定义更新提示
    showCustomUpdateDialog();
  }
});
```

### 条件更新

```typescript
// 根据用户角色决定是否显示更新通知
webUpdateNotification: {
  silence: getUserRole() !== 'admin', // 仅管理员看到通知
  checkInterval: 60 * 1000, // 1分钟检测一次
  notificationProps: {
    title: '管理员更新通知',
    description: '系统后台已更新，请刷新页面。'
  }
}
```

## 📱 移动端适配

### 响应式设计

插件自动适配移动端显示：

```css
/* 自动适配的样式 */
@media (max-width: 768px) {
  .web-update-notice {
    left: 16px !important;
    right: 16px !important;
    width: auto !important;
  }
}
```

### 移动端优化配置

```typescript
// 移动端优化配置
webUpdateNotification: {
  checkInterval: 5 * 60 * 1000, // 移动端降低检测频率
  notificationConfig: {
    placement: 'bottom', // 底部显示更适合移动端
    primaryColor: '#007aff'
  },
  notificationProps: {
    title: '📱 更新可用',
    description: '发现新版本，轻触更新。',
    buttonText: '更新',
    dismissButtonText: '稍后'
  }
}
```

## 🎨 自定义样式

### CSS 变量覆盖

```css
/* 在全局样式中覆盖默认样式 */
:root {
  --web-update-notice-primary-color: #007aff;
  --web-update-notice-secondary-color: #f0f0f0;
  --web-update-notice-border-radius: 12px;
  --web-update-notice-box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
```

### 主题定制

```typescript
// 深色主题
webUpdateNotification: {
  notificationConfig: {
    primaryColor: '#0a84ff',
    secondaryColor: '#1c1c1e',
    placement: 'top'
  }
}

// 品牌主题
webUpdateNotification: {
  notificationConfig: {
    primaryColor: '#ff6b35', // 品牌色
    secondaryColor: '#ffeaa7',
    placement: 'bottom'
  }
}
```

## 🔍 常见问题

### Q: 为什么更新通知没有显示？

A: 请检查以下几点：
1. 确保当前环境是生产环境（`NODE_ENV=production`）
2. 确认已正确安装 `@plugin-web-update-notification/core` 依赖
3. 检查版本检测策略是否正确配置
4. 查看浏览器控制台是否有错误信息

### Q: 如何在开发环境中测试更新通知？

A: 开发环境默认不启用更新通知。如需测试，可以：

```typescript
// 临时启用开发环境检测
api.describe({
  enableBy() {
    return true; // 强制启用
  }
});
```

### Q: 如何自定义检测逻辑？

A: 可以使用静默模式，然后通过事件监听实现自定义逻辑：

```typescript
webUpdateNotification: {
  silence: true, // 不显示默认通知
  checkInterval: 30 * 1000
}

// 自定义检测逻辑
window.addEventListener('web-update-notice', (event) => {
  if (event.detail.hasUpdate) {
    // 实现自定义更新提示
    myCustomUpdateHandler(event.detail);
  }
});
```

### Q: 如何处理更新检测失败？

A: 插件会自动处理网络错误，但你可以监听错误事件：

```typescript
window.addEventListener('web-update-notice-error', (event) => {
  console.error('版本检测失败:', event.detail);
  // 实现错误处理逻辑
});
```

### Q: 支持哪些浏览器？

A: 支持所有现代浏览器：
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- 移动端浏览器

## 📋 最佳实践

### 1. 版本策略选择

- **开发迭代频繁**：使用 `build_timestamp`
- **版本管理规范**：使用 `package_version`
- **Git 工作流**：使用 `commit_hash`
- **精确控制**：使用 `custom`

### 2. 检测频率建议

```typescript
// 不同应用类型的建议配置
const configs = {
  // 高频更新应用（如在线工具）
  highFrequency: {
    checkInterval: 2 * 60 * 1000, // 2分钟
    checkOnWindowFocus: true,
    checkImmediately: true
  },
  
  // 一般业务应用
  normal: {
    checkInterval: 10 * 60 * 1000, // 10分钟
    checkOnWindowFocus: true,
    checkImmediately: false
  },
  
  // 低频更新应用
  lowFrequency: {
    checkInterval: 30 * 60 * 1000, // 30分钟
    checkOnWindowFocus: false,
    checkImmediately: false
  }
};
```

### 3. 用户体验优化

```typescript
// 用户友好的配置
webUpdateNotification: {
  // 适中的检测频率
  checkInterval: 8 * 60 * 1000,
  
  // 友好的提示文案
  notificationProps: {
    title: '🎉 新功能来了',
    description: '我们为您准备了新功能和体验优化，建议立即更新。',
    buttonText: '✨ 立即体验',
    dismissButtonText: '⏰ 稍后提醒'
  },
  
  // 不要过于打扰用户
  checkOnWindowFocus: false, // 避免频繁切换窗口时检测
  hiddenDismissButton: false // 允许用户选择稍后更新
}
```

### 4. 性能优化

```typescript
// 性能优化配置
webUpdateNotification: {
  // 合理的检测间隔
  checkInterval: 15 * 60 * 1000, // 15分钟
  
  // 避免不必要的检测
  checkOnLoadFileError: false,
  
  // 静默模式减少UI开销
  silence: shouldSilentMode(),
  
  // 仅在必要时输出日志
  logVersion: process.env.NODE_ENV === 'development'
}
```

## 🛠️ 开发调试

### 调试模式

```typescript
// 开启详细日志
webUpdateNotification: {
  logVersion: true,
  checkInterval: 10 * 1000, // 10秒快速测试
  notificationProps: {
    title: '[DEBUG] 更新测试',
    description: '这是调试模式的更新通知'
  }
}
```

### 版本信息查看

```javascript
// 在浏览器控制台中查看版本信息
console.log('当前版本:', window.pluginWebUpdateNotice_version);

// 查看检测状态
console.log('更新实例:', window.webUpdateNoticeInstance);
```

## 📄 许可证

[MIT](./LICENSE).

## 🔗 相关链接

- [@plugin-web-update-notification/core](https://github.com/GreatAuk/plugin-web-update-notification)
- [Web App 更新策略最佳实践](https://web.dev/app-update-strategies/)
