<template>
    <div class="ms-pagination">
        <div @click="btnPageFirstOnClick" 
        data-c-tooltip="Trang đầu" tooltip-position ="right" 
         :class="[modelValue == 1 || pageCount == 0? 'ms-pagination-item-disable' : 'ms-pagination-item']">
            <div :class="[modelValue == 1 || pageCount == 0? 'disable' : '']" class="icon-page-first"></div>
            <!-- <div class="tooltiptext" style="left: 125%; top: 0;">Trang đầu</div> -->
        </div>

        <div @click="btnPagePrevOnClick"
        :class="[modelValue == 1 || pageCount == 0? 'ms-pagination-item-disable' : 'ms-pagination-item']"
        class="tooltip">
            <div class="icon-page-prev" :class="[modelValue == 1 || pageCount == 0? 'disable' : '']"></div>
            <div class="tooltiptext" style="left: 125%; top: 0;">Trang trước</div>
        </div>

        <div style="border-left: 1px solid #ccc ; height: 14px; margin-right: 8px;"></div>

        <div style="padding: 0 4px;" class="mr-8">Trang</div>

        <BaseInputInt style="width: 40px;" class="mr-8"
        :disable="pageCount == 0"
        v-model="pageIndex"
        :align="'left'"
        @handleSubmitValue="handleSubmitPage"
        @handleBlur="handleBlurPage"></BaseInputInt>

        <div style="padding: 0 4px;" class="mr-8">Trên {{pageCount}}</div>

        <div style="border-left: 1px solid #ccc ; height: 14px; margin-right: 8px;"></div>

        <div @click="btnPageNextOnClick"
        :class="[modelValue == pageCount || pageCount == 0? 'ms-pagination-item-disable' : 'ms-pagination-item']"
        class="tooltip">
            <div class="icon-page-next" :class="[modelValue == pageCount || pageCount == 0? 'disable' : '']"></div>
            <div class="tooltiptext" style="left: 125%; top: 0;">Trang sau</div>
        </div>

        <div @click="btnPageLastOnClick"
        :class="[modelValue == pageCount || pageCount == 0? 'ms-pagination-item-disable' : 'ms-pagination-item']"
        class="tooltip">
            <div class="icon-page-last" :class="[modelValue == pageCount || pageCount == 0? 'disable' : '']"></div>
            <div class="tooltiptext" style="left: 125%; top: 0;">Trang cuối</div>
        </div>

        <div style="border-left: 1px solid #ccc ; height: 14px; margin-right: 8px;"></div>

        <div @click="btnReloadOnClick" class="ms-pagination-item tooltip">
            <div class="icon-page-reload"></div>
            <div class="tooltiptext" style="left: 125%; top: 0;">Tải lại</div>
        </div>
        
        <div style="border-left: 1px solid #ccc ; height: 14px; margin-right: 8px;"></div>
    </div>
</template>

<script>
import BaseInputInt from './BaseInputInt.vue';
export default {
    components:{
        BaseInputInt
    },
    props: {
        // Giá trị v-model truyền vào
        modelValue: {
            type: Number
        },
        // Biến lưu tổng số trang
        pageCount: {
            type: Number,
            required: true
        },
    },
    data() {
        return {
            // Biến lưu trang được truyền vào v-model của input nhập số trang
            pageIndex: this.modelValue
        }
    },
    watch: {
        // Hàm kiểm tra v-model truyền vào có thay đổi không
        modelValue: function(value) {
            this.pageIndex = value
        },
        pageCount: function(value){
            if (value === 0) {
                this.pageIndex = 0;
            }
            else {
                this.pageIndex = this.modelValue
            }
        },
    },
    methods: {
        /**
         * Hàm xử lý khi ấn vào nút reload
         * Author: Nguyễn Hoàng Anh (16/8/2022)
         */
        btnReloadOnClick(){
            this.$emit('btnReloadOnClick');
        },
        /**
         * Hàm xử lý khi ấn trang đầu tiên
         * Author: Nguyễn Hoàng Anh (13/8/2022)
         */
        btnPageFirstOnClick(){
            try {
                if (this.modelValue > 1)
                    this.$emit('update:modelValue', 1);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi ấn trang trước đó
         * Author: Nguyễn Hoàng Anh (13/8/2022)
         */
        btnPagePrevOnClick(){
            try {
                if (this.modelValue > 1) 
                    this.$emit('update:modelValue', this.modelValue - 1);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi ấn trang tiếp theo
         * Author: Nguyễn Hoàng Anh (13/8/2022)
         */
        btnPageNextOnClick() {
            try {
                if (this.modelValue < this.pageCount)
                    this.$emit('update:modelValue', this.modelValue + 1);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi ấn trang cuối cùng
         * Author: Nguyễn Hoàng Anh (13/8/2022)
         */
        btnPageLastOnClick() {
            try {
                if (this.modelValue < this.pageCount)
                    this.$emit('update:modelValue', this.pageCount);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý update pageIndex khi nhấn enter
         * Author: Nguyễn Hoàng Anh (13/8/2022)
         */
        handleSubmitPage() {
            try {
                this.pageIndex = parseInt(this.pageIndex);
                if (isNaN(this.pageIndex)){
                    this.pageIndex = this.modelValue;
                    return
                }
                if (this.pageIndex < 1) {
                    this.$emit('update:modelValue', 1);
                }
                else if (this.pageIndex > this.pageCount) {
                    this.$emit('update:modelValue', this.pageCount);
                }
                else{
                    this.$emit('update:modelValue', parseInt(this.pageIndex));
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi blur input nhập số trang
         * Author: Nguyễn Hoàng Anh (13/8/2022)
         */
        handleBlurPage() {
            try {
                this.pageIndex = this.modelValue;
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>

<style scoped>
.ms-pagination {
    display: flex;
    height: 100%;
    align-items: center;
}

.ms-pagination-item {
    padding: 3px;
    border: 1px solid transparent;
    cursor: pointer;
    border-radius: 3px;
    margin-right: 8px;
}

.ms-pagination-item-disable {
    padding: 3px;
    border: 1px solid transparent;
    cursor: pointer;
    border-radius: 3px;
    margin-right: 8px;
}

.disable {
    opacity: 0.5;
}

.ms-pagination-item:hover {
    background-color: #ebebeb;
    border-color:  #d8d8d8;
    background-image: -webkit-linear-gradient(top, #ededed, #ebebeb 50%, #dfdfdf 51%, #ebebeb);
}
</style>