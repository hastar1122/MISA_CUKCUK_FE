import BaseAPIConfig from "./BaseApiConfig";

/**
 * Class chứa danh sách API Foods
 * Author: Nguyễn Hoàng Anh (10/8/2022)
 */
class FoodApi {
    controller = "Foods";

    /**
     * Lấy toàn bộ danh sách món ăn
     * @returns Danh sách toàn bộ món ăn
     */
    getAll() {
        return BaseAPIConfig.get(`${this.controller}`);
    }

    /**
     * Lọc và phân trang danh sách món ăn
     * @param {*} filters Danh sách thông tin lọc
     * @param {*} pageIndex Trang hiện tại
     * @param {*} pageSize Số bản ghi trên 1 trang
     * @returns Danh sách thực đơn đã được lọc và phân trang, Tổng số trang, Tổng số bản ghi tìm được
     * Author: Nguyễn Hoàng Anh (15/8/2022)
     */
    filter(filters, pageIndex, pageSize, sort) {
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].type == 'int' && filters[i].value != '') {
                filters[i].value = parseFloat(filters[i].value.toString().split('').filter(c => c !== '.').join(''));
            }
        }
        var filter = {
            Filters: filters,
            Limit: pageSize,
            Page: pageIndex,
            Sort: sort
        }
        return BaseAPIConfig.post(`${this.controller}/filter`, filter);
    }

    /**
     * Lấy thông tin chi tiết món ăn theo khóa chính
     * @param {*} id mã món ăn 
     * @returns Thông tin món ăn theo khóa chính
     * Author: Nguyễn Hoàng Anh (18/8/2022)
     */
    getByID(id) {
        return BaseAPIConfig.get(`${this.controller}/${id}`);
    }

    /**
     * Thêm mới món ăn
     * @param {*} food Thông tin món ăn 
     * @returns Số dòng đc thêm mới
     * Author: Nguyễn Hoàng Anh (21/8/2022)
     */
    post(formData) {
        return BaseAPIConfig.post(`${this.controller}`, formData);
    }

    /**
     * Cập nhật thông tin thực đơn theo ID
     * @param {*} id  //ID của thực đơn đang được cập nhật
     * @returns Số dòng được cập nhật
     * Author: Nguyễn Hoàng Anh (23/8/2022)
     */
    put(id, food) {
        return BaseAPIConfig.put(`${this.controller}/${id}`, food);
    }

    /**
     * Lấy mã thực đơn theo tên
     * @param {*} foodName tên thực đơn
     * @returns mã thực đơn
     * Author: Nguyễn Hoàng Anh (23/8/2022)
     */
    getFoodCode(foodName) {
        return BaseAPIConfig.get(`${this.controller}/getFoodCode?foodName=${foodName}`);
    }

    /**
     * Xóa thực đơn
     * @param {*} foodID Id của thực đơn cần xóa
     * @returns 
     * Author: Nguyễn Hoàng Anh (23/8/2022)
     */
    delete(foodID) {
        return BaseAPIConfig.delete(`${this.controller}/${foodID}`);
    }

    /**
     * Xóa danh sách thực đơn
     * @param {*} foodIDs 
     * @returns 
     * Author: Nguyễn Hoàng Anh (24/8/2022)
     */
    deleteMultiple(foodIDs) {
        return BaseAPIConfig.delete(`${this.controller}/deleteMultiple?foodIDs=${foodIDs}`)
    }

    /**
     * Upload ảnh
     * @param {*} file 
     * @returns Link ảnh
     * Author: Nguyễn Hoàng Anh (28/8/2022)
     */
    uploadImge(file) {
        let formData = new FormData();
        formData.append('fileImage', file);
        return BaseAPIConfig.post(`${this.controller}/uploadImage`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    /**
     * Xuất ra file excel
     * @param {*} filters Thông tin lọc 
     * @param {*} pageIndex Trạng hiện tại (sẽ set null khi về server)
     * @param {*} pageSize Số bản ghi trên 1 trang (sẽ set null khi về server)
     * @param {*} sort Cột được sắp xếp
     * @returns file excel
     * Author: Nguyễn Hoàng Anh (29/8/2022)
     */
    export (filters, pageIndex, pageSize, sort) {
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].type == 'int' && filters[i].value != '') {
                filters[i].value = parseFloat(filters[i].value.toString().split('').filter(c => c !== '.').join(''));
            }
        }
        var filter = {
            Filters: filters,
            Limit: pageSize,
            Page: pageIndex,
            Sort: sort
        }
        return BaseAPIConfig.post(`${this.controller}/export`, filter, {
            responseType: 'blob'
        });
    }
}

export default new FoodApi();