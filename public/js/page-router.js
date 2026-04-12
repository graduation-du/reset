/**
 * page-router.js — Lightweight AJAX page router for smooth wizard transitions.
 *
 * Prevents Tailwind CDN and shared scripts from re-executing on every navigation.
 * Fetches the target page HTML, swaps only <main>, fires 'page:enter' so modules reinit.
 * Falls back to a full hard-navigation on any error.
 */
(function () {
  'use strict';

  var _busy = false;

  // Deduplication key for a script src.
  // Same-origin: use pathname only (ignores ?v= cache-buster).
  // External CDN: use origin + pathname (preserves the host).
  function _srcKey(src) {
    try {
      var u = new URL(src, location.origin);
      return u.origin === location.origin ? u.pathname : u.origin + u.pathname;
    } catch (e) { return src; }
  }

  // Track script srcs already present in this document — won't re-inject them.
  var _loadedSrcs = new Set(
    Array.from(document.querySelectorAll('script[src]')).map(function (s) {
      return _srcKey(s.getAttribute('src'));
    })
  );

  // Simple in-memory response cache (keyed by pathname).
  var _cache = Object.create(null);

  // ── Fetch page HTML (cached) ─────────────────────────────────────────────
  function _fetch(url) {
    if (_cache[url]) return Promise.resolve(_cache[url]);
    return fetch(url, {
      credentials: 'same-origin',
      headers: { 'Accept': 'text/html', 'X-Requested-With': 'PageRouter' }
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
      return r.text();
    }).then(function (html) {
      _cache[url] = html;
      return html;
    });
  }

  // ── Parse fetched HTML — extract main + scripts ──────────────────────────
  function _parse(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var main = doc.querySelector('main');
    var inlineScripts = [];
    var externalSrcs  = [];
    var pageStyles    = [];  // body-level <style> blocks (e.g. DOB wheel picker CSS)
    doc.body.querySelectorAll('style').forEach(function (s) {
      if (s.textContent.trim()) pageStyles.push(s.textContent);
    });
    doc.body.querySelectorAll('script').forEach(function (s) {
      var src = s.getAttribute('src');
      if (src) {
        externalSrcs.push(src);  // store full original src value
      } else if (s.textContent.trim()) {
        inlineScripts.push(s.textContent);
      }
    });
    return { main: main, inlineScripts: inlineScripts, externalSrcs: externalSrcs, pageStyles: pageStyles };
  }

  // ── Inject an external script only if it hasn't been loaded yet ──────────
  function _loadSrc(src) {
    var key = _srcKey(src);
    return new Promise(function (resolve) {
      if (_loadedSrcs.has(key)) { resolve(); return; }
      _loadedSrcs.add(key);
      var s = document.createElement('script');
      s.src = src;  // use original src (handles CDN URLs correctly)
      s.onload = s.onerror = resolve;
      document.body.appendChild(s);
    });
  }

  // ── Run inline script code in global (window) context ───────────────────
  function _runInline(scripts) {
    scripts.forEach(function (code) {
      try {
        // eslint-disable-next-line no-new-func
        new Function(code).call(window);
      } catch (e) {
        console.warn('[PageRouter] inline script error:', e);
      }
    });
  }

  // ── Main navigate function ────────────────────────────────────────────────
  /**
   * Navigate to a URL using AJAX content-swap.
   * Safe to call from any page script instead of window.location.href.
   * @param {string} url  Site-relative path, e.g. '/verify/civil-id'
   */
  window.navigateTo = function (url) {
    if (_busy) return;
    if (url === window.location.pathname) return;
    _busy = true;

    // Start fetching immediately — runs in parallel with the exit animation.
    var fetchPromise = _fetch(url);

    // Trigger the CSS exit animation (body.page-exiting main { animation: pageExit ... }).
    document.body.classList.add('page-exiting');

    // Wait for the exit animation (280 ms) AND the fetch to both complete.
    Promise.all([
      fetchPromise,
      new Promise(function (r) { setTimeout(r, 280); })
    ]).then(function (results) {
      var parsed = _parse(results[0]);
      if (!parsed.main) throw new Error('No <main> element in response for: ' + url);

      // Mark new main for entrance animation.
      parsed.main.classList.add('screen-transition');

      // Remove any page-specific styles injected by a previous navigation,
      // then inject the new page's styles so they are available before paint.
      document.querySelectorAll('style[data-page-style]').forEach(function (s) { s.remove(); });
      if (parsed.pageStyles.length) {
        var styleEl = document.createElement('style');
        styleEl.setAttribute('data-page-style', '1');
        styleEl.textContent = parsed.pageStyles.join('\n');
        document.head.appendChild(styleEl);
      }

      // Find current <main>. If its parent is an <a> (splash "tap anywhere" wrapper),
      // replace the whole <a> so it doesn't silently wrap future pages.
      var current = document.querySelector('main');
      var target  = (current && current.parentElement && current.parentElement.tagName === 'A')
        ? current.parentElement
        : current;
      if (target) target.replaceWith(parsed.main);

      // Update the browser URL bar.
      history.pushState({ url: url }, '', url);

      // Removing the exit class triggers a repaint — the new <main> becomes visible
      // and the .screen-transition entrance animation starts immediately.
      document.body.classList.remove('page-exiting');

      // Load any NEW external scripts needed by this page (first-time only).
      return Promise.all(parsed.externalSrcs.map(_loadSrc)).then(function () {

        // Re-run the page-specific inline initialisation code from the new page.
        _runInline(parsed.inlineScripts);

        // Signal all persistent modules (idle-timeout, privacy-shield, i18n, etc.)
        // to reinitialise themselves for the new page context.
        document.dispatchEvent(new CustomEvent('page:enter', { detail: { url: url } }));

        // Re-focus first input after entrance animation settles.
        setTimeout(function () {
          var first = document.querySelector('input[data-vkb]:not([disabled]), .otp-input:first-child');
          if (first) {
            first.focus();
            first.classList.add('input-autofocus-glow');
            first.addEventListener('animationend', function () {
              first.classList.remove('input-autofocus-glow');
            }, { once: true });
          }
        }, 420);

        window.scrollTo(0, 0);
      });

    }).catch(function (err) {
      console.error('[PageRouter] Error — falling back to hard navigation:', err);
      window.location.href = url;
    }).then(function () {
      _busy = false;
    });
  };

  // ── Prefetch on pointerdown for near-zero latency ────────────────────────
  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest('[data-prefetch]');
    if (el && el.dataset.prefetch) _fetch(el.dataset.prefetch).catch(function () {});
  }, { passive: true });

  // ── Browser back/forward navigation ─────────────────────────────────────
  window.addEventListener('popstate', function (e) {
    var target = (e.state && e.state.url) ? e.state.url : window.location.pathname;
    window.navigateTo(target);
  });

})();
