/**
 * Hightouch 日本語化 — コンテンツスクリプト
 *
 * 動作概要:
 * 1. chrome.storage から ON/OFF 状態を取得
 * 2. ON の場合、ページ全体のテキストを日本語に置換
 * 3. MutationObserver（childList + characterData）で React SPA の動的更新にも追随
 * 4. SPA内タブ遷移を検知してフォールバックスキャンを再起動
 */

// ============================================================
// 翻訳対象から除外するCSSセレクタ
// ユーザーが入力・表示したデータ（カラム名・セル値等）は翻訳しない
// ============================================================
const EXCLUDE_SELECTORS = [
  "input",
  "textarea",
  "[contenteditable='true']",
  "code",
  "pre",
  ".cm-content",        // CodeMirror エディタ（SQLエディタ）
  ".cm-line",           // CodeMirror 行
  "table td",           // データプレビューのセル値（ユーザーデータのため除外）
  // table th は除外しない（Hightouch側のUIラベルのため翻訳対象）
  "[data-testid*='preview']",
  "[class*='cell-value']",
  "[class*='CellValue']",
  "[role='gridcell']",
  "[role='cell']",
  ".monaco-editor",     // Monaco エディタ（コードエディタ）
  "script",
  "style",
  "noscript",
];

// ============================================================
// 翻訳辞書（ja.json を fetch して読み込む）
// ============================================================
let translations = {};
let sortedKeys = [];
let templates = [];   // パターンマッチ用テンプレート
let isEnabled = true;
let isInitialized = false;

/**
 * 辞書をロードし、長い文字列が先に適用されるよう降順ソートする
 * _templates キーからパターンマッチ用テンプレートも読み込む
 */
async function loadTranslations() {
  try {
    const url = chrome.runtime.getURL("translations/ja.json");
    const response = await fetch(url);
    const data = await response.json();

    // _comment キーを除外
    delete data["_comment"];

    // _templates キーからパターンマッチ用テンプレートを読み込む
    if (Array.isArray(data["_templates"])) {
      templates = data["_templates"].map(t => ({
        regex: new RegExp(t.pattern),
        replacement: t.replacement,
      }));
      delete data["_templates"];
    }

    translations = data;

    // 長い文字列を先にマッチさせるため、キーを文字数の降順でソート
    sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);
  } catch (e) {
    console.error("[Hightouch 日本語化] 辞書の読み込みに失敗しました:", e);
  }
}

// ============================================================
// 翻訳ロジック
// ============================================================

/**
 * カーリークォート・アポストロフィをストレートクォートに正規化する
 * HightouchのUIはU+2018/U+2019等の特殊文字を使う場合があり、
 * 辞書キー（ストレートクォート）との一致に失敗するため正規化する
 */
function normalizeForLookup(text) {
  return text
    .replace(/\u00A0/g, ' ')                 // ノーブレークスペース → 通常スペース
    .replace(/[\u2018\u2019\u02BC]/g, "'")   // カーリーシングルクォート → '
    .replace(/[\u201C\u201D]/g, '"');         // カーリーダブルクォート → "
}

/**
 * 指定要素が翻訳除外セレクタに一致するか確認する
 */
function isExcluded(element) {
  for (const selector of EXCLUDE_SELECTORS) {
    try {
      if (element.matches && element.matches(selector)) return true;
      if (element.closest && element.closest(selector)) return true;
    } catch (e) {
      // 無効なセレクタは無視
    }
  }
  return false;
}

/**
 * テキストノードの内容を辞書に基づいて翻訳する
 * 元のテキストは data-ht-original 属性に保存する（復元・デバッグ用）
 *
 * ※ data-ht-original チェックは「すでに翻訳済みか」をスマートに判定する：
 *   - 属性の元テキストの翻訳結果 === 現在のテキスト → 翻訳済みのためスキップ
 *   - それ以外（Reactが再レンダリングして英語に戻った等）→ 再翻訳する
 */
// UIラベルの最大文字数。これを超えるテキストはユーザーデータの可能性があるためスキップする。
// data-ht-original 属性にユーザーデータが誤って保存されることを防ぐ。
// 注意: 一部の長いUI説明文（Databricks設定の説明など）は500字を超えるため1000に設定。
const MAX_TRANSLATE_LENGTH = 1000;

function translateTextNode(node) {
  const parent = node.parentElement;
  if (!parent) return;
  if (isExcluded(parent)) return;

  const raw = node.textContent.trim();
  if (!raw || raw.length === 0) return;
  if (raw.length > MAX_TRANSLATE_LENGTH) return;  // 長すぎるテキストはスキップ
  const trimmed = normalizeForLookup(raw);

  // スマートな翻訳済みチェック
  // 「元テキストの翻訳結果 === 現在のテキスト」であれば翻訳済み → スキップ
  // React が再レンダリングして英語に戻った場合や別テキストが入った場合は再翻訳する
  if (parent.hasAttribute("data-ht-original")) {
    const storedOriginal = parent.getAttribute("data-ht-original").trim();
    const expectedTranslation = translations[storedOriginal];
    if (expectedTranslation && trimmed === expectedTranslation) return;
  }

  // 辞書を長い順にスキャンして最初に一致したものを適用
  for (const key of sortedKeys) {
    if (trimmed === key) {
      parent.setAttribute("data-ht-original", trimmed);
      // 前後の空白を保持しつつ、中央のテキストだけを置換する
      node.textContent = node.textContent.replace(raw, translations[key]);
      return;
    }
  }

  // テンプレートマッチ（動的な値を含む文字列のパターン置換）
  for (const tmpl of templates) {
    if (tmpl.regex.test(trimmed)) {
      const translated = trimmed.replace(tmpl.regex, tmpl.replacement);
      if (translated !== trimmed) {
        parent.setAttribute("data-ht-original", trimmed);
        node.textContent = node.textContent.replace(raw, translated);
        return;
      }
    }
  }
}

/**
 * SPAN子要素を含む混合コンテンツ要素を翻訳する
 * 例: "Send <span>CRITICAL</span> alert" → "<span>CRITICAL</span>アラートを送信"
 *
 * 子スパンのテキストが翻訳結果に含まれる場合はスパンを適切な位置に保持する。
 * 含まれない場合（下線付きツールチップトリガーなど）はフォールバックとして
 * 最初のテキストノードに翻訳全文を入れ、子スパンを空にする。
 *
 * ※ 直接テキストノードが存在する要素のみを対象とする（アイコン+テキストの
 *   ナビ項目のような「テキストノードなし」要素には適用しない）。
 */
function applyMixedSpanTranslation(element, significantChildren, directTextNodes, translation) {
  element.setAttribute("data-ht-original", element.textContent.trim());

  if (significantChildren.length === 1) {
    const childSpan = significantChildren[0];
    const childText = childSpan.textContent;
    const idx = translation.indexOf(childText);

    if (idx !== -1) {
      // 子スパンのテキストが翻訳に含まれる → スパンを保持しつつ前後テキストを更新
      const before = translation.substring(0, idx);
      const after = translation.substring(idx + childText.length);

      let foundChild = false;
      const textBefore = [], textAfter = [];
      element.childNodes.forEach(node => {
        if (node === childSpan) { foundChild = true; return; }
        if (node.nodeType === Node.TEXT_NODE) {
          (foundChild ? textAfter : textBefore).push(node);
        }
      });

      if (textBefore.length > 0) {
        textBefore[0].textContent = before;
        textBefore.slice(1).forEach(n => { n.textContent = ""; });
      }
      if (textAfter.length > 0) {
        textAfter[0].textContent = after;
        textAfter.slice(1).forEach(n => { n.textContent = ""; });
      }
      return;
    }
  }

  // フォールバック: 直接テキストノードが存在する場合のみ最初のノードに翻訳を入れ、子スパンを空にする
  if (directTextNodes.length > 0) {
    directTextNodes[0].textContent = translation;
    directTextNodes.slice(1).forEach(n => { n.textContent = ""; });
    significantChildren.forEach(s => { s.textContent = ""; });
  }
}

/**
 * 要素ツリーを再帰的に走査してテキストノードを翻訳する
 */
function translateNode(rootNode) {
  if (!rootNode) return;

  // 除外要素はスキップ
  if (rootNode.nodeType === Node.ELEMENT_NODE && isExcluded(rootNode)) return;

  // テキストノードを翻訳
  if (rootNode.nodeType === Node.TEXT_NODE) {
    translateTextNode(rootNode);
    return;
  }

  // 要素レベルの翻訳チェック（react-wrap-balancer 対策）
  // react-wrap-balancer は <wbr> を挿入してテキストノードを分割するため、
  // テキストノード単位では辞書キーに完全一致しない場合がある。
  // 子要素が <wbr>/<br> のみの「葉に近い」要素に対しては、
  // 要素全体の textContent で辞書照合し、一括置換する。
  if (
    rootNode.nodeType === Node.ELEMENT_NODE &&
    !rootNode.hasAttribute("data-ht-original")
  ) {
    const significantChildren = Array.from(rootNode.children).filter(
      (c) => !["WBR", "BR", "SCRIPT", "STYLE"].includes(c.tagName)
    );
    if (significantChildren.length === 0) {
      const rawText = rootNode.textContent.trim();
      if (rawText.length > MAX_TRANSLATE_LENGTH) return;  // 長すぎるテキストはスキップ
      const fullText = normalizeForLookup(rawText);
      if (fullText && translations[fullText]) {
        rootNode.setAttribute("data-ht-original", fullText);
        // rootNode.textContent への直接代入は React が管理する子ノード（<wbr> 等）を
        // まるごと破壊し、React の removeChild 時に NotFoundError を引き起こすため、
        // テキストノードのみを個別に更新する。
        const textNodes = Array.from(rootNode.childNodes).filter(
          (n) => n.nodeType === Node.TEXT_NODE
        );
        if (textNodes.length > 0) {
          textNodes[0].textContent = translations[fullText];
          textNodes.slice(1).forEach((n) => { n.textContent = ""; });
        }
        return;
      }
    } else if (significantChildren.every(c => c.tagName === "SPAN")) {
      // 全 significant 子要素が SPAN の混合コンテンツ要素
      // 例: "Send <span>CRITICAL</span> alert"
      //
      // ★ 重要: 直接テキストノードがある場合のみ処理する。
      //   アイコン+ラベルのナビ項目（<icon-span><text-span>）のような
      //   「テキストノードなし」要素に適用するとラベルが消えるバグを防ぐ。
      const directTextNodes = Array.from(rootNode.childNodes).filter(
        n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
      );
      if (directTextNodes.length > 0) {
        const rawText = rootNode.textContent.trim();
        if (rawText && rawText.length <= MAX_TRANSLATE_LENGTH) {
          const fullText = normalizeForLookup(rawText);
          if (fullText && translations[fullText]) {
            applyMixedSpanTranslation(rootNode, significantChildren, directTextNodes, translations[fullText]);
            return;
          }
          for (const tmpl of templates) {
            if (tmpl.regex.test(fullText)) {
              const translated = fullText.replace(tmpl.regex, tmpl.replacement);
              if (translated !== fullText) {
                applyMixedSpanTranslation(rootNode, significantChildren, directTextNodes, translated);
                return;
              }
            }
          }
        }
      }
    }
  }

  // 子ノードを再帰的に処理
  if (rootNode.childNodes) {
    rootNode.childNodes.forEach(translateNode);
  }
}

/**
 * 翻訳を元に戻す（ON→OFF 時）
 * data-ht-original 属性から元テキストを復元する
 */
function revertTranslations() {
  document.querySelectorAll("[data-ht-original]").forEach((el) => {
    const original = el.getAttribute("data-ht-original");
    if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
      el.firstChild.textContent = original;
    }
    el.removeAttribute("data-ht-original");
  });
}

// ============================================================
// MutationObserver — React SPA の動的DOM変更を監視
// ============================================================

let debounceTimer = null;

/**
 * MutationObserver のコールバック
 * childList（ノード追加）と characterData（テキスト変更）の両方に反応する
 * react-wrap-balancer 等が characterData でテキストを書き換えるケースに対応
 */
function onDomMutation() {
  if (!isEnabled) return;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    translateNode(document.body);
  }, 200);
}

const observer = new MutationObserver(onDomMutation);

function startObserver() {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,   // テキストノードの内容変更も監視
  });
}

function stopObserver() {
  observer.disconnect();
}

// ============================================================
// フォールバックスキャン & SPA遷移検知
// ============================================================

/**
 * フォールバックスキャン
 * MutationObserver が取りこぼした要素を補完するため、
 * 起動後2秒おきに5回（計10秒間）ページ全体を再スキャンする
 */
function startFallbackScan() {
  let count = 0;
  const interval = setInterval(() => {
    if (!isEnabled) { clearInterval(interval); return; }
    translateNode(document.body);
    count++;
    if (count >= 5) clearInterval(interval);
  }, 2000);
}

/**
 * SPA内のタブ・ページ遷移を検知してフォールバックスキャンを再起動する
 * Hightouch は React SPA のため、URLが変わってもページ全体はリロードされない
 * タブ遷移後に新たにレンダリングされたコンテンツを確実に翻訳するために必要
 *
 * ※ enable() が複数回呼ばれても インターバルは1つだけ起動する
 */
let urlChangeDetectionStarted = false;

function startUrlChangeDetection() {
  if (urlChangeDetectionStarted) return;
  urlChangeDetectionStarted = true;

  let previousUrl = location.href;
  setInterval(() => {
    if (!isEnabled) return;
    const currentUrl = location.href;
    if (currentUrl !== previousUrl) {
      previousUrl = currentUrl;
      // 遷移直後は少し待ってからスキャン（React のレンダリング完了を待つ）
      setTimeout(() => {
        translateNode(document.body);
        startFallbackScan();
      }, 500);
    }
  }, 300);
}

// ============================================================
// 初期化 & ON/OFF 制御
// ============================================================

/**
 * 拡張機能を有効化する
 */
async function enable() {
  if (!isInitialized) {
    await loadTranslations();
    isInitialized = true;
  }
  isEnabled = true;
  translateNode(document.body);
  startObserver();
  startFallbackScan();
  startUrlChangeDetection();
}

/**
 * 拡張機能を無効化する（元の英語UIに戻す）
 */
function disable() {
  isEnabled = false;
  stopObserver();
  revertTranslations();
}

/**
 * chrome.storage.sync から設定を読み込んで初期化
 */
async function initialize() {
  chrome.storage.sync.get({ enabled: true }, async (result) => {
    if (result.enabled) {
      await enable();
    }
  });
}

/**
 * ポップアップからの ON/OFF メッセージを受信する
 */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SET_ENABLED") {
    if (message.enabled) {
      enable();
    } else {
      disable();
    }
  }
});

// ============================================================
// 起動
// ============================================================
initialize();
