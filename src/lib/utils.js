// src/lib/utils.js

/**
 * Hàm hỗ trợ tạo URL chuẩn dựa trên BASE_URL của dự án
 * @param {string} path - Đường dẫn mong muốn (ví dụ: '/blog/post-1')
 * @returns {string} - Đường dẫn đã được nối với BASE_URL
 */
export function getAssetPath(path) {
    if (!path) return '';

    const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // ví dụ: /ten-repo

    // Nếu path đã bắt đầu bằng base thì không thêm nữa (tránh /ten-repo/ten-repo/2)
    if (path.startsWith(base) && base !== '') {
        return path;
    }

    // Đảm bảo path có dấu gạch chéo ở đầu
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${base}${cleanPath}`;
}
