'use strict';

// 国际化资源文件
const messages = {
  en: {
    title: 'Additional Miniplayer',
    videoList: 'Video List',
    searchingVideos: 'Searching for videos on the page...',
    noVideosFound: 'No videos found on the current page',
    unknownVideo: 'Unknown Video',
    noSource: 'No source address',
    openMiniplayerError: 'Error opening miniplayer, please try again',
    openMiniplayer: 'Open Miniplayer',
    contentScriptNotLoaded: 'Content script not loaded on current page'
  },
  zh: {
    title: 'Additional Miniplayer',
    videoList: '视频列表',
    searchingVideos: '正在搜索页面中的视频...',
    noVideosFound: '当前页面没有找到视频',
    unknownVideo: '未知视频',
    noSource: '无源地址',
    openMiniplayerError: '打开小窗时出现错误，请重试',
    openMiniplayer: '打开小窗',
    contentScriptNotLoaded: '当前页面未加载内容脚本'
  }
};

// 获取浏览器语言环境
function getBrowserLocale() {
  try {
    // 优先使用 navigator.languages，然后是 navigator.language，最后使用默认值 'en'
    const locales = navigator.languages || [navigator.language];
    for (const locale of locales) {
      // 检查是否支持的语言
      if (locale.toLowerCase().startsWith('zh')) {
        return 'zh';
      }
      // 默认返回英语
      if (locale.toLowerCase().startsWith('en')) {
        return 'en';
      }
    }
    // 如果没有匹配的语言，返回默认语言
    return 'en';
  } catch (error) {
    console.warn('Error detecting browser locale, defaulting to en:', error);
    return 'en';
  }
}

// 当前语言环境
let currentLocale = getBrowserLocale();

// 获取翻译文本
function t(key, locale = null) {
  const targetLocale = locale || currentLocale;
  const message = messages[targetLocale] && messages[targetLocale][key];
  
  // 如果目标语言没有找到对应文本，则回退到英语
  if (!message && targetLocale !== 'en') {
    return messages.en[key] || key;
  }
  
  return message || key;
}

// 切换语言
function setLocale(locale) {
  if (messages[locale]) {
    currentLocale = locale;
  } else {
    console.warn(`Locale '${locale}' is not supported, keeping current locale '${currentLocale}'`);
  }
}

// 获取当前语言
function getLocale() {
  return currentLocale;
}

// 获取支持的语言列表
function getSupportedLocales() {
  return Object.keys(messages);
}

// 动态更新页面中文本的函数
function updatePageTexts() {
  // 更新页面标题
  const titleElement = document.querySelector('title');
  if (titleElement) {
    titleElement.textContent = t('title');
  }

  // 更新带有 data-i18n 属性的元素
  const i18nElements = document.querySelectorAll('[data-i18n]');
  i18nElements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const text = t(key);
    element.textContent = text;
  });

  // 更新带有 data-i18n-attr 属性的元素（用于更新属性值）
  const i18nAttrElements = document.querySelectorAll('[data-i18n-attr]');
  i18nAttrElements.forEach(element => {
    const attrData = element.getAttribute('data-i18n-attr');
    const [key, attrName] = attrData.split('|');
    const value = t(key);
    element.setAttribute(attrName, value);
  });
}

// 导出国际化函数
export { t, setLocale, getLocale, getSupportedLocales, updatePageTexts, getBrowserLocale };