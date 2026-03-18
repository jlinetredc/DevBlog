---
title: 'Tự động Publish lại các bài viết bị Missed Schedule trong WordPress'
description: 'WordPress đôi khi bỏ qua lịch đăng bài tự động (missed schedule). Bài viết hướng dẫn cách xử lý triệt để vấn đề này bằng một đoạn code nhỏ trong functions.php.'
pubDate: 2026-03-18
category: 'wordpress'
---

Bạn đặt lịch đăng bài tự động trên WordPress, nhưng đến giờ bài lại không được publish? Đây là lỗi khá phổ biến mang tên **"Missed Schedule"** — và may mắn thay, nó hoàn toàn có thể xử lý được bằng một đoạn code đơn giản trong `functions.php`.

## Tại sao WordPress bị Missed Schedule?

WordPress không có một tiến trình nền (background process) chạy liên tục như các hệ thống server truyền thống. Thay vào đó, nó sử dụng **WP-Cron** — một cơ chế "giả lập cron" chỉ được kích hoạt khi có người truy cập vào trang web của bạn.

Điều này có nghĩa là:

- Nếu website ít traffic và **không có ai truy cập** đúng vào thời điểm bài viết được lên lịch, WP-Cron sẽ không được gọi.
- Kết quả là bài viết bị kẹt ở trạng thái `future` (chờ xuất bản) thay vì được publish đúng giờ.

## Giải pháp: Tự động phát hiện và publish lại

Đoạn code dưới đây sẽ kiểm tra và publish lại tất cả các bài viết đang bị kẹt mỗi khi có request đến website, đảm bảo không bài nào bị bỏ sót.

```php
add_action('init', function() {
    if (defined('DOING_CRON') || defined('DOING_AJAX')) return;

    $now_gmt = gmdate('Y-m-d H:i:s');

    $missed = get_posts(array(
        'post_status'    => 'future',
        'post_type'      => array('post', 'news', 'lineup'),
        'posts_per_page' => 20,
        'date_query'     => array(
            array(
                'column' => 'post_date_gmt',
                'before' => $now_gmt,
            ),
        ),
    ));

    foreach ($missed as $post) {
        wp_publish_post($post->ID);
    }
}, 99);
```

## Phân tích từng phần của code

### 1. Hook vào `init` với priority 99

```php
add_action('init', function() { ... }, 99);
```

Hook `init` chạy rất sớm trong vòng đời của WordPress, sau khi core đã load xong. Priority `99` đảm bảo code này chạy sau hầu hết các plugin khác, tránh xung đột.

### 2. Bỏ qua WP-Cron và AJAX

```php
if (defined('DOING_CRON') || defined('DOING_AJAX')) return;
```

Điều kiện này tránh việc code chạy chồng chéo trong các tiến trình nội bộ như WP-Cron hay các AJAX request, vốn không cần thiết phải publish bài viết ngay tại thời điểm đó.

### 3. Lấy thời gian hiện tại theo GMT

```php
$now_gmt = gmdate('Y-m-d H:i:s');
```

Thời gian của bài viết trong database WordPress luôn được lưu theo **GMT** (không phụ thuộc múi giờ của server hay cài đặt timezone WordPress). Vì vậy, ta dùng `gmdate()` thay vì `date()` để so sánh chính xác.

### 4. Truy vấn các bài viết bị missed

```php
$missed = get_posts(array(
    'post_status'    => 'future',
    'post_type'      => array('post', 'news', 'lineup'),
    'posts_per_page' => 20,
    'date_query'     => array(
        array(
            'column' => 'post_date_gmt',
            'before' => $now_gmt,
        ),
    ),
));
```

Đây là phần cốt lõi của giải pháp:

| Tham số | Ý nghĩa |
|---|---|
| `post_status => 'future'` | Chỉ lấy các bài đang ở trạng thái chờ xuất bản |
| `post_type` | Áp dụng cho các loại bài: `post`, `news`, `lineup` |
| `posts_per_page => 20` | Giới hạn 20 bài mỗi lần để tránh overload |
| `date_query` | Lọc bài có ngày đăng (GMT) **trước** thời điểm hiện tại — tức là đã đến giờ nhưng chưa được publish |

> **Lưu ý:** Nếu website của bạn có nhiều Custom Post Type khác cần theo dõi, hãy thêm chúng vào mảng `post_type`.

### 5. Publish từng bài bị bỏ lỡ

```php
foreach ($missed as $post) {
    wp_publish_post($post->ID);
}
```

Hàm `wp_publish_post()` là native function của WordPress dùng để publish một bài viết theo ID. Nó cập nhật trạng thái bài viết, cập nhật thời gian publish, và kích hoạt các action/hook liên quan (như gửi thông báo cho subscriber chẳng hạn).

## Cách áp dụng

1. Mở file `functions.php` của theme đang active tại đường dẫn `wp-content/themes/ten-theme/functions.php`.
2. Dán đoạn code vào cuối file, trước thẻ đóng `?>` (nếu có).
3. Lưu lại và truy cập vào thất kỳ trang nào trên website để kích hoạt lần đầu.

Hoặc nếu bạn muốn an toàn hơn và không muốn chỉnh sửa file theme, hãy tạo một **Plugin nhỏ** riêng lẻ chỉ để chứa đoạn code này.

## Lưu ý về hiệu năng

- Đoạn code này chạy **mỗi khi có request trang thông thường** (không phải AJAX hay Cron). Với website traffic cao, code này sẽ thường xuyên được gọi — nhưng vì `get_posts` với điều kiện `post_status = future` thường trả về rất ít kết quả (thậm chí không có), nên tác động đến hiệu năng là không đáng kể.
- Giới hạn `posts_per_page => 20` là một biện pháp an toàn. Trong điều kiện bình thường, hiếm khi có nhiều hơn 20 bài bị missed cùng một lúc.

## Tổng kết

Lỗi Missed Schedule là một "quirk" nổi tiếng của WordPress xuất phát từ cơ chế WP-Cron phụ thuộc vào traffic. Với đoạn code trên, mỗi lần có người truy cập website, WordPress sẽ tự động kiểm tra và publish ngay các bài viết đã đến giờ — đơn giản, hiệu quả và không cần cài thêm plugin nào.
