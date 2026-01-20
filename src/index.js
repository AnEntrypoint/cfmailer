import { EmailMessage } from 'cloudflare:email';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/send-email') {
      return sendEmail(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
    }

    return json({ error: 'Not Found' }, { status: 404 });
  }
};

async function sendEmail(request, env) {
  try {
    const body = await request.json();
    const { to, subject, text, html, from } = body;

    if (!to || !subject || (!text && !html)) {
      return json({ error: 'Missing fields: to, subject, text or html' }, { status: 400 });
    }

    if (!isValidEmail(to)) {
      return json({ error: 'Invalid recipient email' }, { status: 400 });
    }

    const senderEmail = from || `noreply@${env.DOMAIN || 'example.com'}`;

    if (!isValidEmail(senderEmail)) {
      return json({ error: 'Invalid sender email' }, { status: 400 });
    }

    const message = new EmailMessage({
      from: senderEmail,
      to,
      subject: subject.substring(0, 998),
      ...(html && { html }),
      ...(text && { text })
    });

    await env.send_email.send(message);

    return json({
      success: true,
      message: `Email sent to ${to}`,
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email send error:', error.message);
    return json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(data, options = {}) {
  return new Response(JSON.stringify(data), {
    status: options.status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
