<template>
    <button 
    :disabled="disable"
    class="ms-button"
    :class="[{'ms-button-secondary' :type == 'secondary' && disable !=true}, 
    disable == true ? 'ms-button-disable' : '',
    {'ms-button-primary' : type != 'secondary' && disable != true}]"
    @click="handleClick">
        <div :class="[icon != null ? [icon] : '']"></div>
        <div class="ms-button-title">{{text}}</div>
    </button>
</template>

<script>
export default {
    props: {
        // Kiểu button
        type: {
            type: String,
        },
        // Text hiển thị
        text: {
            type: String,
        },
        // Có được hoạt động không
        disable:{
            type: Boolean,
            default: false
        },
        // Biến lưu class icon truyền vào
        icon: {
            type: String
        }
    },
    methods: {
        /**
         * Hàm xử lý sự kiện click
         * Author: Nguyễn Hoàng Anh (21/7/2022)
         */
        handleClick() {
            this.$emit('handleClick');
        }
    },
}
</script>

<style>
.ms-button {
    height: 100%;
    width: 100%;
    border-radius: 0;
    cursor: pointer;
    padding: 3px 3px 3px 3px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ms-button-primary{
    border: 1px solid #ccc;
    background-color: #fcfcfc;
}

.ms-button-secondary {
    border: 1px solid transparent;
    background-color: transparent;
}

.ms-button-title {
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    padding: 0 5px;
    white-space: nowrap;
}

.ms-button-primary:hover{
    border-color:#0071c1;
    background-image: linear-gradient(#eff0ec, #e1f2e9);
}

.ms-button-primary:focus{
    outline: 0;
    border-color:#0071c1;
    background-image: linear-gradient(#eff0ec, #e1f2e9);
}

.ms-button-secondary:hover {
    border-color:#0071c1;
    background-color: #fff;
}

.ms-button-secondary:focus {
    outline: 0;
    border-color:#0071c1;
    background-color: #cdced1;
}

.ms-button-disable {
    border: 1px solid #ccc;
    cursor: default;
    opacity: .5;
}
</style>