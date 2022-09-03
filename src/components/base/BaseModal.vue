<template>
    <vue-final-modal 
    v-slot="{ close }" 
    v-bind="$attrs" 
    classes="modal-container" 
    content-class="modal-content"
    :esc-to-close="escToClose"
    :drag="isDrag"
    :resize="resize"
    :resize-directions="['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']"
    :content-style="styles"
    :click-to-close="false"
    drag-selector=".modal_header">
        <div class="modal_header">
            <div class="modal_title">{{title}}</div>
            <div v-if="isShowCloseHeader" class="modal_btn_close" @click="btnCloseModalOnClick"></div>
        </div>
        <div class="modal_content">
            <slot name="modal_content"></slot>
        </div>
        <div class="modal_footer">
            <slot name="modal_footer"></slot>
        </div>
  </vue-final-modal>
</template>

<script>
import { $vfm, VueFinalModal, ModalsContainer } from 'vue-final-modal'

export default {
    components: {
        VueFinalModal,
        ModalsContainer
    },
    data() {
        return {
            
        }
    },
    props: {
        // Có cho phép ấn esc để đóng không
        escToClose: {
            type: Boolean
        },
        // Có cho phép di chuyển modal không
        isDrag: {
            type: Boolean
        },
        // Có cho phép thay đổi kích thước của modal không
        resize: {
            type: Boolean
        },
        // Custom css cho modal
        styles: {

        },
        // Tiêu đề của modal
        title: {
            type: String
        },
        isShowCloseHeader: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        btnCloseModalOnClick() {
            this.$emit('btnCloseModalOnClick');
        }
    },
}
</script>

<style scoped>
::v-deep(.modal-container) {
    display: flex;
    justify-content: center;
    align-items: center;
}

::v-deep(.modal-content) {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    padding: 0;
    border-width: 5px;
    border-style: solid;
    background-color: #fff;
    border-color: #0072bc;
}

.modal_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: move;
    height: 30px;
    background-color: #0072bc;
    padding: 2px;
}

.modal_title {
    color: #fff;
    font-size: 13px;
    line-height: 16px;
    text-align: left;
    padding-left: 3px;
}

.modal_btn_close {
    cursor: pointer;
    background-color: transparent!important;
    opacity: 1!important;
    overflow: hidden;
    width: 16px;
    height: 16px;
    background-image: url(https://cdn2-new.cukcuk.vn/QLNH/resources/images/tools/tool-sprites.png);
    margin: 0;
}
</style>