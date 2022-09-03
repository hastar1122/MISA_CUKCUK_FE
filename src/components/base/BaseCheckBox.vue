<template>
    <label class="ms-checkbox">
        <input v-model="checked" @change="handleChangeValue" :disabled="disable" type="checkbox" class="ms-checkbox-input">
        <span class="checkmark"></span>
        <span v-if="hasLable" class="ms-checkbox-label">
            {{label}}
        </span>
    </label>
</template>

<script>
export default {
    watch: {
        // Gán giá trị v-model truyền vào cho checked
        modelValue: function(value){
            this.checked = value;
        },
        // Trả lại value cho component cha
        checked: function(value){
            this.$emit('update:modelValue',value);
        }
    },
    props: {
        // Giá trị v-model truyền vào
        modelValue: {
            
        },
        // Có cho phép hoạt động không
        disable: {
            type: Boolean
        },
        // Hiển thị lable nếu có
        label: {
            type: String
        }
    },
    data() {
        return {
            // Biến lưu giá trị check
            checked: this.modelValue,
            // Biến xác định có label không
            hasLable: false
        }
    },
    methods: {
        /**
         * Hàm xử lý sự kiện thay đổi checked
         * Author: Nguyễn Hoàng Anh (20/7/2022)
         */
        handleChangeValue() {
            this.$emit('handleChangeValue');
        }
    },
    created() {
        /**
         * Nếu có label truyền vào biến hasLabel đc xét bằng true
         * Author: Nguyễn Hoàng Anh (20/7/2022)
         */
        try {
            if (this.label){
                this.hasLable = true;
            }
            else{
                this.hasLable = false;
            }
        } catch (error) {
            console.log(error);
        }
    },
}
</script>

<style>
.ms-checkbox {
    justify-content: flex-start;
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    max-width: max-content;
}

/* Hide the browser's default checkbox */

.ms-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}


/* Create a custom checkbox */
.checkmark {
    position: relative;
    border-radius: 2px;
    top: 0;
    left: 0;
    height: 13px;
    width: 13px;
    background-color: #f9f9f9;
    border: 1px solid #afafaf;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}


/* On mouse-over, add a grey background color */

.ms-checkbox:hover input~.checkmark {
    background-color: #f9f9f9;
}

.ms-checkbox input:focus~.checkmark{
    border-color: #3892d3 !important;
}

.ms-checkbox input:focus~.checkmark:after{
    border-color: #3892d3 !important;
}


/* When the checkbox is checked, add a blue background */

.ms-checkbox input:checked~.checkmark {
    background-color: #fff;
    border: 1px solid #717171;
    transition: 0.3s;
    transform: rotate(90deg);
}


/* Create the checkmark/indicator (hidden when not checked) */

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}


/* Show the checkmark when checked */

.ms-checkbox input:checked~.checkmark:after {
    display: block;
}


/* Style the checkmark/indicator */

.ms-checkbox .checkmark:after {
    left: -1px;
    top: -3px;
    width: 3px;
    height: 11px;
    border: solid #717171;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
}

.ms-checkbox-label{
    white-space: nowrap;
    padding-left: 7px;
    font-size: 13px;
}
</style>