<template>
    <div id="ms-main-content">
        <div id="ms-header-page">
            <div id="ms-title-header-page">Thực đơn</div>
            <div style="align-self: start;">
                <BaseButton
                 style="width: 100px; height: 28px; "
                :text="'Phản hồi'"
                :icon="'icon-feedback'"/>
            </div>
        </div>
        <div id="ms-content-page">
            <FoodList/>
        </div>
    </div>
</template>

<script>
import BaseButton from '../base/BaseButton.vue'
import FoodList from '../view/food/FoodList.vue'
export default {
    components: {
        BaseButton,
        FoodList
    }
}
</script>

<style>
#ms-main-content{
    width: 100%;
    min-width: calc(100% - var(--width_navbar));
    height: calc(100vh - var(--height_header));
    min-height: calc(100vh - var(--height_header));
    background-color: #fff;
}

#ms-header-page{
    width: 100%;
    height: var(--height_header_page);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 8px 0 8px;
}

#ms-title-header-page{
    font-size: 22px;
}

#ms-content-page {
    width: 100%;
    height: calc(100% - var(--height_header_page));
    padding: 8px;
}
</style>