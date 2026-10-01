import React, { useState } from "react";

const STAGE_LABELS = {
  business: "Your Business",
  begin: "How Sales Begin",
  move: "How Sales Move",
  buyer: "How Buyers Progress",
  improve: "Improvement",
  execution: "Execution"
};

function MetricCard({ label, value, note }) {
  return (
    <article className="admin-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}

function DataList({ title, rows, labelKey, valueKey }) {
  return (
    <section className="admin-data-card">
      <h2>{title}</h2>

      {rows?.length ? (
        <div className="admin-data-list">
          {rows.map((row, index) => (
            <div
              className="admin-data-row"
              key={`${row[labelKey]}-${index}`}
            >
              <span>{row[labelKey] || "Direct / unknown"}</span>
              <strong>{row[valueKey]}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="admin-empty">No data yet.</p>
      )}
    </section>
  );
}

export default function AdminDashboard() {
  const [accessKey, setAccessKey] = useState(
    () => {
      try {
        return window.sessionStorage.getItem(
          "sage-admin-key"
        ) || "";
      } catch {
        return "";
      }
    }
  );
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");

  async function loadDashboard(event) {
    event?.preventDefault();
    setStatus("Loading…");

    try {
      const response = await fetch(
        "/api/admin/metrics",
        {
          headers: {
            Authorization: `Bearer ${accessKey}`
          }
        }
      );

      if (response.status === 401) {
        setStatus("Access key not accepted.");
        setData(null);
        return;
      }

      if (!response.ok) {
        setStatus(
          "Admin analytics are not configured yet."
        );
        setData(null);
        return;
      }

      const result = await response.json();

      try {
        window.sessionStorage.setItem(
          "sage-admin-key",
          accessKey
        );
      } catch {
        // Session persistence is optional.
      }

      setData(result);
      setStatus("");
    } catch {
      setStatus("Unable to load analytics.");
    }
  }

  const overview = data?.overview || {};

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <div className="eyebrow">
          SAGE ADMIN
        </div>
        <h1>Growth & usage</h1>
        <p>
          Anonymous product analytics only. SAGE does not
          send diagnostic answers, company details, email
          addresses, names, or IP addresses into this
          dashboard.
        </p>
      </section>

      {!data && (
        <form
          className="admin-login"
          onSubmit={loadDashboard}
        >
          <label htmlFor="admin-key">
            Admin access key
          </label>
          <input
            id="admin-key"
            type="password"
            value={accessKey}
            autoComplete="current-password"
            onChange={(event) =>
              setAccessKey(event.target.value)
            }
          />
          <button
            className="primary-button"
            type="submit"
            disabled={!accessKey}
          >
            View Dashboard
          </button>
          {status && (
            <div className="admin-status">
              {status}
            </div>
          )}
        </form>
      )}

      {data && (
        <>
          <section className="admin-metrics">
            <MetricCard
              label="Review starts"
              value={overview.reviewStarts || 0}
            />
            <MetricCard
              label="Reviews completed"
              value={overview.completedReviews || 0}
            />
            <MetricCard
              label="Completion rate"
              value={`${overview.completionRate || 0}%`}
            />
            <MetricCard
              label="Reports viewed"
              value={overview.reportViews || 0}
            />
            <MetricCard
              label="Shares"
              value={overview.shares || 0}
            />
          </section>

          <section className="admin-grid">
            <DataList
              title="Core Review funnel"
              rows={(data.funnel || []).map((row) => ({
                ...row,
                label:
                  STAGE_LABELS[row.stage_id] ||
                  row.stage_id
              }))}
              labelKey="label"
              valueKey="sessions"
            />
            <DataList
              title="Countries"
              rows={data.countries}
              labelKey="country"
              valueKey="sessions"
            />
            <DataList
              title="Regions"
              rows={data.regions}
              labelKey="region"
              valueKey="sessions"
            />
            <DataList
              title="Referrers"
              rows={data.referrers}
              labelKey="referrer_host"
              valueKey="sessions"
            />
            <DataList
              title="Shared through"
              rows={data.shareChannels}
              labelKey="share_channel"
              valueKey="shares"
            />
            <DataList
              title="Tracked links"
              rows={data.sourceTags}
              labelKey="source_tag"
              valueKey="sessions"
            />
          </section>

          <section className="admin-data-card admin-wide-card">
            <h2>Last 30 days</h2>
            <div className="admin-data-list">
              {(data.daily || []).map((row) => (
                <div
                  className="admin-data-row"
                  key={row.day}
                >
                  <span>{row.day}</span>
                  <strong>
                    {row.starts} starts ·{" "}
                    {row.completed} completed
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <div className="admin-refresh">
            <button
              type="button"
              className="back-button"
              onClick={loadDashboard}
            >
              Refresh Data
            </button>
          </div>
        </>
      )}
    </main>
  );
}
