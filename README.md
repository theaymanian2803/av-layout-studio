# Gear Canvas

Build a full-stack e-commerce web application specifically for professional Camera, Audio, and Visual equipment. The defining feature of this app is a "Customizable Storefront Layout" where authenticated users can drag, drop, and rearrange the layout of the website to suit their browsing preferences.

Tech Stack:

Frontend: React, Tailwind CSS, Shadcn UI, Framer Motion (for smooth drag-and-drop animations), and React Beautiful DnD (or similar drag-and-drop library).

Backend/Database: Supabase (for Authentication, PostgreSQL database, and Storage).

Core Features & Pages:

Dynamic Homepage (The Layout Engine): * Implement a widget-based grid system.

Provide an "Edit Layout" toggle switch. When active, users can drag and drop different UI blocks (e.g., "Featured Cameras," "New Audio Gear," "Current Deals Slider," "Top Brands Grid").

Save the user's layout preferences to their profile in the database so it persists across sessions.

Product Catalog & Filtering: * Categories for: Cameras (DSLR, Mirrorless, Cinema), Lenses, Audio (Microphones, Mixers), Lighting, and Accessories.

Advanced filtering: Filter by brand (Sony, Canon, Rode, Shure), price range, sensor size, and mount type.

Toggleable views: Allow users to switch between a dense grid view and a detailed list view.

Product Detail Page (PDP): * High-quality image gallery, technical specifications table, price, stock status, and an "Add to Cart" button.

Include a section for "Compatible Accessories" (e.g., suggesting a specific lens for a camera body).

Shopping Cart & Checkout: * A slide-out cart sidebar.

Order summary, quantity adjustments, and a mock checkout flow.

User Authentication & Dashboard: * Sign up/Login via Supabase.

User dashboard to view order history, manage shipping addresses, and a dedicated tab to reset or tweak their custom homepage layout settings.

Design System & UI/UX:

Theme: Modern, sleek, and "tech-focused." Use a dark mode by default with deep blacks, dark grays, and a vivid accent color (like neon blue or vibrant orange) to highlight buttons and prices.

Typography: Clean, sans-serif fonts (like Inter or Roboto) for high legibility on technical specs.

Interactions: Use Shadcn UI for clean, accessible components. Add smooth hover states on product cards and satisfying snap-to-grid animations when users are customizing their layout.

Initial Setup Instructions for the AI:

Scaffold the React application and set up the routing for Home, Catalog, Product Details, Cart, and Profile.

Create dummy JSON data for at least 15 A/V and camera products to populate the store immediately.

Build the draggable layout grid component first, as it is the core feature of the app. Ensure it has a fallback default layout for non-logged-in users.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/42ab062e-aeee-45e2-ba7c-5fa701568e4f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
