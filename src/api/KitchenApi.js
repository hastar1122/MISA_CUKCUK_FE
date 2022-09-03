import BaseAPIConfig from "./BaseApiConfig";

/**
 * Class chứa danh sách API Kitchens
 * Author: Nguyễn Hoàng Anh (17/8/2022)
 */
class KitchenApi {
    controller = "Kitchens";

    /**
     * Lấy toàn bộ danh sách nơi chế biến
     * @returns Danh sách toàn bộ nơi chế biến
     */
    getAll() {
        return BaseAPIConfig.get(`${this.controller}`);
    }

    /**
     * Thêm mới nơi chế biến
     * @param {*} formData Thông tin nới chế biến
     * @returns Số dòng đc thêm mới
     * Author: Nguyễn Hoàng Anh (21/8/2022)
     */
    post(formData) {
        return BaseAPIConfig.post(`${this.controller}`, formData);
    }
}

export default new KitchenApi();