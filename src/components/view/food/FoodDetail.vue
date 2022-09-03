<template>
    <BaseModal @keydown="shortKeyEvent"
    v-model="isShowModal"
    :title="titleModal"
    :isDrag="true"
    @btnCloseModalOnClick="btnCloseModalOnClick">
        <template #modal_content>
            <div class="modal_content">
                <BaseTabNav :tabs="tabs" :tabSelected="tabSelected" @setSelectedTab="setSelectedTab">
                    <BaseTab :isSelected="tabSelected === 'Thông tin chung'">
                        <div class="form-food">
                            <div class="form-food-detail">
                                <BaseInput @handleBlur="handelBlurInputFoodName" ref="inputFoodNameRef" style="padding-bottom: 5px;" v-model="food.FoodName" :label="'Tên món'" :require="true"></BaseInput>
                                <BaseInput ref="inputFoodCodeRef" style="padding-bottom: 5px;" v-model="food.FoodCode" :label="'Mã món'" :require="true"></BaseInput>
                                <div style="min-width: 24px; min-height: 24px; width: 100%;padding-bottom: 5px;">
                                    <BaseComboBox
                                    ref="inputFoodCategoryRef"
                                    v-model="food.FoodCategoryID"
                                    :data="foodCategorys"
                                    :keyText="'FoodCategoryID'"
                                    :filterAble="true"
                                    :displayText="'FoodCategoryName'"
                                    :label="'Nhóm thực đơn'">
                                        <template #option>
                                            <div @click="btnOpenFormAddFoodCategoryOnClick" class="icon-add"></div>
                                        </template>
                                    </BaseComboBox>
                                </div>
                                <div style="min-width: 24px; min-height: 24px; width: 100%;padding-bottom: 5px;">
                                    <BaseComboBox
                                    ref="inputFoodUnitRef"
                                    v-model="food.FoodUnitID"
                                    :data="foodUnits"
                                    :keyText="'FoodUnitID'"
                                    :filterAble="true"
                                    :displayText="'FoodUnitName'"
                                    :label="'Đơn vị tính'"
                                    :require="true">
                                        <template #option>
                                            <div @click="btnOpenFormAddFoodUnitOnClick" class="icon-add"></div>
                                        </template>
                                    </BaseComboBox>
                                </div>
                                <div style="display: flex; align-items: center ;padding-bottom: 5px;">
                                    <BaseInputInt @handleBlur="handleBlurInputFoodPrice" ref="inputFoodPriceRef" :isMoney="true" style="width: 240px;" v-model="food.FoodPrice" :label="'Giá bán'" :require="true"></BaseInputInt>
                                    <BaseCheckBox ref="inputChangeByTimeRef" class="ml-16" v-model="food.ChangeByTime" :label="'Thay đổi theo thời giá'"></BaseCheckBox>
                                </div>
                                <div style="display: flex; align-items: center; padding-bottom: 5px;">
                                    <BaseInputInt @handleBlur="handleBlurInputFoodOutwardPrice" ref="inputFoodOutwardPriceRef" :isMoney="true" style="width: 240px;" v-model="food.FoodOutwardPrice" :label="'Giá vốn'"></BaseInputInt>
                                    <BaseCheckBox ref="inputAllowedChangeRef" class="ml-16" v-model="food.AllowedChange" :label="'Điều chỉnh giá tự do'"></BaseCheckBox>
                                </div>
                                <BaseTextarea ref="inputFoodDescriptionRef" style="padding-bottom: 5px;" v-model="food.FoodDescription" :label="'Mô tả'"></BaseTextarea>
                                <div style="min-width: 24px; min-height: 24px; width: 100%;padding-bottom: 5px;">
                                    <BaseComboBox
                                    ref="inputKitchenRef"
                                    v-model="food.KitchenID"
                                    :data="kitchens"
                                    :keyText="'KitchenID'"
                                    :filterAble="true"
                                    :displayText="'KitchenName'"
                                    :label="'Chế biến tại'">
                                        <template #option>
                                            <div @click="btnOpenFormAddKitchenOnClick" class="icon-add"></div>
                                        </template>
                                    </BaseComboBox>
                                </div>
                                <div style="padding-left: 125px; margin-top: 4px;">
                                    <BaseCheckBox ref="inputHideInMenuRef" class="mb-8" v-model="food.HideInMenu" :label="'Không hiển thị trên thực đơn'"></BaseCheckBox>
                                    <BaseCheckBox v-if="formMode == 1" ref="inputInActiveRef" class="mb-8" v-model="food.InActive" :label="'Ngừng bán'"></BaseCheckBox>
                                </div>
                            </div>
                            <div class="form-food-image">
                                <fieldset class="container-food-image">
                                    <legend class="title-image">Ảnh đại diện</legend>
                                    <div class="content-image">
                                        <div class="left-content-image">
                                            <div style="position: relative; width: 100%; height: 120px;">
                                                <img :src="urlFileImage" style="width: 100%; height: 100%;"/>
                                                <BaseButton style="width: 110px; height: 25px; position: absolute; top: 0; color: #026b97;" 
                                                :text="'Biểu tượng'"
                                                :icon="'icon-pen'"></BaseButton>
                                            </div>
                                            <div style="text-align: center; font-size: 12px; margin-top: 8px;" >
                                                Chọn các ảnh có định dạng <br><b style="margin-top: 4px;">(.jpg, .jpeg, .png, .gif)</b>
                                            </div>
                                            <div style="text-align: center; font-size: 12px; margin-top: 16px;">
                                                <a class="btn-chose-from-library">
                                                    Chọn từ thư viện ảnh
                                                </a>
                                            </div>
                                        </div>
                                        <div class="right-content-image ml-4">
                                            <div class="tooltip">
                                                <BaseButton @handleClick="btnOpenFileOnClick" style="width: 27px; height: 25px; font-weight: bold;" :text="'...'"></BaseButton>
                                                <input v-on:change="fileImageOnChange($event)" style="display: none;" type="file" accept="image/*" ref="inputOpenFileRef"/>
                                                <div class="tooltiptext" style="left: 125%; top: 0;">Bấm vào đây để chọn ảnh</div>
                                            </div>
                                            <div class="tooltip">
                                                <BaseButton @handleClick="btnDeleteFileOnClick" style="width: 27px; height: 25px; padding-left: 13px; margin-top: 4px;" :icon="'icon-delete'"></BaseButton>
                                                <div class="tooltiptext" style="left: 125%; top: 4px;">Xóa ảnh</div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </BaseTab>
                    <BaseTab :isSelected="tabSelected === 'Sở thích phục vụ'">
                        <div class="form-food-addition">
                            <div class="mb-8">
                                <span>Món ăn: <b>{{food.FoodName}}</b></span>
                            </div>
                            <div class="suggestion icon-info-2 mb-8">
                                Ghi lại các sở thích của khách hàng giúp nhân viên phục vụ chọn nhanh order. 
                                <br/>
                                 VD: không cay/ít hành/thêm phomai...
                            </div>
                            <BaseTable style="height: 250px; border-top: 1px solid #c1c1c1;"
                            :headers="headers"
                            :items="food.FoodAdditions"
                            :keyId="'FoodAdditionID'"
                            :isShowFooter="false">
                                <template #body>
                                    <tr class="ms-body-tr"
                                    v-for="(item, index) in food.FoodAdditions">
                                        <td :class="{'cell-selected': rowSelected == index &&  colSelected == 0 }" class="ms-body-td">
                                           <BaseComboBoxTable style="height: 24px;"
                                           @click="rowOnClick(index, 0)"
                                           v-model="item.FoodAdditionDescription"
                                           :data="foodAdditions"
                                           :value="formatMoneyToDouble(item.FoodAdditionPrice)"
                                           :displayText="'FoodAdditionDescription'"
                                           :valueText="'FoodAdditionPrice'"
                                           :filterAble="true"
                                           ref="comboBoxRef"
                                           @handleValueChange="handleValueChangeFoodAddition"
                                           @handleAddOnclick="btnOpenFormAddFoodAdditionOnClick">
                                                <template #headerItem>
                                                    <div class="header-items">
                                                        <div style="text-align: center; width: 60%;">Sở thích phục vụ</div>
                                                        <div style="text-align: center; width: 40%;">Thu thêm</div>
                                                    </div>
                                                </template>
                                                <template #itemComboBox="{item}">
                                                    <div class="list-item-combobox">
                                                        <div class="item-combobox" style="width: 60%;">{{item.FoodAdditionDescription}}</div>
                                                        <div class="item-combobox" style="text-align: right; width: 40%;">{{formatMoney(item.FoodAdditionPrice)}}</div>
                                                    </div>
                                                </template>
                                           </BaseComboBoxTable> 
                                        </td>
                                        <td :class="{'cell-selected': rowSelected == index &&  colSelected == 1 }" v-if="item.FormMode != 2" class="ms-body-td">
                                            <BaseInputIntTable 
                                            @click="rowOnClick(index, 1)" 
                                            @handleBlur="handleBlurFoodAdditionPrice(index)" 
                                            :isMoney="true" 
                                            v-model="item.FoodAdditionPrice"></BaseInputIntTable>
                                        </td>
                                        <!-- <td @click="rowOnClick(index, 0)" class="ms-body-td">{{item.FoodAdditionDescription}}</td>
                                        <td @click="rowOnClick(index, 1)" class="ms-body-td">{{item.FoodAdditionPrice}}</td> -->
                                    </tr>
                                </template>
                            </BaseTable>
                            <div style="padding: 2px; display: flex;">
                                <BaseButton @handleClick="btnAddRowOnclick" style="width: 100px; height: 25px;" :text="'Thêm dòng'" :icon="'icon-new-item'"></BaseButton>
                                <BaseButton @handleClick="btnDeleteRowOnclick" :disable="!food.FoodAdditions || rowSelected < 0" class="ml-4" style="width: 100px; height: 25px;" :text="'Xóa dòng'" :icon="'icon-delete'"></BaseButton>
                            </div>
                        </div>
                    </BaseTab>
                </BaseTabNav>
            </div>
        </template>
        <template #modal_footer>
            <div class="modal_footer">
                <div class="modal_left_footer">
                    <BaseButton style="width: 75px; height: 25px;" :text="'Giúp'" :icon="'icon-help'"></BaseButton>
                </div>
                <div class="modal_right_footer">
                    <BaseButton data-c-tooltip="Cất (Ctrl + s)" tooltip-position ="bottom" @handleClick="btnSaveOnClick" style="width: 86px; height: 25px;" :text="'Cất'" :icon="'icon-save'"></BaseButton>
                    <BaseButton data-c-tooltip="Cất & Thêm (Ctrl + Alt + s)" tooltip-position ="bottom" @handleClick="btnSaveAndNewOnClick" class="ml-8" style="width: 123px; height: 25px;" :text="'Cất & Thêm'" :icon="'icon-save-add'"></BaseButton>
                    <BaseButton data-c-tooltip="Hủy bỏ (Ctrl + b)" tooltip-position ="bottom" @handleClick="btnCancelOnClick" class="ml-8" style="width: 91px; height: 25px;" :text="'Hủy bỏ'" :icon="'icon-cancel'"></BaseButton>
                </div>
            </div>
        </template>
    </BaseModal>
    <!-- Message Box -->
    <MessageBox
        v-if="isShowMessageBox"
        :msg="message"
        :isWarning="isWarning"
        @closeMessageBox="closeMessageBox"
    ></MessageBox>
    <!-- Save Change Dialog -->
    <SaveChangeModal
        v-if="isShowChangeDialog"
        @cancelDialog="btnCancelOnClick"
        @closeDialog="closeChangeDialog"
        @submitDialog="btnSaveOnClick"
    ></SaveChangeModal>
    <!-- Form Add FoodCategory -->
    <AddFoodCategory
        v-if="isShowFormAddFoodCategory"
        @closeDialog="closeFormAddFoodCategory"
        @insertFoodCategory="insertFoodCategory">
    </AddFoodCategory>
    <!-- Form Add FoodUnit -->
    <AddFoodUnit
        v-if="isShowFormAddFoodUnit"
        @closeDialog="closeFormAddFoodUnit"
        @insertFoodUnit="insertFoodUnit">
    </AddFoodUnit>
    <!-- Form Add Kitchen -->
    <AddKitchen
        v-if="isShowFormAddKitchen"
        @closeDialog="closeFormAddKitchen"
        @insertKitchen="insertKitchen">
    </AddKitchen>
    <!-- Form Add FoodAddition -->
    <AddFoodAddition
        v-if="isShowFormAddFoodAddition"
        @closeDialog="closeFormAddFoodAddition"
        @insertFoodAddition="insertFoodAddition">
    </AddFoodAddition>
</template>

<script>
import BaseModal from '../../base/BaseModal.vue'
import BaseTabNav from '../../base/BaseTabNav.vue'
import BaseTab from '../../base/BaseTab.vue'
import BaseInput from '../../base/BaseInput.vue'
import BaseInputInt from '../../base/BaseInputInt.vue'
import BaseButton from '../../base/BaseButton.vue'
import BaseComboBox from '../../base/BaseComboBox.vue'
import BaseTextarea from '../../base/BaseTextarea.vue'
import BaseCheckBox from '../../base/BaseCheckBox.vue'
import BaseComboBoxTable from '../../base/BaseComboBoxTable.vue'
import BaseInputIntTable from '../../base/BaseInputIntTable.vue'
import FoodCategoryApi from '../../../api/FoodCategoryApi'
import FoodUnitApi from '../../../api/FoodUnitApi'
import KitchenApi from '../../../api/KitchenApi'
import BaseTable from '../../base/BaseTable.vue'
import FoodApi from '../../../api/FoodApi'
import FoodAdditionApi from '../../../api/FoodAdditionApi'
import MessageBox from '../../base/MessageBox.vue'
import {FormMode} from '../../../enums/MISAEnum'
import SaveChangeModal from '../../base/SaveChangeModal.vue'
import AddFoodCategory from './AddFoodCategory.vue'
import AddFoodUnit from './AddFoodUnit.vue'
import AddKitchen from './AddKitchen.vue'
import AddFoodAddition from './AddFoodAddition.vue'
import {messageValidateFood, messageToastFood} from '../../../resources/Messages'

export default {
    components: {
        BaseModal,
        BaseTabNav,
        BaseTab,
        BaseInput,
        BaseInputInt,
        BaseButton,
        BaseComboBox,
        BaseTextarea,
        BaseCheckBox,
        BaseTable,
        BaseComboBoxTable,
        BaseInputIntTable,
        MessageBox,
        SaveChangeModal,
        AddFoodCategory,
        AddFoodUnit,
        AddKitchen,
        AddFoodAddition
    },
    emits: ['btnCloseModalOnClick','insertFood','updateFood'],
    watch: {
        food: {
            handler: function(value){
                this.isFoodInfoChange = true;
            },
            deep: true
        },
        formMode: function(value) {
            if (value == FormMode.EDIT) {
                this.titleModal = "Cập nhật món ăn"
            }
            else
                this.titleModal = "Thêm mới món ăn"
        }
    },
    props: {
        foodSelectedID: {

        },
        FormMode: {

        }
    },
    data() {
        return {
            // Biến kiểm tra form chi tiết thực đơn có thay đổi không
            isFoodInfoChange: false,
            // Biến xác định change dialog mở hay đóng
            isShowChangeDialog: false,
            // Biến xác định có hiển thị form thông tin thực đơn không
            isShowModal: true,
            // Biến lưu danh sách tiêu đề của các tab
            tabs: ['Thông tin chung', 'Sở thích phục vụ'],
            // Biến lưu tab đang được chọn
            tabSelected: 'Thông tin chung',
            // Biến lưu thông tin món ăn
            food: {
                FoodAdditions: []
            },
            // Biến lưu danh sách nhóm thực đơn
            foodCategorys: [],
            // Biến lưu danh sách đơn vị tính
            foodUnits: [],
            // Biến lưu danh sách nơi chế biên
            kitchens: [],
            // Biến lưu header trên data table
            headers: [
                { text: 'Sở thích phục vụ', align: 'left', value: 'FoodAdditionDescription', width: 480},
                { text: 'Thu thêm', align: 'right', value: 'FoodAdditionPrice', width: 240},
            ],
            // Biến lưu danh sách sở thích
            foodAdditions: [],
            // Biến lưu dòng đang được chọn
            rowSelected: -1,
            // Biến lưu cột đang được chọn
            colSelected: -1,
            // Biến xác định modal message box mở hay đóng
            isShowMessageBox: false,
            // Biến lưu tin nhắn thông báo cho message box
            message: null,
            // Biến xác định kiểu message box
            isWarning: true,
            // Biến lưu input không hợp lệ để focus sau khi validate
            inputNotValid: null,
            // Biến lưu danh sách combobox trên form sở thích phục vụ
            listComboboxRef: [],
            // Biến lưu địa chỉ ảnh mặc định
            defaultImage: './src/assets/img/ImageHandler.png',
            // Biến lưu url ảnh để binding lên img avatar
            urlFileImage: this.defaultImage,
            // Biến xác định form thêm mới hay sửa (0 là thêm mới, 1 là sửa)
            formMode: this.FormMode,
            // Biến xác định form thêm mới nhóm thực đơn mở hay đóng
            isShowFormAddFoodCategory: false,
            // Biến xác định form thêm mới đơn vị tính mở hay đóng
            isShowFormAddFoodUnit: false,
            // Biến xác định form thêm mới nơi chế biến mở hay đóng
            isShowFormAddKitchen: false,
            // Biến xác định form thêm mới sở thích phục vụ mở hay đóng
            isShowFormAddFoodAddition: false,
            // Biến lưu file ảnh
            fileImage: null,
            // Biến lưu title của modal
            titleModal: null
        }
    },
    methods: {
        /**
         * Hàm xử lý khi thêm mới sở thích phục vụ
         * @param {*} foodAddition sở thích phục vụ mới 
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        insertFoodAddition(foodAddition) {
            try {
                // Lấy danh sách sở thích phục vụ
                FoodAdditionApi.getAll().then((res) => {
                    this.foodAdditions = res.data
                    this.food.FoodAdditions[this.rowSelected].FoodAdditionDescription = foodAddition.FoodAdditionDescription;
                    this.food.FoodAdditions[this.rowSelected].FoodAdditionPrice = foodAddition.FoodAdditionPrice;
                    this.$refs.comboBoxRef[this.rowSelected].$refs.inputFilterRef.focus();
                })
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm mở form thêm mới sở thích phục vụ
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        btnOpenFormAddFoodAdditionOnClick() {
            try {
                this.isShowFormAddFoodAddition = true;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm đóng form thêm mới sở thích phục vú
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        closeFormAddFoodAddition() {
            try {
                this.isShowFormAddFoodAddition = false;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi thêm mới nơi chế biến
         * @param {*} kitchen nơi chế biến mới 
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        insertKitchen(kitchen) {
            try {
                // Lấy danh sách nơi chế biến
                KitchenApi.getAll().then((res) => {
                    this.kitchens = res.data
                    this.food.KitchenID = kitchen.KitchenID;
                    this.$refs.inputKitchenRef.$refs.inputFilterRef.focus();
                })
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm mở form thêm mới nơi chế biến
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        btnOpenFormAddKitchenOnClick() {
            try {
                this.isShowFormAddKitchen= true;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm đóng form thêm mới nơi chế biến
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        closeFormAddKitchen() {
            try {
                this.isShowFormAddKitchen = false;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi thêm mới đơn vị tính
         * @param {*} foodUnit đơn vị tính mới 
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        insertFoodUnit(foodUnit) {
            try {
                // Lấy danh sách đơn vị tính
                FoodUnitApi.getAll().then((res) => {
                    this.foodUnits = res.data
                    this.food.FoodUnitID = foodUnit.FoodUnitID;
                    this.$refs.inputFoodUnitRef.$refs.inputFilterRef.focus();
                })
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm mở form thêm mới đơn vị tính
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        btnOpenFormAddFoodUnitOnClick() {
            try {
                this.isShowFormAddFoodUnit= true;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm đóng form thêm mới đơn vị tính
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        closeFormAddFoodUnit() {
            try {
                this.isShowFormAddFoodUnit = false;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi thêm mới nhóm thực đơn
         * @param {*} foodCategory nhóm thực đơn mới
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        insertFoodCategory(foodCategory) {
            try {
                // Lấy danh sách nhóm thực đơn
                FoodCategoryApi.getAll().then((res) => {
                    this.foodCategorys = res.data
                    this.food.FoodCategoryID = foodCategory.FoodCategoryID;
                    this.$refs.inputFoodCategoryRef.$refs.inputFilterRef.focus();
                })
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm mở form thêm mới nhóm thực đơn
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        btnOpenFormAddFoodCategoryOnClick() {
            try {
                this.isShowFormAddFoodCategory = true;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm đóng form thêm mới nhóm thực đơn
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        closeFormAddFoodCategory() {
            try {
                this.isShowFormAddFoodCategory = false;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm đóng change dialog
         * Author: Nguyễn Hoàng Anh (26/6/2022)
         */
        closeChangeDialog(){
            try {
                this.isShowChangeDialog = false;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi click nút cancel
         * Author: Nguyễn Hoàng Anh (23/8/2022)
         */
        btnCancelOnClick() {
            this.$emit('btnCloseModalOnClick');
        },
        /**
         * Hàm xử lý khi blur input tên món ăn
         * Author: Nguyễn Hoàng Anh (23/8/2022)
         */
        handelBlurInputFoodName() {
            if (this.food.FoodName != undefined && this.food.FoodName.trim() != "" && (this.formMode == FormMode.INSERT || this.formMode == FormMode.REPLICATION)) {
                FoodApi.getFoodCode(this.food.FoodName).then((res) => {
                    this.food.FoodCode = res.data;
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        /**
         * Hàm xử lý khi blur khỏi input giá vốn
         * Author: Nguyễn Hoàng Anh (23/8/2022)
         */
        handleBlurInputFoodOutwardPrice() {
            if (!this.food.FoodOutwardPrice || this.food.FoodOutwardPrice < 0) {
                this.food.FoodOutwardPrice = 0;
            }
        },
        /**
         * Hàm xử lý khi blur khỏi input giá bán
         * Author: Nguyễn Hoàng Anh (23/8/2022)
         */
        handleBlurInputFoodPrice(){
            if (!this.food.FoodPrice || this.food.FoodPrice < 0) {
                this.food.FoodPrice = 0;
            }
        },
        /**
         * Hàm xử lý khi xóa ảnh
         * Author: Nguyễn Hoàng Anh (21/8/2022)
         */
        btnDeleteFileOnClick(){
            this.urlFileImage = this.defaultImage;
            this.fileImage = null;
            this.$refs.inputOpenFileRef.value = null
            this.food.Image = null;
        },
        /**
         * Hàm xử lý khi chọn ảnh
         * @param {*} event 
         * Author: Nguyễn Hoàng Anh (21/8/2022)
         */
        fileImageOnChange(event) {
            var me = this;
            if (event.target.files && event.target.files[0]) {
                //  Validate kích thước ảnh
                if (event.target.files[0].size > 5 * 1024 * 1024) {
                    this.openMessageBoxWarning(messageValidateFood.validateOverSizeImage);
                    return
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    me.urlFileImage = e.target.result;
                }
                reader.readAsDataURL(event.target.files[0]);
                me.fileImage = event.target.files[0];
            }
        },
        /**
         * Hàm xử lý khi click vào button chọn ảnh 
         * Author: Nguyễn Hoàng Anh (21/8/2022)
         */
        btnOpenFileOnClick() {
            this.$refs.inputOpenFileRef.click();
        },
        /**
         * Hàm chuyển dạng dữ liệu money sang double để gửi về server
         * Author: Nguyễn Hoàng Anh (21/8/2022)
         */
        formatMoneyToDouble(money) {
            return parseFloat(money.toString().split('').filter(c => c !== '.').join(''));
        },
        /**
         * Hàm sử lý định dạng dữ liệu tiền
         * Author: Nguyễn Hoàng Anh (22/6/2022)
         */
        formatMoney(value) {
            if (typeof value == 'number' && (value || value === 0)) {
                var money = Math.round(value);
                return money.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
        },
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
         * Hàm upload ảnh lên server
         * Author: Nguyễn Hoàng Anh (28/8/2022)
         */
        async uploadImage() {
            await FoodApi.uploadImge(this.fileImage).then((res)=> {
                console.log(res.data);
                this.food.Image = res.data;
            }).catch((err) => {
                console.log(err);
                this.openMessageBoxWarning("Lỗi không thể tải lên file ảnh")
            })
        },
        /**
         * Hàm xử lý khi click nút cất
         * Author: Nguyễn Hoàng Anh (20/8/2022)
         */
        async btnSaveOnClick() {
            try {
                /// 1. Validate dữ liệu
                var isValid = this.validateBeforeSubmit();
                if (!isValid)
                    return
                
                /// 2. Upload ảnh
                if (this.fileImage) {
                    await this.uploadImage();
                }

                /// 3. Build dữ liệu món ăn
                // 3.1 Format lại giá tiền
                this.food.FoodPrice = this.formatMoneyToDouble(this.food.FoodPrice);
                this.food.FoodOutwardPrice = this.formatMoneyToDouble(this.food.FoodOutwardPrice);
                // 3.2 Lọc ra những danh sách sở thích phục vụ trống
                this.food.FoodAdditions = this.filterEmptyFoodAdditions(this.food.FoodAdditions)
                
                /// 4. Gọi API
                // Kiểm tra xem là form thêm mới, sửa hay nhân bản
                if (this.formMode == FormMode.INSERT || this.formMode == FormMode.REPLICATION){
                    FoodApi.post(this.food).then((res) => {
                        this.$emit('btnCloseModalOnClick');
                        this.toastSuccessMessage(messageToastFood.addSuccess);
                        this.$emit('insertFood');
                    }).catch((err) => {
                        this.openMessageBoxWarning(err.response.data.userMsg);
                        this.toastErrorMessage(messageToastFood.addError);
                    })
                }
                else if (this.FormMode == FormMode.EDIT) {
                    FoodApi.put(this.food.FoodID, this.food).then((res) => {
                        this.$emit('btnCloseModalOnClick');
                        this.toastSuccessMessage(messageToastFood.updateSuccess);
                        this.$emit('updateFood');
                    }).catch((err) => {
                        this.openMessageBoxWarning(err.response.data.userMsg);
                        this.toastErrorMessage(messageToastFood.updateError);
                    })
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi click nút cất và thêm mới
         * Author: Nguyễn Hoàng Anh (23/8/2022)
         */
        async btnSaveAndNewOnClick() {
            try {
                /// 1. Validate dữ liệu
                var isValid = this.validateBeforeSubmit();
                if (!isValid)
                    return
                
                /// 2. Upload ảnh
                if (this.fileImage) {
                    await this.uploadImage();
                }

                /// 3. Build dữ liệu món ăn
                // 3.1 Format lại giá tiền
                this.food.FoodPrice = this.formatMoneyToDouble(this.food.FoodPrice);
                this.food.FoodOutwardPrice = this.formatMoneyToDouble(this.food.FoodOutwardPrice);
                // 3.2 Lọc ra những danh sách sở thích phục vụ trống
                this.food.FoodAdditions = this.filterEmptyFoodAdditions(this.food.FoodAdditions)
                
                /// 4. Gọi API
                // Kiểm tra xem là form thêm mới, sửa hay nhân bản
                if (this.formMode == FormMode.INSERT || this.formMode == FormMode.REPLICATION){
                    FoodApi.post(this.food).then((res) => {
                        this.$emit('insertFood');
                        this.toastSuccessMessage(messageToastFood.addSuccess);
                        this.resetData();
                    }).catch((err) => {
                        this.openMessageBoxWarning(err.response.data.userMsg);
                        this.toastErrorMessage(messageToastFood.addError);
                    })
                }
                else if (this.formMode == FormMode.EDIT) {
                    FoodApi.put(this.food.FoodID, this.food).then((res) => {
                        this.$emit('updateFood');
                        this.toastSuccessMessage(messageToastFood.updateSuccess);
                        // Đặt lại thành form thêm mới
                        this.formMode = FormMode.INSERT;

                        this.resetData();
                    }).catch((err) => {
                        this.openMessageBoxWarning(err.response.data.userMsg);
                        this.toastErrorMessage(messageToastFood.updateError);
                    })
                }

            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm lọc ra danh sách dánh sở thích phục có nội dung và thu thêm lớn hơn 0
         * Author: Nguyễn Hoàng Anh (22/8/2022)
         */
        filterEmptyFoodAdditions(listFoodAddition) {
            try {
                if (listFoodAddition === []) return [];

                let res = [];

                for (const item of listFoodAddition) {
                    
                    if (!item.FoodAdditionDescription && (item.FoodAdditionPrice === 0 || item.FoodAdditionPrice === '0' || !item.FoodAdditionPrice)) {
                        continue;
                    }
                    else if (item.FoodAdditionDescription && (item.FoodAdditionPrice === 0 || item.FoodAdditionPrice === '0' || !item.FoodAdditionPrice)) {
                        res.push({ FoodAdditionID: null, FoodAdditionDescription: item.FoodAdditionDescription, FoodAdditionPrice: 0 });
                    } else {
                        res.push({ FoodAdditionID: item.FoodAdditionID, FoodAdditionDescription: item.FoodAdditionDescription, FoodAdditionPrice: this.formatMoneyToDouble(item.FoodAdditionPrice) });
                    }
                }

                return res;
            } catch (error) {
                console.log(error);
            }
        },
        /** 
         * Hàm đóng message box
         * Author: Nguyễn Hoàng Anh (24/6/2022)
         */
        closeMessageBox(isShow) {
            try {
                // Đóng message box
                this.isShowMessageBox = isShow;
                // Focus vào input không hợp lệ nếu có
                if (this.inputNotValid){
                    this.$nextTick(() => {
                        var me = this
                        setTimeout(function() {
                            me.inputNotValid.focus();
                        },50)
                        
                    })
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm mở message box cảnh báo (warning)
         * Author: Nguyễn Hoàng Anh (23/7/2022)
         */
        openMessageBoxWarning(msg){
            try {
                this.message = msg;
                this.isWarning = true;
                this.isShowMessageBox = true;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm validate dữ liệu trước khi gửi request thêm mới, cập nhật bản ghi
         * Author: Nguyễn Hoàng Anh (20/08/2022)
         */
        validateBeforeSubmit() {
            try {
                var isValid = true;
                var FoodName = this.$refs.inputFoodNameRef;
                var FoodCode = this.$refs.inputFoodCodeRef;
                var FoodUnit = this.$refs.inputFoodUnitRef;
                var FoodPrice = this.$refs.inputFoodPriceRef;   
                var listMessageError = [];
                var listInputError = [];
                var listTabError = [];

                if ( this.food.FoodName == undefined || !this.food.FoodName.trim()) {
                    FoodName.isValid = false;
                    listMessageError.push(messageValidateFood.validateNameNull);
                    listInputError.push(FoodName.$refs.inputRef)
                    listTabError.push(0);
                    isValid = false;
                }
                if ( this.food.FoodCode == undefined || !this.food.FoodCode) {
                    FoodCode.isValid = false;
                    listMessageError.push(messageValidateFood.validateCodeNull);
                    listInputError.push(FoodCode.$refs.inputRef)
                    listTabError.push(0);
                    isValid = false;
                }
                if (!this.food.FoodUnitID) {
                    FoodUnit.isValid = false;
                    listMessageError.push(messageValidateFood.validateUnitNull);
                    listInputError.push(FoodUnit.$refs.inputFilterRef)
                    listTabError.push(0);
                    isValid = false;
                }
                if (this.food.FoodPrice < 0 || (!this.food.FoodPrice && this.food.FoodPrice != 0)) {
                    FoodPrice.isValid = false;
                    listMessageError.push(messageValidateFood.validatePriceInValid);
                    listInputError.push(FoodPrice.$refs.inputRef)
                    listTabError.push(0);
                    isValid = false;
                }
                
                for (var i = 0; i < this.food.FoodAdditions.length; i ++) {
                    if (!this.food.FoodAdditions[i].FoodAdditionDescription && this.food.FoodAdditions[i].FoodAdditionPrice > 0) {
                        listMessageError.push(messageValidateFood.validateFoodAdditionNull);
                        listInputError.push(this.$refs.comboBoxRef[i].$refs.inputFilterRef);
                        listTabError.push(1);
                        this.rowSelected = i;
                        this.colSelected = 0;
                        isValid = false;
                        break
                    }
                    else {
                        var isDuplicate = this.checkDuplicateFoodAddition(this.food.FoodAdditions[i]);
                        if (isDuplicate != -1) {
                            listMessageError.push(messageValidateFood.validateFoodAdditionDuplicate);
                            this.tabSelected = 'Sở thích phục vụ'
                            listInputError.push(this.$refs.comboBoxRef[isDuplicate].$refs.inputFilterRef);
                            listTabError.push(1);
                            this.rowSelected = isDuplicate;
                            this.colSelected = 0;
                            isValid = false;
                            break
                        }
                    }
                }

                if (!isValid) {
                    this.inputNotValid = listInputError[0];
                    this.openMessageBoxWarning(listMessageError[0]);
                    this.tabSelected = this.tabs[listTabError[0]]
                }
                
                return isValid;
            } catch (error) {
                
            }
        },
        /**
         * Hàm kiểm tra trùng dữ liệu sở thích phục vụ
         * Author: Nguyễn Hoàng Anh (21/8/2022)
         */
        checkDuplicateFoodAddition(foodAdditionChecked) {
            var count = 0;
            for (var i = 0; i < this.food.FoodAdditions.length; i ++) {
                if (this.food.FoodAdditions[i].FoodAdditionDescription === foodAdditionChecked.FoodAdditionDescription && 
                this.food.FoodAdditions[i].FoodAdditionPrice === foodAdditionChecked.FoodAdditionPrice 
                && (this.food.FoodAdditions[i].FoodAdditionDescription && this.food.FoodAdditions[i].FoodAdditionDescription != 0)) {
                    count ++;
                    if (count > 1) {
                        return i;
                    }
                }
            }
            return -1
        },
        /**
         * Hàm xử lý khi giá trị combobox chọn sở thích phục vụ thay đổi
         * Author: Nguyễn Hoàng Anh (19/8/2022)
         * @param {*} value  giá trị ID của sở thích phục đang được chọn
         */
        handleValueChangeFoodAddition(value) {
            // Gán lại giá của sở thích phục vụ đang được chọn cho ô input giá thu thêm tương ứng
            this.food.FoodAdditions[this.rowSelected].FoodAdditionPrice = value;
        },
        /**
         * Hàm xử lý khi chọn 1 cell trên table sở thích phục vụ
         * Author: Nguyễn Hoàng Anh (19/8/2022)
         * @param {*} row  dòng đang được chọn
         * @param {*} col  cột đang được chọn
         */
        rowOnClick(row, col) {
            this.rowSelected = row;
            this.colSelected = col;
        },
        /**
         * Hàm xử lý khi click button xóa dòng
         * Author: Nguyễn Hoàng Anh (19/8/2022)
         */
        btnDeleteRowOnclick() {
            this.food.FoodAdditions = this.food.FoodAdditions.filter((item, index) => index !== this.rowSelected)
            if (this.food.FoodAdditions.length > 0) {
                this.rowSelected = this.food.FoodAdditions.length - 1
            }
            else
                this.rowSelected = -1
        },
        /**
         * Hàm xử lý khi blur ô input nhập thu thêm sở thích phục vụ
         * Author: Nguyễn Hoàng Anh (19/8/2022)
         * @param {*} index vị trí blur
         */
        handleBlurFoodAdditionPrice(index) {
            if (!this.food.FoodAdditions[index].FoodAdditionPrice) {
                this.food.FoodAdditions[index].FoodAdditionPrice = 0
            }
        },
        /**
         * Hàm xử lý khi click button thêm dòng
         * Author: Nguyễn Hoàng Anh (19/8/2022)
         */
        btnAddRowOnclick() {
            this.food.FoodAdditions.push({FoodAdditionID: null, FoodAdditionDescription: '', FoodAdditionPrice: 0})
            this.$nextTick(() => {this.$refs['comboBoxRef'][this.food.FoodAdditions.length - 1].$refs.inputFilterRef.focus()})
            this.rowSelected = this.food.FoodAdditions.length - 1
            this.colSelected = 0
        },
        /**
         * Hàm xử lý khi chọn tab
         * @param {*} tab tab được chọn
         * Author: Nguyễn Hoàng Anh (17/8/2022)
         */ 
        setSelectedTab(tab) {
            this.tabSelected = tab;
        },
        /**
         * Hàm xử lý khi click vào nút close
         * Author: Nguyễn Hoàng Anh (18/8/2022)
         */
        btnCloseModalOnClick() {
            try {
                // nếu giá trên form bị thay đổi thì mở save change dialog
                if (this.isFoodInfoChange == true){
                    this.isShowChangeDialog = true;
                }
                else {
                    this.$emit('btnCloseModalOnClick');
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm reset data và set 1 vài giá trị mặc định trên Form
         * Author: Nguyễn Hoàng Anh (17/7/2022)
         */
        resetData(){
            try {
                this.tabSelected = this.tabs[0];
                this.food= {
                    FoodAdditions: [],
                    Image: null,
                    FoodCategoryID: null,
                    FoodUnitID: null,
                    KitchenID: null,
                };
                this.food.FoodPrice = 0;
                this.food.FoodOutwardPrice = 0;
                this.urlFileImage = this.defaultImage;
                this.fileImage = null;
                
                this.$nextTick(() => {
                    this.$refs.inputFoodNameRef.isValid = true;
                    this.$refs.inputFoodCodeRef.isValid = true;
                    this.$refs.inputFoodUnitRef.isValid =true;
                    this.$refs.inputFoodPriceRef.isValid =true; 
                    this.$refs.inputOpenFileRef.value = null
                })
                 
                var me = this
                setTimeout(function() {
                    me.isFoodInfoChange = false;
                    me.$refs.inputFoodNameRef.$refs.inputRef.focus()
                }, 300);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm lấy thông tin món ăn theo ID
         * Author: Nguyễn Hoàng Anh (20/8/2022)
         */
        getInfoFoodByID() {
            FoodApi.getByID(this.foodSelectedID).then((res) => {
                if (!res.data) {
                    this.openMessageBoxWarning("Không tìm thấy thông tin thực đơn này! Có thể thực đơn đã bị xóa vui lòng kiểm tra lại");
                    return
                }
                this.food = res.data;

                if (this.food.Image) {
                    this.urlFileImage = `http://localhost:5062${this.food.Image}`
                }
                else {
                    this.urlFileImage = this.defaultImage
                }

                
                var me = this
                setTimeout(function() {
                    me.isFoodInfoChange = false
                    me.$refs.inputFoodNameRef.$refs.inputRef.focus()
                }, 270);
            })
        },
        /**
         * Hàm gán phím tắt cho modal
         * Author: Nguyễn Hoàng Anh (24/8/2022)
         */
        shortKeyEvent(event) {
            if (event.ctrlKey && event.altKey && event.key === 's') {
                event.preventDefault();
                this.btnSaveAndNewOnClick();
            }
            else if (event.ctrlKey  && event.key === 's') {
                event.preventDefault();
                this.btnSaveOnClick()
            } 
            else if (event.key === "Escape") {
                event.preventDefault();
                this.btnCloseModalOnClick();
            }
            else if (event.ctrlKey  && event.key === 'b') {
                event.preventDefault();
                this.btnCancelOnClick();
            }
        }
    },
    created() {
        if (this.FormMode == FormMode.INSERT) {
            this.resetData()
            this.titleModal = 'Thêm mới món ăn'
        }
        else if (this.FormMode == FormMode.EDIT) {
            this.getInfoFoodByID();
            this.titleModal = 'Cập nhật món ăn'
        }
        else if (this.FormMode == FormMode.REPLICATION){
            this.getInfoFoodByID();
            this.titleModal = 'Thêm mới món ăn'
            var me = this
            setTimeout(function() {
                FoodApi.getFoodCode(me.food.FoodName).then((res) => {
                    me.food.FoodCode = res.data;
                }).catch((err) => {
                    console.log(err);
                });
            }, 100);
        }
        
        // Lấy danh sách nhóm thực đơn
        FoodCategoryApi.getAll().then((res) => {
            this.foodCategorys = res.data
        })

        // Lấy danh sách đon vị tính
        FoodUnitApi.getAll().then((res) => {
            this.foodUnits = res.data
        })

        // Lấy danh sách nơi chế biên
        KitchenApi.getAll().then((res) => {
            this.kitchens = res.data
        })

        FoodAdditionApi.getAll().then((res) => {
            this.foodAdditions = res.data
        })
        
        //document.addEventListener("keydown", this.shortKeyEvent);
    },
    unmounted() {
        //document.removeEventListener("keydown", this.shortKeyEvent);
    },
}
</script>

<style scoped>
.modal_content {
    padding: 8px;
    min-height: 500px;
    width: 740px;
}

.form-food{
    display: flex;
}

.form-food-detail {
    min-width: 506px;
}

.form-food-image {
    min-width: 210px;
    margin-left: 8px;
}

.modal_footer{
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal_right_footer {
    display: flex;
    align-items: center;
}

.container-food-image {
    border: 1px solid #afafaf;
    padding: 0px 8px 8px;
    margin-top: -8px;
}

.title-image {
    padding: 0 3px 1px;
    line-height: 16px;
}

.content-image {
    height: 220px;
    display: flex;
}

.left-content-image {
    width: 160px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.btn-chose-from-library {
    padding: 3px 3px 3px 3px;
    color: #026b97!important; 
    cursor: pointer;
    font-weight: bold;
}

.btn-chose-from-library:hover {
    opacity: .5;
}

.right-content-image {
    display: flex;
    flex-direction: column;
}

.form-food-addition {
    display: flex;
    flex-direction: column;
    margin-top: -6px;

}

.suggestion {
    font-style: italic;
    padding-top: 0!important;
    height: 34px;
    margin-left: -8px!important;
}

.cell-selected {
    background-color: #c1ddf1
}

.header-items {
    display: flex; 
    justify-content: space-between;
    font-weight: bold;
    background-color: #ededed;
    margin: 0 -6px;
    min-height: 24px;
}

.list-item-combobox {
    display: flex; 
    justify-content: space-between;
    margin: 0 -6px;
}

.item-combobox {
    border-right: 1px solid #ccc!important;
    border-bottom: 1px solid #ccc!important;
    padding: 5px 10px 4px 10px;
}
</style>