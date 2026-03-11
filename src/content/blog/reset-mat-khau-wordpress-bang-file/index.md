---
title: 'Hướng dẫn Reset mật khẩu WordPress bằng File (functions.php)'
description: 'Bạn bị mất quyền truy cập Admin WordPress và không thể nhận email reset? Đây là cách khôi phục mật khẩu trực tiếp thông qua file hệ thống.'
pubDate: 2026-03-11
category: 'wordpress'
---

Trong quá trình quản trị website WordPress, đôi khi bạn có thể gặp tình huống "tiến thoái lưỡng nan": Quên mật khẩu Admin nhưng tính năng gửi email khôi phục của hosting lại bị lỗi, hoặc bạn không còn truy cập được vào email đăng ký nữa.

Lúc này, nếu bạn có quyền truy cập vào mã nguồn thông qua **FTP** hoặc **File Manager** (trên cPanel/DirectAdmin), bạn hoàn toàn có thể đặt lại mật khẩu bằng cách chỉnh sửa file `functions.php` của theme đang sử dụng.

Dưới đây là hướng dẫn chi tiết từng bước.

## Bước 1: Truy cập vào mã nguồn website

Đầu tiên, bạn cần kết nối vào host của mình. Bạn có thể sử dụng:
- Phần mềm FTP client như **FileZilla**, **WinSCP**.
- Hoặc công cụ **File Manager** ngay trong bảng điều khiển cPanel/DirectAdmin của nhà cung cấp hosting.

## Bước 2: Tìm file functions.php của Theme đang kích hoạt

Điều hướng tới thư mục chứa theme mà website bạn đang sử dụng theo đường dẫn sau:

`wp-content/themes/ten-theme-cua-ban/`

Tại đây, bạn sẽ tìm thấy file có tên là `functions.php`. Hãy tải file này về máy tính bằng FTP để sao lưu dự phòng (rất quan trọng), sau đó mở file này ra bằng một Text Editor (như Notepad++, VS Code) để chỉnh sửa.

## Bước 3: Thêm đoạn code Reset mật khẩu

Thêm đoạn mã sau vào ngay sau thẻ mở `<?php` ở đầu file `functions.php` (hoặc ở ngay cuối file, trước thẻ đóng `?>` nếu có):

```php
wp_set_password( 'MatKhauMoiCuaBan123!', 1 );
```

**Giải thích thông số:**
- `'MatKhauMoiCuaBan123!'`: Đây là mật khẩu mới mà bạn muốn đặt. Hãy thay đổi thành mật khẩu khó đoán của bạn.
- `1`: Đây là ID của user quản trị viên. Thông thường, user admin đầu tiên được tạo ra trên WordPress sẽ có ID là 1. Nếu tài khoản của bạn có ID khác, hãy thay số 1 bằng ID tương ứng.

Lưu lại file `functions.php` và upload đè lên file cũ trên thư mục theme của host.

## Bước 4: Đăng nhập vào WordPress

Bây giờ, hãy mở trình duyệt và truy cập vào trang đăng nhập Admin của trang web (thường là `tenmien.com/wp-admin`).

Sử dụng Username của bạn và mật khẩu mới (`MatKhauMoiCuaBan123!`) để đăng nhập.

## Bước 5: Xóa đoạn code đã thêm (RẤT QUAN TRỌNG)

Khi bạn đã đăng nhập thành công vào Dashboard, WordPress đã tự động cập nhật được mật khẩu mới vào hệ thống cơ sở dữ liệu. 

Ngay lúc này, bạn **PHẢI** quay lại file `functions.php` trên host và **xóa đoạn code** `wp_set_password` mà bạn vừa thêm ở Bước 3, sau đó lưu lại. 

```php
// Xóa ngay dòng này sau khi đăng nhập thành công:
// wp_set_password( 'MatKhauMoiCuaBan123!', 1 );
```

> **Lý do cần xóa:** Nếu bạn không xóa đoạn mã này, mỗi khi có bất kỳ ai truy cập tải trang trên website của bạn, WordPress sẽ liên tục chạy hàm này và reset lại mật khẩu, điều này sẽ gây lỗi session khiến bạn hoặc người khác bị văng khỏi trang quản trị liên tục.

---

## Tóm lại

Phương pháp reset mật khẩu bằng việc chỉnh sửa file `functions.php` này rất nhanh chóng và không yêu cầu bạn phải đăng nhập vào cơ sở dữ liệu phpMyAdmin phức tạp. Chỉ với quyền quản lý File/FTP, bạn đã có thể dễ dàng lấy lại quyền kiểm soát website WordPress của mình. Chúc bạn thực hiện thành công!
