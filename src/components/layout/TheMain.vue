<template>
    <div id="ms-main">
        <TheHeader @toggleNavbar="toggleNavbar"></TheHeader>
        <div id="ms-content-area">
            <TheNavbar v-if="isShowNavbar"></TheNavbar>
            <TheContent></TheContent>
        </div>
    </div>
</template>

<script>
    import TheNavbar from "./TheNavbar.vue";
    import TheHeader from "./TheHeader.vue"
    import TheContent from './TheContent.vue'
    export default {
        name: 'App',
        components: {
            TheNavbar,
            TheHeader,
            TheContent
        },
        data() {
            return {
                isShowNavbar: true
            }
        },
        methods: {
            toggleNavbar(){
                this.isShowNavbar = !this.isShowNavbar;
            }
        },
    }
</script>

<style>
@import url(../../css/layout/main.css);

#ms-main {
    display: flex;
    flex-direction: column;
}

#ms-content-area {
    display: flex;
}
</style>