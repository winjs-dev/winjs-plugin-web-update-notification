import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Options } from '@plugin-web-update-notification/core';
import {
  DIRECTORY_NAME,
  generateJSONFileContent,
  generateJsFileContent,
  getFileHash,
  getVersion,
  INJECT_SCRIPT_FILE_NAME,
  INJECT_SCRIPT_TAG_ID,
  INJECT_STYLE_FILE_NAME,
  JSON_FILE_NAME,
  NOTIFICATION_ANCHOR_CLASS_NAME,
} from '@plugin-web-update-notification/core';
import { resolve, winPath } from '@winner-fed/utils';
import type { IApi } from '@winner-fed/winjs';

export type { Options } from '@plugin-web-update-notification/core';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const injectVersionTpl = (version: string) => {
  return `window.pluginWebUpdateNotice_version = '${version}';`;
};

function resolveProjectDep(opts: {
  pkg: PackageJson;
  cwd: string;
  dep: string;
}) {
  if (
    opts.pkg.dependencies?.[opts.dep] ||
    opts.pkg.devDependencies?.[opts.dep]
  ) {
    return dirname(
      resolve.sync(`${opts.dep}/package.json`, {
        basedir: opts.cwd,
      }),
    );
  }
}

export default (api: IApi) => {
  let pkgPath: string = '';
  try {
    pkgPath =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: '@plugin-web-update-notification/core',
      }) ||
      dirname(
        require.resolve('@plugin-web-update-notification/core/package.json'),
      );
  } catch (_) {
    throw new Error(
      `Can't find @plugin-web-update-notification/core package. Please install @plugin-web-update-notification/core first.`,
    );
  }

  function checkPkgPath() {
    if (!pkgPath) {
      throw new Error(
        `Can't find @plugin-web-update-notification/core package. Please install @plugin-web-update-notification/core first.`,
      );
    }
  }

  checkPkgPath();

  api.describe({
    key: 'webUpdateNotification',
    config: {
      schema({ zod }) {
        return zod
          .object({
            versionType: zod
              .string()
              .describe('版本生成类型。指定如何生成版本号，如 "build_timestamp"（构建时间戳）、"package_version"（package.json 版本）、"custom"（自定义版本）等。决定检测更新的版本比较依据。')
              .optional(),
            customVersion: zod
              .string()
              .describe('自定义版本号。当 versionType 为 "custom" 时使用的版本字符串。可以是任意格式的版本标识，用于手动控制版本检测逻辑。')
              .optional(),
            checkInterval: zod
              .number()
              .describe('版本检查间隔时间（毫秒）。设置自动检查新版本的时间间隔，如 30000 表示每30秒检查一次。设为 0 或负数时禁用定时检查。')
              .optional(),
            logVersion: zod
              .boolean()
              .describe('是否在控制台输出版本信息。设为 true 时会在浏览器控制台打印当前版本和检查过程的日志信息，便于开发调试。')
              .optional(),
            checkOnWindowFocus: zod
              .boolean()
              .describe('是否在窗口获得焦点时检查更新。设为 true 时，当用户切换回页面标签时会自动检查是否有新版本，提高更新检测的及时性。')
              .optional(),
            checkImmediately: zod
              .boolean()
              .describe('是否立即检查更新。设为 true 时，页面加载完成后立即执行一次版本检查，而不等待设定的检查间隔。')
              .optional(),
            checkOnLoadFileError: zod
              .boolean()
              .describe('是否在文件加载错误时检查更新。设为 true 时，当页面加载资源文件失败时会触发版本检查，判断是否因为版本更新导致的文件路径变化。')
              .optional(),
            injectFileBase: zod
              .string()
              .describe('注入文件的基础路径。指定检查文件和通知相关资源的请求路径前缀，默认使用 publicPath 配置。用于适配不同的部署环境和 CDN 配置。')
              .optional(),
            customNotificationHTML: zod
              .string()
              .describe('自定义通知 HTML 内容。提供完全自定义的更新通知界面 HTML 字符串，替代默认的通知样式。设置后会忽略 notificationProps 和 notificationConfig 配置。')
              .optional(),
            notificationProps: zod
              .object({
                title: zod
                  .string()
                  .describe('通知标题文本。显示在更新通知弹窗顶部的主标题内容。')
                  .optional(),
                description: zod
                  .string()
                  .describe('通知描述文本。显示在通知弹窗中的详细说明内容，用于告知用户发现新版本。')
                  .optional(),
                buttonText: zod
                  .string()
                  .describe('更新按钮文本。点击后刷新页面的主按钮显示文本，如 "立即更新"。')
                  .optional(),
                dismissButtonText: zod
                  .string()
                  .describe('关闭按钮文本。用于关闭通知弹窗的按钮显示文本，如 "稍后提醒"。')
                  .optional()
              })
              .describe('通知内容属性配置。定义更新通知弹窗中显示的文本内容，包括标题、描述和按钮文字。')
              .optional(),
            notificationConfig: zod
              .object({
                primaryColor: zod
                  .string()
                  .describe('通知主要颜色。设置通知弹窗的主色调，通常用于按钮和高亮元素，如 "#1890ff"。')
                  .optional(),
                secondaryColor: zod
                  .string()
                  .describe('通知次要颜色。设置通知弹窗的辅助色调，用于背景或边框等元素。')
                  .optional(),
                placement: zod
                  .string()
                  .describe('通知显示位置。指定通知弹窗在页面中的显示位置，如 "top"、"bottom"、"topRight" 等。')
                  .optional()
              })
              .describe('通知样式配置。定义更新通知弹窗的外观样式，包括颜色主题和显示位置。')
              .optional(),
            silence: zod
              .boolean()
              .describe('是否启用静默模式。设为 true 时，版本检查在后台静默进行，生成的 JSON 文件不包含提示信息，通常用于自定义通知实现。')
              .optional(),
            locale: zod
              .string()
              .describe('语言环境设置。指定通知界面的语言，如 "zh-CN"、"en-US" 等。影响默认文本内容的语言显示。')
              .optional(),
            localeData: zod
              .record(zod.any())
              .describe('自定义语言数据对象。提供多语言文本映射，用于覆盖或扩展默认的语言包内容。键为语言代码，值为对应的文本配置。')
              .optional(),
            hiddenDefaultNotification: zod
              .boolean()
              .describe('是否隐藏默认通知界面。设为 true 时不显示内置的通知弹窗，通常配合 customNotificationHTML 使用或实现完全自定义的通知逻辑。')
              .optional(),
            hiddenDismissButton: zod
              .boolean()
              .describe('是否隐藏关闭按钮。设为 true 时通知弹窗中不显示 "稍后提醒" 类型的关闭按钮，强制用户必须更新。')
              .optional()
          })
          .describe('网页更新通知插件配置。基于 @plugin-web-update-notification/core 提供自动检测网页更新并显示通知的功能。支持多种版本检测策略、自定义通知界面、多语言、样式配置等特性。仅在生产环境下生效，通过比对版本文件判断是否有新版本发布。')
          .optional()
          .default({});
      },
    },
    enableBy() {
      return api.env === 'production' && api?.userConfig.webUpdateNotification;
    },
  });

  const webUpdateNotificationOptions = (api.userConfig?.webUpdateNotification ||
    {}) as Options;
  if (webUpdateNotificationOptions.injectFileBase === undefined)
    webUpdateNotificationOptions.injectFileBase =
      api.userConfig.publicPath || '/';

  const {
    versionType,
    customNotificationHTML,
    hiddenDefaultNotification,
    injectFileBase = '/',
    customVersion,
    silence,
  } = webUpdateNotificationOptions;

  let version = '';
  if (versionType === 'custom') {
    version = getVersion(versionType, customVersion!);
  } else {
    version = getVersion(versionType!);
  }

  // 插件只在生产环境时生效
  if (!version || api.env !== 'production') {
    return;
  }

  const jsFlePath = winPath(
    join(pkgPath, 'dist', `${INJECT_SCRIPT_FILE_NAME}.js`),
  );
  const jsFileContent = generateJsFileContent(
    readFileSync(jsFlePath, 'utf8').toString(),
    version,
    webUpdateNotificationOptions,
  );
  /** inject script file hash */
  const jsFileHash = getFileHash(jsFileContent);

  const cssFilePath = winPath(
    join(pkgPath, 'dist', `${INJECT_STYLE_FILE_NAME}.css`),
  );
  /** inject css file hash */
  const cssFileHash = getFileHash(readFileSync(cssFilePath, 'utf8').toString());

  api.addHTMLLinks(() => {
    if (customNotificationHTML || hiddenDefaultNotification) return [];

    return [
      {
        rel: 'stylesheet',
        href: `${injectFileBase}${DIRECTORY_NAME}/${INJECT_STYLE_FILE_NAME}.${cssFileHash}.css`,
      },
    ];
  });

  api.addHTMLHeadScripts(() => {
    const scriptList = [];
    scriptList.push({
      content: injectVersionTpl(version),
    });
    scriptList.push({
      src: `${injectFileBase}${DIRECTORY_NAME}/${INJECT_SCRIPT_FILE_NAME}.${jsFileHash}.js`,
      'data-id': INJECT_SCRIPT_TAG_ID,
      'data-v': version,
    });
    return scriptList;
  });

  api.onBuildComplete(() => {
    // 优先使用 winjs 提供的绝对输出目录，兼容 monorepo 场景
    const outputPath = api.paths.absOutputPath || join(api.paths.cwd, 'dist');
    // 递归创建目录，避免父级目录不存在时报错
    mkdirSync(join(outputPath, DIRECTORY_NAME), { recursive: true });

    // copy file from @plugin-web-update-notification/core/dist/??.css */ to dist/
    copyFileSync(
      cssFilePath,
      join(
        outputPath,
        DIRECTORY_NAME,
        `${INJECT_STYLE_FILE_NAME}.${cssFileHash}.css`,
      ),
    );

    // write js file to dist/
    writeFileSync(
      join(
        outputPath,
        DIRECTORY_NAME,
        `${INJECT_SCRIPT_FILE_NAME}.${jsFileHash}.js`,
      ),
      jsFileContent,
    );

    // write version json file to dist/
    writeFileSync(
      join(outputPath, DIRECTORY_NAME, `${JSON_FILE_NAME}.json`),
      generateJSONFileContent(version, silence),
    );
  });

  api.modifyHTML(($) => {
    if (!hiddenDefaultNotification) {
      $('body').append(`<div class="${NOTIFICATION_ANCHOR_CLASS_NAME}"></div>`);
    }
    return $;
  });
};
