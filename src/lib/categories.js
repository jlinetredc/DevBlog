export const CATEGORIES = {
    FRONTEND: { id: 'frontend', label: 'Frontend' },
    BACKEND: { id: 'backend', label: 'Backend' },
    WORDPRESS: { id: 'wordpress', label: 'Wordpress' },
    UIUX: { id: 'uiux', label: 'UI/UX Design' },
    LIBRARY: { id: 'library', label: 'Library' },
};

// Hàm hỗ trợ kiểm tra và chuẩn hóa category
export const getCategoryLabel = (id) => {
    const cat = Object.values(CATEGORIES).find(
        (c) => c.id === id.toLowerCase()
    );
    return cat ? cat.label : 'Chưa phân loại';
};
