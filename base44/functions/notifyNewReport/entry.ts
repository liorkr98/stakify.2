import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const report = payload.data;
    if (!report) return Response.json({ ok: true, skipped: 'no data' });

    const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    const adminEmail = adminUsers?.[0]?.email;
    if (!adminEmail) return Response.json({ ok: true, skipped: 'no admin email' });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `📄 New Report Published: "${report.title}"`,
      body: `
<h2>New Report on Stakify</h2>
<p><strong>Title:</strong> ${report.title}</p>
<p><strong>Author:</strong> ${report.author_name || report.created_by || 'Unknown'}</p>
<p><strong>Status:</strong> ${report.status}</p>
<p><strong>Tickers:</strong> ${(report.tickers || []).join(', ') || 'None'}</p>
<p><strong>Prediction:</strong> ${report.prediction_action ? `${report.prediction_action} $${report.prediction_ticker}` : 'None'}</p>
<p><strong>Published at:</strong> ${new Date().toUTCString()}</p>
<br/>
<a href="https://app.base44.com/report?id=${report.id}" style="background:#3b82f6;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">View Report</a>
      `.trim(),
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});