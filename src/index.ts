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

function resolveProjectDep(opts: { pkg: PackageJson; cwd: string; dep: string }) {
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
      `Can't find @plugin-web-update-notification/core package. Please install antd first.`,
    );
  }

  function checkPkgPath() {
    if (!pkgPath) {
      throw new Error(
        `Can't find @plugin-web-update-notification/core package. Please install antd first.`,
      );
    }
  }

  checkPkgPath();

  api.describe({
    key: 'webUpdateNotification',
    config: {
      schema(Joi) {
        return Joi.object({
          versionType: Joi.string(),
          customVersion: Joi.string(),
          checkInterval: Joi.number(),
          logVersion: Joi.boolean(),
          checkOnWindowFocus: Joi.boolean(),
          checkImmediately: Joi.boolean(),
          checkOnLoadFileError: Joi.boolean(),
          injectFileBase: Joi.string(),
          customNotificationHTML: Joi.string(),
          notificationProps: {
            title: Joi.string(),
            description: Joi.string(),
            buttonText: Joi.string(),
            dismissButtonText: Joi.string(),
          },
          notificationConfig: {
            primaryColor: Joi.string(),
            secondaryColor: Joi.string(),
            placement: Joi.string(),
          },
          silence: Joi.boolean(),
          locale: Joi.string(),
          localeData: Joi.object(),
          hiddenDefaultNotification: Joi.boolean(),
          hiddenDismissButton: Joi.boolean(),
        });
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
