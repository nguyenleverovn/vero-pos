# VERO POS V1

Repository này là scaffold Next.js + TypeScript + Tailwind cho **VERO POS V1** theo guideline đã chốt, ưu tiên bám thiết kế Figma, không backend/login/cloud.

## Cấu trúc project

- `src/app` – Next.js App Router + entry pages
- `src/components/layout` – khung layout, header, navigation
- `src/components/product` – product card, product grid, product interactions
- `src/components/cart` – cart item, quantity control, summary
- `src/components/ui` – primitives: button
- `src/data` – dữ liệu mẫu
- `src/design-system` – tài liệu vận hành thiết kế (nền cho Figma handoff)

## Chạy project

```bash
npm install
npm run dev
```

## Notes
- Chưa bật backend
- Chưa có login/register
- Chưa có cloud sync
- Chỉ là khung giao diện để bám Figma nhanh
