const SESSION_KEY = "sage-anonymous-session";
const REVIEW_KEY = "sage-review-id";

function randomId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function readStorage(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    // Telemetry must never interrupt the diagnostic.
  }
}

export function getAnonymousSessionId() {
  let id = readStorage(window.sessionStorage, SESSION_KEY);

  if (!id) {
    id = randomId();
    writeStorage(window.sessionStorage, SESSION_KEY, id);
  }

  return id;
}

export function getReviewId({ create = false } = {}) {
  let id = readStorage(window.localStorage, REVIEW_KEY);

  if (!id && create) {
    id = randomId();
    writeStorage(window.localStorage, REVIEW_KEY, id);
  }

  return id || "";
}

export function resetReviewId() {
  try {
    window.localStorage.removeItem(REVIEW_KEY);
  } catch {
    // Continue without persistence.
  }
}

function referrerHost() {
  if (!document.referrer) return "";

  try {
    const host = new URL(document.referrer).hostname;
    return host === window.location.hostname ? "" : host;
  } catch {
    return "";
  }
}

function sourceTag() {
  const raw =
    new URLSearchParams(window.location.search).get("via") || "";

  return /^[a-zA-Z0-9_-]{1,64}$/.test(raw) ? raw : "";
}

export async function trackEvent(
  eventType,
  {
    stageId = "",
    sectionIndex = null,
    shareChannel = "",
    createReview = false
  } = {}
) {
  const payload = {
    eventType,
    sessionId: getAnonymousSessionId(),
    reviewId: getReviewId({ create: createReview }),
    stageId,
    sectionIndex,
    referrerHost: referrerHost(),
    sourceTag: sourceTag(),
    shareChannel
  };

  try {
    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch {
    // Anonymous telemetry is non-essential and must fail silently.
  }
}

export async function getPublicStats() {
  try {
    const response = await fetch("/api/stats", {
      headers: { Accept: "application/json" }
    });

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
}

export const shareMessage =
  "Every business has a way it sells. SAGE turns that into a visible sales-system picture—free, private, and no CRM or uploads required.";

export async function shareSage() {
  const url = "https://thesalessuccess.app/";
  const data = {
    title: "SAGE — Free Sales System Review",
    text: shareMessage,
    url
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
      trackEvent("share", {
        shareChannel: "native"
      });
      return { shared: true, method: "native" };
    } catch (error) {
      if (error?.name === "AbortError") {
        return { shared: false, method: "cancelled" };
      }
    }
  }

  try {
    await navigator.clipboard.writeText(
      `${shareMessage} ${url}`
    );

    trackEvent("share", {
      shareChannel: "copy"
    });

    return { shared: true, method: "copy" };
  } catch {
    window.prompt(
      "Copy this SAGE link:",
      url
    );

    trackEvent("share", {
      shareChannel: "manual"
    });

    return { shared: true, method: "manual" };
  }
}
