export const FilterType = {
    CONTAIN: 0, // Chứa
    EQUAL: 1, // Bằng
    START_WITH: 2, // Bắt đầu bằng
    END_WITH: 3, // Kết thúc bằng
    NOT_CONTAIN: 4, // Không chứa
    LESS: 5, // Nhỏ hơn
    BIGGER: 6, // Lớn hơn
    LESS_OR_EQUAL: 7, // Nhỏ hơn hoặc bằng
    BIGGER_OR_EQUAL: 8, // Lớn hơn hoặc bằng
};

export const ConfirmType = {
    No: 0, // Không
    Yes: 1, // Có
}

export const Direction = {
    ASC: 0, // Tăng dần
    DESC: 1, // Giảm dần
}
export const FormMode = {
    INSERT: 0, // Thêm mới
    EDIT: 1, // Cập nhật
    REPLICATION: 2, // Nhân bản
};