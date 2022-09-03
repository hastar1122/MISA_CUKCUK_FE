<template>
    <BaseModal
    v-model="isShowModal"
    :title="'CUKCUK - Quản lý nhà hàng'"
    :isShowCloseHeader="false" 
    :isDrag="true">
        <template #modal_content>
            <div class="modal_content">
                <div :class="isWarning ? 'icon-warning' : '' "></div>
                <div class="message-content"><span>{{message}}</span></div>
            </div>
        </template>
        <template #modal_footer>
            <div class="modal_footer">
                <BaseButton ref="btnSubmitRef" @handleClick="btnCloseMsgBoxOnClick" style="width: 75px; height: 25px; margin-right: 4px; float: right;" 
                :text="'Đồng ý'"></BaseButton>
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
            // Biến lưu nội dung thông báo
            message: null,

            // Biến giữ cho modal message box luôn hiển thị
            isShowModal: true,
        }
    },
    props: ["msg", "isWarning"],
    methods: {
        btnCloseMsgBoxOnClick() {
            this.$emit("closeMessageBox", false);
        },
        shortKeyEvent(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                this.btnCloseMsgBoxOnClick()
            }
        }
    },
    created() {
        this.message = this.msg;

        window.addEventListener('keydown', this.shortKeyEvent)
    },
    unmounted() {
        window.removeEventListener('keydown', this.shortKeyEvent)
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