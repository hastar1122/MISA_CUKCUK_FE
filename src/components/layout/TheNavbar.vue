<template>
    <div id="menu-container">
        <div class="menu-list-item">
            <div class="menu-item">
                <div class="menu-item-icon">
                    <div class="mi mi-24 me-warehouse"></div>
                </div>
                <div class="menu-item-tilte">Kho</div>
            </div>
            <div class="menu-item">
                <div class="menu-item-icon">
                    <div class="mi mi-24 mi-promotion"></div>
                </div>
                <div class="menu-item-tilte">Khuyến mại</div>
            </div>
            <div class="menu-item menu-item-selected">
                <div class="menu-item-icon">
                    <div class="mi mi-24 mi-menu"></div>
                </div>
                <div class="menu-item-tilte">Thực đơn</div>
            </div>
            <div class="menu-item">
                <div class="menu-item-icon">
                    <div class="mi mi-24 mi-category"></div>
                </div>
                <div class="menu-item-tilte">Danh mục</div>
            </div>
            <div class="menu-item">
                <div class="menu-item-icon">
                    <div class="mi mi-24 mi-setting"></div>
                </div>
                <div class="menu-item-tilte">Thiết lập hệ thống</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
#menu-container{
    width: auto;
    background-color: #0973b9;
}

.menu-list-item{
    height: calc(100vh - var(--height_header));
    width: var(--width_navbar);
    overflow: auto;
}

.menu-item{
    border-bottom: 1px solid #016087;
    border-top: 1px solid #038ac1;
    height: 40px;
    color: #fff;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.menu-item:hover{
    background-color: #eb7728;
}

.menu-item-selected {
    background-color: #0199fc !important;
}

.menu-item-icon {
    display: flex;
    align-items: center;
    margin-right: 7px;
    margin-left: 12px;
}
</style>