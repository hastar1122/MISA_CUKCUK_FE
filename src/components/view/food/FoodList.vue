<template>
    <div id="page-food-list">
        <div class="ms-toolbar">
            <BaseButton
            style="padding: 2px 4px;height: auto; width: auto;"
            :icon="'icon-new-item'"
            :text="'Thêm'"
            @handleClick="btnAddOnClick"
            :type="'secondary'"/>
            <BaseButton
            :disable="foods.length == 0"
            style="padding: 2px 4px;height: auto; width: auto;"
            :icon="'icon-replication'"
            :text="'Nhân bản'"
            @handleClick="btnNhanBanOnClick"
            :type="'secondary'"/>
            <BaseButton
            :disable="foods.length == 0"
            style="padding: 2px 4px;height: auto; width: auto;"
            :icon="'icon-update'"
            :text="'Sửa'"
            @handleClick="btnEditOnClick"
            :type="'secondary'"/>
            <BaseButton
            :disable="foods.length == 0"
            style="padding: 2px 4px;height: auto; width: auto;"
            :icon="'icon-delete'"
            :text="'Xóa'"
            @handleClick="btnDeleteOnClick"
            :type="'secondary'"/>
            <BaseButton
            @handleClick="resetFilter"
            style="padding: 2px 4px;height: auto; width: auto;"
            :icon="'icon-reload'"
            :text="'Nạp'"
            :type="'secondary'"/>
            <!-- <BaseButton
            style="padding: 2px 4px;height: auto; width: auto;"
            :icon="'icon-import'"
            :text="'Nhập khẩu'"
            :type="'secondary'"/> -->
            <BaseButton
            style="padding: 2px 4px;height: auto; width: auto;"
            :icon="'icon-export'"
            :text="'Xuất khẩu'"
            @handleClick="btnExportOnClick"
            :disable="foods.length == 0"
            :type="'secondary'"/>
        </div>
        <div class="food-list" style="position: relative;">
            <!-- Loading -->
            <Loading 
            :active="isLoading"
            :can-cancel="false"
            :color="'#0973b9'"
            :height="60"
            :width="60"
            :is-full-page="false"/>
            <BaseTable 
            v-model="foodsSelected"
            ref="tableListFoodRef"
            :headers="headers"
            :items="foods"
            :keyId="'FoodID'"
            @btnTableHeaderOnClick="btnTableHeaderOnClick"
            @rowOnDbClick="rowOnDbClick"
            @rowOnClick="rowOnClick"
            @rowOnRightClick="showContextMenu">
            <template #header="{key,value}">
                <div v-if="value == 'FoodCode'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px;">
                        <BaseDropdown
                        v-model="filterInfo[0].operator"
                        :data="optionsFilterForString"
                        :keyText="'key'"
                        :displayText="'display'"
                        @handleValueChangeDropdown="handleValueChangeDropdown(filterInfo[0].value)">
                        <template #itemDropdown="{item}">
                            <div v-if="item.key == 0">∗ : Chứa</div>
                            <div v-if="item.key == 1">= : Bằng</div>
                            <div v-if="item.key == 2">+ : Bắt đầu bằng</div>
                            <div v-if="item.key == 3">- : Kết thúc bằng</div>
                            <div v-if="item.key == 4">! : Không chứa</div>
                        </template>
                        </BaseDropdown>
                    </div>
                    <BaseInput v-model="filterInfo[0].value" @handleSubmitValue="handleSubmitValueFilter" @handleBlur="handleValueChangeInput"></BaseInput>
                </div>
                <div v-if="value == 'FoodName'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px;">
                        <BaseDropdown
                        v-model="filterInfo[1].operator"
                        :data="optionsFilterForString"
                        :keyText="'key'"
                        :displayText="'display'"
                        @handleValueChangeDropdown="handleValueChangeDropdown(filterInfo[1].value)">
                        <template #itemDropdown="{item}">
                            <div v-if="item.key == 0">∗ : Chứa</div>
                            <div v-if="item.key == 1">= : Bằng</div>
                            <div v-if="item.key == 2">+ : Bắt đầu bằng</div>
                            <div v-if="item.key == 3">- : Kết thúc bằng</div>
                            <div v-if="item.key == 4">! : Không chứa</div>
                        </template>
                        </BaseDropdown>
                    </div>
                    <BaseInput v-model="filterInfo[1].value" @handleSubmitValue="handleSubmitValueFilter" @handleBlur="handleValueChangeInput"></BaseInput>
                </div>
                <div v-if="value == 'FoodCategoryName'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px;">
                        <BaseDropdown
                        v-model="filterInfo[2].operator"
                        :data="optionsFilterForString"
                        :keyText="'key'"
                        :displayText="'display'"
                        @handleValueChangeDropdown="handleValueChangeDropdown(filterInfo[2].value)">
                        <template #itemDropdown="{item}">
                            <div v-if="item.key == 0">∗ : Chứa</div>
                            <div v-if="item.key == 1">= : Bằng</div>
                            <div v-if="item.key == 2">+ : Bắt đầu bằng</div>
                            <div v-if="item.key == 3">- : Kết thúc bằng</div>
                            <div v-if="item.key == 4">! : Không chứa</div>
                        </template>
                        </BaseDropdown>
                    </div>
                    <BaseInput v-model="filterInfo[2].value" @handleSubmitValue="handleSubmitValueFilter" @handleBlur="handleValueChangeInput"></BaseInput>
                </div>
                <div v-if="value == 'FoodUnitName'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px;">
                        <BaseDropdown
                        v-model="filterInfo[3].operator"
                        :data="optionsFilterForString"
                        :keyText="'key'"
                        :displayText="'display'"
                        @handleValueChangeDropdown="handleValueChangeDropdown(filterInfo[3].value)">
                        <template #itemDropdown="{item}">
                            <div v-if="item.key == 0">∗ : Chứa</div>
                            <div v-if="item.key == 1">= : Bằng</div>
                            <div v-if="item.key == 2">+ : Bắt đầu bằng</div>
                            <div v-if="item.key == 3">- : Kết thúc bằng</div>
                            <div v-if="item.key == 4">! : Không chứa</div>
                        </template>
                        </BaseDropdown>
                    </div>
                    <BaseInput v-model="filterInfo[3].value" @handleSubmitValue="handleSubmitValueFilter" @handleBlur="handleValueChangeInput"></BaseInput>
                </div>
                <div v-if="value == 'FoodPrice'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px;">
                        <BaseDropdown
                        v-model="filterInfo[4].operator"
                        :data="optionsFilterForNumber"
                        :keyText="'key'"
                        :displayText="'display'"
                        @handleValueChangeDropdown="handleValueChangeDropdown(filterInfo[4].value)">
                        <template #itemDropdown="{item}">
                            <div v-if="item.key == 1">= : Bằng</div>
                            <div v-if="item.key == 5">&lt; : Nhỏ hơn</div>
                            <div v-if="item.key == 7">≤ : Nhỏ hơn hoặc bằng</div>
                            <div v-if="item.key == 6">> : Lớn hơn</div>
                            <div v-if="item.key == 8">≥ : Lớn hơn hoặc bằng</div>
                        </template>
                        </BaseDropdown>
                    </div>
                    <BaseInputInt ref="foodPriceTxtRef" :isMoney="true" v-model="filterInfo[4].value" @handleSubmitValue="handleSubmitValueFilter" @handleBlur="handleValueChangeInput"></BaseInputInt>
                </div>
                <div v-if="value == 'ChangeByTime'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px; width: 100%;">
                        <BaseComboBox
                        v-model="filterInfo[5].value"
                        :data="optionsFilterForBoolean"
                        :keyText="'key'"
                        :filterAble="true"
                        :displayText="'display'"
                        @handleValueChange="handleValueChangeCombobox">
                        </BaseComboBox>
                    </div>
                </div>
                <div v-if="value == 'AllowedChange'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px; width: 100%;">
                        <BaseComboBox
                        v-model="filterInfo[6].value"
                        :data="optionsFilterForBoolean"
                        :keyText="'key'"
                        :filterAble="true"
                        :displayText="'display'"
                        @handleValueChange="handleValueChangeCombobox">
                        </BaseComboBox>
                    </div>
                </div>
                <div v-if="value == 'Materials'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px; width: 100%;">
                        <BaseComboBox
                        :data="optionsFilterForBoolean"
                        :keyText="'key'"
                        :filterAble="false"
                        :displayText="'display'">
                        </BaseComboBox>
                    </div>
                </div>
                <div v-if="value == 'HideInMenu'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px; width: 100%;">
                        <BaseComboBox
                        v-model="filterInfo[7].value"
                        :data="optionsFilterForBoolean"
                        :keyText="'key'"
                        :filterAble="true"
                        :displayText="'display'"
                        @handleValueChange="handleValueChangeCombobox">
                        </BaseComboBox>
                    </div>
                </div>
                <div v-if="value == 'InActive'" style="padding: 0 2px 2px 2px; display: flex;">
                    <div style="min-width: 24px; min-height: 24px; width: 100%;">
                        <BaseComboBox
                        v-model="filterInfo[8].value"
                        :data="optionsFilterForBoolean"
                        :keyText="'key'"
                        :filterAble="true"
                        :displayText="'display'"
                        @handleValueChange="handleValueChangeCombobox">
                        </BaseComboBox>
                    </div>
                </div>
            </template>
            <template #item="{key, value}">
                <div v-if="key == 'ChangeByTime'" :class="[value == true ? 'icon-checked': 'icon-unchecked']" style="margin: auto;"></div>
                <div v-if="key == 'AllowedChange'" :class="[value == true ? 'icon-checked': 'icon-unchecked']" style="margin: auto;"></div>
                <div v-if="key == 'Materials'">Chưa thiết lập</div>
                <div v-if="key == 'HideInMenu'" :class="[value ==  true ? 'icon-checked' : 'icon-unchecked' ]" style="margin: auto;"></div>
                <div v-if="key == 'InActive'" :class="[value == true ? 'icon-checked': 'icon-unchecked']" style="margin: auto;"></div>
            </template>
            <template #table-footer>
                <div class="table-footer">
                    <div class="left-footer">
                        <BasePagination
                        v-model="pageIndex"
                        :pageCount="pageCount"
                        class="mr-16"
                        @btnReloadOnClick="btnReloadOnClick"
                        ></BasePagination>
                        <BaseComboBox 
                        class="ml-16"
                        style="width: 60px; height: 24px;"
                        v-model="numberItem"
                        :data="numberItemOption"
                        :keyText="'key'"
                        :displayText="'display'"
                        :type="'dropup'"
                        :styleForInput="'custom-ms-combobox-filter-light'">
                        </BaseComboBox>
                    </div>
                    <div class="right-footer mr-16">
                        <span v-if="foods.length == numberItem">Hiển thị {{foods.length * (pageIndex - 1) + 1}} - {{numberItem * pageIndex}} trên {{totalRecord}} kết quả</span>
                        <span v-else-if="foods.length > 0 && foods.length < numberItem">Hiển thị {{numberItem * (pageIndex - 1) + 1}} - {{numberItem * (pageIndex -1) + foods.length}} trên {{totalRecord}} kết quả</span>
                        <span v-else>Không có dữ liệu</span>
                    </div>
                </div>
            </template>
            </BaseTable>
        </div>
    </div>
    <!-- Modal Detail -->
    <FoodDetail 
    v-if="isShowFoodDetail" 
    :FormMode="formMode"
    @insertFood="resetFilter"
    @updateFood="loadListFood"
    @btnCloseModalOnClick="btnCloseModalOnClick"
    :foodSelectedID="foodSelectedID"/>
    <!-- Confirm Delete Dialog -->
    <ConfirmDeleteModal
    v-if="IsShowCfDialog"
    @closeCfDialog="closeCfDialog"
    @handleSubmit="deleteFood"
    :message="messageCf"/>
    <!-- Option Menu -->
    <div 
        v-if="isShowOptionMenu"
        class="option-menu"
        :style="{ position: 'fixed', top: `${positionTop}px`, left: `${positionLeft}px` }"
        v-click-outside="() => (this.isShowOptionMenu = false)">
        <div>
            <div class="option-menu-item"
                @click="() => {this.isShowOptionMenu = false; this.btnAddOnClick();}">
                <div class="option-menu-icon">
                    <div class="icon-new-item mr-4"></div>
                </div>
                <div class="toolbar-button-text">Thêm thực đơn</div>
            </div>
            <div class="option-menu-item"
                @click="() => {this.isShowOptionMenu = false; this.btnNhanBanOnClick();}">
                <div class="option-menu-icon">
                    <div class="icon-replication mr-4"></div>
                </div>
                <div class="toolbar-button-text">Nhân bản</div>
            </div>
            <div class="option-menu-item"
                @click="() => {this.isShowOptionMenu = false; this.btnEditOnClick();}">
                <div class="option-menu-icon">
                    <div class="icon-update mr-4"></div>
                </div>
                <div class="toolbar-button-text">Sửa</div>
            </div>
            <div class="option-menu-item"
                @click="() => {this.isShowOptionMenu = false; this.btnDeleteOnClick();}">
                <div class="option-menu-icon">
                    <div class="icon-delete mr-4"></div>
                </div>
                <div class="toolbar-button-text">Xóa</div>
            </div>
            <div style="margin: 2px;" class="option-menu-sepatator"></div>
            <div class="option-menu-item"
                @click="() => {this.isShowOptionMenu = false; this.btnReloadOnClick();}">
                <div class="option-menu-icon">
                    <div class="icon-reload mr-4"></div>
                </div>
                <div class="toolbar-button-text">Nạp</div>
            </div>
            <div style="margin: 2px;" class="option-menu-sepatator"></div>
            <div class="option-menu-item"
                @click="() => {this.isShowOptionMenu = false; this.btnExportOnClick();}">
                <div class="option-menu-icon">
                    <div class="icon-export mr-4"></div>
                </div>
                <div class="toolbar-button-text">Xuất khẩu</div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseButton from '../../base/BaseButton.vue'
import BaseTable from '../../base/BaseTable.vue'
import BaseComboBox from '../../base/BaseComboBox.vue'
import BaseInput from '../../base/BaseInput.vue'
import BaseInputInt from '../../base/BaseInputInt.vue'
import FoodApi from '../../../api/FoodApi'
import BasePagination from '../../base/BasePagination.vue'
import BaseDropdown from '../../base/BaseDropdown.vue'
import {FilterType, ConfirmType} from '../../../enums/MISAEnum'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css';
import FoodDetail from './FoodDetail.vue'
import {FormMode} from '../../../enums/MISAEnum'
import ConfirmDeleteModal from '../../base/ConfirmDeleteModal.vue'
import vClickOutside from 'click-outside-vue3'
import {messageToastFood} from '../../../resources/Messages'

export default {
    name: "FoodList",
    components: {
        BaseButton,
        BaseTable,
        BaseComboBox,
        BaseInput,
        BasePagination,
        BaseDropdown,
        BaseComboBox,
        BaseInputInt,
        Loading,
        FoodDetail,
        ConfirmDeleteModal
    },
    data() {
        return {
            // Biến lưu message cho confirm dialog
            messageCf: null,
            // Biến xác định confirm dialog mở hay đóng
            IsShowCfDialog: false,
            // Biến lưu ID của thực đơn được chọn
            foodSelectedID: null,
            // Biến xác định form thông tin thực đơn có mở không
            isShowFoodDetail: false,
            // Biến kiểm tra xem thông tin lọc có thay đổi không
            isFilterInfoChange: false,
            // Biến kiểm tra có mở loading không
            isLoading: false,
            // Biến lưu header trên data table
            headers: [
                { text: 'Mã món ăn', align: 'left', value: 'FoodCode', width: 180},
                { text: 'Tên món ăn', align: 'left', value: 'FoodName', width: 180},
                { text: 'Nhóm thực đơn', align: 'left', value: 'FoodCategoryName', width: 160},
                { text: 'Đơn vị tính', align: 'left', value: 'FoodUnitName', width: 100},
                { text: 'Giá bán', align: 'right', value: 'FoodPrice', width: 120, type: 'Money'},
                { text: 'Thay đổi theo thời giá', align: 'center', value: 'ChangeByTime', width: 160},
                { text: 'Điều chỉnh giá tự do', align: 'center', value: 'AllowedChange', width: 160},
                { text: 'Định lượng NVL', align: 'left', value: 'Materials', width: 160},
                { text: 'Không hiển thị trên thực đơn', align: 'center', value: 'HideInMenu', width: 190},
                { text: 'Ngừng bán', align: 'center', value: 'InActive', width: 120},
            ],
            // Biến lưu món ăn đang được chọn
            foodSelected: null,
            // Biến lưu số bản ghi trên 1 trang
            numberItem: 25,
            // Biến lưu danh sách option bản ghi trên 1 trang
            numberItemOption:[
                    {
                        key: 25,
                        display: '25',
                    },
                    {
                        key: 50,
                        display: '50',
                    },
                    {
                        key: 100,
                        display: '100'
                    },
                ],
            foods: [],
            // Biến lưu trang hiện tại
            pageIndex: 1,
            // Biến lưu tổng số trang
            pageCount: 0,
            // Biến lưu tổng số bản ghi 
            totalRecord: 0,
            // Biến lưu thông tin filter
            filterInfo: [
                {operator: FilterType.CONTAIN, value: null, property: 'FoodCode', type: 'string'},
                {operator: FilterType.CONTAIN, value: null, property: 'FoodName', type: 'string'},
                {operator: FilterType.CONTAIN, value: null, property: 'FoodCategoryName', type: 'string'},
                {operator: FilterType.CONTAIN, value: null, property: 'FoodUnitName', type: 'string'},
                {operator: FilterType.LESS_OR_EQUAL, value: '', property: 'FoodPrice', type: 'int'},
                {operator: FilterType.EQUAL, value: null, property: 'ChangeByTime', type: 'boolean'},
                {operator: FilterType.EQUAL, value: null, property: 'AllowedChange', type: 'boolean'},
                {operator: FilterType.EQUAL, value: null, property: 'HideInMenu', type: 'boolean'},
                {operator: FilterType.EQUAL, value: null, property: 'InActive', type: 'boolean'},
            ],
            // Biến lưu các option cho các cột filter có kiểu là chuỗi
            optionsFilterForString: [
                {key: FilterType.CONTAIN, display: '∗'},
                {key: FilterType.EQUAL, display: '='},
                {key: FilterType.START_WITH, display: '+'},
                {key: FilterType.END_WITH, display: '-'},
                {key: FilterType.NOT_CONTAIN, display: '!'},
            ],
            // Biến lưu các option cho các cột filter có kiểu là số
            optionsFilterForNumber: [
                {key: FilterType.EQUAL, display: '='},
                {key: FilterType.LESS, display: '<'},
                {key: FilterType.LESS_OR_EQUAL, display: '≤'},
                {key: FilterType.BIGGER, display: '>'},
                {key: FilterType.BIGGER_OR_EQUAL, display: '≥'},
            ],
            // Biến lưu các option cho các cột filter có kiểu là số
            optionsFilterForBoolean: [
                {key: ConfirmType.No, display: 'Không'},
                {key: ConfirmType.Yes, display: 'Có'},
            ],
            // Biến lưu cột đang được sắp xếp
            columnSorted: null,
            // Biến xác định form thêm mới hay sửa (0 là thêm mới, 1 là sửa)
            formMode: null,
            // Biến xác định xóa nhiều hay 1
            isDeleteMultiple: false,
            // Biến lưu danh sách thực đơn được chọn
            foodsSelected: [],
            // Biến lưu vị khi right click vào table
            positionTop: null,
            positionLeft: null,
            // Biến xác định option menu mở hay đóng
            isShowOptionMenu: false
        }
    },
    watch: {
        foodsSelected: function(value) {
            console.log(value);
        },
        /**
         * Hàm xử lý khi thông tin lọc thay đổi
         * Author: Nguyễn Hoàng Anh (16/8/2022)
         */
        filterInfo: {
            handler: function(value){
                this.isFilterInfoChange = true;
            },
            deep: true
        },
        /**
         * Hàm xử lý khi số bản ghi trên 1 trang thay đổi
         * Author: Nguyễn Hoàng Anh (16/8/2022)
         */
        numberItem: function(value) {
            this.numberItem = value;
            this.pageIndex = 1;
            this.loadListFood();
        },
        /**
         * Hàm xử lý khi trang hiện tại thay đổi
         * Author: Nguyễn Hoàng Anh (16/8/2022)
         */
        pageIndex: function(value) {
            if (value > 0) {
                this.pageIndex = value;
                this.loadListFood();
            }
        }
    },
    methods: {
        /**
         * Hàm hiển thị toast thành công
         * Author: Nguyễn Hoàng Anh (30/8/2022)
         */
         toastSuccessMessage(msg) {
            try {
                this.$message({
                    message: msg,
                    type: 'success',
                });
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm hiển thị toast không thành công
         * Author: Nguyễn Hoàng Anh (30/8/2022)
         */
        toastErrorMessage(msg) {
            try {
                this.$message({
                    message: msg,
                    type: 'error',
                });
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi click button export
         * Author: Nguyễn Hoàng Anh (29/8/2022)
         */
        btnExportOnClick(){
            var filters = this.filterInfo.filter(item => item.value != null);
            FoodApi.export(filters, this.pageIndex, this.numberItem, this.columnSorted).then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Danh_sach_thuc_don.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL (link.href); // release the URL object
                document.body.removeChild(link);
            }).
            catch((res) => {
                alert(res.data);
                console.log(res);
            })
        },
        /**
         * Hàm show context menu
         * Author: Nguyễn Hoàng Anh (28/8/2022)
         */
        showContextMenu(event, item) {
            try {
                this.positionLeft = event.pageX;
                this.positionTop = event.pageY;
                this.isShowOptionMenu = true
                this.foodSelectedID = item.FoodID;
                this.foodSelected = item;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xóa thực đơn
         * Author: Nguyễn Hoàng Anh (23/8/2022)
         */
        deleteFood() {
            try {
                if (this.isDeleteMultiple == false){
                    FoodApi.delete(this.foodSelectedID).then((res) => {
                        this.loadListFood();
                        this.toastSuccessMessage(messageToastFood.deleteSuccess)
                    }).
                    catch((err) => {
                        console.log(err);
                    })
                }
                else if (this.isDeleteMultiple == true){
                    var foodIdsSelectd= [];
                    this.foodsSelected.forEach(element => {
                        foodIdsSelectd.push(element.FoodID);
                    });

                    FoodApi.deleteMultiple(foodIdsSelectd).then((res) => {
                        this.loadListFood();
                        this.foodSelectedID= []
                        this.toastSuccessMessage(messageToastFood.deleteListSuccess)
                    }).
                    catch((err) => {
                        console.log(err);
                    })
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm đóng confirm dialog
         * Author: Nguyễn Hoàng Anh (25/7/2022)
         */
        closeCfDialog(isShow){
            try {
                this.IsShowCfDialog = isShow;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi click vào nút xóa
         * Author: Nguyễn Hoàng Anh (24/8/2022)
         */
        btnDeleteOnClick() {
            try {
                if (this.foodsSelected.length > 1) {
                    this.isDeleteMultiple = true;
                    this.messageCf = `Bạn có chắc chắn muốn xóa các món đã chọn không?`
                    this.IsShowCfDialog = true;
                }
                else {
                    this.isDeleteMultiple = false;
                    this.messageCf = `Bạn có thực sự muốn xóa món <${this.foodSelected.FoodCode} - ${this.foodSelected.FoodName}> không?`
                    this.IsShowCfDialog = true;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi click nút nhân bản
         * Author: Nguyễn Hoàng Anh (24/8/2022)
         */
        btnNhanBanOnClick() {
            try {
                this.formMode = FormMode.REPLICATION;
                this.isShowFoodDetail = true;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi click vào nút sửa
         * Author: Nguyễn Hoàng Anh (24/8/2022)
         */
        btnEditOnClick() {
            try {
                this.formMode = FormMode.EDIT;
                this.isShowFoodDetail = true
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm reser thông tin filter và load lại trang
         * Author: Nguyễn Hoàng Anh (23/8/2022)
         */
        resetFilter() {
            this.filterInfo = [
                {operator: FilterType.CONTAIN, value: null, property: 'FoodCode', type: 'string'},
                {operator: FilterType.CONTAIN, value: null, property: 'FoodName', type: 'string'},
                {operator: FilterType.CONTAIN, value: null, property: 'FoodCategoryName', type: 'string'},
                {operator: FilterType.CONTAIN, value: null, property: 'FoodUnitName', type: 'string'},
                {operator: FilterType.LESS_OR_EQUAL, value: '', property: 'FoodPrice', type: 'int'},
                {operator: FilterType.EQUAL, value: null, property: 'ChangeByTime', type: 'boolean'},
                {operator: FilterType.EQUAL, value: null, property: 'AllowedChange', type: 'boolean'},
                {operator: FilterType.EQUAL, value: null, property: 'HideInMenu', type: 'boolean'},
                {operator: FilterType.EQUAL, value: null, property: 'InActive', type: 'boolean'},
            ];
            this.$refs.tableListFoodRef.columnSorted = {property: null, direction: null};
            this.columnSorted = null;
            this.pageIndex = 1;
            this.loadListFood();
        },
        /**
         * Hàm xử lý khi click vào dòng trên bảng danh sách món ăn
         * Author: Nguyễn Hoàng Anh (22/8/2022)
         */
        rowOnClick(item) {
            try {
                this.foodSelectedID = item.FoodID;
                this.foodSelected = item;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi double click vào dòng trên bảng danh sách món ăn
         * Author: Nguyễn Hoàng Anh (22/8/2022)
         */
        rowOnDbClick(item) {
            try {
                this.formMode = FormMode.EDIT;
                this.foodSelectedID = item.FoodID;
                this.isShowFoodDetail = true
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi click vào nút close
         * Author: Nguyễn Hoàng Anh (18/8/2022)
         */
        btnCloseModalOnClick() {
            this.isShowFoodDetail = false;
        },
        /**
         * Hàm xử lý khi click vào add thực đơn mới
         * Author: Nguyễn Hoàng Anh (18/8/2022)
         */
        btnAddOnClick() {
            try {
                this.formMode = FormMode.INSERT;
                this.isShowFoodDetail = true;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi ấn vào nút reload
         * Author: Nguyễn Hoàng Anh (16/8/2022)
         */
        btnReloadOnClick(){
            this.loadListFood();
        },
        /**
         * Hàm xử lý khi dữ liệu input filter thay đổi
         * Author: Nguyễn Hoàng Anh (16/8/2022)
         */
        handleValueChangeInput() {
            if (this.isFilterInfoChange == true) {
                this.pageIndex = 1;
                this.loadListFood();
            }
        },
        /**
         * Hàm xử lý khi dữ liệu dropdown filter thay đổi
         * Author: Nguyễn Hoàng Anh (16/8/2022)
         */
        handleValueChangeDropdown(value) {
            this.$nextTick(() => {this.isFilterInfoChange = false})
            if(value) {
                this.pageIndex = 1;
                this.loadListFood();
            }
        },
        /**
         * Hàm xử lý khi dữ liệu combobox filter thay đổi
         * Author: Nguyễn Hoàng Anh (16/8/2022)
         */
        handleValueChangeCombobox(value) {
            this.pageIndex = 1;
            this.loadListFood();
        },
        /**
         * Hàm xử lý khi ấn enter vào ô filter
         * Author: Nguyễn Hoàng Anh (15/8/2022)
         */
        handleSubmitValueFilter() {
            if (this.isFilterInfoChange == true) {
                this.pageIndex = 1;
                this.loadListFood();
            }
        },
        /**
         * Hàm sắp xếp khi click vào cột
         * @param {*} value // Cột được sắp xếp
         * Author: Nguyễn Hoàng Anh (15/8/2022) 
         */
        btnTableHeaderOnClick(value) {
            this.columnSorted = value;
            this.loadListFood();
        },
        /**
         * Load danh sách thực đơn (phân trang)
         * Author: Nguyễn Hoàng Anh (15/8/2022)
         */
        loadListFood() {
            this.isLoading = true;
            var filters = this.filterInfo.filter(item => item.value != null);
            FoodApi.filter(filters, this.pageIndex, this.numberItem, this.columnSorted).then((res) => {
                this.foods = res.data.Data;
                if (this.foods.length > 0) {
                    this.foodSelectedID = this.foods[0].FoodID;
                    this.foodSelected = this.foods[0];
                }
                this.pageCount = res.data.TotalPage;
                this.totalRecord = res.data.TotalRecord;
                this.isLoading = false;
                this.isFilterInfoChange = false
            },(err) => {
                this.isLoading = false;
                console.log(err);
            });
        }
    },
    created() {
        this.loadListFood();
    },
    /**
     * Phát hiện khi click ra ngoài
     * Author: Nguyễn Hoàng Anh (8/1/2022)
     */
    directives: {
      clickOutside: vClickOutside.directive
    },
}
</script>

<style>
#page-food-list{
    width: 100%;
    height: 100%;
}

.ms-toolbar {
    display: flex;
    background-color: #ededed!important;
    background-image: linear-gradient(#f9f9f9,#e3e4e6);
    padding: 2px;
    border: 1px solid;
    border-color: #c5c5c5;
    justify-content: start;
}

.ms-toolbar>button {
    margin-right: 9px;
}

.food-list {
    width: 100%;
    height: calc(100% - 28px);
}

.table-footer {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.left-footer {
   width: max-content;
   height: 100%;
   display: flex;
   align-items: center;
}

.custom-ms-combobox-filter-light {
    font-size: 13px !important;
    background-color: #f2f2f2 !important;
}

.option-menu {
  background-color: #fff;
  width: 128px;
  border: 1px solid #e1e1e1;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.option-menu-item {
  display: flex;
  height: 24px;
  align-items: center;
  padding: 0 5px;
  cursor: pointer;
}

.option-menu-item:hover {
  background-color: #dee8f6;
}

.option-menu-sepatator {
  height: 1px;
  border-top: 1px solid #e1e1e1;
}
</style>