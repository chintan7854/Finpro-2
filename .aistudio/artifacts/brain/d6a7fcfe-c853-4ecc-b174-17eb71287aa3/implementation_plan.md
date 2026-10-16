# Implementation Plan — Finance Pro News System Complete Upgrade

Comprehensive upgrade plan for the Finance Pro News module, reinforcing real-time fact checking, verified news catalog maintenance, dual-cycle automated scheduler, multi-language detailed article generation, full article copying & WhatsApp sharing, and bottom reader controls while preserving all existing application features.

---

### 1. Architectural Inspection & Current Baseline

- **News State & Data Engine**:
  - `src/constants/financeNewsData.ts`: Holds initial verified National (10 items) and International (10 items) records with official sources (RBI, AMFI, MoSPI, CBDT, US Fed, OPEC, IMF, ECB, etc.).
  - `src/types/news.ts`: Defines `FinanceNewsItem`, `FinanceNewsArticle`, `NewsNotification`, and `NewsSchedulerStatus`.
- **Backend & Automation**:
  - `server.ts` & `api/index.ts`: Dual-cycle scheduler registered with `node-cron` at `0 4 * * *` (Fetch) and `30 4 * * *` (Safe Pruning) with `Asia/Kolkata` timezone.
  - Endpoints: `GET /api/news`, `GET /api/news/status`, `POST /api/news/refresh`, `POST /api/news/generate-article`, and `POST /api/news/custom-topic`.
- **UI Components & Handlers**:
  - `src/components/news/FinanceNewsView.tsx`: News dashboard with category tabs, search, impact filter, custom topic modal, and scheduler status modal.
  - `src/components/news/FinanceArticleReader.tsx`: Article reader with inline editing, regenerate, save, copy, and WhatsApp sharing.
  - `src/components/news/NewsNotificationBell.tsx`: Notification bell with unread counters and navigation to news items.
  - `src/components/news/NewsSchedulerModal.tsx`: Real-time inspector for 4:00 AM / 4:30 AM cron jobs, live counts, and scheduler audit logs.

---

### 2. Required Upgrades & Gaps Identified

1. **Fact-Checking & Verification Status Support**:
   - Extend `FinanceNewsItem` in `src/types/news.ts` to include standardized `VerificationStatus`: `'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED' | 'OUTDATED' | 'FAILED'`.
   - Store retrieval & verification timestamps (`verifiedAt`, `retrievedAt`), source URLs, evidence notes, and publisher types.
   - Display prominent verification badges with distinct colors, official primary source indicators, and exact publication/event dates on news cards.

2. **Full Article Copying & WhatsApp Sharing**:
   - Ensure `handleCopyText` copies the entire comprehensive article including Headline, Verified Facts, Context, Why It Matters, All 9 Financial Impacts, Advisor Perspective, Practical Takeaways, Common Mistakes, Future Scenarios, Conclusion, and Active Advisor Credentials with Disclaimers.
   - Upgrade WhatsApp sharing to support complete formatted advisory briefs (using WhatsApp markdown formatting: `*bold*`, `_italic_`, `•` bullets) without lossy truncation, with fallback to clipboard if message exceeds URL limits. Avoid `window.open` per environment constraints.

3. **Working Bottom Controls on Article Reader**:
   - Add a sticky/docked or prominent bottom action toolbar on `FinanceArticleReader.tsx`:
     - "Back to News Dashboard"
     - "Save Article" / "Saved in Library"
     - "Edit Article" / "Save Changes"
     - "Regenerate Analysis"
     - "Copy Full Article"
     - "Share to WhatsApp" (Complete Brief)
     - "Scroll to Top" smooth navigation
     - "Delete Article" (if saved)

4. **Detailed Article Generator Depth & 9 Financial Impacts**:
   - Verify that all 9 financial impacts are fully articulated across both AI generation prompts and local high-fidelity generator:
     1. Household Expenses
     2. Inflation
     3. Savings & Bank FDs
     4. Loans & EMIs
     5. Taxes & Deductions
     6. Insurance (Term & Health)
     7. SIPs & Mutual Funds
     8. Stock Markets
     9. Gold & Commodities
   - Map both modern (`fullName`, `mobile`, `amfiArn`, `croppedPhotoUrl`) and legacy (`advisorName`, `phoneNumber`, `professionalDetails`, `profilePhoto`) advisor profile properties so active profile data is always 100% complete.

5. **Scheduler & Automation Safeguards**:
   - Preserve 10 active National and 10 active International verified news items.
   - Maintain strict safe-cleanup guard: never prune more old items than successfully added new items, and skip cleanup if 4:00 AM addition fails.
   - Retain full audit logs and timezone verification.

---

### 3. Implementation Steps

- **Step 1**: Update `src/types/news.ts` with `VerificationStatus` and verification metadata fields.
- **Step 2**: Enhance `src/constants/financeNewsData.ts` with `verificationStatus: 'VERIFIED'`, verified timestamps, and primary source attributes.
- **Step 3**: Update `src/services/financeNewsService.ts` local high-fidelity generator and helpers to support all 9 impact breakdowns, multi-language phrasing, and complete advisor profile binding.
- **Step 4**: Upgrade `FinanceArticleReader.tsx` with:
  - Full article clipboard copying (comprehensive formatting with all 9 impacts and scenarios)
  - Full WhatsApp sharing with options for Complete Brief and Executive Summary
  - Prominent bottom controls bar (Back, Save, Edit, Regenerate, Copy, WhatsApp, Scroll to Top)
  - Enhanced in-place editing for content sections
- **Step 5**: Upgrade `FinanceNewsView.tsx` with verification status badges, source links, publication/event dates, and active count indicators.
- **Step 6**: Update `server.ts` and `api/index.ts` to ensure consistency of news endpoints and scheduler logs with new verification status fields.
- **Step 7**: Compile and lint the applet to verify zero TypeScript errors or regressions.
