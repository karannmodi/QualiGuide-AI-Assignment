import { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileStack, MessageSquareText, ClipboardList, Users,
  ShieldCheck, AlertTriangle, Search, ChevronRight, Filter, X, LogOut,
  CircleUserRound, Factory, Wrench, Boxes, HardHat, ListChecks, PackageSearch,
  ClipboardCheck, ThumbsUp, ThumbsDown, CircleAlert, History, MessageCircle,
  Inbox, UploadCloud, CheckCircle2
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Design tokens + component CSS (no Tailwind compiler available, so   */
/* every color/type decision lives here as plain CSS custom classes)   */
/* ------------------------------------------------------------------ */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

  .qg-root {
    --bg: #F4F6F8;
    --surface: #FFFFFF;
    --surface-alt: #ECF0F3;
    --ink: #16212C;
    --ink-muted: #5C6773;
    --border: #DCE2E7;
    --brand: #28527A;
    --brand-dark: #1B3A55;
    --brand-tint: #E7EEF3;
    --verified: #1E7A5C;
    --verified-bg: #E7F3EE;
    --verified-border: #BFDFD2;
    --warn: #9C5A18;
    --warn-bg: #FBF1E2;
    --warn-border: #EAD2A8;
    --archived: #8992A0;
    font-family: 'Inter', sans-serif;
    color: var(--ink);
    background: var(--bg);
    min-height: 100vh;
    display: flex;
  }
  .qg-mono { font-family: 'IBM Plex Mono', monospace; }
  .qg-display { font-family: 'Space Grotesk', sans-serif; }

  /* ---------- Accessibility: consistent visible keyboard focus ---------- */
  .qg-root button:focus-visible,
  .qg-root a:focus-visible,
  .qg-root [tabindex]:focus-visible {
    outline: 2px solid var(--brand); outline-offset: 2px; border-radius: 3px;
  }
  .qg-root input:focus-visible,
  .qg-root select:focus-visible,
  .qg-root textarea:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(40, 82, 122, 0.25);
    border-color: var(--brand);
  }

  /* ---------- Role Selector (simulated login) ---------- */
  .qg-login-wrap {
    min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(180deg, #1B3A55 0%, #28527A 55%, #2E5E8C 100%);
    padding: 32px;
  }
  .qg-login-card {
    background: var(--surface); border-radius: 4px; width: 100%; max-width: 560px;
    padding: 40px 40px 32px; box-shadow: 0 20px 60px rgba(15, 30, 45, 0.35);
  }
  .qg-login-eyebrow {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--brand); font-weight: 600;
  }
  .qg-login-title {
    font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700;
    margin: 6px 0 4px; color: var(--ink);
  }
  .qg-login-sub { color: var(--ink-muted); font-size: 14px; line-height: 1.5; margin-bottom: 24px; }
  .qg-role-list { display: flex; flex-direction: column; gap: 10px; }
  .qg-role-btn {
    display: flex; align-items: center; gap: 14px; text-align: left;
    border: 1px solid var(--border); background: var(--surface);
    border-radius: 4px; padding: 14px 16px; cursor: pointer; transition: all 0.15s ease;
  }
  .qg-role-btn:hover { border-color: var(--brand); background: var(--brand-tint); }
  .qg-role-icon {
    width: 38px; height: 38px; border-radius: 4px; background: var(--brand-tint);
    color: var(--brand); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .qg-role-name { font-weight: 600; font-size: 14px; color: var(--ink); }
  .qg-role-need { font-size: 12.5px; color: var(--ink-muted); margin-top: 1px; }
  .qg-sim-note {
    margin-top: 22px; font-size: 12px; color: var(--ink-muted); border-top: 1px solid var(--border);
    padding-top: 14px; display: flex; gap: 8px; align-items: flex-start; line-height: 1.5;
  }

  /* ---------- Shell / Sidebar ---------- */
  .qg-sidebar {
    width: 232px; flex-shrink: 0; background: var(--brand-dark); color: #EAF0F5;
    display: flex; flex-direction: column; padding: 20px 14px;
  }
  .qg-brand { display: flex; align-items: center; gap: 9px; padding: 0 8px 20px; }
  .qg-brand-mark {
    width: 26px; height: 26px; border-radius: 3px; background: #EAF0F5; color: var(--brand-dark);
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
    font-family: 'IBM Plex Mono', monospace;
  }
  .qg-brand-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 0.01em; }
  .qg-nav { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; }
  .qg-nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 4px;
    font-size: 13.5px; font-weight: 500; color: #C7D5E0; cursor: pointer; border: none; background: none;
    width: 100%; text-align: left; transition: background 0.12s ease;
  }
  .qg-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
  .qg-nav-item.active { background: rgba(255,255,255,0.14); color: #fff; }
  .qg-nav-item.disabled { color: #6E8092; cursor: default; }
  .qg-nav-item.disabled:hover { background: none; color: #6E8092; }
  .qg-nav-soon {
    margin-left: auto; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.05em;
    background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 20px; font-family: 'IBM Plex Mono', monospace;
  }
  .qg-sidebar-footer {
    margin-top: auto; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 12px;
  }
  .qg-role-chip {
    display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #DCE7EF; padding: 6px 8px;
  }
  .qg-switch-btn {
    display: flex; align-items: center; gap: 7px; font-size: 12px; color: #A9BDCC; background: none;
    border: none; cursor: pointer; padding: 7px 8px; width: 100%; border-radius: 4px;
  }
  .qg-switch-btn:hover { background: rgba(255,255,255,0.06); color: #fff; }

  /* ---------- Main area ---------- */
  .qg-main { flex: 1; padding: 28px 36px 40px; overflow-y: auto; }
  .qg-page-head { margin-bottom: 22px; }
  .qg-page-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; }
  .qg-page-sub { color: var(--ink-muted); font-size: 13.5px; margin-top: 4px; max-width: 640px; line-height: 1.5; }
  .qg-sim-banner {
    display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600;
    color: var(--brand); background: var(--brand-tint); padding: 4px 9px; border-radius: 20px;
    letter-spacing: 0.02em; margin-bottom: 10px;
  }

  /* ---------- Dashboard ---------- */
  .qg-stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 26px; }
  .qg-stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 16px 18px; }
  .qg-stat-num { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; }
  .qg-stat-label { font-size: 12px; color: var(--ink-muted); margin-top: 2px; }
  .qg-panel-row { display: grid; grid-template-columns: 1.3fr 1fr; gap: 18px; }
  .qg-panel {
    background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 20px;
  }
  .qg-panel-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 4px; }
  .qg-panel-sub { font-size: 12.5px; color: var(--ink-muted); margin-bottom: 14px; }
  .qg-quicklink {
    display: flex; align-items: center; justify-content: space-between; padding: 11px 12px;
    border: 1px solid var(--border); border-radius: 4px; margin-bottom: 8px; cursor: pointer; background: var(--surface);
    width: 100%; text-align: left; font-family: 'Inter', sans-serif;
  }
  .qg-quicklink:hover { border-color: var(--brand); background: var(--brand-tint); }
  .qg-quicklink-label { font-size: 13.5px; font-weight: 600; display: flex; align-items: center; gap: 9px; }
  .qg-persona-need { font-size: 13px; line-height: 1.6; color: var(--ink); }
  .qg-persona-need b { color: var(--brand-dark); }

  /* ---------- Document Library ---------- */
  .qg-filter-bar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
  .qg-search-input {
    flex: 1; min-width: 220px; display: flex; align-items: center; gap: 8px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 4px; padding: 8px 12px;
  }
  .qg-search-input input { border: none; outline: none; font-size: 13.5px; width: 100%; font-family: 'Inter', sans-serif; background: transparent; color: var(--ink); }
  .qg-select {
    border: 1px solid var(--border); border-radius: 4px; background: var(--surface); font-size: 13px;
    padding: 8px 10px; color: var(--ink); font-family: 'Inter', sans-serif;
  }
  .qg-doc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .qg-doc-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 14px 16px;
  }
  .qg-doc-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
  .qg-doc-title { font-weight: 600; font-size: 14px; line-height: 1.4; }
  .qg-doc-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
  .qg-tag {
    font-size: 10.5px; font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; letter-spacing: 0.03em;
    padding: 2px 7px; border-radius: 20px; background: var(--surface-alt); color: var(--ink-muted);
  }
  .qg-tag.status-current { background: var(--verified-bg); color: var(--verified); }
  .qg-tag.status-archived { background: #F1EEE9; color: var(--archived); }
  .qg-doc-excerpt { font-size: 12.5px; color: var(--ink-muted); margin-top: 9px; line-height: 1.5; }
  .qg-empty { color: var(--ink-muted); font-size: 13.5px; padding: 30px 0; text-align: center; }

  /* ---------- Q&A ---------- */
  .qg-ask-box {
    background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 16px; margin-bottom: 8px;
  }
  .qg-ask-row { display: flex; gap: 10px; }
  .qg-ask-row input {
    flex: 1; border: 1px solid var(--border); border-radius: 4px; padding: 10px 12px; font-size: 14px;
    font-family: 'Inter', sans-serif; outline: none; color: var(--ink);
  }
  .qg-ask-row input:focus { border-color: var(--brand); }
  .qg-ask-btn {
    background: var(--brand); color: #fff; border: none; border-radius: 4px; padding: 0 18px;
    font-weight: 600; font-size: 13.5px; cursor: pointer; display: flex; align-items: center; gap: 6px;
  }
  .qg-ask-btn:hover { background: var(--brand-dark); }
  .qg-ask-btn:disabled { background: var(--archived); cursor: default; }
  .qg-chip-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  .qg-chip {
    font-size: 12px; border: 1px solid var(--border); background: var(--surface); border-radius: 20px;
    padding: 5px 12px; cursor: pointer; color: var(--ink-muted);
  }
  .qg-chip:hover { border-color: var(--brand); color: var(--brand); }

  .qg-qa-thread { display: flex; flex-direction: column; gap: 14px; margin-top: 18px; }
  .qg-q-bubble { font-size: 13.5px; color: var(--ink-muted); }
  .qg-q-bubble b { color: var(--ink); font-weight: 600; }

  .qg-stamp-card {
    position: relative; background: var(--verified-bg); border: 1px solid var(--verified-border);
    border-radius: 4px; padding: 16px 18px 16px 20px; overflow: hidden;
  }
  .qg-stamp-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: var(--verified);
  }
  .qg-stamp-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
  .qg-stamp-seal {
    display: flex; align-items: center; gap: 6px; background: var(--verified); color: #fff; font-size: 11px;
    font-weight: 700; padding: 3px 10px 3px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .qg-stamp-answer { font-size: 14px; line-height: 1.6; color: var(--ink); margin-bottom: 12px; }
  .qg-cite-box {
    background: var(--surface); border: 1px dashed var(--verified-border); border-radius: 4px; padding: 10px 12px;
  }
  .qg-cite-doc { font-size: 12.5px; font-weight: 700; color: var(--brand-dark); display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .qg-cite-rev { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-muted); }
  .qg-cite-excerpt { font-size: 12.5px; color: var(--ink-muted); margin-top: 5px; font-style: italic; line-height: 1.5; }

  .qg-refusal-card {
    position: relative; background: var(--warn-bg); border: 1px solid var(--warn-border);
    border-radius: 4px; padding: 16px 18px 16px 20px; overflow: hidden;
  }
  .qg-refusal-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: var(--warn);
  }
  .qg-refusal-head { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; color: var(--warn); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.03em; }
  .qg-refusal-text { font-size: 13.5px; color: var(--ink); line-height: 1.55; }

  /* ---------- NCR Assistant ---------- */
  .qg-ncr-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
  .qg-example-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .qg-example-chip {
    display: flex; align-items: center; gap: 7px; font-size: 12.5px; border: 1px solid var(--border);
    background: var(--surface); border-radius: 4px; padding: 7px 12px; cursor: pointer; color: var(--ink);
  }
  .qg-example-chip:hover { border-color: var(--brand); background: var(--brand-tint); }
  .qg-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .qg-form-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
  .qg-form-field.full { grid-column: span 2; }
  .qg-form-label { font-size: 12px; font-weight: 600; color: var(--ink-muted); }
  .qg-form-label .req { color: var(--warn); margin-left: 2px; }
  .qg-form-input, .qg-form-select, .qg-form-textarea {
    border: 1px solid var(--border); border-radius: 4px; padding: 9px 11px; font-size: 13.5px;
    font-family: 'Inter', sans-serif; color: var(--ink); outline: none; width: 100%; box-sizing: border-box;
    background: var(--surface);
  }
  .qg-form-input:focus, .qg-form-select:focus, .qg-form-textarea:focus { border-color: var(--brand); }
  .qg-form-textarea { resize: vertical; min-height: 64px; }
  .qg-form-input.err, .qg-form-select.err, .qg-form-textarea.err { border-color: #C24A2C; background: #FDF3F0; }
  .qg-field-err { font-size: 11.5px; color: #C24A2C; }
  .qg-generate-btn {
    background: var(--brand); color: #fff; border: none; border-radius: 4px; padding: 11px 18px;
    font-weight: 600; font-size: 13.5px; cursor: pointer; display: flex; align-items: center; gap: 7px;
    width: 100%; justify-content: center; margin-top: 4px;
  }
  .qg-generate-btn:hover { background: var(--brand-dark); }
  .qg-form-err-banner {
    background: #FDF3F0; border: 1px solid #EAC1B4; color: #98351C; font-size: 12.5px; border-radius: 4px;
    padding: 9px 12px; margin-bottom: 14px;
  }

  .qg-review-banner {
    display: flex; align-items: flex-start; gap: 9px; background: var(--warn-bg); border: 1px solid var(--warn-border);
    border-radius: 4px; padding: 11px 14px; font-size: 13px; color: var(--warn); font-weight: 600; margin-bottom: 16px;
  }
  .qg-out-section { margin-bottom: 16px; }
  .qg-out-heading {
    font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase;
    letter-spacing: 0.04em; color: var(--brand-dark); margin-bottom: 8px; display: flex; align-items: center; gap: 7px;
  }
  .qg-out-text { font-size: 13.5px; line-height: 1.6; color: var(--ink); }
  .qg-out-list { margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.65; color: var(--ink); }
  .qg-out-list li { margin-bottom: 4px; }
  .qg-ncr-empty {
    border: 1px dashed var(--border); border-radius: 4px; padding: 30px 20px; text-align: center;
    color: var(--ink-muted); font-size: 13px; line-height: 1.6;
  }

  /* ---------- Feedback widget ---------- */
  .qg-feedback-wrap { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border); }
  .qg-feedback-label { font-size: 11.5px; color: var(--ink-muted); font-weight: 600; margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.03em; }
  .qg-feedback-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .qg-feedback-btn {
    display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; border-radius: 20px;
    padding: 6px 12px; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--ink-muted);
  }
  .qg-feedback-btn:hover { border-color: var(--brand); color: var(--ink); }
  .qg-feedback-btn.selected.helpful { background: var(--verified-bg); border-color: var(--verified); color: var(--verified); }
  .qg-feedback-btn.selected.wrong { background: #FBEAE5; border-color: #C24A2C; color: #C24A2C; }
  .qg-feedback-btn.selected.incomplete { background: var(--warn-bg); border-color: var(--warn); color: var(--warn); }
  .qg-feedback-btn.selected.outdated { background: #EDEEF3; border-color: #5C6773; color: #5C6773; }
  .qg-feedback-comment {
    width: 100%; box-sizing: border-box; margin-top: 9px; border: 1px solid var(--border); border-radius: 4px;
    padding: 8px 10px; font-size: 12.5px; font-family: 'Inter', sans-serif; resize: vertical; min-height: 44px; outline: none;
  }
  .qg-feedback-comment:focus { border-color: var(--brand); }
  .qg-feedback-submit {
    margin-top: 8px; background: var(--brand); color: #fff; border: none; border-radius: 4px; padding: 7px 14px;
    font-size: 12.5px; font-weight: 600; cursor: pointer;
  }
  .qg-feedback-submit:hover { background: var(--brand-dark); }
  .qg-feedback-confirm {
    display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--verified); font-weight: 600;
  }

  /* ---------- Admin review queue ---------- */
  .qg-review-stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 22px; }
  .qg-review-stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 14px 16px; text-align: center;
  }
  .qg-review-stat-num { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; }
  .qg-review-stat-label { font-size: 11.5px; color: var(--ink-muted); margin-top: 3px; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .qg-review-comment-item {
    border: 1px solid var(--border); border-radius: 4px; padding: 12px 14px; margin-bottom: 10px; background: var(--surface);
  }
  .qg-review-comment-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
  .qg-review-badge {
    font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; padding: 2px 8px; border-radius: 20px;
  }
  .qg-review-badge.helpful { background: var(--verified-bg); color: var(--verified); }
  .qg-review-badge.wrong { background: #FBEAE5; color: #C24A2C; }
  .qg-review-badge.incomplete { background: var(--warn-bg); color: var(--warn); }
  .qg-review-badge.outdated { background: #EDEEF3; color: #5C6773; }
  .qg-review-context { font-size: 12px; color: var(--ink-muted); }
  .qg-review-comment-text { font-size: 13px; color: var(--ink); line-height: 1.5; }
  .qg-qm-only-note { font-size: 12px; color: var(--ink-muted); margin-top: 3px; }

  /* ---------- Simulated upload ---------- */
  .qg-upload-btn {
    display: flex; align-items: center; gap: 7px; background: var(--brand); color: #fff; border: none;
    border-radius: 4px; padding: 9px 15px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap;
  }
  .qg-upload-btn:hover { background: var(--brand-dark); }
  .qg-modal-overlay {
    position: fixed; inset: 0; background: rgba(16, 24, 32, 0.55); display: flex; align-items: center;
    justify-content: center; padding: 24px; z-index: 50;
  }
  .qg-modal-card {
    background: var(--surface); border-radius: 4px; width: 100%; max-width: 640px; max-height: 88vh;
    overflow-y: auto; padding: 26px 28px 24px; box-shadow: 0 20px 60px rgba(15, 30, 45, 0.35);
  }
  .qg-modal-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 6px; }
  .qg-modal-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; }
  .qg-modal-close { background: none; border: none; cursor: pointer; color: var(--ink-muted); padding: 2px; }
  .qg-modal-close:hover { color: var(--ink); }
  .qg-modal-sub { font-size: 12.5px; color: var(--ink-muted); margin-bottom: 18px; line-height: 1.5; }
  .qg-success-note {
    display: flex; align-items: flex-start; gap: 9px; background: var(--verified-bg); border: 1px solid var(--verified-border);
    color: var(--verified); border-radius: 4px; padding: 12px 14px; font-size: 13px; font-weight: 600; margin-bottom: 16px; line-height: 1.5;
  }
  .qg-modal-actions { display: flex; gap: 10px; margin-top: 6px; }
  .qg-modal-secondary-btn {
    background: var(--surface); border: 1px solid var(--border); color: var(--ink); border-radius: 4px;
    padding: 9px 15px; font-size: 13px; font-weight: 600; cursor: pointer;
  }
  .qg-modal-secondary-btn:hover { border-color: var(--brand); color: var(--brand); }

  /* ---------- Responsive / mobile-width adjustments ---------- */
  @media (max-width: 860px) {
    .qg-panel-row, .qg-ncr-layout { grid-template-columns: 1fr; }
    .qg-stat-row, .qg-review-stat-row { grid-template-columns: repeat(2, 1fr); }
    .qg-doc-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 720px) {
    .qg-root { flex-direction: column; }
    .qg-sidebar {
      width: 100%; flex-direction: row; align-items: center; padding: 10px 12px; gap: 10px;
      overflow-x: auto;
    }
    .qg-brand { padding: 0 10px 0 0; flex-shrink: 0; }
    .qg-nav { flex-direction: row; margin-top: 0; gap: 4px; flex-shrink: 0; }
    .qg-nav-item, .qg-nav-item.disabled {
      width: auto; white-space: nowrap; padding: 8px 9px;
    }
    .qg-nav-item span.qg-nav-soon { margin-left: 5px; }
    .qg-sidebar-footer {
      margin-top: 0; margin-left: auto; border-top: none; padding-top: 0; flex-shrink: 0;
      display: flex; align-items: center; gap: 6px; border-left: 1px solid rgba(255,255,255,0.14); padding-left: 10px;
    }
    .qg-role-chip { max-width: 120px; overflow: hidden; }
    .qg-role-chip-label { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .qg-switch-btn-label { display: none; }
    .qg-main { padding: 18px 16px 30px; }
    .qg-page-title { font-size: 19px; }
    .qg-form-grid { grid-template-columns: 1fr; }
    .qg-form-field.full { grid-column: span 1; }
    .qg-login-wrap { padding: 16px; }
    .qg-login-card { padding: 26px 22px 22px; }
    .qg-modal-card { padding: 20px 18px 18px; }
  }

  @media (max-width: 480px) {
    .qg-stat-row, .qg-review-stat-row { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .qg-stat-card, .qg-review-stat-card { padding: 12px; }
    .qg-ask-row { flex-wrap: wrap; }
    .qg-ask-row input { min-width: 0; width: 100%; }
    .qg-ask-btn { width: 100%; justify-content: center; padding: 10px; }
  }
`;

/* ------------------------------------------------------------------ */
/* Sample data                                                         */
/* ------------------------------------------------------------------ */
const PERSONAS = [
  {
    id: 'quality_manager',
    label: 'Maria — Quality Manager',
    icon: ShieldCheck,
    need: 'Keep procedures accurate and audit-ready',
    dept: 'Quality',
  },
  {
    id: 'supervisor',
    label: 'James — Production Supervisor',
    icon: Factory,
    need: 'Get answers during production without stopping the line',
    dept: 'Production',
  },
  {
    id: 'supplier_engineer',
    label: 'Anika — Supplier Quality Engineer',
    icon: Boxes,
    need: 'Review defects and start corrective actions',
    dept: 'Supply Chain',
  },
  {
    id: 'operator',
    label: 'Carlos — Operator / Inspector',
    icon: HardHat,
    need: 'Follow the correct, current work instruction',
    dept: 'Production',
  },
];

const DOCUMENTS = [
  {
    id: 'doc_001', title: 'Incoming Inspection Procedure', revision: 'C', department: 'Quality', site: 'Plant 1',
    status: 'current', tags: ['incoming', 'inspection', 'receiving', 'sampling', 'ansi'],
    fullText: 'All incoming lots must be sampled per ANSI Z1.4 general inspection level II. Lots failing acceptance sampling are quarantined and logged in the nonconforming material register.',
  },
  {
    id: 'doc_002', title: 'Calibration Control Procedure', revision: 'D', department: 'Quality', site: 'Plant 1',
    status: 'current', tags: ['calibration', 'gauge', 'measurement', 'equipment'],
    fullText: 'All measurement and test equipment is calibrated on a 12-month cycle against NIST-traceable standards. Out-of-tolerance gauges trigger a review of parts measured since the last calibration.',
  },
  {
    id: 'doc_003', title: 'CNC Machining Work Instruction — Housing 4471', revision: 'F', department: 'Production', site: 'Plant 1',
    status: 'current', tags: ['cnc', 'machining', 'housing', 'tolerance', 'work instruction'],
    fullText: 'Housing 4471 critical dimensions hold +/-0.05mm tolerance on the mounting bore. First-article inspection is required after any tooling change or program edit.',
  },
  {
    id: 'doc_004', title: 'Electrostatic Discharge (ESD) Handling Procedure', revision: 'B', department: 'Production', site: 'Plant 2',
    status: 'current', tags: ['esd', 'static', 'electronics', 'handling', 'ppe'],
    fullText: 'ESD-sensitive assemblies must be handled only at grounded workstations with wrist straps in place. Ungrounded plastic totes are not approved for staging ESD-sensitive parts.',
  },
  {
    id: 'doc_005', title: 'Supplier Quality Requirements Manual', revision: 'E', department: 'Supply Chain', site: 'Corporate',
    status: 'current', tags: ['supplier', 'requirements', 'ppap', 'approval', 'incoming'],
    fullText: 'New suppliers must submit a PPAP Level 3 package before first production shipment. Supplier corrective actions are due within 10 business days of an NCR notification.',
  },
  {
    id: 'doc_006', title: 'Corrective Action Procedure (CAPA)', revision: 'G', department: 'Quality', site: 'Corporate',
    status: 'current', tags: ['corrective action', 'capa', 'root cause', 'nonconformance'],
    fullText: 'Root cause analysis is required for any repeat nonconformance within a 90-day window. Corrective action effectiveness is verified at the next scheduled audit or within 60 days, whichever is sooner.',
  },
  {
    id: 'doc_007', title: 'Final Inspection Checklist — Assembly Line 2', revision: 'A', department: 'Quality', site: 'Plant 2',
    status: 'current', tags: ['final inspection', 'checklist', 'assembly'],
    fullText: 'Final inspection on Line 2 confirms torque values, label placement, and functional test pass before units are released to packaging.',
  },
  {
    id: 'doc_008', title: 'Packaging and Labeling Specification', revision: 'C', department: 'Packaging', site: 'Plant 1',
    status: 'archived', tags: ['packaging', 'labeling', 'shipping'],
    fullText: 'Superseded by Rev D, which updates the shipping label barcode format. This revision should no longer be used for production shipments.',
  },
  {
    id: 'doc_009', title: 'Nonconforming Material Control Procedure', revision: 'D', department: 'Quality', site: 'Corporate',
    status: 'current', tags: ['nonconforming', 'ncr', 'quarantine', 'disposition'],
    fullText: 'Nonconforming material is tagged, quarantined within 4 hours of detection, and dispositioned as rework, scrap, use-as-is, or return-to-supplier.',
  },
  {
    id: 'doc_010', title: 'Operator Training and Qualification Policy', revision: 'B', department: 'Quality', site: 'Corporate',
    status: 'current', tags: ['training', 'qualification', 'operator', 'certification'],
    fullText: 'Operators must be re-qualified annually on any work instruction with a critical dimension. Training records are retained for the life of the part plus three years.',
  },
];

const SUGGESTED_QUESTIONS = [
  'What is the current revision for the incoming inspection procedure?',
  'What PPE is required for ESD-sensitive parts?',
  'How long do supplier corrective actions have before they are due?',
  'How do I submit a purchase order in the ERP system?',
];

const SEVERITY_OPTIONS = ['Minor', 'Major', 'Critical'];
const DETECTION_STAGE_OPTIONS = [
  'Incoming inspection', 'In-process', 'Final inspection', 'Customer return', 'Internal audit',
];

const SAMPLE_NCRS = [
  {
    id: 'ncr_ex_01',
    label: 'NCR-014 — Bore diameter out of tolerance',
    partNumber: 'HSG-4471',
    supplier: 'Internal — Plant 1 Machining',
    issueDescription: 'Mounting bore on housing measured 0.11mm over the drawing tolerance on a sample of parts from the same production lot.',
    affectedQuantity: '340',
    severity: 'Major',
    detectionStage: 'In-process',
    containmentAction: 'Line stopped; lot quarantined in the hold cage pending 100% re-inspection.',
  },
  {
    id: 'ncr_ex_02',
    label: 'NCR-021 — Incoming connector plating defect',
    partNumber: 'CN-2208',
    supplier: 'Meridian Electronics Supply',
    issueDescription: 'Incoming connectors show inconsistent gold plating thickness, some pins below spec, discovered during incoming sampling.',
    affectedQuantity: '1200',
    severity: 'Major',
    detectionStage: 'Incoming inspection',
    containmentAction: 'Full incoming lot placed on hold; not released to production.',
  },
  {
    id: 'ncr_ex_03',
    label: 'NCR-027 — ESD-sensitive board handled ungrounded',
    partNumber: 'PCB-9903',
    supplier: 'Internal — Plant 2 Assembly',
    issueDescription: 'Operator staged ESD-sensitive boards in an ungrounded plastic tote instead of the approved ESD tote during a shift changeover.',
    affectedQuantity: '58',
    severity: 'Critical',
    detectionStage: 'Internal audit',
    containmentAction: 'Affected boards segregated for functional retest; workstation grounding re-verified.',
  },
];

const EMPTY_NCR_FORM = {
  partNumber: '', supplier: '', issueDescription: '', affectedQuantity: '',
  severity: '', detectionStage: '', containmentAction: '',
};

const FEEDBACK_OPTIONS = [
  { id: 'helpful', label: 'Helpful', icon: ThumbsUp },
  { id: 'wrong', label: 'Wrong', icon: ThumbsDown },
  { id: 'incomplete', label: 'Incomplete', icon: CircleAlert },
  { id: 'outdated', label: 'Outdated', icon: History },
];

function makeId() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const EMPTY_UPLOAD_FORM = {
  title: '', documentNumber: '', revision: '', department: '', site: '', status: 'current', tags: '', excerpt: '',
};

/* ------------------------------------------------------------------ */
/* Q&A matching logic (rule-based — no model call, no network)         */
/* ------------------------------------------------------------------ */
const STOPWORDS = new Set([
  'the','a','an','is','are','of','for','to','what','how','do','i','does','my','on','in','with',
  'current','be','are','it','and','or','can','when','should','need','needs','me','this',
]);

function scoreDocuments(text, documents) {
  const clean = text.toLowerCase().replace(/[^\w\s]/g, '');
  const words = clean.split(/\s+/).filter((w) => w && !STOPWORDS.has(w));
  if (words.length === 0) return [];

  return documents
    .map((doc) => {
      const bodyText = (doc.title + ' ' + doc.fullText).toLowerCase();
      let score = 0;
      words.forEach((w) => {
        if (doc.tags.some((t) => t.toLowerCase().includes(w) || w.includes(t.toLowerCase()))) score += 3;
        else if (bodyText.includes(w)) score += 1;
      });
      return { doc, score };
    })
    .sort((a, b) => b.score - a.score);
}

function matchQuestion(question, documents) {
  const ranked = scoreDocuments(question, documents);
  const top = ranked[0];
  return top && top.score >= 3 ? top.doc : null;
}

/* ------------------------------------------------------------------ */
/* NCR summary generation (rule-based — built only from sample docs)   */
/* ------------------------------------------------------------------ */
function generateNcrSummary(form, documents) {
  const byId = (id) => documents.find((d) => d.id === id);
  const baseDocs = [byId('doc_009'), byId('doc_006')].filter(Boolean);

  const topicText = `${form.issueDescription} ${form.containmentAction} ${form.partNumber}`;
  const ranked = scoreDocuments(topicText, documents).filter(
    (r) => r.score >= 3 && !baseDocs.some((b) => b.id === r.doc.id)
  );
  const topicDocs = ranked.slice(0, 2).map((r) => r.doc);
  const citations = [...baseDocs, ...topicDocs];

  const tagSet = new Set(topicDocs.flatMap((d) => d.tags));
  const isSupplierIssue = form.supplier && !/internal/i.test(form.supplier);

  const investigationAreas = [];
  if (tagSet.has('calibration') || /gauge|measur|dimension|tolerance/i.test(form.issueDescription)) {
    investigationAreas.push('Verify calibration status of the measurement equipment used to detect this issue, per the Calibration Control Procedure.');
  }
  if (tagSet.has('cnc') || tagSet.has('machining') || /tolerance|bore|machin/i.test(form.issueDescription)) {
    investigationAreas.push('Review tooling condition, program revision, and first-article inspection records for the affected work instruction.');
  }
  if (tagSet.has('esd') || /esd|static|electron/i.test(form.issueDescription)) {
    investigationAreas.push('Confirm ESD handling controls (grounded workstation, wrist strap, approved totes) were followed at the point of detection.');
  }
  if (isSupplierIssue || tagSet.has('supplier')) {
    investigationAreas.push(`Review ${form.supplier || 'the supplier'}'s incoming quality history and PPAP status per the Supplier Quality Requirements Manual.`);
  }
  if (form.severity === 'Critical') {
    investigationAreas.push('Escalate immediately given Critical severity — confirm no additional lots or downstream units are affected.');
  }
  if (investigationAreas.length === 0) {
    investigationAreas.push('Confirm whether this is a repeat nonconformance within the last 90 days, which changes root-cause requirements per the CAPA Procedure.');
  }

  const containmentSteps = [
    `Quarantine the affected quantity (${form.affectedQuantity || 'unspecified'} units) and tag as nonconforming per the Nonconforming Material Control Procedure.`,
    `Logged containment action: "${form.containmentAction}"`,
    isSupplierIssue
      ? `Notify ${form.supplier} that material is on hold pending disposition.`
      : 'Notify the responsible production area that the affected lot is on hold pending disposition.',
    'Confirm no additional lots from the same source or time window are at risk.',
  ];

  const nextActions = [
    'Assign a root-cause investigation owner and target completion date.',
    'Complete disposition (rework, scrap, use-as-is, or return-to-supplier) per the Nonconforming Material Control Procedure.',
    isSupplierIssue
      ? 'If confirmed supplier-caused, issue a supplier corrective action request — due within 10 business days per the Supplier Quality Requirements Manual.'
      : 'If confirmed process-caused, open an internal corrective action per the CAPA Procedure.',
    'Verify corrective action effectiveness within 60 days or at the next scheduled audit, per the CAPA Procedure.',
  ];

  const summary = `${form.severity || 'Unclassified'}-severity nonconformance on part ${form.partNumber || '(not specified)'}` +
    `${isSupplierIssue ? ` supplied by ${form.supplier}` : ''}, detected at ${form.detectionStage ? form.detectionStage.toLowerCase() : 'an unspecified stage'}. ` +
    `${form.affectedQuantity || 'An unspecified number of'} units are affected. Reported issue: ${form.issueDescription}`;

  return { summary, containmentSteps, investigationAreas, nextActions, citations };
}

/* ------------------------------------------------------------------ */
/* Role Selector (simulated login)                                     */
/* ------------------------------------------------------------------ */
function RoleSelector({ onSelect }) {
  return (
    <div className="qg-login-wrap">
      <div className="qg-login-card">
        <div className="qg-login-eyebrow">QualiGuide AI — Prototype</div>
        <div className="qg-login-title">Choose a role to explore</div>
        <div className="qg-login-sub">
          This is a simulated sign-in for demo purposes only. No credentials, accounts, or
          real identity provider are involved — selecting a role just changes what the
          prototype shows you.
        </div>
        <div className="qg-role-list">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.id} className="qg-role-btn" onClick={() => onSelect(p)}>
                <div className="qg-role-icon"><Icon size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div className="qg-role-name">{p.label}</div>
                  <div className="qg-role-need">{p.need}</div>
                </div>
                <ChevronRight size={16} color="#8992A0" />
              </button>
            );
          })}
        </div>
        <div className="qg-sim-note">
          <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 2 }} color="#28527A" />
          <span>
            Simulated feature: role selection changes the view only. It is not a security
            control, and no real authentication is happening in this prototype.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                              */
/* ------------------------------------------------------------------ */
function Sidebar({ persona, view, setView, onSwitchRole }) {
  const Icon = persona.icon;
  const isQualityManager = persona.id === 'quality_manager';
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
    { id: 'library', label: 'Document Library', icon: FileStack, enabled: true },
    { id: 'qa', label: 'Ask a Question', icon: MessageSquareText, enabled: true },
    { id: 'ncr', label: 'NCR Assistant', icon: ClipboardList, enabled: true },
    { id: 'feedback', label: 'Feedback & Review', icon: Inbox, enabled: isQualityManager, badge: isQualityManager ? null : 'QM only' },
  ];
  return (
    <div className="qg-sidebar">
      <div className="qg-brand">
        <div className="qg-brand-mark">QG</div>
        <div className="qg-brand-name">QualiGuide AI</div>
      </div>
      <div className="qg-nav">
        {items.map((it) => {
          const ItemIcon = it.icon;
          if (!it.enabled) {
            return (
              <div
                key={it.id}
                className="qg-nav-item disabled"
                aria-disabled="true"
                title={it.badge === 'QM only' ? 'Available to the Quality Manager role' : 'Coming in a future iteration'}
              >
                <ItemIcon size={15} />
                {it.label}
                <span className="qg-nav-soon">{it.badge || 'Soon'}</span>
              </div>
            );
          }
          return (
            <button
              key={it.id}
              className={`qg-nav-item ${view === it.id ? 'active' : ''}`}
              onClick={() => setView(it.id)}
            >
              <ItemIcon size={15} />
              {it.label}
            </button>
          );
        })}
      </div>
      <div className="qg-sidebar-footer">
        <div className="qg-role-chip">
          <Icon size={14} />
          <span className="qg-role-chip-label">{persona.label}</span>
        </div>
        <button className="qg-switch-btn" onClick={onSwitchRole}>
          <LogOut size={13} /> <span className="qg-switch-btn-label">Switch role</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                            */
/* ------------------------------------------------------------------ */
function Dashboard({ persona, documents, setView }) {
  const current = documents.filter((d) => d.status === 'current').length;
  const archived = documents.filter((d) => d.status === 'archived').length;
  const depts = new Set(documents.map((d) => d.department)).size;

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated demo data — nothing here is a real customer or document</div>
        <div className="qg-page-title">Welcome back, {persona.label.split(' — ')[0]}</div>
        <div className="qg-page-sub">
          This dashboard summarizes the sample document library loaded into this browser
          session. Nothing is fetched from a server.
        </div>
      </div>

      <div className="qg-stat-row">
        <div className="qg-stat-card">
          <div className="qg-stat-num">{documents.length}</div>
          <div className="qg-stat-label">Total sample documents</div>
        </div>
        <div className="qg-stat-card">
          <div className="qg-stat-num">{current}</div>
          <div className="qg-stat-label">Marked current</div>
        </div>
        <div className="qg-stat-card">
          <div className="qg-stat-num">{archived}</div>
          <div className="qg-stat-label">Marked archived</div>
        </div>
        <div className="qg-stat-card">
          <div className="qg-stat-num">{depts}</div>
          <div className="qg-stat-label">Departments covered</div>
        </div>
      </div>

      <div className="qg-panel-row">
        <div className="qg-panel">
          <div className="qg-panel-title">Jump back in</div>
          <div className="qg-panel-sub">These modules are ready to try in this build.</div>
          <button className="qg-quicklink" onClick={() => setView('qa')}>
            <span className="qg-quicklink-label"><MessageSquareText size={15} /> Ask a quality question</span>
            <ChevronRight size={15} color="#8992A0" />
          </button>
          <button className="qg-quicklink" onClick={() => setView('ncr')}>
            <span className="qg-quicklink-label"><ClipboardList size={15} /> Start an NCR summary</span>
            <ChevronRight size={15} color="#8992A0" />
          </button>
          <button className="qg-quicklink" onClick={() => setView('library')}>
            <span className="qg-quicklink-label"><FileStack size={15} /> Browse the document library</span>
            <ChevronRight size={15} color="#8992A0" />
          </button>
        </div>
        <div className="qg-panel">
          <div className="qg-panel-title">Why you're here</div>
          <div className="qg-panel-sub">Based on the selected role</div>
          <div className="qg-persona-need">
            <b>{persona.label}</b> — {persona.need.toLowerCase()}. The Feedback &amp; Review
            queue is visible only to the Quality Manager role, which is reflected in the
            navigation on the left.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulated document upload (Quality Manager only)                    */
/* ------------------------------------------------------------------ */
function UploadDocumentModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_UPLOAD_FORM);
  const [errors, setErrors] = useState({});
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function updateField(key, value) {
    setForm({ ...form, [key]: value });
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.documentNumber.trim()) errs.documentNumber = 'Document number is required.';
    if (!form.revision.trim()) errs.revision = 'Revision is required.';
    if (!form.department.trim()) errs.department = 'Department is required.';
    if (!form.site.trim()) errs.site = 'Site is required.';
    if (!form.tags.trim()) errs.tags = 'At least one tag is required.';
    if (!form.excerpt.trim()) errs.excerpt = 'A source excerpt is required.';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onAdd({
      id: makeId(),
      title: form.title.trim(),
      documentNumber: form.documentNumber.trim(),
      revision: form.revision.trim(),
      department: form.department.trim(),
      site: form.site.trim(),
      status: form.status,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      fullText: form.excerpt.trim(),
    });
    setJustAdded(true);
  }

  function resetForAnother() {
    setForm(EMPTY_UPLOAD_FORM);
    setErrors({});
    setJustAdded(false);
  }

  return (
    <div className="qg-modal-overlay" onClick={onClose}>
      <div
        className="qg-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qg-upload-modal-title"
      >
        <div className="qg-modal-head">
          <div className="qg-modal-title" id="qg-upload-modal-title">Add a simulated document</div>
          <button className="qg-modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </div>
        <div className="qg-modal-sub">
          No file is processed — this creates a record directly in this browser session's
          library so it can be searched, filtered, and matched by Q&amp;A / NCR. It will
          disappear if the page is refreshed.
        </div>

        {justAdded ? (
          <>
            <div className="qg-success-note">
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              "{form.title}" was added to the in-session library. Remember: this demo record
              resets when the page is refreshed.
            </div>
            <div className="qg-modal-actions">
              <button className="qg-modal-secondary-btn" onClick={resetForAnother}>Add another</button>
              <button className="qg-upload-btn" onClick={onClose}>Done</button>
            </div>
          </>
        ) : (
          <>
            {Object.keys(errors).length > 0 && (
              <div className="qg-form-err-banner">Please fix the highlighted fields before adding this document.</div>
            )}
            <div className="qg-form-grid">
              <div className="qg-form-field full">
                <label className="qg-form-label" htmlFor="up-title">Title<span className="req">*</span></label>
                <input id="up-title" className={`qg-form-input ${errors.title ? 'err' : ''}`} value={form.title}
                  onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. Torque Verification Work Instruction" />
                {errors.title && <div className="qg-field-err">{errors.title}</div>}
              </div>

              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-docnum">Document number<span className="req">*</span></label>
                <input id="up-docnum" className={`qg-form-input ${errors.documentNumber ? 'err' : ''}`} value={form.documentNumber}
                  onChange={(e) => updateField('documentNumber', e.target.value)} placeholder="e.g. WI-3312" />
                {errors.documentNumber && <div className="qg-field-err">{errors.documentNumber}</div>}
              </div>
              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-revision">Revision<span className="req">*</span></label>
                <input id="up-revision" className={`qg-form-input ${errors.revision ? 'err' : ''}`} value={form.revision}
                  onChange={(e) => updateField('revision', e.target.value)} placeholder="e.g. A" />
                {errors.revision && <div className="qg-field-err">{errors.revision}</div>}
              </div>

              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-department">Department<span className="req">*</span></label>
                <input id="up-department" className={`qg-form-input ${errors.department ? 'err' : ''}`} value={form.department}
                  onChange={(e) => updateField('department', e.target.value)} placeholder="e.g. Quality" />
                {errors.department && <div className="qg-field-err">{errors.department}</div>}
              </div>
              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-site">Site<span className="req">*</span></label>
                <input id="up-site" className={`qg-form-input ${errors.site ? 'err' : ''}`} value={form.site}
                  onChange={(e) => updateField('site', e.target.value)} placeholder="e.g. Plant 1" />
                {errors.site && <div className="qg-field-err">{errors.site}</div>}
              </div>

              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-status">Status</label>
                <select id="up-status" className="qg-form-select" value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                  <option value="current">Current</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-tags">Tags (comma separated)<span className="req">*</span></label>
                <input id="up-tags" className={`qg-form-input ${errors.tags ? 'err' : ''}`} value={form.tags}
                  onChange={(e) => updateField('tags', e.target.value)} placeholder="e.g. torque, assembly, checklist" />
                {errors.tags && <div className="qg-field-err">{errors.tags}</div>}
              </div>

              <div className="qg-form-field full">
                <label className="qg-form-label" htmlFor="up-excerpt">Source excerpt<span className="req">*</span></label>
                <textarea id="up-excerpt" className={`qg-form-textarea ${errors.excerpt ? 'err' : ''}`} value={form.excerpt}
                  onChange={(e) => updateField('excerpt', e.target.value)} placeholder="A short passage this document would be cited from…" />
                {errors.excerpt && <div className="qg-field-err">{errors.excerpt}</div>}
              </div>
            </div>

            <button className="qg-upload-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSubmit}>
              <UploadCloud size={15} /> Add to library
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Document Library                                                    */
/* ------------------------------------------------------------------ */
function DocumentLibrary({ documents, isQualityManager, onAddDocument }) {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [status, setStatus] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  const depts = ['all', ...new Set(documents.map((d) => d.department))];

  const filtered = documents.filter((d) => {
    const matchesSearch =
      search.trim() === '' ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = dept === 'all' || d.department === dept;
    const matchesStatus = status === 'all' || d.status === status;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated storage — documents live only in this browser session</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div className="qg-page-title">Document Library</div>
            <div className="qg-page-sub">
              Sample quality documents with revision, department, site, and status metadata.
              {isQualityManager
                ? ' As Quality Manager, you can add a simulated demo document below — it resets on refresh.'
                : ' Uploading is available to the Quality Manager role.'}
            </div>
          </div>
          {isQualityManager && (
            <button className="qg-upload-btn" onClick={() => setUploadOpen(true)}>
              <UploadCloud size={15} /> Add document
            </button>
          )}
        </div>
      </div>

      {uploadOpen && (
        <UploadDocumentModal
          onClose={() => setUploadOpen(false)}
          onAdd={(doc) => onAddDocument(doc)}
        />
      )}

      <div className="qg-filter-bar">
        <div className="qg-search-input">
          <Search size={14} color="#5C6773" />
          <input
            aria-label="Search documents by title or tag"
            placeholder="Search title or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select aria-label="Filter by department" className="qg-select" value={dept} onChange={(e) => setDept(e.target.value)}>
          {depts.map((d) => (
            <option key={d} value={d}>{d === 'all' ? 'All departments' : d}</option>
          ))}
        </select>
        <select aria-label="Filter by status" className="qg-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="current">Current only</option>
          <option value="archived">Archived only</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="qg-empty">No documents match those filters. Try clearing a filter.</div>
      ) : (
        <div className="qg-doc-grid">
          {filtered.map((d) => (
            <div className="qg-doc-card" key={d.id}>
              <div className="qg-doc-top">
                <div className="qg-doc-title">{d.title}</div>
              </div>
              <div className="qg-doc-meta">
                <span className="qg-tag">{d.department}</span>
                <span className="qg-tag">{d.site}</span>
                {d.documentNumber && <span className="qg-tag qg-mono">{d.documentNumber}</span>}
                <span className="qg-tag qg-mono">Rev {d.revision}</span>
                <span className={`qg-tag status-${d.status}`}>{d.status}</span>
              </div>
              <div className="qg-doc-excerpt">{d.fullText}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Q&A Panel                                                            */
/* ------------------------------------------------------------------ */
function QAPanel({ documents, feedbackEntries, onSubmitFeedback }) {
  const [question, setQuestion] = useState('');
  const [thread, setThread] = useState([]);

  function ask(q) {
    const text = q.trim();
    if (!text) return;
    const doc = matchQuestion(text, documents);
    setThread([{ id: makeId(), question: text, doc }, ...thread]);
    setQuestion('');
  }

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated matching — no model or network call, just local keyword rules over sample data</div>
        <div className="qg-page-title">Ask a Question</div>
        <div className="qg-page-sub">
          Answers are only generated when a sample document supports them, and every
          supported answer shows its source. If nothing matches, the system says so
          instead of guessing.
        </div>
      </div>

      <div className="qg-ask-box">
        <div className="qg-ask-row">
          <input
            aria-label="Type your question"
            placeholder="e.g. What PPE is required for ESD-sensitive parts?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask(question)}
          />
          <button className="qg-ask-btn" disabled={!question.trim()} onClick={() => ask(question)}>
            <Search size={14} /> Ask
          </button>
        </div>
        <div className="qg-chip-row">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button key={q} className="qg-chip" onClick={() => ask(q)}>{q}</button>
          ))}
        </div>
      </div>

      <div className="qg-qa-thread">
        {thread.map((item) => (
          <div key={item.id}>
            <div className="qg-q-bubble"><b>You asked:</b> {item.question}</div>
            <div style={{ height: 8 }} />
            {item.doc ? (
              <div className="qg-stamp-card">
                <div className="qg-stamp-head">
                  <div className="qg-stamp-seal"><ShieldCheck size={12} /> Supported answer</div>
                </div>
                <div className="qg-stamp-answer">
                  Per <b>{item.doc.title}</b>: {item.doc.fullText}
                </div>
                <div className="qg-cite-box">
                  <div className="qg-cite-doc">
                    {item.doc.title}
                    <span className="qg-cite-rev">REV {item.doc.revision} · {item.doc.status.toUpperCase()} · {item.doc.department}</span>
                  </div>
                  <div className="qg-cite-excerpt">"{item.doc.fullText}"</div>
                </div>
                <FeedbackWidget
                  resultId={item.id}
                  resultType="qa"
                  contextLabel={item.question}
                  entries={feedbackEntries}
                  onSubmit={onSubmitFeedback}
                />
              </div>
            ) : (
              <div className="qg-refusal-card">
                <div className="qg-refusal-head"><AlertTriangle size={14} /> No approved source found</div>
                <div className="qg-refusal-text">
                  None of the sample documents in this library support an answer to that
                  question. Rather than guess, QualiGuide AI is refusing to answer — in
                  production this would route to a quality manager or trigger a document
                  gap review.
                </div>
                <FeedbackWidget
                  resultId={item.id}
                  resultType="qa"
                  contextLabel={item.question}
                  entries={feedbackEntries}
                  onSubmit={onSubmitFeedback}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feedback widget (reused on Q&A answers and NCR summaries)            */
/* ------------------------------------------------------------------ */
function FeedbackWidget({ resultId, resultType, contextLabel, entries, onSubmit }) {
  const [pendingRating, setPendingRating] = useState(null);
  const [comment, setComment] = useState('');

  const existing = entries.find((e) => e.resultId === resultId);

  if (existing) {
    const opt = FEEDBACK_OPTIONS.find((o) => o.id === existing.rating);
    const Icon = opt ? opt.icon : ThumbsUp;
    return (
      <div className="qg-feedback-wrap">
        <div className="qg-feedback-confirm">
          <Icon size={14} /> Feedback submitted — marked "{opt ? opt.label : existing.rating}". Thank you.
        </div>
      </div>
    );
  }

  function submit() {
    if (!pendingRating) return;
    onSubmit({
      id: makeId(),
      resultId,
      resultType,
      contextLabel,
      rating: pendingRating,
      comment: comment.trim(),
      timestamp: Date.now(),
    });
  }

  return (
    <div className="qg-feedback-wrap">
      <div className="qg-feedback-label">Was this useful?</div>
      <div className="qg-feedback-row">
        {FEEDBACK_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              className={`qg-feedback-btn ${pendingRating === opt.id ? `selected ${opt.id}` : ''}`}
              onClick={() => setPendingRating(opt.id)}
            >
              <Icon size={13} /> {opt.label}
            </button>
          );
        })}
      </div>
      {pendingRating && (
        <>
          <textarea
            aria-label="Optional feedback comment"
            className="qg-feedback-comment"
            placeholder="Optional comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="qg-feedback-submit" onClick={submit}>Submit feedback</button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Admin Review Queue (Quality Manager only)                           */
/* ------------------------------------------------------------------ */
function AdminReviewQueue({ entries }) {
  const counts = { helpful: 0, wrong: 0, incomplete: 0, outdated: 0 };
  entries.forEach((e) => { if (counts[e.rating] !== undefined) counts[e.rating] += 1; });

  const recentComments = entries
    .filter((e) => e.comment)
    .slice()
    .reverse();

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated queue — stored only in this browser session, visible to Quality Manager role only</div>
        <div className="qg-page-title">Feedback &amp; Review</div>
        <div className="qg-page-sub">
          Feedback submitted on Q&amp;A answers and NCR summaries collects here for review.
          Totals and comments reset if the page is refreshed.
        </div>
      </div>

      <div className="qg-review-stat-row">
        {FEEDBACK_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <div className="qg-review-stat-card" key={opt.id}>
              <div className="qg-review-stat-num">{counts[opt.id]}</div>
              <div className="qg-review-stat-label"><Icon size={12} /> {opt.label}</div>
            </div>
          );
        })}
      </div>

      <div className="qg-panel">
        <div className="qg-panel-title">Recent comments</div>
        <div className="qg-panel-sub">{entries.length} total submission{entries.length === 1 ? '' : 's'} this session</div>
        {recentComments.length === 0 ? (
          <div className="qg-empty">No comments submitted yet in this session.</div>
        ) : (
          recentComments.map((e) => {
            const opt = FEEDBACK_OPTIONS.find((o) => o.id === e.rating);
            return (
              <div className="qg-review-comment-item" key={e.id}>
                <div className="qg-review-comment-top">
                  <span className={`qg-review-badge ${e.rating}`}>{opt ? opt.label : e.rating}</span>
                  <span className="qg-review-context">{e.resultType === 'ncr' ? 'NCR Assistant' : 'Q&A'} · {e.contextLabel}</span>
                </div>
                <div className="qg-review-comment-text">{e.comment}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NCR Assistant                                                        */
/* ------------------------------------------------------------------ */
function NCRAssistant({ documents, feedbackEntries, onSubmitFeedback }) {
  const [form, setForm] = useState(EMPTY_NCR_FORM);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  function loadExample(ex) {
    setForm({
      partNumber: ex.partNumber, supplier: ex.supplier, issueDescription: ex.issueDescription,
      affectedQuantity: ex.affectedQuantity, severity: ex.severity, detectionStage: ex.detectionStage,
      containmentAction: ex.containmentAction,
    });
    setErrors({});
    setResult(null);
  }

  function updateField(key, value) {
    setForm({ ...form, [key]: value });
  }

  function validate() {
    const errs = {};
    if (!form.partNumber.trim()) errs.partNumber = 'Part number is required.';
    if (!form.supplier.trim()) errs.supplier = 'Supplier (or "Internal") is required.';
    if (!form.issueDescription.trim()) errs.issueDescription = 'Issue description is required.';
    if (!form.severity) errs.severity = 'Select a severity.';
    if (!form.detectionStage) errs.detectionStage = 'Select a detection stage.';
    if (!form.containmentAction.trim()) errs.containmentAction = 'Immediate containment action is required.';

    const qty = form.affectedQuantity.trim();
    if (!qty) {
      errs.affectedQuantity = 'Affected quantity is required.';
    } else if (!/^\d+$/.test(qty) || parseInt(qty, 10) <= 0) {
      errs.affectedQuantity = 'Enter a whole number greater than 0.';
    }
    return errs;
  }

  function handleGenerate() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setResult(null);
      return;
    }
    setResult({ id: makeId(), ...generateNcrSummary(form, documents) });
  }

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated NCR logic — templated from your form and the sample document set, no model or network call</div>
        <div className="qg-page-title">NCR Assistant</div>
        <div className="qg-page-sub">
          Enter a nonconformance, or load a fictional example, to generate a structured
          summary, containment steps, investigation areas, and next actions grounded only
          in the sample approved documents.
        </div>
      </div>

      <div className="qg-example-row">
        {SAMPLE_NCRS.map((ex) => (
          <button key={ex.id} className="qg-example-chip" onClick={() => loadExample(ex)}>
            <ClipboardList size={13} /> {ex.label}
          </button>
        ))}
      </div>

      <div className="qg-ncr-layout">
        <div className="qg-panel">
          <div className="qg-panel-title">Nonconformance details</div>
          <div className="qg-panel-sub">Fields marked <span style={{ color: '#9C5A18' }}>*</span> are required.</div>

          {Object.keys(errors).length > 0 && (
            <div className="qg-form-err-banner">
              Please fix the highlighted fields before generating a summary.
            </div>
          )}

          <div className="qg-form-grid">
            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-part">Part number<span className="req">*</span></label>
              <input
                id="ncr-part"
                className={`qg-form-input ${errors.partNumber ? 'err' : ''}`}
                value={form.partNumber}
                onChange={(e) => updateField('partNumber', e.target.value)}
                placeholder="e.g. HSG-4471"
              />
              {errors.partNumber && <div className="qg-field-err">{errors.partNumber}</div>}
            </div>
            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-supplier">Supplier<span className="req">*</span></label>
              <input
                id="ncr-supplier"
                className={`qg-form-input ${errors.supplier ? 'err' : ''}`}
                value={form.supplier}
                onChange={(e) => updateField('supplier', e.target.value)}
                placeholder="e.g. Internal — Plant 1, or supplier name"
              />
              {errors.supplier && <div className="qg-field-err">{errors.supplier}</div>}
            </div>

            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-qty">Affected quantity<span className="req">*</span></label>
              <input
                id="ncr-qty"
                className={`qg-form-input ${errors.affectedQuantity ? 'err' : ''}`}
                value={form.affectedQuantity}
                onChange={(e) => updateField('affectedQuantity', e.target.value)}
                placeholder="e.g. 340"
                inputMode="numeric"
              />
              {errors.affectedQuantity && <div className="qg-field-err">{errors.affectedQuantity}</div>}
            </div>
            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-severity">Severity<span className="req">*</span></label>
              <select
                id="ncr-severity"
                className={`qg-form-select ${errors.severity ? 'err' : ''}`}
                value={form.severity}
                onChange={(e) => updateField('severity', e.target.value)}
              >
                <option value="">Select severity…</option>
                {SEVERITY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.severity && <div className="qg-field-err">{errors.severity}</div>}
            </div>

            <div className="qg-form-field full">
              <label className="qg-form-label" htmlFor="ncr-issue">Issue description<span className="req">*</span></label>
              <textarea
                id="ncr-issue"
                className={`qg-form-textarea ${errors.issueDescription ? 'err' : ''}`}
                value={form.issueDescription}
                onChange={(e) => updateField('issueDescription', e.target.value)}
                placeholder="Describe what was found, where, and how…"
              />
              {errors.issueDescription && <div className="qg-field-err">{errors.issueDescription}</div>}
            </div>

            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-stage">Detection stage<span className="req">*</span></label>
              <select
                id="ncr-stage"
                className={`qg-form-select ${errors.detectionStage ? 'err' : ''}`}
                value={form.detectionStage}
                onChange={(e) => updateField('detectionStage', e.target.value)}
              >
                <option value="">Select stage…</option>
                {DETECTION_STAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.detectionStage && <div className="qg-field-err">{errors.detectionStage}</div>}
            </div>
            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-containment">Immediate containment action<span className="req">*</span></label>
              <input
                id="ncr-containment"
                className={`qg-form-input ${errors.containmentAction ? 'err' : ''}`}
                value={form.containmentAction}
                onChange={(e) => updateField('containmentAction', e.target.value)}
                placeholder="e.g. Lot quarantined pending disposition"
              />
              {errors.containmentAction && <div className="qg-field-err">{errors.containmentAction}</div>}
            </div>
          </div>

          <button className="qg-generate-btn" onClick={handleGenerate}>
            <ListChecks size={15} /> Generate NCR summary
          </button>
        </div>

        <div>
          {!result ? (
            <div className="qg-ncr-empty">
              <PackageSearch size={20} style={{ marginBottom: 8 }} />
              <div>Your structured NCR summary will appear here once the form is complete.</div>
            </div>
          ) : (
            <div className="qg-panel">
              <div className="qg-review-banner">
                <ClipboardCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                Quality Manager review is required before this NCR can be dispositioned or closed. This output is a draft starting point only.
              </div>

              <div className="qg-out-section">
                <div className="qg-out-heading"><FileStack size={13} /> Summary</div>
                <div className="qg-out-text">{result.summary}</div>
              </div>

              <div className="qg-out-section">
                <div className="qg-out-heading"><ShieldCheck size={13} /> Containment steps</div>
                <ul className="qg-out-list">
                  {result.containmentSteps.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="qg-out-section">
                <div className="qg-out-heading"><Search size={13} /> Investigation areas</div>
                <ul className="qg-out-list">
                  {result.investigationAreas.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="qg-out-section">
                <div className="qg-out-heading"><ListChecks size={13} /> Suggested next actions</div>
                <ul className="qg-out-list">
                  {result.nextActions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="qg-out-section" style={{ marginBottom: 0 }}>
                <div className="qg-out-heading"><ClipboardList size={13} /> Citations</div>
                {result.citations.map((doc) => (
                  <div className="qg-cite-box" key={doc.id} style={{ marginBottom: 8 }}>
                    <div className="qg-cite-doc">
                      {doc.title}
                      <span className="qg-cite-rev">REV {doc.revision} · {doc.status.toUpperCase()} · {doc.department}</span>
                    </div>
                    <div className="qg-cite-excerpt">"{doc.fullText}"</div>
                  </div>
                ))}
              </div>

              <FeedbackWidget
                resultId={result.id}
                resultType="ncr"
                contextLabel={form.partNumber ? `Part ${form.partNumber}` : 'NCR summary'}
                entries={feedbackEntries}
                onSubmit={onSubmitFeedback}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                  */
/* ------------------------------------------------------------------ */
export default function App() {
  const [persona, setPersona] = useState(null);
  const [view, setView] = useState('dashboard');
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [documents, setDocuments] = useState(DOCUMENTS);

  function submitFeedback(entry) {
    setFeedbackEntries((prev) => [...prev, entry]);
  }

  function addDocument(doc) {
    setDocuments((prev) => [doc, ...prev]);
  }

  function switchRole() {
    setPersona(null);
    setView('dashboard');
  }

  if (!persona) {
    return (
      <div className="qg-root" style={{ display: 'block' }}>
        <style>{STYLE}</style>
        <RoleSelector onSelect={(p) => { setPersona(p); setView('dashboard'); }} />
      </div>
    );
  }

  const isQualityManager = persona.id === 'quality_manager';
  const activeView = view === 'feedback' && !isQualityManager ? 'dashboard' : view;

  return (
    <div className="qg-root">
      <style>{STYLE}</style>
      <Sidebar persona={persona} view={activeView} setView={setView} onSwitchRole={switchRole} />
      <div className="qg-main">
        {activeView === 'dashboard' && <Dashboard persona={persona} documents={documents} setView={setView} />}
        {activeView === 'library' && (
          <DocumentLibrary documents={documents} isQualityManager={isQualityManager} onAddDocument={addDocument} />
        )}
        {activeView === 'qa' && (
          <QAPanel documents={documents} feedbackEntries={feedbackEntries} onSubmitFeedback={submitFeedback} />
        )}
        {activeView === 'ncr' && (
          <NCRAssistant documents={documents} feedbackEntries={feedbackEntries} onSubmitFeedback={submitFeedback} />
        )}
        {activeView === 'feedback' && isQualityManager && <AdminReviewQueue entries={feedbackEntries} />}
      </div>
    </div>
  );
}