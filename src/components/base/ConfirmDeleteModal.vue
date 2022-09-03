<template>
    <BaseModal
    v-model="isShowModal"
    :title="'CUKCUK - Quản lý nhà hàng'"
    :isShowCloseHeader="false" 
    :isDrag="true">
        <template #modal_content>
            <div class="modal_content">
                <div class="icon-question"></div>
                <div class="message-content"><span>{{message}}</span></div>
            </div>
        </template>
        <template #modal_footer>
            <div class="modal_footer">
                <BaseButton @handleClick="btnCloseCfDialogOnClick" style="width: 75px; height: 25px; margin-right: 4px; float: right;" 
                :text="'Không'"></BaseButton>
                <BaseButton @handleClick="btnHandleSubmit" style="width: 75px; height: 25px; margin-right: 8px; float: right;" 
                :text="'Có'"></BaseButton>
            </div>
        </template>
    </BaseModal>
</template>
    
<script>
import BaseModal from "../base/BaseModal.vue";
import BaseButton from "./BaseButton.vue";

export default {
    components: {
        BaseModal,
        BaseButton
    },
    data() {
        return {
            // Biến giữ cho modal message box luôn hiển thị
            isShowModal: true,
        }
    },
    props: ["message"],
    created() {
        
    },
    methods: {
        /**
         * Đóng confirm dialog
         */
        btnCloseCfDialogOnClick() {
            this.$emit("closeCfDialog", false);
        },
        /**
         * Hàm thực hiện khi ấn submit
         * Author: Nguyễn Hoàng Anh (25/6/2022) 
         */
        btnHandleSubmit() {
            this.$emit('handleSubmit');
            this.$emit('closeCfDialog', false);  
        }
    },
}
</script>

<style scoped>
.modal_content {
    width: 390px;
    padding: 10px;
    display: flex;
}

.message-content {
    width: 328px;
    padding-left: 16px;
    word-wrap: break-word;
}

.modal_footer {
    padding: 6px;
    width: 100%;
    height: 37px;
}
</style>