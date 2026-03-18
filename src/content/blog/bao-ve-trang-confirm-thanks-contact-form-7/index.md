---
title: 'Bảo vệ trang Confirm và Thanks của Contact Form 7 + Multistep Form 7'
description: 'Ngăn người dùng truy cập trực tiếp vào trang xác nhận (confirm) và cảm ơn (thanks) của form liên hệ khi chưa thực sự điền và gửi form bằng cookie và hook WordPress.'
pubDate: 2026-03-18
category: 'wordpress'
---

Khi xây dựng form liên hệ nhiều bước bằng **Contact Form 7** kết hợp plugin **Multistep Form 7 (CF7 Multi-Step Forms)**, một vấn đề thường bị bỏ qua là: người dùng hoàn toàn có thể gõ thẳng URL vào trình duyệt để truy cập trang `/confirm/` hoặc `/thanks/` mà không cần điền form.

Điều này không chỉ gây trải nghiệm kỳ lạ mà còn có thể làm lộ nội dung trang xác nhận hoặc tạo ra những edge case không mong muốn trong luồng xử lý form.

Bài viết này hướng dẫn cách dùng **cookie và WordPress hook** để khóa chặt hai trang đó, chỉ cho phép truy cập khi người dùng đi đúng quy trình.

---

## Luồng hoạt động tổng quan

Trước khi đi vào code, hãy hiểu rõ luồng mà chúng ta muốn bảo vệ:

```
/contact/  →  (điền form, click Next)  →  /confirm/  →  (click Submit)  →  /thanks/
```

- **`/confirm/`**: Trang xem lại thông tin trước khi gửi. Chỉ hợp lệ khi người dùng vừa điền xong bước cuối của Multistep Form 7.
- **`/thanks/`**: Trang cảm ơn sau khi form được gửi thành công. Chỉ hợp lệ khi Contact Form 7 vừa gửi email xong.

---

## Phần 1: Bảo vệ trang `/confirm/`

Plugin **CF7 Multi-Step Forms** lưu dữ liệu form của các bước trung gian vào cookie có key là `cf7msm_posted_data`. Chúng ta sẽ kiểm tra cookie này để xác định người dùng có thực sự đang đi qua form hay không.

```php
add_action('template_redirect', function() {
    if (is_page('confirm')) {
        $step_data_exists = false;

        if (isset($_COOKIE['cf7msm_posted_data']) && !empty($_COOKIE['cf7msm_posted_data'])) {
            $step_data_exists = true;
        }

        if (!$step_data_exists) {
            wp_redirect(home_url('/contact/'));
            exit;
        }
    }
});
```

### Giải thích

| Thành phần | Ý nghĩa |
|---|---|
| `template_redirect` | Hook chạy trước khi WordPress render template, thời điểm lý tưởng để redirect |
| `is_page('confirm')` | Kiểm tra xem trang hiện tại có phải trang có slug `confirm` không |
| `$_COOKIE['cf7msm_posted_data']` | Cookie do Multistep Form 7 tạo ra khi người dùng chuyển bước |
| `wp_redirect()` + `exit` | Redirect về trang form và dừng thực thi ngay lập tức |

**Kịch bản bảo vệ:**
- Người dùng gõ thẳng `yourdomain.com/confirm/` → không có cookie → redirect về `/contact/`.
- Người dùng vừa điền form bước 1, nhấn Next → có cookie `cf7msm_posted_data` → được vào trang confirm bình thường.

---

## Phần 2: Đặt cookie khi form gửi thành công

Sau khi người dùng xác nhận và submit form trên trang `/confirm/`, Contact Form 7 sẽ xử lý và gửi email. Khi thành công, hook `wpcf7_mail_sent` được gọi — đây là thời điểm chúng ta set một cookie đánh dấu "form đã gửi thành công".

```php
add_action('wpcf7_mail_sent', function($contact_form) {
    setcookie('form_submitted_successfully', '1', time() + 60, COOKIEPATH, COOKIE_DOMAIN);
});
```

### Giải thích

| Tham số | Ý nghĩa |
|---|---|
| `'form_submitted_successfully'` | Tên cookie tùy chọn, đặt sao cho dễ nhận biết |
| `'1'` | Giá trị của cookie — ở đây chỉ cần một flag đơn giản |
| `time() + 60` | Cookie hết hạn sau **60 giây** — đủ thời gian để WordPress redirect sang trang `/thanks/` |
| `COOKIEPATH`, `COOKIE_DOMAIN` | Hằng số WordPress, đảm bảo path và domain cookie đúng với cấu hình website |

> **Tại sao chỉ 60 giây?** Cookie này chỉ cần tồn tại đủ lâu để người dùng được redirect sang trang `/thanks/`. Sau đó nó sẽ bị xóa ngay trong phần tiếp theo.

---

## Phần 3: Bảo vệ trang `/thanks/`

Tương tự trang confirm, chúng ta kiểm tra sự tồn tại của cookie `form_submitted_successfully` trước khi cho phép truy cập trang cảm ơn.

```php
add_action('template_redirect', function() {
    if (is_page('thanks')) {
        if (!isset($_COOKIE['form_submitted_successfully'])) {
            wp_safe_redirect(home_url('/contact/'));
            exit;
        } else {
            setcookie('form_submitted_successfully', '', time() - 3600, COOKIEPATH, COOKIE_DOMAIN);
        }
    }
});
```

### Giải thích

**Trường hợp không có cookie** (truy cập trực tiếp):
```php
wp_safe_redirect(home_url('/contact/'));
exit;
```
Dùng `wp_safe_redirect()` thay vì `wp_redirect()` để an toàn hơn — hàm này kiểm tra xem URL đích có thuộc domain hiện tại không, tránh open redirect vulnerability.

**Trường hợp có cookie** (đến từ đúng luồng):
```php
setcookie('form_submitted_successfully', '', time() - 3600, COOKIEPATH, COOKIE_DOMAIN);
```
Xóa cookie ngay lập tức bằng cách set thời gian hết hạn về quá khứ (`time() - 3600`). Điều này đảm bảo:
- Người dùng không thể **reload** trang `/thanks/` sau khi đã xem.
- Người dùng không thể **bookmark** và quay lại trang này sau.

---

## Code hoàn chỉnh

Dán toàn bộ đoạn code sau vào file `functions.php` của theme đang active:

```php
/**
 * Bảo vệ trang /confirm/ - chỉ cho truy cập khi có dữ liệu từ Multistep Form 7
 */
add_action('template_redirect', function() {
    if (is_page('confirm')) {
        $step_data_exists = false;

        if (isset($_COOKIE['cf7msm_posted_data']) && !empty($_COOKIE['cf7msm_posted_data'])) {
            $step_data_exists = true;
        }

        if (!$step_data_exists) {
            wp_redirect(home_url('/contact/'));
            exit;
        }
    }
});

/**
 * Đặt cookie sau khi Contact Form 7 gửi email thành công
 */
add_action('wpcf7_mail_sent', function($contact_form) {
    setcookie('form_submitted_successfully', '1', time() + 60, COOKIEPATH, COOKIE_DOMAIN);
});

/**
 * Bảo vệ trang /thanks/ - chỉ cho truy cập sau khi form đã được gửi
 */
add_action('template_redirect', function() {
    if (is_page('thanks')) {
        if (!isset($_COOKIE['form_submitted_successfully'])) {
            wp_safe_redirect(home_url('/contact/'));
            exit;
        } else {
            setcookie('form_submitted_successfully', '', time() - 3600, COOKIEPATH, COOKIE_DOMAIN);
        }
    }
});
```

---

## Lưu ý khi triển khai

- **Slug trang**: Code dùng `is_page('confirm')` và `is_page('thanks')`. Hãy đảm bảo slug của hai trang WordPress tương ứng là `confirm` và `thanks`. Nếu slug của bạn khác (ví dụ `xac-nhan`, `cam-on`), hãy thay thế cho phù hợp.
- **Tên cookie của CF7MSM**: Tên cookie `cf7msm_posted_data` là mặc định của plugin CF7 Multi-Step Forms. Nếu bạn dùng plugin khác hoặc phiên bản cũ, hãy kiểm tra lại tên cookie thực tế bằng browser DevTools (tab Application → Cookies).
- **Cache**: Nếu website có bật Page Cache (WP Rocket, LiteSpeed Cache, v.v.), hãy đảm bảo hai trang `/confirm/` và `/thanks/` được **loại trừ khỏi cache**, vì đây là các trang động phụ thuộc vào trạng thái người dùng.

---

## Tổng kết

Chỉ với ba đoạn hook nhỏ, bạn đã xây dựng được một hệ thống bảo vệ khép kín cho toàn bộ luồng form liên hệ nhiều bước:

1. **Cookie của CF7MSM** xác nhận người dùng đã đi qua các bước form trước khi vào trang confirm.
2. **Cookie tùy chỉnh** được set sau khi gửi thành công, làm "vé vào cổng" cho trang thanks.
3. Cookie đó bị **xóa ngay lập tức** sau lần truy cập đầu tiên vào trang thanks, ngăn mọi truy cập tiếp theo.

Giải pháp này nhẹ, không cần database, không phụ thuộc session PHP, và hoạt động tốt với hầu hết các cấu hình WordPress thông thường.
