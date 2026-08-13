# VERO POS - GitHub Merge Review Process

## Mục tiêu
Mọi thay đổi vào `main` phải được kiểm tra trước khi merge.

## Branch Rule

### main
- Chỉ chứa code ổn định.
- Không commit trực tiếp.

### Development branches
- `feature/*`
- `fix/*`
- `refactor/*`

Ví dụ: `feature/pos-screen`, `feature/cart`, `feature/indexed-db`

## Pull Request Process

Mỗi thay đổi bắt buộc tạo PR.

### PR Title
- Ngắn gọn, rõ mục đích.
- Ví dụ: `feat: create POS sales screen`

### PR Description template
- `What changed`
- `Why`
- `Testing`

## Review Checklist

### Product
- Có đúng phạm vi VERO POS V1?
- Có thêm tính năng ngoài kế hoạch không?
- UX có bám Figma?

### Code Quality
- Component có tái sử dụng được không?
- Có trùng code không?
- Tên file / biến rõ ràng?
- Có code quá phức tạp không?

### Function
- Chức năng chạy đúng?
- Không phá hỏng chức năng cũ?
- Không có lỗi console?

### Responsive
- Mobile OK
- Tablet OK
- Desktop OK

### Performance
- Không load dư thừa
- Không có package không cần thiết

## Test Before Merge (bắt buộc)
- `npm run lint`
- `npm run build`

Nếu lỗi: không merge.

## Merge Rule
- PR phải `approved`
- Build passed
- Test passed
- Không conflict
- Merge method: **Squash merge**
- Lý do: giữ lịch sử main sạch

## After Merge
- Pull latest main
- Xóa branch cũ
- Update changelog

## Final Rule
`main` luôn ở trạng thái có thể deploy bất kỳ lúc nào.
