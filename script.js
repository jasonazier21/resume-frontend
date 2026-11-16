"use strict";

/* ------------------------------------------------------------------
 * Visitor counter API
 * TODO (Week 3): paste the Lambda / API Gateway invoke URL here, e.g.
 *   const API_URL = "https://abc123.execute-api.ap-southeast-1.amazonaws.com/count";
 * The endpoint should return JSON like {"count": 123}.
 * While this is an empty string the counter does nothing and the
 * footer keeps showing "–".
 * ------------------------------------------------------------------ */
const API_URL = "";

const THEME_KEY = "theme";

/* ---------- Theme ---------- */
function readStoredTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch (err) {
    return null; // storage blocked or unavailable
  }
}

function storeTheme(value) {
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch (err) {
    /* ignore: the choice just won't persist */
  }
}

function systemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") || systemTheme();
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0f141a" : "#0b5cad");
  updateToggle(theme);
}

function updateToggle(theme) {
  const button = document.getElementById("theme-toggle");
  const label = document.getElementById("theme-toggle-label");
  if (!button || !label) return;
  const next = theme === "dark" ? "light" : "dark";
  label.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  button.setAttribute("aria-label", "Switch to " + next + " mode");
}

// Apply a saved choice immediately (script is loaded in <head>) to avoid a flash.
const savedTheme = readStoredTheme();
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

function initTheme() {
  updateToggle(currentTheme());
  const button = document.getElementById("theme-toggle");
  if (!button) return;
  button.addEventListener("click", function () {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
  });
}

/* ---------- Visitor counter ---------- */
async function loadVisitorCount() {
  if (!API_URL) return; // not configured yet: leave "–"
  const el = document.getElementById("visits");
  if (!el) return;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return;
    const data = await response.json();
    const count = Number(data && data.count);
    if (Number.isFinite(count)) el.textContent = count.toLocaleString("en-US");
  } catch (err) {
    /* fail silently: keep the placeholder */
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  loadVisitorCount();
});
