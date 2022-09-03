<template>
    <BaseModal @keydown="shortKeyEvent"
    ref="addFoodUnitRef"
    v-model="isShowModal"
    :title="'Thêm đơn vị tính'"
    :isDrag="true"
    @btnCloseModalOnClick="btnCloseModalOnClick">
        <template #modal_content>
            <div class="modal_content">
                <BaseInput ref="inputFoodUnitNameRef" style="padding-bottom: 5px;" v-model="foodUnit.FoodUnitName" :label="'Đơn vị tính'" :require="true"></BaseInput>
                <BaseTextarea ref="inputFoodUnitDescriptionRef" style="padding-bottom: 5px;" v-model="foodUnit.FoodUnitDescription" :label="'Diễn giải'"></BaseTextarea>
            </div>
        </template>
        <template #modal_footer>
            <div class="modal_footer">
                <div class="modal_left_footer">
                    <BaseButton style="width: 75px; height: 25px;" :text="'Giúp'" :icon="'icon-help'"></BaseButton>
                </div>
                <div class="modal_right_footer">
                    <BaseButton data-c-tooltip="Cất (Ctrl + s)" tooltip-position ="bottom" @handleClick="btnSaveOnClick" style="width: 86px; height: 25px;" :text="'Cất'" :icon="'icon-save'"></BaseButton>
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
</template>

<script>
import BaseModal from '../../base/BaseModal.vue'
import BaseInput from '../../base/BaseInput.vue'
import BaseButton from '../../base/BaseButton.vue'
import BaseTextarea from '../../base/BaseTextarea.vue'
import FoodUnitApi from '../../../api/FoodUnitApi'
import MessageBox from '../../base/MessageBox.vue'
import SaveChangeModal from '../../base/SaveChangeModal.vue'

export default {
    components: {
        BaseModal,
        BaseInput,
        BaseButton,
        BaseTextarea,
        MessageBox,
        SaveChangeModal
    },
    emits: ['closeDialog','insertFoodUnit'],
    data() {
        return {
            // Biến giữ cho modal luôn hiển thị
            isShowModal: true,
            // Biến lưu thông tin đơn vị tính
            foodUnit: {},
            // Biến kiểm tra thông tin form đon vị tính có thay đổi không
            isFoodUnitInfoChange: false,
            // Biến lưu input không hợp lệ để focus sau khi validate
            inputNotValid: null,
            // Biến xác định modal message box mở hay đóng
            isShowMessageBox: false,
            // Biến lưu tin nhắn thông báo cho message box
            message: null,
            // Biến xác định change dialog mở hay đóng
            isShowChangeDialog: false,
            // Biến xác định kiểu message box
            isWarning: true,
        }
    },
    watch: {
        foodUnit: {
            handler: function(value){
                this.isFoodUnitInfoChange = true;
            },
            deep: true
        },
    },
    methods: {
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
                else {
                    this.$nextTick(() => {
                        var me = this
                        setTimeout(function() {
                            me.$refs.inputFoodUnitNameRef.$refs.inputRef.focus()
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
         * Hàm validate dữ liệu trước khi gửi request thêm mới
         * Author: Nguyễn Hoàng Anh (20/08/2022)
         */
        validateBeforeSubmit() {
            try {
                var isValid = true;
                var FoodUnitName = this.$refs.inputFoodUnitNameRef;
                var listMessageError = [];
                var listInputError = [];

                if (this.foodUnit.FoodUnitName == undefined || !this.foodUnit.FoodUnitName.trim()) {
                    FoodUnitName.isValid = false;
                    listMessageError.push('Đơn vị tính không được để trống');
                    listInputError.push(FoodUnitName.$refs.inputRef)
                    isValid = false;
                }

                if (!isValid) {
                    this.inputNotValid = listInputError[0];
                    this.openMessageBoxWarning(listMessageError[0]);
                }
                
                return isValid;
            } catch (error) {
                
            }
        },
        /**
         * Hàm xử lý khi click nút cất
         * Author: Nguyễn Hoàng Anh (26/8/2022)
         */
        btnSaveOnClick() {
            try {
                // 1. Validate dữ liệu
                var isValid = this.validateBeforeSubmit();
                if (!isValid)
                    return
                
                // 2. Build dữ liệu 
                
                // 3. Gọi API
                FoodUnitApi.post(this.foodUnit).then((res) => {
                    this.foodUnit.FoodUnitID = res.data;
                    this.$emit('insertFoodUnit', this.foodUnit);

                    this.$emit('closeDialog');
                }).catch((err) => {
                    this.openMessageBoxWarning(err.response.data.userMsg);
                })

            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi click vào nút close
         * Author: Nguyễn Hoàng Anh (18/8/2022)
         */
        btnCloseModalOnClick() {
            try {
                // nếu giá trên form bị thay đổi thì mở save change dialog
                if (this.isFoodUnitInfoChange == true){
                    this.isShowChangeDialog = true;
                }
                else {
                    this.$emit('closeDialog');
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi click nút cancel
         * Author: Nguyễn Hoàng Anh (23/8/2022)
         */
        btnCancelOnClick() {
            this.$emit('closeDialog');
        },        
        /**
         * Hàm gán phím tắt cho modal
         * Author: Nguyễn Hoàng Anh (24/8/2022)
         */
        shortKeyEvent(event) {
            
            if (event.ctrlKey  && event.key === 's') {
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
        this.foodUnit = {};

        var me = this
        setTimeout(function() {
            me.isFoodUnitInfoChange = false;
            me.$refs.inputFoodUnitNameRef.$refs.inputRef.focus()
        }, 270);
        
        //document.addEventListener("keydown", this.shortKeyEvent);
    },
    unmounted() {
        //document.removeEventListener("keydown", this.shortKeyEvent);
    },
}
</script>

<style scoped>
.modal_content {
    width: 475px;
    padding: 8px;
    display: flex;
    flex-direction: column;
}

.message-content {
    width: 328px;
    padding-left: 16px;
    word-wrap: break-word;
}

.modal_footer {
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal_right_footer {
    display: flex;
    align-items: center;
}
</style>