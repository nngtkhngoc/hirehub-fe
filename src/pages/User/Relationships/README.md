# Relationships Page - Quản lý Kết nối

## 📋 Tổng quan

Trang **Relationships** cho phép người dùng quản lý tất cả các mối quan hệ/kết nối của mình trong hệ thống HireHub, bao gồm:
- Danh sách bạn bè (kết nối đã được chấp nhận)
- Lời mời kết nối đã gửi (đang chờ phản hồi)
- Lời mời kết nối nhận được (cần xét duyệt)

## 🌐 Route

**URL**: `/relationships`

**Layout**: UserLayout

**Authentication**: Required (người dùng phải đăng nhập)

## ✨ Tính năng

### 1. **Tab Bạn bè** 👥
- Hiển thị danh sách tất cả người dùng đã kết nối (status: connected)
- Cho phép hủy kết nối với bạn bè
- Hiển thị thông tin: Avatar, Tên, Email
- Click vào tên để xem profile

### 2. **Tab Đã gửi** 📤
- Hiển thị lời mời kết nối đã gửi (status: pending)
- Cho phép hủy lời mời đã gửi
- Hiển thị thời gian gửi lời mời
- Chỉ hiển thị lời mời mà user là người gửi

### 3. **Tab Nhận được** 📥
- Hiển thị lời mời kết nối nhận được (status: pending)
- Cho phép chấp nhận hoặc từ chối lời mời
- Hiển thị thời gian nhận lời mời
- Chỉ hiển thị lời mời mà user là người nhận

### 4. **Tìm kiếm** 🔍
- Tìm kiếm theo tên hoặc email
- Áp dụng cho tất cả các tab
- Real-time filtering

## 🎨 Design System

Page này áp dụng design system thống nhất:

### Layout
- Container: `max-w-6xl mx-auto px-4 py-6`
- Spacing: `space-y-6`
- Cards: `bg-white rounded-xl shadow-sm border border-gray-100`

### Typography
- Page title: `text-3xl font-bold font-title text-gray-900`
- Description: `text-gray-500 mt-1`
- User name: `font-semibold text-gray-900`
- Email: `text-sm text-gray-500`

### Colors
- Primary: `text-primary` / `bg-primary`
- Success: `text-green-600` / `bg-green-50`
- Error: `text-red-600` / `bg-red-50`
- Gray: `text-gray-600` / `bg-gray-50`

### Components
- Buttons: shadcn Button với variants (outline, default)
- Tabs: shadcn Tabs component
- Dialog: AlertDialog cho confirmations
- Empty States: Custom Empty component
- Icons: lucide-react (Users, UserPlus, UserCheck, etc.)

## 🔌 API Integration

### Endpoints sử dụng:

1. **GET** `/api/relationships/friends?userId={userId}`
   - Lấy danh sách bạn bè
   - Returns: `Friend[]`

2. **GET** `/api/relationships/user/{userId}`
   - Lấy tất cả relationships của user
   - Returns: `Relationship[]`

3. **PUT** `/api/relationships/{senderId}/{receiverId}`
   - Cập nhật status (chấp nhận/từ chối)
   - Body: `{ status: "connected" | "rejected" }`

4. **DELETE** `/api/relationships/{senderId}/{receiverId}`
   - Xóa relationship (hủy kết nối/hủy lời mời)

### Hooks sử dụng:

```tsx
import { 
  useFriends, 
  useRelationship, 
  useUpdateRelationshipStatus, 
  useDisconnect 
} from "@/hooks/useRelationship";
```

## 📊 Data Models

### Friend
```typescript
interface Friend {
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}
```

### Relationship
```typescript
interface Relationship {
  sender: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  receiver: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string; // "pending" | "connected" | "rejected"
  createdAt: string;
}
```

## 🎯 User Stories

### As a User:
1. ✅ Tôi có thể xem tất cả bạn bè của mình
2. ✅ Tôi có thể hủy kết nối với bạn bè
3. ✅ Tôi có thể xem lời mời đã gửi và hủy chúng
4. ✅ Tôi có thể chấp nhận/từ chối lời mời nhận được
5. ✅ Tôi có thể tìm kiếm trong danh sách
6. ✅ Tôi có thể click để xem profile của người khác

## 🔔 Notifications

Khi actions được thực hiện, toast notifications sẽ hiển thị:
- ✅ "Đã hủy kết nối"
- ✅ "Đã hủy lời mời"
- ✅ "Đã chấp nhận lời mời"
- ✅ "Đã từ chối lời mời"
- ❌ "Không thể [action]" (khi có lỗi)

## 🔐 Security

- Chỉ user đã đăng nhập mới truy cập được
- User chỉ có thể xem/quản lý relationships của chính mình
- Confirmation dialog cho các actions quan trọng (hủy kết nối, chấp nhận, từ chối)

## 📱 Responsive Design

- **Desktop**: Full layout với 3 columns tabs
- **Tablet**: Responsive grid layout
- **Mobile**: Single column, tabs full width

## 🧪 Testing Checklist

- [ ] Hiển thị đúng danh sách bạn bè
- [ ] Hiển thị đúng lời mời đã gửi
- [ ] Hiển thị đúng lời mời nhận được
- [ ] Tìm kiếm hoạt động đúng
- [ ] Buttons hoạt động (hủy kết nối, chấp nhận, từ chối)
- [ ] Confirmation dialogs hiển thị đúng
- [ ] Toast notifications hiển thị
- [ ] Links to profiles hoạt động
- [ ] Empty states hiển thị khi không có data
- [ ] Loading states hiển thị

## 🚀 Future Enhancements

Có thể thêm:
- [ ] Pagination cho danh sách dài
- [ ] Filter theo thời gian
- [ ] Bulk actions (chấp nhận/từ chối nhiều cùng lúc)
- [ ] Suggestions (người dùng có thể biết)
- [ ] Activity timeline
- [ ] Export danh sách bạn bè

## 📞 Related Components

- `ConnectionButton` - Button để gửi lời mời kết nối
- `RecommendedUsers` - Hiển thị gợi ý người dùng
- `UserCard` - Card component cho user profiles

## 📝 Notes

- Backend relationship có 3 status: "pending", "connected", "rejected"
- Khi reject một lời mời, relationship vẫn tồn tại với status "rejected" (không xóa)
- Khi hủy kết nối hoặc hủy lời mời, relationship sẽ bị xóa hoàn toàn
- RelationshipKey trong backend là composite key (userId1, userId2)

---

**Created**: December 31, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready

