function showToast(message, isError = false) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';
  el.style.background = isError ? '#3a1717' : '#14231b';
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
  }, 3200);
}

function parseElement(title = '') {
  const match = title.match(/^(.*?)\s*\[([^\]]+)\]\s*$/);
  return {
    label: match ? match[1].trim() : title.trim(),
    id: match ? match[2].trim() : 'SEM-ID',
  };
}

function githubFallbackUrl({ id, label, text, meta }) {
  const title = `[3D] ${id} — ${label}`.slice(0, 120);
  const body = `## Feedback Casa Contreras\n\n**Elemento:** ${label}\n**ID:** \`${id}\`\n**Versão:** v0.8\n\n### Solicitação\n${text}\n\n### Contexto\n\`\`\`\n${meta}\n\`\`\``;
  return `https://github.com/Leetattoo/casa-container/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export function installFeedbackV08() {
  if (window.__CASA_FEEDBACK_V08__) return;
  window.__CASA_FEEDBACK_V08__ = true;

  const send = document.getElementById('sendFeedback');
  const cancel = document.getElementById('cancelFeedback');
  const text = document.getElementById('feedbackText');
  const title = document.getElementById('feedbackTitle');
  const meta = document.getElementById('feedbackMeta');
  if (!send || !text || !title || !meta) return;

  send.textContent = 'Enviar feedback';

  // Capture=true: intercepta o listener antigo antes que ele tente apenas abrir o GitHub.
  send.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const requestText = text.value.trim();
    if (!requestText) {
      showToast('Escreva o feedback primeiro.', true);
      text.focus();
      return;
    }

    const element = parseElement(title.textContent || '');
    const payload = {
      elementId: element.id,
      elementLabel: element.label,
      text: requestText,
      meta: meta.textContent || '',
      page: location.href,
      version: 'v0.8-performance-layout',
      qa: {
        dimension: window.__CASA_DIMENSION_QA__ || null,
        drive: window.__CASA_QA__ || null,
        performance: window.__CASA_PERF__ || null,
      },
    };

    const localId = `casa-feedback-pending-${Date.now()}`;
    localStorage.setItem(localId, JSON.stringify(payload));
    send.disabled = true;
    send.textContent = 'Enviando…';

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.error || `HTTP ${response.status}`);

      localStorage.removeItem(localId);
      localStorage.setItem(`casa-feedback-sent-${data.feedbackId}`, JSON.stringify({ ...payload, server: data }));
      showToast(`Feedback ${data.feedbackId} recebido.`);
      send.textContent = 'Enviado ✓';
      setTimeout(() => {
        if (cancel) cancel.click();
        send.disabled = false;
        send.textContent = 'Enviar feedback';
      }, 650);
    } catch (error) {
      console.error('[Casa Contreras] feedback API falhou', error);
      send.disabled = false;
      send.textContent = 'Enviar feedback';
      showToast('Falhou no servidor. Abrindo fallback do GitHub…', true);
      // Mantém o backup local e usa navegação na mesma aba para evitar bloqueio de popup.
      setTimeout(() => {
        location.href = githubFallbackUrl({ id: element.id, label: element.label, text: requestText, meta: meta.textContent || '' });
      }, 600);
    }
  }, true);
}
