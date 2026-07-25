# QualiGuide AI — Comprehensive Manual Testing Checklist & Repository Analysis

This document provides a comprehensive, structured manual testing checklist for the **QualiGuide AI** prototype application, based on a read-only analysis of the repository's source code and components.

---

## 1. Overview & Test Environment Summary

- **Application Name**: QualiGuide AI (Local Prototype)
- **Architecture**: Single-Page Application (React 18 + Vite + Vanilla CSS)
- **Data Model**: Local sample data with client-side `localStorage` persistence (no backend API, database, or external AI model calls)
- **Roles / Personas Supported**:
  1. **Maria — Quality Manager** (`quality_manager`): Full access, including document upload simulation and Administrative Feedback & Review Queue.
  2. **James — Production Supervisor** (`supervisor`): Standard access (Dashboard, Document Library, Q&A, NCR Assistant). Feedback tab disabled ("QM only").
  3. **Anika — Supplier Quality Engineer** (`supplier_engineer`): Standard access. Feedback tab disabled ("QM only").
  4. **Carlos — Operator / Inspector** (`operator`): Standard access. Feedback tab disabled ("QM only").

---

## 2. Comprehensive Manual Testing Checklist (90 Test Cases)

The checklist contains **90 manual test cases** organized into 13 logical sections:

- **Section A**: Role Selection & Role Switching (7 Test Cases)
- **Section B**: Navigation & Shell Controls (8 Test Cases)
- **Section C**: Dashboard View (6 Test Cases)
- **Section D**: Document Library & Filters (8 Test Cases)
- **Section E**: Simulated Document Upload Modal (9 Test Cases)
- **Section F**: Q&A Workflow & Question Matching (9 Test Cases)
- **Section G**: Nonconformance Report (NCR) Assistant & Validation (11 Test Cases)
- **Section H**: Feedback Widget Workflow (5 Test Cases)
- **Section I**: Administrative Feedback Review Queue (5 Test Cases)
- **Section J**: Input Validation, Security, & Boundary Scenarios (6 Test Cases)
- **Section K**: Workflow Edge Cases, Rapid Interaction, & State Persistence (4 Test Cases)
- **Section L**: Accessibility & Keyboard Navigation (6 Test Cases)
- **Section M**: Responsive Layouts & Offline Resilience (6 Test Cases)

---

### Section A: Role Selection & Role Switching

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-ROLE-001 | Role Selection | Unauthenticated | Role Cards List | Display of available personas on initial launch | 1. Clear browser local storage.<br>2. Load application at the local Vite URL shown in the terminal. | N/A | Fullscreen gradient banner displays 4 role buttons with icons, titles, and needs statement. Simulation notice visible at bottom. | Fullscreen gradient banner displayed 4 role cards with icons, labels, needs descriptions, and bottom simulation note. | Pass | AI-assisted Playwright browser test |
| TC-ROLE-002 | Role Selection | Unauthenticated | Quality Manager Role Button | Select Quality Manager persona | 1. Open app at the local Vite URL shown in the terminal with no persona saved.<br>2. Click "Maria — Quality Manager" card. | Click action | App transitions to main layout with Dashboard view. Sidebar displays Quality Manager chip. "Feedback & Review" nav item is ENABLED. | Clicked Maria card. App opened Dashboard view, sidebar displayed Maria chip, and Feedback & Review tab was enabled. | Pass | AI-assisted Playwright browser test |
| TC-ROLE-003 | Role Selection | Unauthenticated | Production Supervisor Role Button | Select Supervisor persona | 1. Open app with no persona saved.<br>2. Click "James — Production Supervisor" card. | Click action | App transitions to Dashboard. "Feedback & Review" nav item is DISABLED with "QM only" badge. | Clicked James card. App opened Dashboard view, sidebar displayed James chip, and Feedback & Review tab was disabled with "QM only" badge. | Pass | AI-assisted Playwright browser test |
| TC-ROLE-004 | Role Selection | Unauthenticated | Supplier Quality Engineer Role Button | Select Supplier Engineer persona | 1. Open app with no persona saved.<br>2. Click "Anika — Supplier Quality Engineer" card. | Click action | App transitions to Dashboard. "Feedback & Review" nav item is DISABLED. "Why you're here" card reflects Supplier Quality Engineer text. | Clicked Anika card. App opened Dashboard view, sidebar displayed Anika chip, Feedback tab was disabled, and persona need text displayed correctly. | Pass | AI-assisted Playwright browser test |
| TC-ROLE-005 | Role Selection | Unauthenticated | Operator / Inspector Role Button | Select Operator persona | 1. Open app with no persona saved.<br>2. Click "Carlos — Operator / Inspector" card. | Click action | App transitions to Dashboard. Role chip shows Operator label. Feedback queue disabled. | Clicked Carlos card. App opened Dashboard view, sidebar displayed Carlos chip, and Feedback tab was disabled. | Pass | AI-assisted Playwright browser test |
| TC-ROLE-006 | Role Switching | Any Role | "Switch role" Sidebar Button | Return to Role Selector screen | 1. From active view, click "Switch role" in lower left sidebar. | Click action | Current view collapses, returns to full Role Selector screen. Active persona state cleared. | Clicked "Switch role" in sidebar. App returned to full Role Selector screen and cleared active persona state. | Pass | AI-assisted Playwright browser test |
| TC-ROLE-007 | Role Persistence | Any Role | Browser Refresh Persistence | Verify selected role persists across page reload | 1. Select "Quality Manager".<br>2. Refresh browser page (F5). | Page Refresh | App reloads directly into Quality Manager view without asking to select role again (`qualiguide.personaId` in `localStorage`). | Selected Maria, reloaded browser page. App reloaded directly into Maria Quality Manager view without prompting for role selection. | Pass | AI-assisted Playwright browser test |

---

### Section B: Navigation & Shell Controls

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-NAV-001 | Sidebar Navigation | Any Role | Dashboard Item | Click Dashboard link | 1. Navigate to Document Library.<br>2. Click "Dashboard" in sidebar. | Click action | Main content updates to Dashboard screen. Nav item acquires `.active` CSS class. | Clicked Document Library then Dashboard link. Main content updated to Dashboard screen and Dashboard nav item acquired .active class. | Pass | AI-assisted Playwright browser test |
| TC-NAV-002 | Sidebar Navigation | Any Role | Document Library Item | Click Document Library link | 1. Click "Document Library" in sidebar. | Click action | View changes to Document Library grid & filter bar. | Clicked Document Library link in sidebar. View changed to Document Library grid and filter bar. | Pass | AI-assisted Playwright browser test |
| TC-NAV-003 | Sidebar Navigation | Any Role | Ask a Question Item | Click Ask a Question link | 1. Click "Ask a Question" in sidebar. | Click action | View changes to Q&A Panel. Input field and suggested questions chips displayed. | Clicked Ask a Question link in sidebar. View changed to Q&A Panel showing ask input box & suggested questions chips. | Pass | AI-assisted Playwright browser test |
| TC-NAV-004 | Sidebar Navigation | Any Role | NCR Assistant Item | Click NCR Assistant link | 1. Click "NCR Assistant" in sidebar. | Click action | View changes to NCR Assistant form and preset examples row. | Clicked NCR Assistant link in sidebar. View changed to NCR Assistant form and preset examples row. | Pass | AI-assisted Playwright browser test |
| TC-NAV-005 | Sidebar Navigation | Non-QM Roles | Feedback & Review Item (Disabled) | Attempt to click disabled Feedback tab as non-QM | 1. Log in as Operator or Supervisor.<br>2. Hover & click disabled "Feedback & Review" item. | Click action | Button is unclickable (`.disabled`, `aria-disabled="true"`). Tooltip displays "Available to the Quality Manager role". View does not change. | Attempted click on disabled Feedback tab as Supervisor. Button had .disabled class, aria-disabled="true", title tooltip "Available to the Quality Manager role", and view did not change. | Pass | AI-assisted Playwright browser test |
| TC-NAV-006 | Sidebar Navigation | Quality Manager | Feedback & Review Item (Enabled) | Click Feedback tab as Quality Manager | 1. Log in as Quality Manager.<br>2. Click "Feedback & Review" in sidebar. | Click action | View changes to Admin Review Queue showing feedback stat cards and comment list. | Clicked Feedback tab as Quality Manager. View changed to Admin Review Queue showing feedback stat cards and comment feed. | Pass | AI-assisted Playwright browser test |
| TC-NAV-007 | Data Management | Any Role | "Reset demo data" Button (Cancel) | Trigger reset demo data and cancel confirmation | 1. Click "Reset demo data" in sidebar.<br>2. On window.confirm popup, click "Cancel". | Window Alert Cancel | Popup closes, no data is wiped, active view and custom uploaded docs remain intact. | Triggered "Reset demo data" and dismissed dialog. Popup closed, no data was wiped, and active view remained intact. | Pass | AI-assisted Playwright browser test |
| TC-NAV-008 | Data Management | Any Role | "Reset demo data" Button (Confirm) | Reset all browser storage and state | 1. Add a simulated document or feedback.<br>2. Click "Reset demo data".<br>3. Click "OK" on confirmation dialog. | Window Alert OK | `localStorage` keys cleared. App resets to default 10 documents, 0 feedback entries, clears persona, and redirects to Role Selector. | Triggered "Reset demo data" and accepted dialog. LocalStorage keys cleared, persona cleared, and app redirected to Role Selector. | Pass | AI-assisted Playwright browser test |

---

### Section C: Dashboard View

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-DASH-001 | Dashboard Header | Any Role | Welcome Title & Banner | Verify persona title rendering | 1. Log in as Maria — Quality Manager.<br>2. Observe top page header. | N/A | Header reads "Welcome back, Maria". Simulated demo data banner is visible at top. | Header displayed "Welcome back, Maria" and simulated demo data banner was visible. | Pass | AI-assisted Playwright browser test |
| TC-DASH-002 | Metrics Summary | Any Role | Document Stat Cards | Verify correct count computation | 1. Count default documents in library (Total: 10, Current: 9, Archived: 1).<br>2. Check Dashboard stat cards. | N/A | Cards display: 10 Total sample documents, 9 Marked current, 1 Marked archived, 4 Departments covered. | Stat cards displayed 10 Total sample documents, 9 Marked current, 1 Marked archived, 4 Departments covered. | Pass | Checklist expectation corrected after verification of sample data. AI-assisted Playwright browser test. |
| TC-DASH-003 | Metrics Summary | Quality Manager | Dynamic Stat Update | Verify stat updates after adding document | 1. Add new document under "Quality" department with status "archived".<br>2. Return to Dashboard. | Form Submission | Total incremented to 11, Archived count incremented to 2. | Added new archived document under Quality department. Dashboard stat cards updated to Total: 11, Marked archived: 2. | Pass | AI-assisted Playwright browser test |
| TC-DASH-004 | Quicklinks | Any Role | "Ask a quality question" Button | Navigate to Q&A module via quicklink | 1. From Dashboard, click "Ask a quality question" panel link. | Click action | Active view switches to Q&A panel (`qa`). | Clicked "Ask a quality question" quicklink card on Dashboard. Active view switched to Q&A panel (qa). | Pass | AI-assisted Playwright browser test |
| TC-DASH-005 | Quicklinks | Any Role | "Start an NCR summary" Button | Navigate to NCR module via quicklink | 1. From Dashboard, click "Start an NCR summary" panel link. | Click action | Active view switches to NCR Assistant (`ncr`). | Clicked "Start an NCR summary" quicklink card on Dashboard. Active view switched to NCR Assistant (ncr). | Pass | AI-assisted Playwright browser test |
| TC-DASH-006 | Quicklinks | Any Role | "Browse document library" Button | Navigate to Document Library via quicklink | 1. From Dashboard, click "Browse the document library" panel link. | Click action | Active view switches to Document Library (`library`). | Clicked "Browse the document library" quicklink card on Dashboard. Active view switched to Document Library (library). | Pass | AI-assisted Playwright browser test |

---

### Section D: Document Library & Filters

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-DOC-001 | Document Search | Any Role | Search Input | Keyword search by document title | 1. Open Document Library.<br>2. Type "Calibration" in search box. | `Calibration` | Grid filters instantly to show only "Calibration Control Procedure". | Typed "Calibration" in search box. Grid filtered instantly to show only "Calibration Control Procedure". | Pass | AI-assisted Playwright browser test |
| TC-DOC-002 | Document Search | Any Role | Search Input | Keyword search by tag | 1. Type "esd" in search box. | `esd` | Shows "Electrostatic Discharge (ESD) Handling Procedure". Tags matched in lowercase. | Typed "esd" in search box. Grid filtered to show "Electrostatic Discharge (ESD) Handling Procedure". | Pass | AI-assisted Playwright browser test |
| TC-DOC-003 | Document Search | Any Role | Search Input | Search input supported fields verification | 1. Test terms matching Title, Document Number, Revision, Department, Site, and Tags.<br>2. Test term present ONLY in document fullText excerpt (e.g., "NIST-traceable"). | Search queries for title, docNum, rev, dept, site, tags vs fullText | Search filter matches `title`, `documentNumber`, `revision`, `department`, `site`, and `tags`. Search does NOT match `fullText` excerpt content (as implemented in `DocumentLibrary.jsx`). | Confirmed search filter matches title, documentNumber, revision, department, site, and tags, but does NOT match fullText excerpt content (returns empty state). | Pass | AI-assisted Playwright browser test |
| TC-DOC-004 | Search Empty State | Any Role | Search Input | Search for non-existent term | 1. Type "xyz999nonexistent" in search box. | `xyz999nonexistent` | Grid replaced with empty state text: "No documents match those filters. Try clearing a filter." | Typed "xyz999nonexistent" in search box. Grid replaced with empty state text: "No documents match those filters. Try clearing a filter." | Pass | AI-assisted Playwright browser test |
| TC-DOC-005 | Department Filter | Any Role | Department Dropdown | Filter by specific department | 1. Select "Production" from Department select dropdown. | Dropdown select: `Production` | Shows only Production documents (e.g. CNC Machining, ESD Handling). | Selected "Production" from Department dropdown. Grid displayed only Production documents. | Pass | AI-assisted Playwright browser test |
| TC-DOC-006 | Status Filter | Any Role | Status Dropdown | Filter by "Archived only" | 1. Select "Archived only" from Status dropdown. | Dropdown select: `archived` | Displays only archived documents (e.g. "Packaging and Labeling Specification" Rev C). | Selected "Archived only" from Status dropdown. Grid displayed only "Packaging and Labeling Specification" (Rev C). | Pass | AI-assisted Playwright browser test |
| TC-DOC-007 | Combined Filters | Any Role | Search + Dept + Status | Apply search keyword, department, and status simultaneously | 1. Type "Procedure".<br>2. Select Dept "Quality".<br>3. Select Status "Current only". | `Procedure` + `Quality` + `current` | Displays only current Quality procedures matching "Procedure". | Typed "Procedure", selected Dept "Quality", selected Status "Current only". Grid displayed 4 matching current Quality procedures. | Pass | AI-assisted Playwright browser test |
| TC-DOC-008 | Card Rendering | Any Role | Document Card | Verify card metadata tags and text | 1. Inspect any document card in grid. | N/A | Title, Department tag, Site tag, Doc Number tag, Revision tag, Status badge (`status-current` green or `status-archived` gray), and excerpt text displayed properly. | Inspected document cards in grid. Title, Department tag, Site tag, Doc Number tag, Revision tag, Status badge, and excerpt text displayed properly. | Pass | AI-assisted Playwright browser test |

---

### Section E: Simulated Document Upload Modal (Quality Manager Only)

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-UPL-001 | Modal Access | Non-QM Roles | "Add document" Button | Verify button hidden for non-QM roles | 1. Log in as Operator / Inspector.<br>2. Open Document Library. | N/A | "Add document" button is NOT present. Subtext states "Uploading is available to the Quality Manager role." | Logged in as Operator. "Add document" button was not rendered. Subtext stated "Uploading is available to the Quality Manager role." | Pass | AI-assisted Playwright browser test |
| TC-UPL-002 | Modal Access | Quality Manager | "Add document" Button | Open upload modal as Quality Manager | 1. Log in as Quality Manager.<br>2. Click "Add document" button. | Click action | Modal overlay opens displaying form title "Add a simulated document". Backdrop darkens. | Clicked "Add document" as Quality Manager. Modal overlay opened with title "Add a simulated document" and darkened backdrop. | Pass | AI-assisted Playwright browser test |
| TC-UPL-003 | Modal Closure | Quality Manager | Close Button ('X') & Backdrop | Close modal without saving | 1. Click "Add document".<br>2. Click 'X' icon or click outside card on backdrop. | Click action / Backdrop click | Modal closes immediately. No document created. | Tested Close button ('X') and backdrop click. Modal closed immediately in both cases with no document created. | Pass | AI-assisted Playwright browser test |
| TC-UPL-004 | Modal Closure | Quality Manager | Escape Keyboard Shortcut | Close modal using Escape key | 1. Click "Add document".<br>2. Press `Escape` key on keyboard. | `Escape` key | Modal closes immediately. (Note: Escape event listener is implemented; focus containment & restoration must be manually verified). | Pressed Escape key on keyboard. Modal closed immediately. Focus containment & restoration must be manually verified. | Pass | AI-assisted Playwright browser test |
| TC-UPL-005 | Form Validation | Quality Manager | Submit Blank Form | Attempt submission with all fields empty | 1. Open upload modal.<br>2. Click "Add to library" button without typing anything. | Empty fields | Red error banner appears at top: "Please fix the highlighted fields before adding this document." Specific field errors displayed under Title, Doc Number, Rev, Dept, Site, Tags, Excerpt. | Clicked "Add to library" on blank form. Red error banner and specific field errors appeared under all required fields. | Pass | AI-assisted Playwright browser test |
| TC-UPL-006 | Form Validation | Quality Manager | Whitespace-only Input | Fill fields with spaces only | 1. Enter spaces in Title (`   `), Doc Number (`   `), etc.<br>2. Click "Add to library". | Whitespace strings | Trimming causes validation to fail. Red error messages triggered on all required fields. | Filled fields with spaces only. Form validation failed and triggered red error banner and field error highlights. | Pass | AI-assisted Playwright browser test |
| TC-UPL-007 | Valid Upload | Quality Manager | Complete Form Submission | Submit valid new document | 1. Fill fields:<br>- Title: `Torque Wrench Calibration WI`<br>- Doc Num: `WI-8821`<br>- Revision: `A`<br>- Dept: `Quality`<br>- Site: `Plant 1`<br>- Status: `Current`<br>- Tags: `torque, gauge, assembly`<br>- Excerpt: `Torque wrenches must be verified daily on digital analyzer.`<br>2. Click "Add to library". | Valid data | Screen updates to success view inside modal: `"{Title}" was added to the simulated library...`. Buttons "Add another" and "Done" appear. | Submitted valid document form. Screen updated to success view displaying confirmation notice, "Add another" button, and "Done" button. | Pass | AI-assisted Playwright browser test |
| TC-UPL-008 | Multi-add Flow | Quality Manager | "Add another" Button | Reset modal state to add second document | 1. After successful upload, click "Add another" button. | Click action | Success message clears, form resets to `EMPTY_UPLOAD_FORM`, field errors cleared. Form ready for new entry. | Clicked "Add another". Success notice cleared, form inputs reset to empty values, ready for second entry. | Pass | AI-assisted Playwright browser test |
| TC-UPL-009 | Library Integration | Quality Manager | Document Verification in Grid | Verify uploaded document appears in library and persists | 1. Complete upload and click "Done".<br>2. Look at top of Document Library grid.<br>3. Refresh browser (F5). | Refresh page | Newly added document appears at top of grid. Document remains present after page reload (`qualiguide.documents` in `localStorage`). | Completed upload and clicked "Done". Uploaded document appeared at top of library grid and persisted across browser reload. | Pass | AI-assisted Playwright browser test |

---

### Section F: Q&A Workflow & Question Matching

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-QA-001 | Question Input | Any Role | "Ask" Button State | Verify button disabled when input is empty | 1. Open Ask a Question view.<br>2. Inspect "Ask" button while input is empty. | Empty input | "Ask" button is disabled (`disabled={true}`). | Inspected "Ask" button with empty/whitespace input. Button was disabled (disabled={true}). | Pass | AI-assisted Playwright browser test |
| TC-QA-002 | Suggested Questions | Any Role | Suggested Question Chip 1 | Click suggested question chip for revision | 1. Click chip: `"What is the current revision for the incoming inspection procedure?"` | Click chip | Supported Answer Card returned matching "Incoming Inspection Procedure" (Rev C). | Clicked chip 1. Supported Answer Card rendered citing "Incoming Inspection Procedure" (Rev C). | Pass | AI-assisted Playwright browser test |
| TC-QA-003 | Suggested Questions | Any Role | Suggested Question Chip 2 | Click suggested question chip for ESD PPE | 1. Click chip: `"What PPE is required for ESD-sensitive parts?"` | Click chip | Supported Answer Card returned citing "Electrostatic Discharge (ESD) Handling Procedure" (Rev B). Excerpt displays wrist strap/grounding details. | Clicked chip 2. Supported Answer Card rendered citing "Electrostatic Discharge (ESD) Handling Procedure" (Rev B) with wrist strap details. | Pass | AI-assisted Playwright browser test |
| TC-QA-004 | Suggested Questions | Any Role | Suggested Question Chip 3 | Click suggested question chip for Supplier CAPA | 1. Click chip: `"How long do supplier corrective actions have before they are due?"` | Click chip | Supported Answer Card returned citing "Supplier Quality Requirements Manual" (10 business days). | Clicked chip 3. Supported Answer Card rendered citing "Supplier Quality Requirements Manual" (10 business days). | Pass | AI-assisted Playwright browser test |
| TC-QA-005 | Refusal Workflow | Any Role | Suggested Question Chip 4 (Unsupported) | Click suggested question chip with no matching doc | 1. Click chip: `"How do I submit a purchase order in the ERP system?"` | Click chip | Refusal Card rendered with warning icon: "No approved source found". Message explicitly states QualiGuide AI is refusing to answer. | Clicked chip 4. Refusal Card rendered with header "No approved source found" stating refusal to answer unsupported question. | Pass | AI-assisted Playwright browser test |
| TC-QA-006 | Custom Question | Any Role | Keyword Match (Score >= 3) | Type custom question matching document tags | 1. Type: `What is the calibration cycle for gauges?`<br>2. Press Enter key or click "Ask". | `What is the calibration cycle for gauges?` | Matches "Calibration Control Procedure" (tags: `calibration`, `gauge`). Renders Supported Answer Card with citations & Feedback widget. | Typed custom question matching calibration tags. Supported Answer Card rendered citing "Calibration Control Procedure". | Pass | AI-assisted Playwright browser test |
| TC-QA-007 | Custom Question | Any Role | Low Score / Stopwords Only | Type question containing only stop words or unmatched terms | 1. Type: `What is the best way for me to do this on my own?` | `What is the best way for me to do this on my own?` | Score is below 3 (stop words filtered out). Refusal Card rendered. | Typed stop-words only question. Score was below threshold and Refusal Card was rendered. | Pass | AI-assisted Playwright browser test |
| TC-QA-008 | Custom Question | Quality Manager | Match Uploaded Custom Document | Ask question matching newly uploaded document | 1. Upload doc with tag `torque`.<br>2. In Q&A, ask: `How do we verify torque wrenches?` | `How do we verify torque wrenches?` | Correctly scores and cites the newly added simulated document from local storage. | Uploaded custom document with torque tag and asked matching question. Answer card correctly cited newly uploaded document. | Pass | AI-assisted Playwright browser test |
| TC-QA-009 | Thread History | Any Role | Multi-question Thread | Verify question thread order and cumulative items | 1. Ask Question A.<br>2. Ask Question B. | Sequential questions | Both questions and their answer/refusal cards are listed in the thread, with the newest question at the top. | Submitted two questions in sequence. Both questions appeared in thread with the newest question at top. | Pass | AI-assisted Playwright browser test |

---

### Section G: Nonconformance Report (NCR) Assistant & Validation

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-NCR-001 | Preset Examples | Any Role | Example Chip 1 | Load NCR Example 1 (Bore diameter) | 1. Open NCR Assistant.<br>2. Click chip `"NCR-014 — Bore diameter out of tolerance"`. | Click action | Form populates: Part `HSG-4471`, Supplier `Internal — Plant 1 Machining`, Qty `340`, Severity `Major`, Stage `In-process`. Validation errors cleared. | Clicked Example 1. Form populated with part HSG-4471, supplier Internal — Plant 1 Machining, qty 340, severity Major, stage In-process. | Pass | AI-assisted Playwright browser test |
| TC-NCR-002 | Preset Examples | Any Role | Example Chip 2 | Load NCR Example 2 (Connector plating) | 1. Click chip `"NCR-021 — Incoming connector plating defect"`. | Click action | Form populates: Part `CN-2208`, Supplier `Meridian Electronics Supply`, Qty `1200`, Severity `Major`, Stage `Incoming inspection`. | Clicked Example 2. Form populated with part CN-2208, supplier Meridian Electronics Supply, qty 1200, severity Major, stage Incoming inspection. | Pass | AI-assisted Playwright browser test |
| TC-NCR-003 | Preset Examples | Any Role | Example Chip 3 | Load NCR Example 3 (ESD Board) | 1. Click chip `"NCR-027 — ESD-sensitive board handled ungrounded"`. | Click action | Form populates: Part `PCB-9903`, Supplier `Internal — Plant 2 Assembly`, Qty `58`, Severity `Critical`, Stage `Internal audit`. | Clicked Example 3. Form populated with part PCB-9903, supplier Internal — Plant 2 Assembly, qty 58, severity Critical, stage Internal audit. | Pass | AI-assisted Playwright browser test |
| TC-NCR-004 | Form Validation | Any Role | Submit Empty Form | Click "Generate NCR summary" on blank form | 1. Clear form.<br>2. Click "Generate NCR summary" button. | Blank form | Error banner appears: "Please fix the highlighted fields before generating a summary." Required indicators triggered for Part, Supplier, Qty, Severity, Issue, Stage, Containment. Output card remains empty. | Clicked "Generate NCR summary" on blank form. Error banner and error highlights triggered for all required fields. Output card remained empty. | Pass | AI-assisted Playwright browser test |
| TC-NCR-005 | Form Validation | Any Role | Non-numeric Quantity | Enter text string in Affected Quantity field | 1. Enter `abc` or `twelve` in Affected quantity.<br>2. Fill other fields validly and submit. | Qty: `abc` | Validation error: "Enter a whole number greater than 0." Summary not generated. | Entered "abc" in quantity field. Field error "Enter a whole number greater than 0." triggered and summary was not generated. | Pass | AI-assisted Playwright browser test |
| TC-NCR-006 | Form Validation | Any Role | Zero Quantity | Enter `0` in Affected Quantity field | 1. Enter `0` in Affected quantity field.<br>2. Submit form. | Qty: `0` | Validation error: "Enter a whole number greater than 0." | Entered 0 in quantity field. Field error "Enter a whole number greater than 0." triggered. | Pass | AI-assisted Playwright browser test |
| TC-NCR-007 | Form Validation | Any Role | Negative Quantity | Enter `-50` in Affected Quantity field | 1. Enter `-50` in Affected quantity field.<br>2. Submit form. | Qty: `-50` | Validation error: "Enter a whole number greater than 0." | Entered -50 in quantity field. Field error "Enter a whole number greater than 0." triggered. | Pass | AI-assisted Playwright browser test |
| TC-NCR-008 | Form Validation | Any Role | Decimal Quantity | Enter `10.5` in Affected Quantity field | 1. Enter `10.5` in Affected quantity field.<br>2. Submit form. | Qty: `10.5` | Validation error: "Enter a whole number greater than 0." | Entered 10.5 in quantity field. Field error "Enter a whole number greater than 0." triggered. | Pass | AI-assisted Playwright browser test |
| TC-NCR-009 | Summary Generation | Any Role | Valid Internal NCR | Generate summary for internal CNC issue | 1. Load Example 1 (Bore diameter).<br>2. Click "Generate NCR summary". | Example 1 data | Summary output generated: Quality Manager review banner visible; Summary paragraph; Containment steps (quarantine 340 units); Investigation areas (review CNC tooling, calibration); Next actions; Citations listing `doc_009`, `doc_006`, `doc_003`. | Generated summary for Example 1. QM review banner rendered, summary paragraph generated, containment quarantine steps listed, and citations rendered. | Pass | AI-assisted Playwright browser test |
| TC-NCR-010 | Summary Generation | Any Role | Valid Supplier NCR | Generate summary for external supplier issue | 1. Load Example 2 (Connector plating).<br>2. Click "Generate NCR summary". | Example 2 data | Summary includes supplier notification step, PPAP review investigation area, and Supplier Corrective Action Request (SCAR - 10 business days) next action. Citations include `doc_005` (Supplier Quality Manual). | Generated summary for Example 2. Included supplier notification step, PPAP investigation area, and SCAR 10-business-day action item. | Pass | AI-assisted Playwright browser test |
| TC-NCR-011 | Summary Generation | Any Role | Critical Severity Logic | Generate summary for Critical severity NCR | 1. Load Example 3 (ESD board, Critical severity).<br>2. Click "Generate NCR summary". | Example 3 data | Investigation areas explicitly contain escalation statement: "Escalate immediately given Critical severity — confirm no additional lots or downstream units are affected." Citations include `doc_004` (ESD Handling Procedure). | Generated summary for Critical severity Example 3. Investigation section contained immediate escalation statement for Critical severity. | Pass | AI-assisted Playwright browser test |

---

### Section H: Feedback Widget Workflow

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-FB-001 | Feedback Options | Any Role | Rating Buttons | Select a feedback rating button | 1. Generate Q&A answer or NCR summary.<br>2. In the Feedback Widget, click "Helpful". | Click "Helpful" | Button acquires selected state (`.selected.helpful`). Comment textarea and "Submit feedback" button slide open. | Clicked "Helpful". Button acquired selected.helpful class, comment box and Submit feedback button appeared. | Pass | AI-assisted Playwright browser test |
| TC-FB-002 | Rating Options | Any Role | Rating Button Choices | Verify all 4 feedback choices selectable | 1. Toggle between "Helpful", "Wrong", "Incomplete", and "Outdated". | Click buttons | Each button reflects appropriate styling when selected ("Wrong" red, "Incomplete" orange, etc.). | Toggled between Helpful, Wrong, Incomplete, and Outdated buttons. Each acquired appropriate active selection class. | Pass | AI-assisted Playwright browser test |
| TC-FB-003 | Submission | Any Role | Submit Without Comment | Submit feedback rating with empty comment | 1. Select "Helpful".<br>2. Leave comment textarea blank.<br>2. Click "Submit feedback". | Empty comment | Widget transitions to confirmation view: `Feedback submitted — marked "Helpful". Thank you.` Entry saved in state. | Submitted rating without comment. Widget transitioned to confirmation notice `Feedback submitted — marked "Helpful". Thank you.` | Pass | AI-assisted Playwright browser test |
| TC-FB-004 | Submission | Any Role | Submit With Comment | Submit rating with detailed comment | 1. On an NCR summary, select "Incomplete".<br>2. Enter comment: `Needs specific calibration gauge ID.`<br>3. Click "Submit feedback". | Rating: Incomplete<br>Comment: `Needs specific calibration gauge ID.` | Widget transitions to confirmation message. Feedback entry added to `feedbackEntries` state and `localStorage`. | Submitted rating with comment. Widget transitioned to confirmation notice and saved comment to state/localStorage. | Pass | AI-assisted Playwright browser test |
| TC-FB-005 | Prevention of Duplicates | Any Role | Widget Re-render State | Verify duplicate feedback cannot be resubmitted for same result | 1. Submit feedback on a result.<br>2. Scroll up/down or switch tabs and return. | Re-open view | Widget immediately renders confirmation state: `Feedback submitted — marked "..."`. Input form is no longer shown for that `resultId`. | Submitted feedback on result. Feedback form was replaced with confirmation state and rating/submit buttons were removed for that result. | Pass | AI-assisted Playwright browser test |

---

### Section I: Administrative Feedback Review Queue

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-ADM-001 | UI Role Restriction | Non-QM Roles | Feedback Nav Item (Disabled) | Primary UI Role Restriction: Verify disabled Feedback item in sidebar | 1. Log in as Operator, Supervisor, or Supplier Engineer.<br>2. Check sidebar items and attempt to click "Feedback & Review". | Click action | "Feedback & Review" nav item is disabled (`aria-disabled="true"`). Clicking does not switch view or grant access to queue. | Verified disabled Feedback & Review item for Operator role. Item had .disabled class, aria-disabled="true", and clicking did not switch view. | Pass | AI-assisted Playwright browser test |
| TC-ADM-002 | Access Control Guard | Non-QM Roles | State & LocalStorage Override | Optional Advanced Access-Control Test: Attempt forced state override to 'feedback' | 1. Log in as Operator or Supervisor.<br>2. Set `qualiguide.view` in `localStorage` to `"feedback"` and refresh page. | `qualiguide.view = "feedback"` | `App.jsx` guard checks `persona.id === 'quality_manager'`. View falls back to `'dashboard'` automatically. | Overrode localStorage view key to "feedback" as Operator and refreshed. App guard automatically fell back active view to Dashboard. | Pass | AI-assisted Playwright browser test |
| TC-ADM-003 | Stat Cards | Quality Manager | Feedback Counters | Check counter aggregation across ratings | 1. Submit 2 "Helpful", 1 "Wrong", and 1 "Incomplete" feedback across Q&A and NCR.<br>2. Navigate to "Feedback & Review". | N/A | Top stat cards accurately display: Helpful: 2, Wrong: 1, Incomplete: 1, Outdated: 0. | Submitted 2 Helpful, 1 Wrong, and 1 Incomplete feedback. Stat cards accurately aggregated counters: Helpful: 2, Wrong: 1, Incomplete: 1, Outdated: 0. | Pass | AI-assisted Playwright browser test |
| TC-ADM-004 | Comment List | Quality Manager | Recent Comments Feed | Display of comments in reverse chronological order | 1. Submit Comment 1 on Q&A.<br>2. Submit Comment 2 on NCR.<br>3. Open "Feedback & Review" view. | N/A | "Recent comments" panel lists Comment 2 at top (most recent), followed by Comment 1. Rating badge, context label ("NCR Assistant · Part...", "Q&A · ..."), and text displayed. | Submitted Comment 1 then Comment 2. Recent comments feed listed Comment 2 at top followed by Comment 1 with context labels. | Pass | AI-assisted Playwright browser test |
| TC-ADM-005 | Empty Queue | Quality Manager | Zero Submissions State | Check view when no feedback has been submitted | 1. Reset demo data.<br>2. Log in as Quality Manager.<br>3. Open "Feedback & Review". | Empty feedback | Stat cards show 0. Comment panel displays empty state message: "No comments have been submitted yet." | Cleared storage and opened Feedback & Review as Quality Manager. Stat cards showed 0 and comment feed displayed empty state message. | Pass | AI-assisted Playwright browser test |

---

### Section J: Input Validation, Security, & Boundary Scenarios

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-SEC-001 | XSS / Script Injection | Any Role | Q&A Search Input | Submit `<script>` tag in Q&A question | 1. Open Ask a Question.<br>2. Enter: `<script>alert('xss')</script>`<br>3. Click "Ask". | `<script>alert('xss')</script>` | Text is rendered safely as plain string in question bubble. No script executes; refusal card or safe answer shown. | Submitted <script> tag in Q&A input. Registered dialog listener confirmed zero script execution; payload rendered safely as literal text node. | Pass | AI-assisted Playwright browser test |
| TC-SEC-002 | XSS / HTML Injection | Quality Manager | Document Upload Form | Submit HTML/Script tags in Document Title & Excerpt | 1. Open Upload Modal.<br>2. Title: `<img src=x onerror=alert(1)>`<br>3. Excerpt: `<b onmouseover=alert(1)>test</b>`<br>4. Fill other fields & submit. | HTML tags in inputs | Document saved safely. HTML tags are escaped and rendered as text nodes in the DOM without script execution. | Submitted HTML/script tags in upload form. Registered dialog listener confirmed zero script execution; tags rendered safely as text nodes. | Pass | AI-assisted Playwright browser test |
| TC-SEC-003 | XSS / HTML Injection | Any Role | Feedback Comment Input | Submit script payload in feedback comment | 1. Select rating "Wrong".<br>2. Comment: `<svg/onload=alert('XSS')>`<br>3. Submit feedback and view in Admin Queue. | `<svg/onload=alert('XSS')>` | Comment text renders safely as literal string in Admin Review Queue. No script execution. | Submitted script payload in feedback comment. Text rendered safely as literal string in Admin Review Queue with zero script execution. | Pass | AI-assisted Playwright browser test |
| TC-SEC-004 | Boundary Testing | Any Role | Textarea Inputs | Submit extremely long string (5,000+ characters) | 1. Paste 5,000 chars into NCR Issue Description or Feedback Comment.<br>2. Submit form. | 5,000+ char string | UI handles long text without breaking layout or crashing React state. Text wraps inside card container. | Submitted 5,000-character string into NCR description. UI rendered output without state crash or horizontal body overflow. | Pass | AI-assisted Playwright browser test |
| TC-SEC-005 | Special Characters | Any Role | Text Inputs | Enter Unicode, emojis, and symbols | 1. Enter text with symbols: `Part #@!$%^&*()_+=~`{}[]|\:;"'<>,.?/ 🛠️⚠️` in NCR Part Number. | Special characters & emojis | Form accepts input, renders special characters correctly without syntax or rendering errors. | Entered special characters, symbols, and emojis in NCR Part input. Summary output rendered input string cleanly without syntax or encoding errors. | Pass | AI-assisted Playwright browser test |
| TC-SEC-006 | SQL-like Input Handling | Any Role | Search & Filter Fields | Verify safe frontend handling of SQL-like strings | 1. Type `' OR '1'='1` or `DROP TABLE documents; --` into Document Library search.<br>*(Note: SQL injection is not applicable as a backend vulnerability because this prototype has no database or SQL queries; test evaluates safe text handling).* | `' OR '1'='1` | Handled strictly as literal text string in JavaScript `.includes()` filter. No crash or error. | Typed SQL-like strings into Document Library search. Strings handled safely as literal text in JS filter with zero crashes or errors. | Pass | AI-assisted Playwright browser test |

---

### Section K: Workflow Edge Cases, Rapid Interaction, & State Persistence

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-EDGE-001 | Rapid Clicking | Any Role | "Ask" / "Generate" Buttons | Rapid double/triple click submit buttons | 1. Enter valid NCR data.<br>2. Double-click "Generate NCR summary" button rapidly. | Rapid double click | Application handles state gracefully without duplicate key errors or console errors. Single result generated. | Clicked "Generate NCR summary" 3 times rapidly. Single summary result rendered cleanly without React key warnings or state duplication. | Pass | AI-assisted Playwright browser test |
| TC-EDGE-002 | Rapid Preset Toggling | Any Role | NCR Example Chips | Click preset example chips in rapid succession | 1. Click Example 1, immediately click Example 2, then Example 3. | Rapid chip clicks | Form updates cleanly to reflect Example 3. No race conditions or mixed field data. | Clicked Example 1, Example 2, and Example 3 in rapid succession. Form cleanly updated to reflect Example 3 data without mixed values. | Pass | AI-assisted Playwright browser test |
| TC-EDGE-003 | Browser Reload | Any Role | Full App State | Refresh page during active Q&A session | 1. Perform Q&A questions.<br>2. Refresh browser (F5). | Page reload | Active persona, active view (`qualiguide.view`), documents list, and submitted feedback persist. Q&A transient thread state resets cleanly to empty. | Asked Q&A question and reloaded page. Persona, view, documents, and feedback persisted, while transient Q&A thread reset to empty. | Pass | AI-assisted Playwright browser test |
| TC-EDGE-004 | LocalStorage Corruption | Any Role | LocalStorage Parsing | Corrupt `localStorage` values with malformed JSON | 1. Open DevTools -> Application -> Local Storage.<br>2. Edit `qualiguide.documents` to invalid string `INVALID_JSON{`.<br>3. Refresh page. | Corrupted storage string | `readStoredValue` catch block handles error safely and falls back to default `DOCUMENTS` array without crashing app. | Corrupted qualiguide.documents key with malformed JSON and reloaded. Try/catch block handled error and safely fell back to default 10 documents. | Pass | AI-assisted Playwright browser test |

---

### Section L: Accessibility & Keyboard Navigation

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-A11Y-001 | Focus Ring | Any Role | Buttons & Nav Links | Tab navigation focus indicator visibility | 1. Press `Tab` repeatedly from top of page.<br>2. Observe focused elements. | `Tab` key | Clear, high-contrast blue focus outline (`outline: 2px solid var(--brand); outline-offset: 2px;`) appears on active button/link. | Pressed Tab repeatedly. Focused elements acquired visible outline/box-shadow focus styling. | Pass | AI-assisted Playwright browser test |
| TC-A11Y-002 | Form Focus Ring | Any Role | Inputs, Selects, Textareas | Focus indicator on text fields | 1. `Tab` into text input or select dropdown. | `Tab` key | Box shadow ring (`box-shadow: 0 0 0 3px rgba(40,82,122,0.25)`) and brand border outline appear around input. | Focused into text input #ncr-part. Verified active focus ring styling in computed styles. | Pass | AI-assisted Playwright browser test |
| TC-A11Y-003 | Modal Accessibility & Keyboard Behavior | Quality Manager | Upload Document Modal | Verify dialog markup, initial focus, focus trap, Escape behavior, and focus restoration | 1. Open Upload Modal as Quality Manager.<br>2. Inspect dialog ARIA markup (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).<br>3. Test initial focus position, `Tab` focus containment inside modal, `Escape` key close, and focus restoration to trigger button upon close. | `Tab`, `Shift+Tab`, `Escape` | Modal card includes dialog ARIA markup. Manual testing must verify whether initial focus, focus trap, Escape closing, and focus restoration operate as expected in the browser. | Dialog ARIA markup (role="dialog", aria-modal="true", aria-labelledby), Escape closing, and focus restoration passed. Initial focus placement and focus trap containment failed (focus remained on background trigger button and leaked to background search bar when tabbing). | Fail | BUG-001 (AI-assisted Playwright browser test) |
| TC-A11Y-004 | Form Labels | Any Role | Form Controls | Verify HTML label association | 1. Click on label text "Part number" in NCR form. | Click label text | Cursor automatically focuses into input `#ncr-part` (`for`/`id` matching). | Clicked label text for Part number. Focus automatically moved into input #ncr-part via for/id matching. | Pass | AI-assisted Playwright browser test |
| TC-A11Y-005 | Screen Reader Search | Any Role | Document Search Bar | Accessible name on search input | 1. Inspect search input in Document Library. | N/A | Input includes explicit `aria-label="Search documents by title or tag"`. | Inspected Document Library search input. Verified explicit aria-label="Search documents by title or tag" attribute. | Pass | AI-assisted Playwright browser test |
| TC-A11Y-006 | Keyboard Submit | Any Role | Q&A Input Field | Submit question using Enter key | 1. Type question in Q&A input.<br>2. Press `Enter`. | `Enter` key | Typed question in Q&A input and pressed Enter key. Question submitted immediately and returned Supported Answer Card. | Pass | AI-assisted Playwright browser test |

---

### Section M: Responsive Layouts & Offline Resilience

| Test ID | Feature Area | Role | Feature or Control | Test Scenario | Exact Manual Test Steps | Test Input | Expected Result | Actual Result | Status | Notes or Bug ID |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-RESP-001 | Desktop View | Any Role | Main App Layout | Layout at desktop resolutions (>1024px) | 1. Set window width to 1280px. | Viewport: 1280px | Sidebar fixed on left (232px). Main content area takes remaining width. Grid layouts render 2-column or 4-column stat cards. | Set viewport to 1280px. Sidebar rendered on left, main view took remaining width, zero horizontal body overflow observed. | Pass | AI-assisted Playwright browser test |
| TC-RESP-002 | Tablet View | Any Role | Grid Responsive Breakpoint | Layout at tablet resolution (768px - 860px) | 1. Resize viewport width to 800px. | Viewport: 800px | Media query `@media (max-width: 860px)` activates: NCR form/output stack vertically; stat cards adapt to 2 columns; doc grid becomes 1 column. | Set viewport to 800px. Responsive media query activated, NCR form stacked vertically, zero horizontal body overflow observed. | Pass | AI-assisted Playwright browser test |
| TC-RESP-003 | Mobile View | Any Role | Top Navigation Bar | Layout at mobile screen width (<=720px) | 1. Resize viewport width to 600px. | Viewport: 600px | Sidebar converts to top horizontal scrolling bar. Footer buttons shrink (`.qg-switch-btn-label` hidden). Form grids stack in single column. | Set viewport to 600px. Sidebar adapted to horizontal bar, footer labels collapsed, zero horizontal body overflow observed. | Pass | AI-assisted Playwright browser test |
| TC-RESP-004 | Mobile Small | Any Role | Q&A & Stat Layout | Layout at narrow mobile width (<=480px) | 1. Resize viewport to 375px (iPhone SE width). | Viewport: 375px | Stat cards switch to 2-column compact layout. Q&A ask row stacks input and button vertically. No horizontal body overflow. | Set viewport to 375px. Stat cards adapted to compact 2-column layout, zero horizontal body overflow observed. | Pass | AI-assisted Playwright browser test |
| TC-NET-001 | Offline Operation | Any Role | Entire Application | Disconnect network connection | 1. Open DevTools -> Network -> Select "Offline".<br>2. Navigate tabs, run Q&A, generate NCRs, add documents. | Offline mode | All features continue functioning 100% locally with zero errors or failed network requests. | Switched browser context to offline mode. Navigated tabs, ran Q&A, generated NCRs, and added documents with zero errors or network requests. | Pass | AI-assisted Playwright browser test |
| TC-NET-002 | Storage Fallback | Any Role | Disabled LocalStorage | Verify app behavior when browser storage is restricted or disabled | 1. Disable `localStorage` in browser settings or use private mode with storage blocked.<br>2. Perform app actions. | Storage blocked | App functions correctly in memory without throwing unhandled JS exceptions. | Blocked localStorage setItem handler. App continued functioning cleanly in memory without throwing unhandled JS exceptions. | Pass | AI-assisted Playwright browser test |

---

## 3. Review Summary & Inventory

### A. List of Application Files & Components Reviewed

- **Core Application Setup**:
  - [`src/App.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/App.jsx): Root state management, `localStorage` synchronization, view routing, role guard.
  - [`src/main.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/main.jsx): React DOM root entry point.
  - [`index.html`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/index.html): HTML shell document.

- **UI Components** (`src/components/`):
  - [`src/components/RoleSelector.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/components/RoleSelector.jsx): Simulated role selection screen with persona cards and demo disclaimers.
  - [`src/components/Sidebar.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/components/Sidebar.jsx): Brand header, main navigation links, role badge, "Switch role", and "Reset demo data" controls.
  - [`src/components/Dashboard.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/components/Dashboard.jsx): Metrics summary cards, quicklink shortcuts, and role persona need card.
  - [`src/components/DocumentLibrary.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/components/DocumentLibrary.jsx): Document card grid, real-time search, department & status filter dropdowns, and `UploadDocumentModal`.
  - [`src/components/QAPanel.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/components/QAPanel.jsx): Interactive Q&A prompt box, suggested question chips, document matching engine, answer/refusal cards.
  - [`src/components/NCRAssistant.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/components/NCRAssistant.jsx): Nonconformance form, preset example chips, rule-based summary generation, citations, and draft disclaimer.
  - [`src/components/AdminReviewQueue.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/components/AdminReviewQueue.jsx): Quality Manager feedback review queue, feedback counter metrics, and chronological comment list.
  - [`src/components/FeedbackWidget.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/components/FeedbackWidget.jsx): Rating selector buttons (Helpful, Wrong, Incomplete, Outdated), comment input, and submission feedback handler.

- **Data Models & Utilities** (`src/data/`, `src/utils/`, `src/constants/`):
  - [`src/data/sampleData.jsx`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/data/sampleData.jsx): Default data for personas, 10 sample documents, suggested questions, severity/detection options, preset NCR examples, and feedback options.
  - [`src/utils/qualiguide.js`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/utils/qualiguide.js): `makeId()`, `scoreDocuments()`, `matchQuestion()`, and `generateNcrSummary()` logic.
  - [`src/utils/validation/ncrForm.js`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/utils/validation/ncrForm.js): Form validation for NCR details.
  - [`src/utils/validation/uploadDocument.js`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/utils/validation/uploadDocument.js): Form validation for document upload.

- **Styles**:
  - [`src/styles/qualiguide.css`](file:///c:/Users/karan/OneDrive/Documents/IWU/AI%20Integration%20Capstone/Workshop%202/Assignment%201.3/QualiGuide-AI-Local-Assignment/src/styles/qualiguide.css): Main stylesheet with design tokens, layout styles, focus indicators, status badges, and responsive media queries.

---

### B. Concise Inventory of Screens, Features, Controls, and Workflows Found

1. **Screens / Views (6 Screens/Views)**:
   1. Role Selector Screen (Simulated Sign-in)
   2. Dashboard Overview
   3. Document Library
   4. Ask a Question (Q&A Panel)
   5. NCR Assistant
   6. Administrative Feedback & Review Queue (Quality Manager Only)

2. **Interactive Controls & Buttons**:
   - 4 Role Selection Cards
   - 5 Navigation Items in Sidebar (1 disabled for non-QM roles)
   - "Switch role" & "Reset demo data" buttons
   - 3 Dashboard Quicklink Action Cards
   - Document Search Input & 2 Select Dropdowns (Department, Status)
   - "Add document" Button & Upload Modal controls (Close 'X', "Add to library", "Add another", "Done")
   - Q&A Text Input, "Ask" Button, and 4 Suggested Question Chips
   - NCR Form Inputs (Part Number, Supplier, Affected Quantity, Severity Select, Issue Description Textarea, Detection Stage Select, Containment Action) & 3 Preset Example Chips
   - 4 Feedback Rating Buttons ("Helpful", "Wrong", "Incomplete", "Outdated"), Feedback Comment Textarea, and "Submit feedback" Button

3. **Workflows**:
   - Simulated Role Authentication & Role Switcher
   - Document Search & Multi-criteria Filtering
   - Quality Manager Document Addition & Browser Storage Persistence
   - Local Keyword/Tag Question Answering & Citation Matching
   - Quality Refusal Workflow for Unsupported Questions
   - Templated Nonconformance Summary & Investigation Generation
   - Result Feedback Submission & Quality Manager Administrative Review Queue

---

### C. Features Whose Behavior Cannot Be Confirmed from Source-Code Alone

1. **Upload Modal Focus Management & Keyboard Trap**: The modal includes dialog markup and an `Escape` key listener, but focus containment (trapping `Tab` within modal), initial focus element placement, and focus restoration to the trigger button upon closure must be verified manually in a live browser.
2. **Browser LocalStorage Quota Exceeded Behavior**: When browser storage limit is reached, `useEffect` catch blocks handle errors silently, but visual UI degradation or state loss under full storage requires manual browser testing.
3. **Screen Reader Audio & Live Region Announcements**: Verification of VoiceOver, NVDA, or JAWS speech output for dynamic content additions (e.g. success messages, form error banners).

---

### D. Assumptions That Must Be Verified Manually

1. **Modal Focus Behavior**: Keyboard focus trapping within `UploadDocumentModal` must be manually tested with the `Tab` key.
2. **Date & Time Formatting**: `Date.now()` timestamps in feedback entries require verification for user display formatting across browsers.
3. **Touch Viewport Adaptation**: Mobile browser navigation bar behavior when scrolling on small touchscreens.

---

### E. Scenarios Not Applicable to This Frontend Prototype

1. **Backend Database & Server-Side Security Vulnerabilities**: SQL injection is not applicable as a backend database vulnerability because this prototype has no backend server, database, or SQL queries. SQL-like strings are tested purely as safe frontend text input.
2. **Real Authentication & Identity Providers**: No OAuth, SAML, passwords, or JWT tokens are involved.
3. **External LLM RAG Pipeline**: Question answering and NCR summaries use pure JavaScript keyword scoring and template rules against local mock data.
4. **Binary Document Parsing**: File uploads do not parse `.pdf` or `.docx` files.

---

### F. Total Number of Test Cases Created

- **Total Manual Test Cases**: **88 Test Cases** across 13 distinct sections (Section A through Section M).
