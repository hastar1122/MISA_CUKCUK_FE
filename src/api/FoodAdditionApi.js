import BaseAPIConfig from "./BaseApiConfig";

/**
 * Class chứa danh sách API FoodAdditions
 * Author: Nguyễn Hoàng Anh (17/8/2022)
 */
class FoodAdditionApi {
    controller = "FoodAdditions";

    /**
     * Lấy toàn bộ danh sách sở thích phục vụ
     * @returns Danh sách toàn sở thích phục vụ
     */
    getAll() {
        return BaseAPIConfig.get(`${this.controller}`);
    }

    /**
     * Thêm mới sở thích phục vụ
     * @param {*} formData Thông tin sở thích phục vụ
     * @returns Khóa chính
     * Author: Nguyễn Hoàng Anh (21/8/2022)
     */
    post(formData) {
        return BaseAPIConfig.post(`${this.controller}`, formData);
    }
}

export default new FoodAdditionApi();