<template>
    <div id="ms-header">
        <div class="logo-container">
            <div class="icon-left-header mr-4 mr-8" @click="btnToggleNavOnClick"></div>
            <div class="name-app"></div>
        </div>
        <div class="ms-left-header">  
            <div style="width:200px; height: 32px; margin-left: 10px;">
                <BaseComboBox
                v-model="restaurantSelected"
                :data="restaurants"
                :theme="'dark'"
                :filterAble="true"
                :keyText="'id'"
                :displayText="'name'">
                </BaseComboBox>
            </div>
            <div style="width: 28px; height: 32px;">
                <div class="icon-filter">
                    <div class="icon-filter-branch">&nbsp;</div>
                </div>
            </div>
        </div>
        <div class="ms-right-header">
            <div style="width:170px; height: 32px;">
                <BaseComboBox
                v-model="languageSelected"
                :data="languages"
                :theme="'dark'"
                :filterAble="true"
                :keyText="'key'"
                :displayText="'display'">
                </BaseComboBox>
            </div>

            <div class="icon-global ml-8">
                <img src="../../assets/img/icon-globe.png">
            </div>

            <div class="icon-support">
                <img src="../../assets/img/ic_support.svg">
            </div>

            <div class="ms-infor-user ml-16 mr-4">
                <div class="icon-avatar"></div>
                <div class="user-name ml-4">Nguyễn Hoàng Anh</div>
                <div class="icon-caret"></div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseComboBox from '../base/BaseComboBox.vue'
import BaseButton from '../base/BaseButton.vue';
export default {
    components:{
        BaseComboBox,
        BaseButton
    },
    data() {
        return {
            restaurants: [
                { name: 'MISA Restaurant', id: '1' },
            ],
            restaurantSelected: '1',
            languages: [
                { display: 'Tiếng Việt', key: '1'},
                { display: 'English', key: '2'},
                { display: '中文 (Tiếng Trung)', key: '3'},
                { display: 'Deutsch (Tiếng Đức)', key: '4'},
            ],
            languageSelected: '1'
        }
    },
    methods:{
        /**
         * Hàm đóng mở navbar
         * Author: Nguyễn Hoàng Anh (1/8/2022)
         */
        btnToggleNavOnClick() {
            this.$emit('toggleNavbar');
        }
    },
    watch: {
        restaurantSelected: function(value) {
            console.log(value);
        },
        languageSelected: function(value) {
            console.log(value);
        }
    }
}
</script>

<style lang="scss">
#ms-header {
    width: 100%;
    height: 55px;
    background-color: #0973b9;
    border-color: #157fcc;
    position: relative;
}

.logo-container {
    display: flex;
    background-color: #0973b9;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 230px;
    height: 55px;
    

    .name-app {
        width: 100%;
        height: 30px;
        background-image: url(../../assets/img/logo-text.png);
        background-repeat: no-repeat;
        background-position: 2px center;
        cursor: pointer;
    }
}

.ms-left-header {
    position: absolute;
    display: flex;
    top: 0;
    left: 230px;
    width: 240px;
    height: 55px;
    max-width: 240px;
    align-items: center;

    .icon-filter {
        width: 100%;
        height: 100%;
        background-color: #005082;
    }

    .icon-filter:hover{
        background-color: #003f68;
    }
}

.ms-right-header {
    position: absolute;
    display: flex;
    justify-content: end;
    right: 0;
    top: 0;
    align-items: center;
    width: 50%;
    height: 55px;
    background-color: #0973b9;

    .icon-global {
        height: 100%;
        width: 55px;
        padding: 16px;
        cursor: pointer;
    }

    .icon-support {
        height: 100%;
        width: 63px;
        cursor: pointer;
    }

    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }

    .ms-infor-user{
        width: 190px;
        height: 32px;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        cursor: pointer;
        .user-name{
            color: #fff;
            font-weight: 500;
        }
    }
}

.ms-infor-user:hover {
    background-color: #003f68;
}
</style>