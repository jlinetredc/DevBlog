// src/lib/utils.js

/**
 * Hàm hỗ trợ tạo URL chuẩn dựa trên BASE_URL của dự án
 * @param {string} path - Đường dẫn mong muốn (ví dụ: '/blog/post-1')
 * @returns {string} - Đường dẫn đã được nối với BASE_URL
 */
export function getAssetPath(path) {
    const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // Loại bỏ dấu / ở cuối base nếu có
    const cleanPath = path.startsWith('/') ? path : `/${path}`; // Đảm bảo path bắt đầu bằng dấu /

    return `${base}${cleanPath}`;
}
