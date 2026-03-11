---
title: 'Hướng dẫn tích hợp Slick Slider từ A - Z'
pubDate: 2026-02-03
description: 'Cách tạo slide chuyên nghiệp cho website với thư viện Slick Slider kèm CSS tùy chỉnh'
category: 'frontend'
---

**Slick Slider** được mệnh danh là thư viện Carousel hoàn hảo nhất mà bạn từng cần. Với khả năng tùy biến cực cao, hỗ trợ responsive mượt mà, đây là lựa chọn hàng đầu cho các lập trình viên Frontend.

---

## 1. Chèn thư viện vào dự án

Slick Slider hoạt động dựa trên **jQuery**, vì vậy bạn cần nhúng đủ 3 thành phần: CSS của Slick, Thư viện jQuery và JS của Slick.

### 1.1. Thêm CSS (Đặt trong thẻ `<head>`)

```html
<link
    rel="stylesheet"
    type="text/css"
    href="[https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css](https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css)"
/>
<link
    rel="stylesheet"
    type="text/css"
    href="[https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css](https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css)"
/>
```

### 1.2. Thêm JS (Đặt trước thẻ đóng)

Lưu ý: jQuery phải nằm trên Slick JS.

```html
<script
    type="text/javascript"
    src="[https://code.jquery.com/jquery-1.11.0.min.js](https://code.jquery.com/jquery-1.11.0.min.js)"
></script>
<script
    type="text/javascript"
    src="[https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js](https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js)"
></script>
```

## 2. Cấu trúc HTML

Slick không yêu cầu class cố định, bạn chỉ cần một thẻ cha bao quanh các thẻ con (slide).

```html
<div class="your-class">
    <div><img src="slide1.jpg" alt="Slide 1" /></div>
    <div><img src="slide2.jpg" alt="Slide 2" /></div>
    <div><img src="slide3.jpg" alt="Slide 3" /></div>
</div>
```

## 3. Khởi tạo Slider bằng Javascript

Sử dụng đoạn mã dưới đây để kích hoạt các tính năng cơ bản như tự động chạy, hiện nút bấm.

```js
$(document).ready(function () {
    $('.your-class').slick({
        infinite: true, // Lặp lại vô tận
        slidesToShow: 3, // Số lượng item hiển thị
        slidesToScroll: 1, // Số lượng item cuộn mỗi lần
        autoplay: true, // Tự động chạy
        autoplaySpeed: 2000, // Tốc độ (ms)
        dots: true, // Hiện các chấm điều hướng
        arrows: true, // Hiện mũi tên trái/phải
    });
});
```

## 4. Cấu hình Responsive

Bạn có thể thay đổi số lượng item tùy theo kích thước màn hình của người dùng.

```js
$('.your-class').slick({
    slidesToShow: 4,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                infinite: true,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                dots: false,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
            },
        },
    ],
});
```

## 5. Tùy biến CSS cho Mũi tên (Bonus)

Mũi tên mặc định của Slick khá nhỏ và khó nhìn. Bạn có thể dùng đoạn CSS sau để làm chúng nổi bật hơn:

```css
/* Tùy chỉnh vị trí và màu sắc mũi tên */
.slick-prev, .slick-next {
    z-index: 10;
    width: 40px;
    height: 40px;
    background: #ea580c !important; /* Màu cam orange-600 */
    border-radius: 50%;
}

.slick-prev {
    left: 10px;
}

.slick-next {
    right: 10px;
}

/* Thay đổi màu dấu chấm điều hướng khi active */
.slick-dots li.slick-active button:before {
    color: #ea580c !important;
}
```