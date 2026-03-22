/**
 * Hightouch 日本語化 — ポップアップスクリプト
 *
 * 役割:
 * - ON/OFFトグルの状態を chrome.storage.sync に保存
 * - content.js へメッセージを送信して翻訳を切り替える
 * - 登録済み用語数を表示する
 */

// GitHub リポジトリURL（公開後に実際のURLへ変更してください）
const GITHUB_URL = "https://github.com/justin-hieher/hightouch-ja";
const GLOSSARY_URL =
  "https://github.com/justin-hieher/hightouch-ja/blob/main/translations/glossary.md";
const RELEASES_URL = "https://github.com/justin-hieher/hightouch-ja/releases";

const toggle = document.getElementById("enableToggle");
const statsSection = document.getElementById("statsSection");
const disabledNotice = document.getElementById("disabledNotice");
const termCountEl = document.getElementById("termCount");
const glossaryLink = document.getElementById("glossaryLink");
const githubLink = document.getElementById("githubLink");
const versionDisplay = document.getElementById("versionDisplay");
const releasesLink = document.getElementById("releasesLink");

// リンク先を設定
glossaryLink.href = GLOSSARY_URL;
githubLink.href = GITHUB_URL;
releasesLink.href = RELEASES_URL;

// バージョン番号を manifest.json から取得して表示
const { version } = chrome.runtime.getManifest();
versionDisplay.textContent = `v${version}`;

/**
 * 登録済み用語数を ja.json から取得して表示する
 */
async function loadTermCount() {
  try {
    const url = chrome.runtime.getURL("translations/ja.json");
    const res = await fetch(url);
    const data = await res.json();
    const count = Object.keys(data).filter((k) => k !== "_comment" && k !== "_templates").length;
    termCountEl.textContent = count;
  } catch (e) {
    termCountEl.textContent = "—";
  }
}

/**
 * UI の表示状態を enabled に合わせて更新する
 */
function updateUI(enabled) {
  toggle.checked = enabled;
  if (enabled) {
    statsSection.style.display = "block";
    disabledNotice.style.display = "none";
  } else {
    statsSection.style.display = "none";
    disabledNotice.style.display = "block";
  }
}

/**
 * content.js へ有効/無効メッセージを送信する
 */
async function notifyContentScript(enabled) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: "SET_ENABLED", enabled });
    }
  } catch (e) {
    // content script が未注入の場合は無視（ページリロードで解決）
  }
}

// ============================================================
// イベント: トグル切り替え
// ============================================================
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ enabled }, () => {
    updateUI(enabled);
    notifyContentScript(enabled);
  });
});

// ============================================================
// 初期化: 保存済みの状態を読み込む
// ============================================================
chrome.storage.sync.get({ enabled: true }, (result) => {
  updateUI(result.enabled);
});

loadTermCount();
