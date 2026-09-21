# GlobalPedia Project Working Rules

This repository is a production project, not a demo. Preserve working behavior before redesigning it. Inspect the existing architecture first, make focused changes, avoid destructive rewrites, keep secrets/config out of source, and verify changes before claiming completion.

## Frontend standard
- Premium, custom, restrained dark editorial design. Avoid generic SaaS/template styling.
- Use near-black/charcoal surfaces with the brand accent as a selective highlight, not a blanket color.
- Prioritize hierarchy, spacing, typography, responsive composition, accessibility, and purposeful motion.
- Keep animations subtle, usually 160-320ms for interaction, and respect `prefers-reduced-motion`.
- Never ship fake controls: search, navigation, CTAs, cards, forms, and settings must perform their stated action.
- Every meaningful page needs useful loading, empty, error, and not-found behavior where applicable.
- Check desktop and mobile behavior, overflow, keyboard access, metadata, links, and runtime errors.

## Engineering standard
- Prefer existing components, utilities, routes, data models, and design patterns over needless rewrites.
- Avoid unnecessary dependencies and fragile hacks.
- Keep async/network work bounded and failures graceful.
- Preserve databases, credentials, environment variables, authentication, integrations, and user data.
- Never hardcode secrets.

## Delivery standard
Distinguish source review, local verification, and live deployment verification. A successful compile alone is not proof that the deployed product is correct.
