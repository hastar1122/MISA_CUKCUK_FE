import BaseAPIConfig from "./BaseApiConfig";

/**
 * Class chứa danh sách API FoodCategorys
 * Author: Nguyễn Hoàng Anh (17/8/2022)
 */
class FoodUnitApi {
    controller = "FoodUnits";

    /**
     * Lấy toàn bộ danh sách đơn vị tính
     * @returns Danh sách toàn bộ đơn vị tính
     */
    getAll() {
        return BaseAPIConfig.get(`${this.controller}`);
    }

    /**
     * Thêm mới đơn vị tính
     * @param {*} formData Thông tin đơn vị tính
     * @returns Số dòng đc thêm mới
     * Author: Nguyễn Hoàng Anh (21/8/2022)
     */
    post(formData) {
        return BaseAPIConfig.post(`${this.controller}`, formData);
    }
}

export default new FoodUnitApi();