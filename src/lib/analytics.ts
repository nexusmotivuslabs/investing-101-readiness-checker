import type { AnalyticsEvent, AnalyticsPayload } from "./types";

declare global {
  interface Window {
    investing101Analytics?: AnalyticsPayload[];
    dataLayer?: Array<Record<string, string | number | boolean>>;
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  properties: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: AnalyticsPayload = {
    event,
    timestamp: new Date().toISOString(),
    properties,
  };

  window.investing101Analytics = window.investing101Analytics ?? [];
  window.investing101Analytics.push(payload);
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...properties });
  console.info("[analytics placeholder]", payload);
}
