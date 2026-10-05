const ALLOWED_EVENTS = new Set([
  "landing_view",
  "review_started",
  "section_reached",
  "section_completed",
  "deep_dive_started",
  "deep_dive_completed",
  "review_completed",
  "report_viewed",
  "share"
]);

const ALLOWED_STAGES = new Set([
  "",
  // Legacy stage ids are retained for historical events already stored in D1.
  "business",
  "begin",
  "move",
  "buyer",
  "improve",
  // Current Cross-Through review stage ids.
  "foundation",
  "awareness",
  "alignment",
  "resolution",
  "decision",
  "process",
  "execution"
]);

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function cleanToken(value, max = 64) {
  if (typeof value !== "string") return "";
  return /^[a-zA-Z0-9_-]+$/.test(value)
    ? value.slice(0, max)
    : "";
}

function cleanHost(value) {
  if (typeof value !== "string") return "";

  const host = value
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "")
    .slice(0, 120);

  return host;
}

function deviceClass(request) {
  const ua =
    request.headers.get("User-Agent") || "";

  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

function timingSafeTextEqual(a, b) {
  const left = String(a || "");
  const right = String(b || "");

  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |=
      left.charCodeAt(index) ^
      right.charCodeAt(index);
  }

  return difference === 0;
}

function adminAuthorized(request, env) {
  if (!env.ADMIN_TOKEN) return false;

  const auth =
    request.headers.get("Authorization") || "";

  if (!auth.startsWith("Bearer ")) return false;

  return timingSafeTextEqual(
    auth.slice(7),
    env.ADMIN_TOKEN
  );
}

async function recordEvent(request, env) {
  if (!env.DB) {
    return json(
      { error: "Analytics database not configured" },
      503
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const eventType =
    typeof body.eventType === "string"
      ? body.eventType
      : "";

  if (!ALLOWED_EVENTS.has(eventType)) {
    return json({ error: "Unsupported event" }, 400);
  }

  const sessionId = cleanToken(
    body.sessionId,
    80
  );

  if (!sessionId) {
    return json({ error: "Missing session" }, 400);
  }

  const reviewId = cleanToken(
    body.reviewId || "",
    80
  );

  const stageId =
    typeof body.stageId === "string" &&
    ALLOWED_STAGES.has(body.stageId)
      ? body.stageId
      : "";

  const sectionIndex =
    Number.isInteger(body.sectionIndex) &&
    body.sectionIndex >= 1 &&
    body.sectionIndex <= 6
      ? body.sectionIndex
      : null;

  const shareChannel = cleanToken(
    body.shareChannel || "",
    24
  );

  const sourceTag = cleanToken(
    body.sourceTag || "",
    64
  );

  const referrerHost = cleanHost(
    body.referrerHost || ""
  );

  const country =
    cleanToken(request.cf?.country || "", 8);

  const region = String(
    request.cf?.region || ""
  )
    .replace(/[^a-zA-Z0-9 .'-]/g, "")
    .slice(0, 80);

  try {
    await env.DB.prepare(
      `INSERT OR IGNORE INTO sage_events (
        session_id,
        review_id,
        event_type,
        stage_id,
        section_index,
        referrer_host,
        country,
        region,
        device,
        source_tag,
        share_channel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        sessionId,
        reviewId,
        eventType,
        stageId,
        sectionIndex,
        referrerHost,
        country,
        region,
        deviceClass(request),
        sourceTag,
        shareChannel
      )
      .run();

    return json({ ok: true });
  } catch {
    return json({ error: "Unable to record event" }, 500);
  }
}

async function publicStats(env) {
  if (!env.DB) {
    return json(
      { completedReviews: null },
      503
    );
  }

  const row = await env.DB.prepare(
    `SELECT COUNT(DISTINCT review_id) AS count
     FROM sage_events
     WHERE event_type = 'review_completed'
       AND review_id <> ''`
  ).first();

  return json({
    completedReviews: Number(row?.count || 0),
    goal: 1000
  });
}

async function adminMetrics(request, env) {
  if (!adminAuthorized(request, env)) {
    return json({ error: "Unauthorized" }, 401);
  }

  if (!env.DB) {
    return json(
      { error: "Analytics database not configured" },
      503
    );
  }

  const [
    overviewResult,
    funnelResult,
    countriesResult,
    regionsResult,
    referrersResult,
    shareResult,
    sourceResult,
    deviceResult,
    dailyResult
  ] = await env.DB.batch([
    env.DB.prepare(
      `SELECT
        COUNT(DISTINCT CASE WHEN event_type = 'landing_view' THEN session_id END) AS landing_sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'review_started' THEN review_id END) AS review_starts,
        COUNT(DISTINCT CASE WHEN event_type = 'review_completed' THEN review_id END) AS completed_reviews,
        COUNT(DISTINCT CASE WHEN event_type = 'report_viewed' THEN review_id END) AS report_views,
        COUNT(DISTINCT CASE WHEN event_type = 'deep_dive_started' THEN review_id || ':' || stage_id END) AS deep_dives,
        COUNT(CASE WHEN event_type = 'share' THEN 1 END) AS shares
       FROM sage_events`
    ),
    env.DB.prepare(
      `SELECT stage_id, COUNT(DISTINCT session_id) AS sessions
       FROM sage_events
       WHERE event_type = 'section_reached'
       GROUP BY stage_id
       ORDER BY MIN(section_index)`
    ),
    env.DB.prepare(
      `SELECT country, COUNT(DISTINCT session_id) AS sessions
       FROM sage_events
       WHERE country <> ''
       GROUP BY country
       ORDER BY sessions DESC
       LIMIT 12`
    ),
    env.DB.prepare(
      `SELECT region, COUNT(DISTINCT session_id) AS sessions
       FROM sage_events
       WHERE region <> ''
       GROUP BY region
       ORDER BY sessions DESC
       LIMIT 12`
    ),
    env.DB.prepare(
      `SELECT referrer_host, COUNT(DISTINCT session_id) AS sessions
       FROM sage_events
       WHERE referrer_host <> ''
       GROUP BY referrer_host
       ORDER BY sessions DESC
       LIMIT 12`
    ),
    env.DB.prepare(
      `SELECT share_channel, COUNT(*) AS shares
       FROM sage_events
       WHERE event_type = 'share'
       GROUP BY share_channel
       ORDER BY shares DESC`
    ),
    env.DB.prepare(
      `SELECT source_tag, COUNT(DISTINCT session_id) AS sessions
       FROM sage_events
       WHERE source_tag <> ''
       GROUP BY source_tag
       ORDER BY sessions DESC
       LIMIT 20`
    ),
    env.DB.prepare(
      `SELECT device, COUNT(DISTINCT session_id) AS sessions
       FROM sage_events
       WHERE device <> ''
       GROUP BY device
       ORDER BY sessions DESC`
    ),
    env.DB.prepare(
      `SELECT
        date(created_at) AS day,
        COUNT(DISTINCT CASE WHEN event_type = 'review_started' THEN review_id END) AS starts,
        COUNT(DISTINCT CASE WHEN event_type = 'review_completed' THEN review_id END) AS completed
       FROM sage_events
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY date(created_at)
       ORDER BY day DESC`
    )
  ]);

  const overview =
    overviewResult.results?.[0] || {};

  const starts =
    Number(overview.review_starts || 0);

  const completed =
    Number(overview.completed_reviews || 0);

  return json({
    overview: {
      landingSessions: Number(
        overview.landing_sessions || 0
      ),
      reviewStarts: starts,
      completedReviews: completed,
      completionRate:
        starts > 0
          ? Math.round((completed / starts) * 100)
          : 0,
      reportViews: Number(
        overview.report_views || 0
      ),
      deepDives: Number(
        overview.deep_dives || 0
      ),
      shares: Number(overview.shares || 0)
    },
    funnel: funnelResult.results || [],
    countries: countriesResult.results || [],
    regions: regionsResult.results || [],
    referrers: referrersResult.results || [],
    shareChannels: shareResult.results || [],
    sourceTags: sourceResult.results || [],
    devices: deviceResult.results || [],
    daily: dailyResult.results || []
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/events") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }

      return recordEvent(request, env);
    }

    if (url.pathname === "/api/stats") {
      if (request.method !== "GET") {
        return json({ error: "Method not allowed" }, 405);
      }

      return publicStats(env);
    }

    if (url.pathname === "/api/admin/metrics") {
      if (request.method !== "GET") {
        return json({ error: "Method not allowed" }, 405);
      }

      return adminMetrics(request, env);
    }

    return new Response(null, { status: 404 });
  }
};
