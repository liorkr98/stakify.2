import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get reports created in the last 7 days
    const allReports = await base44.asServiceRole.entities.Report.list('-created_date', 100);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentReports = allReports.filter(r => new Date(r.created_date) >= oneWeekAgo);

    const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    const adminEmail = adminUsers?.[0]?.email;
    if (!adminEmail) return Response.json({ ok: true, skipped: 'no admin email' });

    const published = recentReports.filter(r => r.status === 'published');
    const drafts = recentReports.filter(r => r.status === 'draft');

    const reportRows = recentReports.map(r => `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:8px 12px;font-weight:600;">${r.title || 'Untitled'}</td>
        <td style="padding:8px 12px;color:#6b7280;">${r.author_name || r.created_by || '—'}</td>
        <td style="padding:8px 12px;">${r.status === 'published' ? '✅ Published' : '📝 Draft'}</td>
        <td style="padding:8px 12px;color:#6b7280;">${(r.tickers || []).join(', ') || '—'}</td>
        <td style="padding:8px 12px;color:#6b7280;">${new Date(r.created_date).toLocaleDateString()}</td>
      </tr>
    `).join('');

    const body = `
<div style="font-family:sans-serif;max-width:700px;margin:0 auto;">
  <h2 style="color:#1e3a5f;">📊 Weekly Report Summary — Stakify</h2>
  <p style="color:#6b7280;">Week ending ${new Date().toDateString()}</p>

  <div style="display:flex;gap:24px;margin:24px 0;">
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px 24px;text-align:center;">
      <div style="font-size:28px;font-weight:700;color:#0369a1;">${recentReports.length}</div>
      <div style="font-size:12px;color:#6b7280;">Total Reports</div>
    </div>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 24px;text-align:center;">
      <div style="font-size:28px;font-weight:700;color:#16a34a;">${published.length}</div>
      <div style="font-size:12px;color:#6b7280;">Published</div>
    </div>
    <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:16px 24px;text-align:center;">
      <div style="font-size:28px;font-weight:700;color:#d97706;">${drafts.length}</div>
      <div style="font-size:12px;color:#6b7280;">Drafts</div>
    </div>
  </div>

  ${recentReports.length > 0 ? `
  <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    <thead>
      <tr style="background:#f9fafb;">
        <th style="padding:10px 12px;text-align:left;color:#374151;">Title</th>
        <th style="padding:10px 12px;text-align:left;color:#374151;">Author</th>
        <th style="padding:10px 12px;text-align:left;color:#374151;">Status</th>
        <th style="padding:10px 12px;text-align:left;color:#374151;">Tickers</th>
        <th style="padding:10px 12px;text-align:left;color:#374151;">Date</th>
      </tr>
    </thead>
    <tbody>${reportRows}</tbody>
  </table>` : '<p style="color:#6b7280;font-style:italic;">No new reports this week.</p>'}

  <br/>
  <a href="https://app.base44.com" style="background:#3b82f6;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Open Stakify</a>
  <p style="color:#9ca3af;font-size:12px;margin-top:24px;">You're receiving this because you're an admin of Stakify.</p>
</div>
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `📊 Weekly Summary: ${recentReports.length} new report(s) this week`,
      body,
    });

    return Response.json({ ok: true, reportCount: recentReports.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});