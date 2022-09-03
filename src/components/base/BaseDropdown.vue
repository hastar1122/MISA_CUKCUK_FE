<template>
    <div class="ms-dropdown" v-click-outside="clickOutside">
        <BaseButton @keydown.prevent.up="test($event)" @keydown.prevent.down="test($event)" :text="label_selected" @handleClick="openItems"></BaseButton>
    </div>
    <ul ref="scrollContainer" v-if="isShowItems == true && options.length > 0" class="menu" :class="[type == 'dropup' ? 'menu-dropup' : 'menu-dropdown']">
        <li ref="options" @mouseover="hanleMouseOver(index)" @mouseleave="handleMouseLeave(index)" v-for="(item,index) in options" :key="item[`${keyText}`]" 
        :class="[index == this.indexItemSelected ? 'item-hover' : '']" 
        @mousedown="handleItemSelected(item)">
        <div style="width: 24px; height: 24px;" :class="[item[`${keyText}`] == this.value_selected ? 'icon-selected': '',]"></div>
        <slot name="itemDropdown" :item="item">{{item[`${displayText}`]}}</slot>
        </li>
    </ul>
</template>

<script>
import BaseButton from './BaseButton.vue';
import vClickOutside from 'click-outside-vue3'

export default {
    components: {
        BaseButton
    },
    emits: ['handleValueChangeDropdown','update:modelValue'],
    props: {
        // Giá trị v-model truyền vào
        modelValue: {

        },
        // Danh sách item truyền vào
        data: {
            required: true
        },
        // Chuỗi xác định key text hiển thị
        keyText: {
            type: String
        },
        // Chuỗi xác định key value
        displayText: {
            type: String
        },
        // Kiểu dropdown
        type: {
            type: String,
            default: 'dropdown'
        },
    },
    data() {
        return {
            // Biến lưu giá trị value
            value_selected: this.modelValue,
            // Biến lưu text hiển thị
            label_selected: null,
            // Biến xác định menu item có được hiện không
            isShowItems: false,
            // Biến lưu danh sách data truyền vào
            options: [],
            // Biến lưu địa chỉ item được chọn
            indexItemSelected: -1,
        }
    },
    watch: {
        modelValue: function(value){
            this.value_selected = value
            for (var i =0; i < this.options.length; i++){
                if (this.options[i][`${this.keyText}`] == value){
                    this.label_selected = this.options[i][`${this.displayText}`];
                    return
                }
            }
            this.label_selected = ''
        },
        /**
         * Hàm xử lý khi giá trị được chọn thay đổi
         * Author: Nguyễn Hoàng Anh (31/7/2022)
         */
        value_selected: function (value) {
            this.$emit('update:modelValue', value);
            this.$emit('handleValueChangeDropdown', value);
            //this.isShowItems = false
        },
    },
    methods: {
        test(event) {
            event.preventDefault()
            console.log('a');
        },
        /**
         * Hàm xử lý sự kiện khi click ra ngoài
         * Author: Nguyễn Hoàng Anh (8/8/2022)
         */
        clickOutside(){   
            this.isShowItems = false
        },
        /**
         * Hàm xử lý hover khi đưa chuột ra khỏi danh sách item
         * Author: Nguyễn Hoàng Anh (31/7/2022)
         */
        handleMouseLeave() {
            this.indexItemSelected = -1
        },
        /**
         * Hàm xử lý hover khi đưa chuột vào danh sách item
         * Author: Nguyễn Hoàng Anh (31/7/2022)
         */
        hanleMouseOver(index){
            this.indexItemSelected = index
        },
        /**
         * hàm xử lý khi ấn các keyboard enter, lên, xuống
         * Author: Nguyễn Hoàng Anh (31/7/2021)
         */
        onKey(event) {
            if (this.isShowItems == true) {
                //event.preventDefault();
                
                const key = event.key;
            
                const map = {
                    Enter: () => {
                        if (this.options.length > 0 && this.indexItemSelected != -1) {
                            // Duyệt danh sách tuyền vào và set thuộc tính selected bằng false
                            this.data.forEach(item => function () {
                                item.selected = false;
                            })
                            for (var i = 0; i < this.data.length; i++) {
                                if (this.data[i][`${this.keyText}`] == this.options[this.indexItemSelected][`${this.keyText}`]){
                                    // Set giá trị được chọn là item trong danh sách đang được chọn
                                    this.value_selected = this.data[i][`${this.keyText}`];
                                    // Set thuộc tính selected bằng true cho item đó
                                    this.data[i].selected = true;
                                    // Set display hiển thị
                                    this.label_selected = this.data[i][`${this.displayText}`];
                                    break
                                }
                            }        
                            // Đóng list danh sách
                            this.isShowItems = false
                        }
                    },
                    ArrowDown: () => {
                        if (this.indexItemSelected > this.options.length - 2){
                            this.indexItemSelected = 0
                            this.$refs.scrollContainer.scrollTop = 0
                        }
                        else
                        {
                            this.indexItemSelected = this.indexItemSelected + 1;
                            this.fixScrolling('down')
                        }
                            
                    },
                    ArrowUp: () => {
                        if (this.indexItemSelected < 1){
                            this.indexItemSelected = this.options.length - 1
                            this.$refs.scrollContainer.scrollTop = 999999999
                        }
                        else
                        {
                            this.indexItemSelected -=1;
                            this.fixScrolling('up')
                        }
                    },
                    Tab: () => {
                        this.isShowItems = false
                    },
                    Escape: () => {
                        this.isShowItems = false
                    }
                }

                const func = map[key];
                if(func) {
                    func();
                }
            }
        },
        /**
         * Hàm scroll list item
         * @param {*} direction xác định đang scroll lên hay xuống
         * Author: Nguyễn Hoàng Anh (14/8/2022) 
         */
        fixScrolling(direction){
            const liH = this.$refs.options[this.indexItemSelected].clientHeight;
            if (direction == 'down' && this.data.length > 0){
                if (liH * (this.indexItemSelected+1) > this.$refs.scrollContainer.clientHeight)
                    this.$refs.scrollContainer.scrollTop += liH;
                else
                    this.$refs.scrollContainer.scrollTop = 0
            }
            else if (direction == 'up' && this.data.length > 0) {
                if (liH * (this.data.length -this.indexItemSelected ) > this.$refs.scrollContainer.clientHeight)
                this.$refs.scrollContainer.scrollTop -= liH;
            }
            else {
                const liH = this.$refs.options[this.indexItemSelected].clientHeight;
                this.$refs.scrollContainer.scrollTop = liH * this.indexItemSelected;
            }
        },
        /**
         * Hàm xử lý sự kiện khi click item
         * Author: Nguyễn Hoàng Anh (21/7/2022)
         */
        handleItemSelected(item) {
            for (let i = 0 ; i < this.options.length; i++){
                this.options[i].selected = false;
            }
            // Gán giá trị đc chọn 
            this.value_selected = item[`${this.keyText}`];
            item.selected = true;
            // Hiển thị label của item được chọn
            this.label_selected = item[`${this.displayText}`];
            this.isShowItems = false
        },
        /**
         * Hàm tắt mở menu
         * Author: Nguyễn Hoàng Anh (21/7/2022)
         */
        openItems() {
            this.isShowItems = !this.isShowItems;
    
            this.getOptionFromData();
            if (this.modelValue && this.isShowItems == true) {
                this.$nextTick(() => this.fixScrolling())
            }
        },
        /**
         * Hàm tạo danh sách item từ data truyền vào và set item selected nếu có
         * Author: Nguyễn Hoàng Anh (31/7/2022)
         */
        getOptionFromData() {
            this.options = []
            // Duyệt qua từng phần tử trong danh sách data truyền vào
            for (let i = 0 ; i < this.data.length; i++){
                // Nếu v-model truyền vào được tìm thấy trong danh sách
                if (this.data[i][`${this.keyText}`] == this.modelValue){
                    // Set thuộc tính item đó bằng true
                    this.data[i].selected = true
                    // Hiện thị display của item đó
                    this.label_selected = this.data[i][`${this.displayText}`];
                    // Set vị trí đang được chọn
                    this.indexItemSelected = i;
                    // Push vào danh sách để tạo list item
                    this.options.push(this.data[i]);
                }
                else{
                    this.data[i].selected = false;
                    this.options.push(this.data[i]);
                }
            }
        }
    },
    created() {
        this.getOptionFromData();
        
        window.addEventListener('keydown', this.onKey)
    },
    unmounted() {
        window.removeEventListener('keydown', this.onKey)
    },
    /**
     * Phát hiện khi click ra ngoài
     * Author: Nguyễn Hoàng Anh (8/1/2022)
     */
    directives: {
      clickOutside: vClickOutside.directive
    },
}
</script>

<style scoped>
.ms-dropdown {
    width: 100%;
    height: 100%;
    position: relative;
}

.ms-dropdown * {
    box-sizing: border-box;
}

.menu {
    list-style: none;
    padding: 0;
    background: #fff;
    border: 1px solid #e1e1e1;
    box-shadow: rgb(136 136 136) 0px 0px 6px;
    border-radius: 1px;
    max-height: 248px;
    overflow: auto;
    position: absolute;
    width: max-content;
    min-width: max-content;
    transition: 0.2s;
    z-index: 1;
}

.menu-dropup {
    bottom: 100%;
}

.menu li {
    padding: 0 6px;
    cursor: pointer;
    line-height: 22px;
    display: flex;
    align-items: center;
}

.actived {
    background: #c1ddf1 !important;
}

.item-hover {
    background-color: #d6e8f6;
}
</style>