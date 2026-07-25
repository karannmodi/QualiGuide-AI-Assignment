# QualiGuide AI — Application Security Checklist

This document provides a security verification matrix for the **QualiGuide AI** local web application prototype.

---

## Security Verification Matrix

| Security Area | Audit Requirement | Observed Status in Prototype | Status Value |
|---|---|---|---|
| **API Keys & Secrets** | Verify zero exposed API keys, private tokens, passwords, database URIs, or `VITE_` secret environment variables. | Repository search confirmed zero embedded secrets or API keys. Q&A and NCR logic run 100% locally via deterministic JavaScript utility functions. | **Verified** |
| **Dependency Security** | Perform dependency security audit via `npm audit`. | `npm audit` returned 0 vulnerabilities across all production and development dependencies. | **Verified** |
| **XSS & HTML Injection** | Prevent Cross-Site Scripting (XSS) attacks in user inputs (Q&A questions, upload titles/excerpts, feedback comments, NCR fields). | All user-supplied inputs are rendered via standard React JSX expressions (`{text}`), escaping HTML/script tags into harmless text nodes. Zero uses of `dangerouslySetInnerHTML` or `eval()`. | **Verified** |
| **Input Length Validation** | Enforce maximum character lengths on form text fields and textareas (`SEC-REC-001`). | Added HTML `maxLength` attributes and component-level validation checks: Q&A (500), Title (120), DocNum (40), Rev (20), Dept (80), Site (80), Tags (250), Excerpt (1000), NCR Part (120), Supplier (160), Issue (2000), Containment (2000), Feedback (1000). | **Implemented** |
| **Browser Storage Resilience** | Handle `localStorage` failures, full quota errors, and corrupted storage gracefully (`SEC-REC-002`). | `readStoredValue` catches corrupted JSON gracefully. Added safe storage writer handlers in `App.jsx` that display a dismissible warning banner when storage writes fail while maintaining full in-memory operation. | **Implemented** |
| **Error Handling** | Avoid exposing technical stack traces or raw system exceptions to end users. | Form validation messages provide user-friendly guidance. `localStorage` errors trigger a clear, nontechnical persistence banner without exposing exception traces. | **Verified** |
| **Authentication Scope** | Verify simulated role selection behavior (`Maria`, `James`, `Anika`, `Carlos`). | Role selection in `RoleSelector.jsx` is a client-side UX demonstration for assignment evaluation. Production environments require a server-enforced authentication provider (OAuth 2.0 / OIDC). | **Not Applicable** *(Prototype Limitation)* |
| **Authorization Scope** | Evaluate client-side view restrictions (e.g., Feedback tab disabled for non-QM roles). | Client-side role restrictions guard UI views. In production, role-based access control (RBAC) must be enforced via authenticated backend API middleware. | **Future Production Recommendation** |
| **SQL Injection** | Evaluate database SQL injection vulnerability. | Prototype runs 100% client-side with no database or SQL query engine. All filtering uses native JavaScript array methods (`.filter()`, `.includes()`). | **Not Applicable** |
| **Security Headers** | Enforce HTTP security headers (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`). | Local Vite dev server runs for local evaluation. HTTP security headers must be configured on the web hosting server (Nginx/Cloudflare/Vercel) upon production deployment. | **Future Production Recommendation** |
| **Production Build** | Verify clean production bundle build execution. | Executed `npm run build` (`vite build`). Output generated `dist/assets/index-lFRcMd3k.js` (242.67 kB) cleanly in 922ms. | **Verified** |
| **Code Linting** | Verify source code quality and linter execution. | Executed `npm run lint` (`oxlint`). Passed with 0 errors and 5 unused import warnings limited to the preserved reference demo file. | **Verified** |

---

## Deliverables Summary

The following two documentation deliverables were created in the [`docs/`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/docs/) directory:

1. [`docs/TESTING_SECURITY_REPORT.md`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/docs/TESTING_SECURITY_REPORT.md) — Comprehensive two-page summary of testing execution, `BUG-001` identification and fix, security audit findings, accessibility improvements, and final regression results.
2. [`docs/SECURITY_CHECKLIST.md`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/docs/SECURITY_CHECKLIST.md) — Application security verification matrix covering secrets, XSS defenses, input controls, storage resilience, build status, and prototype scope boundaries.

*Note: Per assignment instructions, these files have been created in the local workspace and have not been committed to git.*
