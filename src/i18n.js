'use strict';

// Browser API polyfill for cross-browser compatibility
const browserAPI = globalThis.browser || globalThis.chrome;

// Internationalization resource file
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
  'zh-Hant': {
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

// Get browser locale
function getBrowserLocale() {
  try {
    // Prioritize navigator.languages, then navigator.language, finally use default 'en'
    const locales = navigator.languages || [navigator.language];
    for (const locale of locales) {
      const lang = locale.toLowerCase();
      // Check if the language is supported
      if (lang === 'zh-tw' || lang === 'zh-hk' || lang === 'zh-mo') {
        return 'zh-Hant';
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
    // If no matching language, return default language
    return 'en';
  } catch (error) {
    console.warn('Error detecting browser locale, defaulting to en:', error);
    return 'en';
  }
}

// Current locale
let currentLocale = null;

// Initialize language settings
async function initLocale() {
  try {
    // Check if browserAPI.storage is available
    if (browserAPI && browserAPI.storage && browserAPI.storage.sync) {
      // Try to get user-set language from storage
      const result = await browserAPI.storage.sync.get(['locale']);
      if (result.locale && messages[result.locale]) {
        currentLocale = result.locale;
      } else {
        // If not set or not supported, use browser language
        currentLocale = getBrowserLocale();
      }
    } else {
      // If browserAPI.storage is not available, use browser language directly
      console.warn('browserAPI.storage not available, using browser locale');
      currentLocale = getBrowserLocale();
    }
  } catch (error) {
    console.warn('Error loading locale from storage, using browser locale:', error);
    currentLocale = getBrowserLocale();
  }
}

// Get translated text
function t(key, locale = null) {
  const targetLocale = locale || currentLocale;
  const message = messages[targetLocale] && messages[targetLocale][key];
  
  // If no corresponding text found in target language, fall back to English
  if (!message && targetLocale !== 'en') {
    return messages.en[key] || key;
  }
  
  return message || key;
}

// Switch language (synchronous version, for internal use)
function setLocaleSync(locale) {
  if (messages[locale]) {
    currentLocale = locale;
  } else {
    console.warn(`Locale '${locale}' is not supported, keeping current locale '${currentLocale}'`);
  }
}

// Switch language (asynchronous version, save to storage)
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

// Get current language
function getLocale() {
  return currentLocale;
}

// Get list of supported languages
function getSupportedLocales() {
  return Object.keys(messages);
}

// Function to dynamically update page texts
function updatePageTexts() {
  // Update page title
  const titleElement = document.querySelector('title');
  if (titleElement) {
    titleElement.textContent = t('title');
  }

  // Update elements with data-i18n attribute
  const i18nElements = document.querySelectorAll('[data-i18n]');
  i18nElements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const text = t(key);
    element.textContent = text;
  });

  // Update elements with data-i18n-attr attribute (for updating attribute values)
  const i18nAttrElements = document.querySelectorAll('[data-i18n-attr]');
  i18nAttrElements.forEach(element => {
    const attrData = element.getAttribute('data-i18n-attr');
    const [key, attrName] = attrData.split('|');
    const value = t(key);
    element.setAttribute(attrName, value);
  });
}

// Export internationalization functions
export { t, setLocale, setLocaleSync, getLocale, getSupportedLocales, updatePageTexts, getBrowserLocale, initLocale };