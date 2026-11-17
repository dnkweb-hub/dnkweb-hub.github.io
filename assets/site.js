// Контакты — только согласованные публичные каналы. Не записывайте сюда рабочие данные.
// Telegram: публичная ссылка https://t.me/имя_пользователя
// MAX: полная публичная ссылка на профиль/чат, полученная из самого MAX
// Email: публичный адрес для заказчиков
// На странице показываем только подключённые контактные каналы.
window.PORTFOLIO_CONTACT = Object.freeze({
  telegram: 'https://t.me/dnk_automation_bot',
  max: '',
  email: 'dnkweb@gmail.com'
});

window.addEventListener('DOMContentLoaded', () => {
  const settings = window.PORTFOLIO_CONTACT || {};
  const isHttps = value => { try { const url = new URL(value); return url.protocol === 'https:'; } catch { return false; } };
  const targets = {
    telegram: v => isHttps(v) && new URL(v).hostname === 't.me' ? v : null,
    max: v => isHttps(v) ? v : null,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'mailto:' + v : null
  };
  Object.entries(targets).forEach(([kind, makeUrl]) => {
    const value = String(settings[kind] || '').trim();
    const href = makeUrl(value);
    const card = document.querySelector('[data-channel-card="' + kind + '"]');
    if (!card || !href) return;
    const link = card.querySelector('[data-channel-link]');
    const note = card.querySelector('[data-channel-note]');
    if (!link || !note) return;
    link.href = href;
    link.hidden = false;
    card.dataset.active = 'true';
    note.textContent = kind === 'email' ? value : (kind === 'telegram' ? 'Опишите задачу, сроки и ожидаемый результат. Можно приложить файл или техническое задание.' : 'Удобный способ обсудить задачу и обменяться деталями.');
  });
});
// Публичные *агрегаты* FL Market Radar, отдельно от приватной базы заказов.
// Источник: assets/radar-metrics.js, создаётся tools/export_radar_stats.py.
// Никакие описания, заказчики и ссылки на частные объявления сюда не передаются.
window.addEventListener('DOMContentLoaded', () => {
  const s = window.PORTFOLIO_RADAR_METRICS;
  if (!s || typeof s !== 'object') return;
  const keys = ['total', 'with_budget', 'truncated'];
  if (!keys.every(k => Number.isSafeInteger(s[k]) && s[k] >= 0)) return;
  if (s.with_budget > s.total || s.truncated > s.total) return;
  for (const k of keys) {
    document.querySelectorAll('[data-radar-metric="' + k + '"]').forEach(node => {
      node.textContent = String(s[k]);
    });
  }
  const d = new Date(s.latest_first_seen || '');
  if (!Number.isFinite(d.getTime())) return;
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'
  }).format(d);
  document.querySelectorAll('[data-radar-last-seen]').forEach(node => {
    node.textContent = 'Последнее пополнение истории: ' + formatted;
  });
  document.querySelectorAll('[data-radar-date]').forEach(node => {
    node.textContent = formatted;
  });
});
