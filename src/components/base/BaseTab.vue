<template>
    <div v-show="isSelected" class="tab-panel">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        // Tab có đang được chọn không
        isSelected: {
            type: Boolean
        }
    }
}
</script>

<style>
.tab-panel{
    width: 100%;
    padding-top: 16px;
}
</style>