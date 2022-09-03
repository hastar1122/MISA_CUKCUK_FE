import BaseAPIConfig from "./BaseApiConfig";

/**
 * Class chứa danh sách API FoodCategorys
 * Author: Nguyễn Hoàng Anh (17/8/2022)
 */
class FoodCategoryApi {
    controller = "FoodCategorys";

    /**
     * Lấy toàn bộ danh sách nhóm thực đơn
     * @returns Danh sách toàn bộ nhóm thực đơn
     */
    getAll() {
        return BaseAPIConfig.get(`${this.controller}`);
    }

    /**
     * Thêm mới nhóm thực đơn
     * @param {*} formData Thông tin nhóm thực đơn
     * @returns Khóa chính
     * Author: Nguyễn Hoàng Anh (21/8/2022)
     */
    post(formData) {
        return BaseAPIConfig.post(`${this.controller}`, formData);
    }
}

export default new FoodCategoryApi();