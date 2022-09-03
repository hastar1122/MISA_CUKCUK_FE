<template>
    <div class="ms-input-base">
        <label v-if="label" class="ms-input-label">{{label}}<span v-if="require" class="ms-input-required"> (*)</span></label>
        <input autocomplete="off" type="text"
        :ref="'inputRef'"
        v-model="data"
        @keyup="handleKeyUp"
        @input="handleInput"
        @keyup.enter="handleSubmitValue"
        @blur="blurEvent"
        @click="selectValue"
        :title="title"
        :disabled="disable"
        class="ms-input"
        :class="[isValid == true? '': 'ms-input-validate-error', hasIcon == true? 'hasIcon icon-after-input': '', align == 'left' ? 'text-left' : 'text-right']">
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
            // Kiểm tra giá trị thay đổi có phải kiểu Number không
            if (this.isMoney== true && value){
                if (typeof value == 'number') {
                    var money = Math.round(value);
                    this.data = money.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
                else {
                    this.data = value.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
            }
            else if (value)
                this.data = value.toString().replace(/\D/g, "")

            // Trường hợp nếu dữ liệu rỗng và có bắt buộc
            if (!value && this.require == true){     
                this.$emit('update:modelValue',value)
                this.isValid = false;
            }
            else{
                this.$emit('update:modelValue',value)
                this.isValid = true
            }

            // Trường hợp không hợp lệ, không có dữ liệu và có bắt buộc thì xét message bắt buộc nhập
            if (!this.isValid && !value && this.require){
                this.title = this.messageRequire;
            }
            else{
                this.title = '';
            }
        },
        /**
         * Kiểm tra sự hợp lệ của dữ liệu để set title
         * Author: Nguyễn Hoàng Anh (19/7/2022)
         */
        isValid: function(value){
            // Trường hợp không hợp lệ, không có dữ liệu và có bắt buộc thì xét message bắt buộc nhập
            if (!value && !this.data && this.require){
                this.title = this.messageRequire;
            }
            else{
                this.title = '';
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
        // Bắt buộc nhập không
        require: {
            type: Boolean,
            default: false
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
        label: {
            type:[String, Boolean],
            default: false
        },
        align: {

        },
        isMoney: {
            type: Boolean
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
        }
    },
    methods: {
        /**
         * Hàm xử lý sự kiện blur
         * Author: Nguyễn Hoàng Anh (19/7/2022)
         */
        blurEvent(){
            if (!this.data && this.require == true){
                this.isValid = false;
            }
            else{
                this.isValid = true;
            }
            this.$emit('handleBlur',this.data)
        },
        /**
         * Hàm xủ lý sự kiện khi click vào input
         * Author: Nguyễn Hoàng Anh (19/7/2022)
         */
        selectValue() {
            // Chọn tất cả value trong input
            this.$refs.inputRef.select();
        },
        /**
         * Hàm xử lý sự kiện keyup
         * Author: Nguyễn Hoàng Anh (20/7/2022)
         */
        handleKeyUp() {
            this.$emit('handleKeyUp');
        },
        /**
         * Hàm xử lý sự kiện input
         * Author: Nguyễn Hoàng Anh (20/7/2022)
         */
        handleInput() {
            this.$emit('handleInput');
        },
        /**
         * Hàm xử lý sự kiện enter input
         */
        handleSubmitValue() {
            this.$emit('handleSubmitValue');
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
        if (this.isMoney== true && this.data) {
            if (typeof this.data == 'number') {
                var money = Math.round(this.modelValue);
                this.data = money.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            else {
                this.data = this.modelValue.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
        }
    },
    mounted() {
        const intRx = /\d/,
        integerChange = (event) => {
            if ((event.key.length > 1) || ( (event.key === "-") && (!event.currentTarget.value.length) ) || intRx.test(event.key))
                return;
        event.preventDefault();
    };
  
        for (let input of document.querySelectorAll('input[type="number"][step="1"]' )) 
            input.addEventListener("keydown", integerChange);
    },
}
</script>

<style scoped>
.ms-input-base {
    width: 100%;
    min-height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.ms-input-label {
    min-width: 125px;
    white-space: nowrap;
}

.ms-input-required {
    color: red;
}


.ms-input{
    color: #000;
    padding: 5px 10px 4px 10px!important;
    background-color: transparent;
    box-sizing: border-box;
    min-height: 24px;
    width: 100%;
    border: none;
}

.ms-input:focus {
    outline: 0;
    padding: 3px 5px 3px!important;
    border:1px solid #0071c1 !important;
    background-color: #fff;
    font: 12px/15px Tahoma !important; ;
}

.ms-input-validate-error {
    border-color: #cf4c35ed!important;
}
</style>