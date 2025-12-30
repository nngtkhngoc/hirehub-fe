# Management Pages Style Guide

Tài liệu này mô tả các tiêu chuẩn thiết kế cho tất cả các trang quản lý (Management Pages) trong hệ thống HireHub, áp dụng cho cả Admin và Recruiter.

## 📋 Mục lục

- [Colors & Themes](#colors--themes)
- [Typography](#typography)
- [Buttons](#buttons)
- [Inputs & Forms](#inputs--forms)
- [Tables](#tables)
- [Dialogs & Modals](#dialogs--modals)
- [Empty States](#empty-states)
- [Icons](#icons)
- [Spacing](#spacing)

---

## 🎨 Colors & Themes

### Background Colors
- **Primary Background**: `bg-white`
- **Secondary Background**: `bg-gray-50`
- **Hover States**: `hover:bg-gray-50/50`
- **Border Color**: `border-gray-100`

### Status Colors
- **Success**: `bg-green-100 text-green-700`
- **Warning**: `bg-yellow-100 text-yellow-700`
- **Error**: `bg-red-100 text-red-700`
- **Info**: `bg-blue-100 text-blue-700`
- **Neutral**: `bg-gray-100 text-gray-700`

---

## 📝 Typography

### Page Headers
```tsx
<h1 className="text-3xl font-bold font-title text-gray-900">
  Tên trang quản lý
</h1>
<p className="text-gray-500 mt-1">
  Mô tả ngắn gọn về trang
</p>
```

### Table Headers
- **Font Size**: `text-base`
- **Font Weight**: `font-semibold`
- **Color**: `text-gray-600`

### Table Body
- **Font Size**: `text-base`
- **Font Weight**: `font-medium`
- **Color**: `text-gray-900` (primary), `text-gray-600` (secondary)

### Dialog Titles
- **Font Size**: `text-2xl`
- **Font Weight**: `font-bold` (implied by default)

---

## 🔘 Buttons

### Primary Action Button (Thêm mới, Tạo mới)
```tsx
<Button className="h-10 px-6">
  <Plus className="w-5 h-5 mr-2" />
  Thêm mới
</Button>
```
- **Height**: `h-10` (40px)
- **Padding**: `px-6`
- **Icon Size**: `w-5 h-5` (20px)

### Action Buttons (Sửa, Xóa trong table)
```tsx
<Button variant="outline" size="sm" className="h-9 px-4">
  <Pencil className="w-4 h-4 mr-2" />
  Sửa
</Button>
```
- **Height**: `h-9` (36px)
- **Padding**: `px-4`
- **Icon Size**: `w-4 h-4` (16px)

### Dialog Buttons
```tsx
<Button className="h-11 px-6">
  Xác nhận
</Button>
```
- **Height**: `h-11` (44px)
- **Padding**: `px-6`

### Icon Buttons
```tsx
<Button variant="ghost" size="icon" className="h-9 w-9">
  <MoreVertical size={18} />
</Button>
```
- **Size**: `h-9 w-9` (36x36px)

---

## 📝 Inputs & Forms

### Standard Input
```tsx
<Input className="h-12 text-base" placeholder="Nhập nội dung..." />
```
- **Height**: `h-12` (48px)
- **Font Size**: `text-base` (16px)

### Search Input
```tsx
<div className="relative">
  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <Input className="pl-10" placeholder="Tìm kiếm..." />
</div>
```
- **Icon Padding**: `left-3`
- **Input Padding**: `pl-10`

### Label
```tsx
<Label className="text-base font-medium">
  Tên trường
</Label>
```

---

## 📊 Tables

### Table Container
```tsx
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      {/* ... */}
    </table>
  </div>
</div>
```
- **Container**: `bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden`
- **Inner wrapper**: `overflow-x-auto` (for horizontal scroll on mobile)
- **Table**: Native HTML `<table className="w-full">`

### Table Header
```tsx
<thead className="bg-gray-50 border-b border-gray-100">
  <tr>
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      ID
    </th>
  </tr>
</thead>
```
- **Background**: `bg-gray-50`
- **Border**: `border-b border-gray-100`
- **Padding**: `px-6 py-4`
- **Font**: `text-sm font-semibold text-gray-600`
- **Alignment**: `text-left` (hoặc `text-right`, `text-center`)

### Table Body
```tsx
<tbody className="divide-y divide-gray-100">
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 text-gray-600">
      #123
    </td>
    <td className="px-6 py-4">
      <span className="font-medium text-gray-900">Nội dung</span>
    </td>
  </tr>
</tbody>
```
- **Body divider**: `divide-y divide-gray-100`
- **Row hover**: `hover:bg-gray-50 transition-colors`
- **Cell padding**: `px-6 py-4`
- **ID format**: `#` prefix với `text-gray-600`
- **Content**: `font-medium text-gray-900` cho text chính

### Important Notes
- **Không dùng** shadcn `Table`, `TableHeader`, `TableBody`, `TableCell` components
- **Dùng** native HTML table elements (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`)
- **Font size**: `text-sm` (không phải `text-base`)
- **Gap giữa buttons**: `gap-2` (không phải `gap-3`)

---

## 💬 Dialogs & Modals

### Dialog Container
```tsx
<Dialog>
  <DialogContent className="sm:max-w-[550px]">
    <DialogHeader className="space-y-3">
      <DialogTitle className="text-2xl">Tiêu đề</DialogTitle>
      <DialogDescription className="text-base">
        Mô tả
      </DialogDescription>
    </DialogHeader>
    {/* ... */}
  </DialogContent>
</Dialog>
```
- **Max Width**: `sm:max-w-[550px]`
- **Title Size**: `text-2xl`
- **Description Size**: `text-base`
- **Spacing**: `space-y-3`

### Dialog Footer
```tsx
<DialogFooter className="gap-3">
  <Button variant="outline" className="h-11 px-6">
    Hủy
  </Button>
  <Button className="h-11 px-6">
    Xác nhận
  </Button>
</DialogFooter>
```

---

## 🗂️ Empty States

```tsx
<Empty>
  <EmptyContent>
    <EmptyMedia variant="icon">
      <Briefcase className="text-primary" />
    </EmptyMedia>
    <EmptyTitle>Chưa có dữ liệu</EmptyTitle>
    <EmptyDescription>
      Mô tả hướng dẫn người dùng
    </EmptyDescription>
  </EmptyContent>
</Empty>
```

---

## 🎯 Icons

### Icon Sizes
- **Primary Actions**: `w-5 h-5` (20px) - Cho button lớn
- **Secondary Actions**: `w-4 h-4` (16px) - Cho button nhỏ
- **Search/Filter Icons**: `size={18}` (18px)
- **Menu Icons**: `size={16}` (16px)
- **Icon Buttons**: `size={18}` (18px)

### Icon Colors
- **Default**: `text-gray-400`
- **Primary**: `text-primary`
- **Destructive**: `text-destructive`
- **Success**: `text-green-600`
- **Warning**: `text-orange-600`

---

## 📏 Spacing

### Page Layout
```tsx
<div className="space-y-6">
  {/* Page content */}
</div>
```
- **Main Container**: `space-y-6` (24px gap)

### Filter Section
```tsx
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
  <div className="flex flex-col sm:flex-row gap-4">
    {/* Filters */}
  </div>
</div>
```
- **Padding**: `p-4` (16px)
- **Gap**: `gap-4` (16px)

### Card/Container Padding
- **Small**: `p-4` (16px)
- **Medium**: `p-6` (24px)
- **Large**: `p-12` (48px) - For empty states

---

## 📦 Using Style Constants

Import và sử dụng constants từ file `managementStyles.ts`:

```tsx
import { MANAGEMENT_STYLES } from "@/constants/managementStyles";

// Example usage
<Button className={MANAGEMENT_STYLES.buttons.primary}>
  Thêm mới
</Button>

<Input className={MANAGEMENT_STYLES.inputs.standard} />

<div className={MANAGEMENT_STYLES.table.container}>
  <Table>
    <TableHeader>
      <TableRow className={MANAGEMENT_STYLES.table.header.row}>
        <TableHead className={MANAGEMENT_STYLES.table.header.cell}>
          Header
        </TableHead>
      </TableRow>
    </TableHeader>
  </Table>
</div>
```

---

## ✅ Checklist khi tạo Management Page mới

- [ ] Page header sử dụng `text-3xl font-bold font-title text-gray-900`
- [ ] Button "Thêm mới" có class `h-10 px-6`
- [ ] Action buttons trong table có class `h-9 px-4`
- [ ] Table container có class `border rounded-xl shadow-sm overflow-hidden`
- [ ] Table header có `bg-gray-50` và `py-4 px-6 text-base font-semibold`
- [ ] Table body có `py-5 px-6 text-base font-medium`
- [ ] Dialog buttons có class `h-11 px-6`
- [ ] Input fields có class `h-12 text-base`
- [ ] Empty state được implement với EmptyContent component
- [ ] Icon sizes phù hợp với context (20px cho primary, 16px cho secondary)
- [ ] Spacing nhất quán với `space-y-6` cho main container
- [ ] Hover states được implement (`hover:bg-gray-50/50` cho table rows)

---

## 🔄 Updates & Maintenance

**Last Updated**: December 31, 2025

**Version**: 1.0.0

Khi có thay đổi về design system, vui lòng cập nhật tài liệu này và file `managementStyles.ts`.

---

## 📞 Support

Nếu có câu hỏi về style guide, vui lòng liên hệ team Frontend hoặc tạo issue trên repository.

