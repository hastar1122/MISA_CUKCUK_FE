<template>
    <div style="width: 100%;">
        <ul class="ms-tabs-nav">
            <li v-for="tab in tabs" :key="tab" class="ms-tab-nav" 
            :class="{'active' : tab == tabSelected}" 
            @click="setSelectedTab(tab)">
                <span>{{tab}}</span>
            </li>
        </ul>

        <slot></slot> 
    </div>
</template>

<script>
export default {
    props: {
        // Tab đang được chọn
        tabSelected: {

        },
        // Danh sách tên các nav tab truyền vào
        tabs: {
            
        },
        
    },
    methods: {
        /**
         * Hàm xử lý khi chọn tab
         * @param {*} tab tab được chọn
         * Author: Nguyễn Hoàng Anh (17/8/2022)
         */
        setSelectedTab(tab) {
            this.$emit('setSelectedTab', tab);
        }
    },
}
</script>

<style>
.ms-tabs-nav {
    list-style: none;
    display: flex;
    align-items: center;
    background-color: #f2f2f2!important;
    padding-left: 0;
    height: 29px;
}

.ms-tab-nav {
    background-color: transparent;
    border-color: transparent;
    border-radius: 0;
    padding: 5px 8px;
    margin: 0 0 0 0!important;
    border: 0!important;
    cursor: pointer;
}

.ms-tab-nav:hover{
    background-color: rgba(127,199,227,.4);
    border-left-color: #d3d3d3!important;
    border-right-color: #d3d3d3!important;
    border-top: 2px solid #005082!important;
    margin-left: 1px!important;
}

.active {
    background-color: #fff !important;
    border-bottom: medium none;
    border-left-color: #d3d3d3!important;
    border-right-color: #d3d3d3!important;
    border-top: 2px solid #0072bc!important;
    margin-left: 1px!important;
}
</style>