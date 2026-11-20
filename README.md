# Ultra-Luxury Pakistani Wedding Invitation Platform
### 3D Kinematics, GSAP Choreography, Next.js App Router & Supabase

A bespoke, production-ready digital wedding invitation experience crafted specifically for Pakistani weddings (Mehndi, Barat, Walima). It seamlessly combines Mughal-inspired aesthetics, real 3D envelope kinematics with an articulated flap and wax seal, personalized guest gold-calligraphy cards, a cryptographic bearer token architecture, dynamic server-side WhatsApp Open Graph preview generation, and a comprehensive administration dashboard.

---

## 💎 Key Features

### 1. Cinematic 3D Invitation Experience (Three.js & React Three Fiber)
- **Authentic 3D GLB Model**: Located at [luxury_envelope.glb](file:///E:/wedding_invitiation/public/models/luxury_envelope.glb) with named nodes:
  - `Envelope_Body`: Deep burgundy paper texture with beveled pockets and gold trim
  - `Envelope_Flap_Pivot`: Articulated flap with a mathematically precise hinge pivot at `y = 1.2`
  - `Wax_Seal`: 3D embossed medallion with scalloped wax perimeter and engraved royal monogram
  - `Invitation_Card`: Ivory textured card with gold foil arabesque borders and dynamic canvas text plate
  - `Gold_Ornament`: Metallic filigree trims
  - `Rose_Petal`: 3D curved organic petal geometry
- **Kinematic Flap Opening & Unsealing**: Tapping the royal wax seal triggers a choreographed GSAP sequence where the seal pops, the flap hinges open backward, and the personalized invitation card smoothly slides up and tilts forward.
- **Instanced Petal Flutter**: 42+ organic rose, maroon, and marigold petals drifting with physics-like aerodynamic rotation.
- **Ambient Gold Shimmer**: Upward twinkling gold glitter particles.
- **Interactive Parallax**: Pointer and touch-responsive gyroscope tilt highlights specular metallic reflections.
- **Graceful WebGL Fallback**: If WebGL is unavailable or hardware acceleration is disabled, an ultra-luxury 3D CSS folded origami envelope ensures 100% of the invitation and RSVP functionality remains interactive.

---

### 2. Multi-Event Guest Permissions & Personalization
- **Cryptographic Bearer URLs**: Guests receive unique URLs such as `/invite/[token]` with 192 bits of entropy.
- **SHA-256 Hash Matching**: Raw bearer tokens are never stored in plaintext in the database; they are hashed with SHA-256 for secure constant-time server lookup.
- **Function-Level Permission Isolation**:
  - **Guest 1 ("Bilal Ahmed & Family")**: Invited to **Mehndi & Barat** (Walima is strictly hidden and inaccessible).
  - **Guest 2 ("Mr. Muhammad Ali")**: Invited to **Barat only** (Mehndi and Walima are restricted).
  - **Guest 3 ("Usman Khan & Family")**: Invited to **all 3 functions** (Mehndi, Barat, Walima).
  - **Guest 4 ("Sarah Jenkins & Guest")**: Invited to **Walima only**.
- **Server-Side Enforcement**: Even if an unauthorized event ID is submitted to `/api/rsvp`, the server checks `guest_event_access` and rejects the request with HTTP 403.
- **Headcount Limit Boundary**: Headcount cannot exceed the guest's assigned `max_attendees` limit for each specific event.

---

### 3. Pakistani Wedding Visual Identity & Design System
- **Color Palette**:
  - Deep Burgundy: `#3A0715`
  - Royal Maroon: `#580F25`
  - Antique Gold: `#C5A15A`
  - Champagne Gold: `#E6D2A0`
  - Warm Ivory: `#F8F1E5`
  - Soft Cream: `#EFE4D2`
  - Dark Charcoal: `#191516`
  - Marigold Amber (Mehndi): `#D97706`
- **Function Themes**:
  - **Mehndi**: Festive dholki rhythms, warm marigold yellow/amber canopy, floral patterns.
  - **Barat**: Regal deep burgundy, imperial maroon, antique gold foil, ceremonial Nikah & banquet.
  - **Walima**: Champagne gold, soft warm ivory, white jasmine blossoms, minimalist luxury reception.
- **Typography**: Cormorant Garamond, Cinzel, Montserrat, and Alex Brush script.

---

### 4. Dynamic WhatsApp Open Graph Previews
- Server-side generated 1200 × 630 dynamic image ([opengraph-image.tsx](file:///E:/wedding_invitiation/src/app/invite/[token]/opengraph-image.tsx)).
- Customizes the social share card with the couple's names, royal gold borders, and the guest's exact personalized display name:
  - *"Bilal Ahmed & Family — You are cordially invited to celebrate with us."*
- Robots metadata set to `noindex, nofollow` to protect guest privacy.

---

### 5. Administration Dashboard
Accessible at [`/admin`](file:///E:/wedding_invitiation/src/app/admin):
1. **Overview Dashboard**:
   - Total guests, invitations dispatched, invitations opened, total RSVPs, confirmed headcounts, declined count.
   - Function-wise progress bars showing capacity utilization (Mehndi, Barat, Walima).
2. **Guest Registry** (`/admin/guests`):
   - Search by guest name or phone.
   - Filter by function permissions or invitation status (created, sent, opened, responded, revoked).
   - Add new guest with custom function access.
   - One-click copy invite link, test live 3D view, regenerate token, or revoke access.
3. **Bulk CSV Importer** (`/admin/import`):
   - Upload `.csv` file or paste raw rows.
   - Automatic Pakistani phone number normalization (`03001234567`, `+92 300 1234567`, `0300-1234567` -> `923001234567`).
   - Row-level validation, duplicate detection, and event mapping.
   - Bulk token generation and instant CSV export of generated invitation URLs.
4. **WhatsApp Invitation Hub** (`/admin/whatsapp`):
   - Pre-formatted messages in Royal Formal English, Traditional Roman Urdu, or Warm Family styles.
   - Live WhatsApp chat bubble preview with double ticks.
   - Direct `wa.me/923001234567?text=...` dispatch buttons.
   - One-click copy message, copy link, and mark as sent.
   - Export WhatsApp blast CSV.
5. **RSVP & Catering Reports** (`/admin/rsvps`):
   - Table of all submitted RSVPs, attendee headcounts, dietary requirements (vegetarian, allergies), and heartfelt wishes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Custom Mughal Gold Shimmers & Foil Gradients |
| **3D Engine** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Animation** | GSAP, ScrollTrigger, `@gsap/react`, Lenis Smooth Scroll |
| **Database & Auth** | Supabase, PostgreSQL, Row Level Security (RLS) |
| **Validation** | Zod, PapaParse, Crypto SHA-256 |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install --legacy-peer-deps
```

### 2. Generate 3D Assets (Already Generated)
The 3D envelope model can be rebuilt at any time via:
```bash
node scripts/generate-envelope-glb.mjs
```
This outputs `public/models/luxury_envelope.glb` with the exact named nodes and pivot hierarchies.

### 3. Run Automated Test Suite
Run the 13 automated tests verifying token generation, SHA-256 hashing, phone normalizers, event permission filters, and RSVP boundary limits:
```bash
npx tsx scripts/test-suite.mjs
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Homepage Gateway**: [http://localhost:3000/](http://localhost:3000/)
- **Demo Guest 1 (Mehndi & Barat)**: [http://localhost:3000/invite/vip-bilal-ahmed-family](http://localhost:3000/invite/vip-bilal-ahmed-family)
- **Demo Guest 2 (Barat Only)**: [http://localhost:3000/invite/guest-muhammad-ali](http://localhost:3000/invite/guest-muhammad-ali)
- **Demo Guest 3 (All 3 Events)**: [http://localhost:3000/invite/guest-chaudhry-usman](http://localhost:3000/invite/guest-chaudhry-usman)
- **Demo Guest 4 (Walima Only)**: [http://localhost:3000/invite/guest-sarah-jenkins](http://localhost:3000/invite/guest-sarah-jenkins)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **WhatsApp Hub**: [http://localhost:3000/admin/whatsapp](http://localhost:3000/admin/whatsapp)
- **CSV Importer**: [http://localhost:3000/admin/import](http://localhost:3000/admin/import)

### 5. Production Build
Verify the production build:
```bash
npm run build
```

---

## 🗄️ Supabase Database Setup

When deploying to Supabase Cloud:
1. Create a new Supabase project at [database.new](https://database.new).
2. Go to the SQL Editor and execute the migration file:
   - [20261120000000_init_schema.sql](file:///E:/wedding_invitiation/supabase/migrations/20261120000000_init_schema.sql)
3. Execute the seed data file:
   - [seed.sql](file:///E:/wedding_invitiation/supabase/seed.sql)
4. Add your Supabase project keys to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
*Note: The platform is built with an automatic fallback data layer so it functions completely and persistently out-of-the-box even prior to plugging in remote credentials.*

---

## 🔒 Security Architecture
- **Token Security**: Raw tokens are base64url encoded with 192 bits of entropy (`crypto.randomBytes(24)`).
- **Hashed Storage**: Only the SHA-256 hash is stored in the database.
- **Timing Attack Defense**: Employs `crypto.timingSafeEqual`.
- **Zero Table Dumping**: The `guests` table is protected by Row Level Security (RLS) so anonymous clients cannot dump or harvest guest contact records.
- **Input Validation**: All endpoints enforce strict Zod schemas and server-side headcount boundary limits.
