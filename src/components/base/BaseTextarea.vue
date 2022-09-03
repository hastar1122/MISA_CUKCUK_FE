<template>
    <div class="ms-textarea-base">
        <label v-if="label" class="ms-input-label">{{label}}<span v-if="require" class="ms-input-required"> (*)</span></label>
        <textarea
        :ref="'inputRef'"
        v-model="data"
        @keyup="handleKeyUp"
        @input="handleInput"
        @keyup.enter="handleSubmitValue"
        @blur="blurEvent"
        @click="selectValue"
        :minlength="minlength" 
        :maxlength="maxlength"
        :title="title"
        :disabled="disable"
        :placeholder="placeholder" 
        class="ms-textarea"
        :class="[isValid == true? '': 'ms-input-validate-error', hasIcon == true? 'hasIcon icon-after-input': '']">
        </textarea>
        <div v-if="isValid == false" class="tooltip">
            <div class="icon-error"></div>
            <div class="tooltiptext">
                <div class="icon-error" style="margin-left: 0;"></div>
                <div>{{title}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    watch:{
        // Gán giá trị v-model truyền vào cho data
        modelValue: function(value){
            this.data = value;
        },
        /**
         * Kiểm tra sự thay đổi dữ liệu để xét dữ liệu có hợp lệ không
         * Author: Nguyễn Hoàng Anh (19/7/2022)
         */
        data: function (value){
            try {
                // Trường hợp nếu dữ liệu rỗng và có bắt buộc
                if (value == '' && this.require == true){
                    this.$emit('update:modelValue',value)
                    this.isValid = false;
                }
                // Trường hợp có dữ liệu và validate không hợp lệ
                // else if (value && this.validate  &&!this.validate(value)){
                //     this.$emit('input',value)
                //     this.isValid = false;
                // }
                else{
                    this.$emit('update:modelValue',value)
                    this.isValid = true
                }

                // Trường hợp không hợp lệ, không có dữ liệu và có bắt buộc thì xét message bắt buộc nhập
                if (!this.isValid && !value && this.require){
                    this.title = this.messageRequire;
                }
                // Trường hợp không hợp lệ, có dữ liệu và có validate thì lấy message validate
                else if (!this.isValid && value && this.validate){
                    this.title = this.errorMsgValidate;
                }
                else{
                    this.title = '';
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Kiểm tra sự hợp lệ của dữ liệu để set title
         * Author: Nguyễn Hoàng Anh (19/7/2022)
         */
        isValid: function(value){
            try {
                // Trường hợp không hợp lệ, không có dữ liệu và có bắt buộc thì xét message bắt buộc nhập
                if (!value && !this.data && this.require){
                    this.title = this.messageRequire;
                }
                // Trường hợp không hợp lệ, có dữ liệu và có validate thì lấy message validate
                else if (!value && this.data && this.validate){
                    this.title = this.errorMsgValidate;
                }
                else{
                    this.title = '';
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    props: {
        // Giá trị v-model truyền vào
        modelValue: {
            require: true
        },
        // Có cho phép hoạt động không
        disable: {
            type: Boolean
        },
        // icon nếu có
        icon: {
            type: String
        },
        placeholder: {
            type: String
        },
        maxlength: {
            type: Number
        },
        minlength: {
            type: Number
        },
        // Bắt buộc nhập không
        require: {
            type: Boolean,
            default: false
        },
        // Tin nhắn thông báo nếu không nhập
        messageRequire: {
            type: String,
            default: 'Thông tin này không được bỏ trống'
        },
        // Hàm validate dữ liệu nếu có
        validate: {
            require: false,
            type: Function
        },
        // Tin nhắn thông báo nếu validate không hợp lệ
        errorMsgValidate: {
            type: String,
            default: 'Dữ liệu không hợp lệ'
        },
        label: {
            type:[String, Boolean],
            default: false
        }
    },
    data() {
        return {
            // Biến xác định dữ liệu có hợp lệ không
            isValid: true,
            // Biến lưu trữ dữ liệu
            data: this.modelValue,
            // Biến lưu giá trị đưa lên tile
            title: null,
            // Biến xác định có icon truyền vào không
            hasIcon: false
        }
    },
    methods: {
        /**
         * Hàm xử lý sự kiện blur
         * Author: Nguyễn Hoàng Anh (19/7/2022)
         */
        blurEvent(){
            try {
                if (!this.data && this.require == true){
                    this.isValid = false;
                }
                else{
                    this.isValid = true;
                }
                
                if (this.validate != undefined && this.data != undefined && this.data != ''){
                    if (this.validate(this.data) == true){
                        this.isValid = true;
                    }
                    else{
                        this.isValid = false;
                    }
                }

                this.$emit('handleBlur')
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xủ lý sự kiện khi click vào input
         * Author: Nguyễn Hoàng Anh (19/7/2022)
         */
        selectValue() {
            try {
                // Chọn tất cả value trong input
                this.$refs.inputRef.select();
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý sự kiện keyup
         * Author: Nguyễn Hoàng Anh (20/7/2022)
         */
        handleKeyUp() {
            try {
                this.$emit('handleKeyUp');
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý sự kiện input
         * Author: Nguyễn Hoàng Anh (20/7/2022)
         */
        handleInput() {
            try {
                this.$emit('handleInput');
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi nhấn enter submit
         */
        handleSubmitValue() {
            try {
                this.$emit('handleSubmitValue', this.data);
            } catch (error) {
                console.log(error);
            }
        }
    },
    created() {
        try {
            if (this.icon){
                this.hasIcon = true;
            }
            else {
                this.hasIcon = false;
            }
        } catch (error) {
            console.log(error);
        }
    },
}
</script>

<style scoped>
.ms-textarea-base {
    width: 100%;
    min-height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.ms-input-label {
    min-width: 125px;
    white-space: nowrap;
    align-self: flex-start;
}

.ms-input-required {
    color: red;
}

.ms-textarea{
    color: #000;
    padding: 3px 5px 3px!important;
    background-color: #fff;
    font: 12px/15px Tahoma !important;
    box-sizing: border-box;
    height: 50px;
    width: 100%;
    resize: none;
    border-width: 1px;
    border-style: solid;
    border-color: #c1c1c1 #d9d9d9 #d9d9d9;
}

.ms-textarea:focus {
    outline: 0;
    border-color:#0071c1 !important;
}

.ms-input-validate-error {
    border-color: #cf4c35ed!important;
}
</style>