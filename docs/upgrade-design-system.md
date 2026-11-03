# Beyond Beauty Saloon — Upgrade Design System Specification

**Document Version:** 1.0  
**Status:** Approved & Implemented  
**Date:** 28 October 2026  

---

## 1. Overview & Aesthetic Vision

The Beyond Beauty Saloon design system is crafted for high-end beauty, hair, skin, and bridal grooming. It conveys poise, craftsmanship, and modern warmth. The system blends editorial serif headings with clean sans-serif typography, rounded organic geometry, and subtle micro-interactions.

---

## 2. Color Palette & Switchable Theme Presets

The application features 6 switchable color themes plus a real-time custom accent color picker. All tokens are applied via CSS variables rooted in `globals.css` and managed reactively through `ThemeContext.tsx`.

### 2.1 The 6 Theme Presets

| Theme ID | Preset Name | Mood / Tagline | Background (`--theme-bg`) | Card (`--theme-card`) | Primary Accent (`--theme-primary`) | Dark Accent (`--theme-primary-dark`) | Text Main (`--theme-text-main`) | Text Muted (`--theme-text-muted`) |
|---|---|---|---|---|---|---|---|---|
| `rose` | **Rose Atelier** (Default) | Signature Luxury & French Romance | `#FFF9F8` | `#FFFFFF` | `#B65B78` | `#8F3E58` | `#25212A` | `#6F6775` |
| `sage` | **Sage Serenity** | Calming Botanical & Ayurvedic Spa | `#F6FAF5` | `#FFFFFF` | `#477F69` | `#2E5848` | `#1E3029` | `#5D7267` |
| `lavender` | **Lavender Glow** | Ethereal Glamour & Haute Couture | `#F9F7FF` | `#FFFFFF` | `#7856A8` | `#54397B` | `#29223A` | `#6B627F` |
| `peach` | **Peach Bloom** | Warm Radiance & Summer Glow | `#FFF9F3` | `#FFFFFF` | `#A65C43` | `#7E3E28` | `#33251E` | `#756259` |
| `ocean` | **Ocean Mist** | Fresh Coastal Clarity & Vitality | `#F5FAFC` | `#FFFFFF` | `#287A91` | `#195262` | `#18313B` | `#536C77` |
| `midnight` | **Midnight Luxe** (Dark) | Nocturne Slate & Dramatic Gold | `#14141B` | `#21212B` | `#D99AAB` | `#F3C5D1` | `#F8F5F8` | `#A79FA9` |

### 2.2 Custom Accent Picker & WCAG AA Contrast Calculation

Users can customize the primary accent color using the native `<input type="color">` or hex code input. The system automatically computes accessible text contrast using the standard WCAG 2.1 relative luminance formula:

$$\text{Luminance} = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$$

- When $\text{Luminance} > 0.45$, the foreground contrast color is set to dark (`#14141B`).
- When $\text{Luminance} \le 0.45$, the foreground contrast color is set to white (`#FFFFFF`).
- The choice is dynamically saved in `localStorage.beyond_custom_accent`. A "Reset to Preset" button restores the default theme preset colors.

---

## 3. Typography Hierarchy

| Role | Font Family | Fallback | Typical Weights | Usage |
|---|---|---|---|---|
| **Display & Headings** | *Playfair Display* | Georgia, serif | 600 (SemiBold), 700 (Bold) | Hero headlines, section titles, receipt invoice banners |
| **Interface & Body** | *Plus Jakarta Sans* | -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) | Body prose, navigation links, form labels, buttons, tables |
| **Identifiers & Time** | *Monospace / JetBrains Mono* | Menlo, Consolas, monospace | 600, 700 | Staff Codes (`BBS-0001`), reference codes, timestamps |

---

## 4. Component Design Patterns

### 4.1 Buttons
- **Primary CTA:** Rounded-full pill (`rounded-full`), uppercase letter-spacing (`tracking-wider text-xs font-semibold`), background `var(--theme-primary)` with subtle shadow.
- **Secondary / Ghost:** Rounded-full pill, border `border-salon-gray`, hover background `bg-salon-ivory`, text `text-salon-black`.
- **Destructive / Caution:** Rounded-lg, soft rose background (`bg-rose-50 text-rose-700 border border-rose-200`).

### 4.2 Cards & Surfaces
- **Radius:** `rounded-3xl` for high-level module containers and modals; `rounded-2xl` for child cards and queue items.
- **Borders:** Thin, crisp borders (`border border-salon-gray`) ensuring contrast in both light and dark themes.
- **Shadows:** Soft luxury drop shadows (`shadow-luxury`, `0 20px 40px -15px rgba(0, 0, 0, 0.05)`).

### 4.3 Badges & Chips
- Status indicators feature dual-tone badge styling:
  - **Active / Confirmed:** Emerald background + emerald text (`bg-emerald-50 text-emerald-700 border-emerald-200`).
  - **In Service:** Gold pulse indicator (`bg-salon-gold text-salon-black`).
  - **Deactivated / Suspended:** Muted slate/rose (`bg-rose-50 text-rose-700 border-rose-200`).

---

## 5. Accessibility & Motion Preferences

1. **Reduced Motion:**
   Configured in `globals.css`:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
2. **Keyboard Navigation & Focus Outlines:**
   All interactive buttons, selects, and inputs provide explicit `focus:outline-none focus:border-salon-rose` visual focus states.
3. **Contrast Compliance:**
   All body text maintains minimum 4.5:1 contrast ratio against card backgrounds. Primary buttons dynamically evaluate contrast against accent colors.

