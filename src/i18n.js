'use strict';

// Browser API polyfill for cross-browser compatibility
const browserAPI = globalThis.browser || globalThis.chrome;

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
    contentScriptNotLoaded: 'Content script not loaded on current page',
    settings: 'Settings',
    language: 'Language'
  },
  'zh-CN': {
    title: 'Additional Miniplayer',
    videoList: '视频列表',
    searchingVideos: '正在搜索页面中的视频...',
    noVideosFound: '当前页面没有找到视频',
    unknownVideo: '未知视频',
    noSource: '无源地址',
    openMiniplayerError: '打开小窗时出现错误，请重试',
    openMiniplayer: '打开小窗',
    contentScriptNotLoaded: '当前页面未加载内容脚本',
    settings: '设置',
    language: '语言'
  },
  'zh-TW': {
    title: 'Additional Miniplayer',
    videoList: '影片清單',
    searchingVideos: '正在搜尋頁面中的影片...',
    noVideosFound: '目前頁面沒有找到影片',
    unknownVideo: '未知影片',
    noSource: '無來源位址',
    openMiniplayerError: '開啟小窗時出現錯誤，請重試',
    openMiniplayer: '開啟小窗',
    contentScriptNotLoaded: '目前頁面未載入內容腳本',
    settings: '設定',
    language: '語言'
  },
  ja: {
    title: 'Additional Miniplayer',
    videoList: 'ビデオリスト',
    searchingVideos: 'ページ内のビデオを検索中...',
    noVideosFound: '現在のページにビデオが見つかりません',
    unknownVideo: '不明なビデオ',
    noSource: 'ソースアドレスなし',
    openMiniplayerError: 'ミニプレイヤーの起動エラー、もう一度お試しください',
    openMiniplayer: 'ミニプレイヤーを開く',
    contentScriptNotLoaded: '現在のページにコンテンツスクリプトが読み込まれていません',
    settings: '設定',
    language: '言語'
  },
  fr: {
    title: 'Additional Miniplayer',
    videoList: 'Liste des vidéos',
    searchingVideos: 'Recherche de vidéos sur la page...',
    noVideosFound: 'Aucune vidéo trouvée sur la page actuelle',
    unknownVideo: 'Vidéo inconnue',
    noSource: 'Aucune adresse source',
    openMiniplayerError: 'Erreur lors de l\'ouverture du miniplayer, veuillez réessayer',
    openMiniplayer: 'Ouvrir le miniplayer',
    contentScriptNotLoaded: 'Script de contenu non chargé sur la page actuelle',
    settings: 'Paramètres',
    language: 'Langue'
  },
  es: {
    title: 'Additional Miniplayer',
    videoList: 'Lista de videos',
    searchingVideos: 'Buscando videos en la página...',
    noVideosFound: 'No se encontraron videos en la página actual',
    unknownVideo: 'Video desconocido',
    noSource: 'Sin dirección de origen',
    openMiniplayerError: 'Error al abrir el miniplayer, por favor inténtelo de nuevo',
    openMiniplayer: 'Abrir miniplayer',
    contentScriptNotLoaded: 'Script de contenido no cargado en la página actual',
    settings: 'Configuración',
    language: 'Idioma'
  },
  de: {
    title: 'Additional Miniplayer',
    videoList: 'Videoliste',
    searchingVideos: 'Suche nach Videos auf der Seite...',
    noVideosFound: 'Keine Videos auf der aktuellen Seite gefunden',
    unknownVideo: 'Unbekanntes Video',
    noSource: 'Keine Quelladresse',
    openMiniplayerError: 'Fehler beim Öffnen des Miniplayers, bitte versuchen Sie es erneut',
    openMiniplayer: 'Miniplayer öffnen',
    contentScriptNotLoaded: 'Content-Script nicht auf der aktuellen Seite geladen',
    settings: 'Einstellungen',
    language: 'Sprache'
  },
  ru: {
    title: 'Additional Miniplayer',
    videoList: 'Список видео',
    searchingVideos: 'Поиск видео на странице...',
    noVideosFound: 'На текущей странице видео не найдено',
    unknownVideo: 'Неизвестное видео',
    noSource: 'Нет адреса источника',
    openMiniplayerError: 'Ошибка открытия миниплеера, попробуйте еще раз',
    openMiniplayer: 'Открыть миниплеер',
    contentScriptNotLoaded: 'Скрипт содержимого не загружен на текущей странице',
    settings: 'Настройки',
    language: 'Язык'
  },
  ko: {
    title: 'Additional Miniplayer',
    videoList: '비디오 목록',
    searchingVideos: '페이지에서 비디오를 검색하는 중...',
    noVideosFound: '현재 페이지에서 비디오를 찾을 수 없습니다',
    unknownVideo: '알 수 없는 비디오',
    noSource: '소스 주소 없음',
    openMiniplayerError: '미니플레이어 열기 오류, 다시 시도해 주세요',
    openMiniplayer: '미니플레이어 열기',
    contentScriptNotLoaded: '현재 페이지에 콘텐츠 스크립트가 로드되지 않았습니다',
    settings: '설정',
    language: '언어'
  }
};

// 获取浏览器语言环境
function getBrowserLocale() {
  try {
    // 优先使用 navigator.languages，然后是 navigator.language，最后使用默认值 'en'
    const locales = navigator.languages || [navigator.language];
    for (const locale of locales) {
      const lang = locale.toLowerCase();
      // 检查是否支持的语言
      if (lang === 'zh-tw' || lang === 'zh-hk' || lang === 'zh-mo') {
        return 'zh-TW';
      }
      if (lang.startsWith('zh')) {
        return 'zh-CN';
      }
      if (lang.startsWith('ja')) {
        return 'ja';
      }
      if (lang.startsWith('fr')) {
        return 'fr';
      }
      if (lang.startsWith('es')) {
        return 'es';
      }
      if (lang.startsWith('de')) {
        return 'de';
      }
      if (lang.startsWith('ru')) {
        return 'ru';
      }
      if (lang.startsWith('ko')) {
        return 'ko';
      }
      if (lang.startsWith('en')) {
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
let currentLocale = null;

// 初始化语言设置
async function initLocale() {
  try {
    // 检查 browserAPI.storage 是否可用
    if (browserAPI && browserAPI.storage && browserAPI.storage.sync) {
      // 尝试从存储中获取用户设置的语言
      const result = await browserAPI.storage.sync.get(['locale']);
      if (result.locale && messages[result.locale]) {
        currentLocale = result.locale;
      } else {
        // 如果没有设置或不支持，则使用浏览器语言
        currentLocale = getBrowserLocale();
      }
    } else {
      // 如果 browserAPI.storage 不可用，直接使用浏览器语言
      console.warn('browserAPI.storage not available, using browser locale');
      currentLocale = getBrowserLocale();
    }
  } catch (error) {
    console.warn('Error loading locale from storage, using browser locale:', error);
    currentLocale = getBrowserLocale();
  }
}

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

// 切换语言（同步版本，用于内部使用）
function setLocaleSync(locale) {
  if (messages[locale]) {
    currentLocale = locale;
  } else {
    console.warn(`Locale '${locale}' is not supported, keeping current locale '${currentLocale}'`);
  }
}

// 切换语言（异步版本，保存到存储）
async function setLocale(locale) {
  if (messages[locale]) {
    currentLocale = locale;
    try {
      if (browserAPI && browserAPI.storage && browserAPI.storage.sync) {
        await browserAPI.storage.sync.set({ locale: locale });
      }
    } catch (error) {
      console.warn('Error saving locale to storage:', error);
    }
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
export { t, setLocale, setLocaleSync, getLocale, getSupportedLocales, updatePageTexts, getBrowserLocale, initLocale };