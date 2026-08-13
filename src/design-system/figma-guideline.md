# VERO POS V1 Blueprint Compliance

## Scope
- UI-only MVP shell
- No backend, login, auth, cloud sync
- Flow: Select Product → Add → Cart → Checkout

## Layout
- Mobile: 390px
- Tablet: 768px-1024px
- Desktop: 1280px+

## Component-first standards
- All visual pieces in `src/components/*`
- Reusable primitives in `src/components/ui/*`
- Product/cart sections in dedicated namespaces

## Tokens
- Colors, radius, shadow, spacing are centralized in Tailwind config and global CSS variables.

## Next steps (after this scaffold)
1) Connect real POS data layer
2) Add IndexedDB + persistence
3) Add keyboard/touch interactions for table service speed
