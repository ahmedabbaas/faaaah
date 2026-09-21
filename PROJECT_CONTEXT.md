# GlobalPedia Persistent Working Context

GlobalPedia is a real production project. Treat the existing source as authoritative and preserve working features before making changes.

## Execution
Inspect first. Prefer focused modifications over rewrites. Preserve credentials, environment variables, data, authentication, integrations, APIs, and existing backend behavior. Make backups before risky changes. Test changed behavior and clearly distinguish source review, local verification, and live deployment verification.

## Product/design
Premium, custom, modern editorial interface. Dark near-black surfaces, restrained accent usage, strong typography, purposeful spacing, responsive composition, accessibility, and subtle motion. Avoid generic templates, excessive gradients/glows, clutter, fake controls, filler sections, and oversized empty marketing blocks.

## Interaction quality
Search, navigation, cards, CTAs, forms, settings and other visible controls must actually work. Support mobile behavior, keyboard access, useful empty/error/not-found states, reduced-motion preferences, and metadata/SEO basics.

## Engineering
Reuse the current architecture and components. Avoid unnecessary dependencies, duplicated logic, blocking network/database work, uncontrolled polling, hardcoded secrets, destructive migrations, and fragile hacks. Keep failures graceful and configuration predictable.

## Current GlobalPedia source
Next.js 16 + React 19 + TypeScript. Main experience lives in `app/components/GlobalPediaHome.tsx`; editorial content is in `app/data/entries.ts`; article routes live under `app/articles/[slug]/`. The UI uses plain CSS in `app/globals.css`, not Tailwind.
