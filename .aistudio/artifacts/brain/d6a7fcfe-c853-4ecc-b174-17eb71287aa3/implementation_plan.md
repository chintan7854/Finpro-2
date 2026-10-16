# FinAdvisor Pro — Multi-Profile Management, Image Cropping & Free AI Background Removal

Upgrade the existing Advisor Master Profile into a multi-profile management system with independent branding, canvas image cropping, permanently free client-side background removal, and app-wide active profile integration.

### User Review & Critical Decisions

> [!IMPORTANT]
> - **Zero-Cost Background Removal**: Uses client-side `@imgly/background-removal` (ONNX Web / WebAssembly) running directly in the browser with an intelligent fallback canvas edge-segmentation engine. This requires **zero external API keys, zero paid credits, and runs permanently free**.
> - **Non-Destructive Asset Pipeline**: Each profile maintains three distinct image states for user flexibility: Original Photo, Cropped Photo, and Background-Removed Photo (transparent PNG). Users can switch between "With Background" and "Without Background" at any time across all marketing and content generators.
> - **App-Wide Backward Compatibility**: The existing `useAdvisor()` hook will continue to export `profile` representing the currently selected **active profile**, guaranteeing 100% backward compatibility with all existing marketing studios, flyer generators, business card creators, and finance news article builders.

---

### 1. Overview & Core Concept

- **What It Does**: Enables financial advisors to maintain and switch between multiple distinct professional profiles (e.g., "Wealth Management & Mutual Funds", "Term & Health Insurance", "Corporate Advisory", "NRI Portfolio Planning") under a single account. Each profile possesses its own contact details, regulatory credentials (AMFI/ARN/RIA/NISM), brand color schemes, disclaimer texts, call-to-action buttons, high-resolution logos, and photos.
- **Photo Studio**: Features an interactive visual crop editor with zoom, pan, rotate, and aspect ratio locks (1:1, 4:5, 3:4, Freeform) combined with an on-device, permanently free AI background remover yielding crisp transparent PNG portraits.
- **Target Audience**: Financial advisors, wealth managers, AMFI mutual fund distributors, insurance advisors, and RIA consultants who operate under multiple business verticals or partner entities.
- **Key Value**: Eliminates the tedious friction of continually re-typing details or swapping logos when generating mutual fund market insights versus insurance advisory collateral.

---

### 2. User Experience & Visual Design

#### Key User Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Advisor Master Profile Screen                         │
│                                                                             │
│  ┌─ Active Profile Selector ──────────────────────────────────────────────┐  │
│  │ 👤 Chintan Raval — Mutual Funds (Default)  [ Switch ▼ ]  [ + New ]     │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ Profile Tabs / Management ────────────────────────────────────────────┐  │
│  │ [ Overview ]  [ Identity & Contact ]  [ Visuals ]  [ Branding & Regs ] │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ Photo Studio ─────────────────────────────────────────────────────────┐  │
│  │  ┌───────────────┐  [ ✂️ Crop & Reposition ]   ○ With Background        │  │
│  │  │  Photo Card   │  [ ✨ Remove Background ]  ● Transparent BG (Active)│  │
│  │  │  (Preview)    │  [ 🔄 Restore Original ]   [ 🗑️ Remove Photo ]       │  │
│  │  └───────────────┘                                                     │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─ Profile Actions ──────────────────────────────────────────────────────┐  │
│  │ [ 💾 Save Profile ]   [ 📋 Duplicate ]   [ 👁️ Full Preview ]  [ 🗑️ Delete ] │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Active Profile Selector**: Positioned prominently at the top of the profile screen and accessible via a compact switcher in the top navigation header. Shows the current profile with quick actions to switch, duplicate, or create a new profile.
2. **Interactive Photo & Logo Studio**:
   - **Upload & Crop Modal**: Touch-friendly canvas editor supporting smooth pinch/drag panning, slider zoom (100% to 300%), 90-degree rotations, aspect ratio presets (1:1 Square, 4:5 Portrait, 3:4, Free), rule-of-thirds grid overlay, and real-time circular/square mask preview.
   - **AI Background Remover**: One-click client-side background removal with progress indicator, before/after toggle comparison, and transparent alpha checkerboard preview.
   - **Background Mode Preference**: Allows setting profile-level default for generators ("With Background" vs "Without Background").
3. **Multi-Profile Management Modal**:
   - Card/list view of all profiles with active badge, default badge, creation date, and completion score.
   - One-click actions: Make Default, Duplicate, Rename, Reset to Template, Delete (with safety confirmation modal and fallback protection).
4. **App-Wide Dynamic Integration**:
   - Flyer Studio, Story Generator, News Article Generator, and Business Card Studio automatically read the active profile's colors, logo, and transparent headshot.
   - A quiet profile switcher pill in generator headers allows previewing the same graphic across different advisor identities instantly.

#### Visual Styling & Layout
- **Design System**: Strict Tailwind typography and subtle neutral borders (`border-slate-200 dark:border-slate-800`), avoiding AI slop cliches, unboxed metadata typography, and 60-30-10 color harmony.
- **Touch Targets**: All mobile buttons $\ge 44\text{px}$, responsive modal drawers with safe-area padding for mobile viewports.

---

### 3. Key Product Decisions & Trade-Offs

- **Client-Side AI Background Removal vs. Cloud APIs**:
  - *Chosen Approach*: On-device processing using `@imgly/background-removal` (ONNX / WebAssembly) with canvas color-thresholding fallback.
  - *Why*: Provides **100% permanently free, unlimited background removal** with zero recurring API costs, no quota exhaustion, no external network dependencies, and complete data privacy (advisor photos never leave their device).
- **Relational Multi-Profile Storage Architecture**:
  - *Chosen Approach*: Maintain an array of `AdvisorProfile` objects (`profiles: AdvisorProfile[]`) coupled with `activeProfileId: string` and `defaultProfileId: string` stored in `localStorage` with cloud-sync readiness in `AdvisorContext`.
  - *Why*: Provides atomic profile switching, lightning-fast rendering without remote latency, offline capability, and instant compatibility with existing profile consumption across the application.
- **Canvas-Based Non-Destructive Image Processing**:
  - *Chosen Approach*: Keep the base64 / blob URLs for `originalPhotoUrl`, `croppedPhotoUrl`, and `bgRemovedPhotoUrl` in the profile state.
  - *Why*: Allows advisors to freely revert crops or toggle background transparency without having to re-upload their original high-resolution photo.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AdvisorContext                                   │
│  - profiles: AdvisorProfile[]                                               │
│  - activeProfileId: string                                                  │
│  - defaultProfileId: string                                                 │
│  - activeProfile: AdvisorProfile (derived/getter)                           │
│  - Actions: createProfile(), switchProfile(), updateProfile(),              │
│             duplicateProfile(), deleteProfile(), setDefaultProfile()        │
└──────────────────────┬──────────────────────────────────────────────────────┘
                       │
       ┌───────────────┼──────────────────────────────┐
       ▼               ▼                              ▼
┌──────────────┐┌──────────────┐               ┌──────────────┐
│ ProfileView  ││ ImageCropper │               │ BgRemoval    │
│ & Switcher   ││ Modal (Canvas│               │ Engine       │
│ UI           ││ & Transforms)│               │ (@imgly + FB)│
└──────────────┘└──────────────┘               └──────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Consuming Modules (Unchanged API)                     │
│  - MarketUpdatesView / FlyerStudio / StoryGenerator / BusinessCardView      │
│  - News Article Generator (`/api/generate-news-article`)                    │
│  - Business Card & Social Share Graphics                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Extended `AdvisorProfile` Data Model
```typescript
export interface AdvisorProfile {
  id: string; // unique UUID
  profileName: string; // e.g. "Main Profile", "Mutual Funds", "Insurance"
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;

  // Identity
  fullName: string;
  designation: string;
  qualifications: string;
  achievements: string;

  // Visual Assets
  originalPhotoUrl?: string;
  croppedPhotoUrl?: string;
  bgRemovedPhotoUrl?: string;
  activePhotoVariant: 'original' | 'cropped' | 'bgRemoved';
  useBackgroundRemoved: boolean; // toggle for graphics
  
  originalLogoUrl?: string;
  croppedLogoUrl?: string;
  activeLogoVariant: 'original' | 'cropped';

  // Contact Details
  countryCode: string;
  mobile: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  officeAddress: string;
  website: string;

  // Professional & Regulatory
  amfiArn: string;
  euin: string;
  riaNumber: string;
  irdaNumber: string;
  nismCertifications: string;

  // Branding & Preferences
  primaryColor: string;
  secondaryColor: string;
  ctaText: string;
  disclaimer: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}
```

#### Testing & Verification Plan
1. **Multi-Profile Operations**: Create 3 profiles, switch between them, duplicate one, verify state isolation, test deletion protection for default profile.
2. **Crop & Transform Tool**: Test upload, zoom, pan, rotate, aspect ratio toggling, canvas render quality, and cancel/save behavior.
3. **Background Removal**: Test client-side `@imgly/background-removal` execution, progress indicator, transparent PNG generation, and instant switching between With Background and Without Background.
4. **App-Wide Consistency**: Verify that updating branding or switching profiles instantly reflects across Flyer Studio, Finance News Article Generator, Business Card Preview, and Social Post generators without page reloads.
5. **Compilation & Build**: Run `lint_applet` and `compile_applet` to confirm zero TypeScript and bundling errors.
