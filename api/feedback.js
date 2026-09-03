module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const text = String(body.text || '').trim().slice(0, 4000);
    const elementId = String(body.elementId || 'SEM-ID').slice(0, 160);
    const elementLabel = String(body.elementLabel || '').slice(0, 220);
    const meta = String(body.meta || '').slice(0, 2500);
    if (!text) return res.status(400).json({ ok: false, error: 'empty_feedback' });

    const feedbackId = `CC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const record = {
      event: 'CASA_CONTRERAS_FEEDBACK',
      feedbackId,
      createdAt: new Date().toISOString(),
      elementId,
      elementLabel,
      text,
      meta,
      page: String(body.page || '').slice(0, 500),
      version: String(body.version || 'v0.8').slice(0, 80),
      qa: body.qa && typeof body.qa === 'object' ? body.qa : null,
    };

    // O registro fica nos Runtime Logs da própria aplicação e recebe um ID
    // confirmado pelo servidor. O navegador mantém também um backup local.
    console.log(JSON.stringify(record));
    return res.status(201).json({ ok: true, feedbackId, createdAt: record.createdAt });
  } catch (error) {
    console.error(JSON.stringify({ event: 'CASA_CONTRERAS_FEEDBACK_ERROR', message: error?.message || String(error) }));
    return res.status(500).json({ ok: false, error: 'feedback_failed' });
  }
};
