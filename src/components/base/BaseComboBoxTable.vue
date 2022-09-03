<template>
    <div style="display: flex; align-items: center;">
        <div ref="msComboboxRef" class="ms-combobox" v-click-outside="clickOutside">
            <div class="select" :class="[{'select-clicked':isFocus}]">
                <input :class="isFocus == true ? 'ms-combobox-filter-focus': 'ms-combobox-filter'"
                ref="inputFilterRef"
                @blur="handleBlur($event)" 
                @focus="handleFocus" 
                @keydown.tab="handleKeyDownTab"
                @input="filterOptions" 
                :readonly="filterAble == false" 
                v-model="label_selected">
                <div v-show="isFocus" @click="openItems" class="caret"></div>
                <div @click="handleAddOnclick" v-show="isFocus" class="icon-add"></div>
                <slot name="option"></slot>
            </div>
            <ul ref="scrollContainer" v-if="isShowItems == true && options.length > 0" class="menu" :class="[type == 'dropup' ? 'menu-dropup' : 'menu-dropdown']">
                <li style="position: sticky; top: 0;">
                    <slot name="headerItem"></slot>
                </li>
                <li ref="options" @mouseover="handleMouseOver(index)" @mouseleave="handleMouseLeave(index)" v-for="(item,index) in options" :key="index" 
                :class="[item[`${displayText}`] == this.label_selected && item[`${valueText}`] === this.value ? 'actived': '', 
                index == this.indexItemSelected ? 'item-hover' : '']" 
                @mousedown="handleItemSelected(item)">
                <slot name="itemComboBox" :item="item">{{item[`${displayText}`]}}</slot>
                </li>
            </ul>
        </div>
        <div v-if="isValid == false" class="tooltip">
            <div class="icon-error"></div>
            <div class="tooltiptext">
                <div class="icon-error" style="margin-left: 0;"></div>
                <div>{{messageRequire}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import vClickOutside from 'click-outside-vue3'

export default {
    props: {
        // Giá trị v-model truyền vào
        modelValue: {
            
        },
        // Danh sách item truyền vào
        data: {
            required: true
        },
        // Chuỗi xác định key text hiển thị
        value: {
            
        },
        valueText: {
           
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
        // Biến xác định có filter không 
        filterAble: {
            type: Boolean,
            default: false
        },
        // Custom style cho input filter
        styleForInput: {
            type: String
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
    },
    data() {
        return {
            // Biến xác định dữ liệu có hợp lệ không
            isValid: true,
            // Biến lưu text hiển thị
            label_selected: this.modelValue,
            // Biến xác định menu item có được hiện không
            isShowItems: false,
            // Biến lưu danh sách data truyền vào
            options: [],
            // Biến lưu địa chỉ item được chọn
            indexItemSelected: -1,
            isFocus: false
        }
    },
    watch: {
        /**
         * Hàm xử lý khi giá trị v-model truyền vào thay đổi
         * Author: Nguyễn Hoàng Anh (31/7/2022)
         */
        modelValue: function(value){
            this.label_selected = value
        },
        /**
         * Hàm xử lý khi danh sách item truyền vào thay đổi
         * Author: Nguyễn Hoàng Anh (31/7/2022)
         */
        data: function() {
            this.getOptionFromData()
        },
    },
    methods: {
        handleAddOnclick(){
            this.$emit('handleAddOnclick');
        },
        /**
         * Hàm xử lý khí ấn tab (khi menu item ko dc hiện)
         * Author: Nguyễn Hoàng Anh (21/8/2022)
         */
        handleKeyDownTab(){
            this.isFocus = false
        },
        /**
         * Hàm xử lý sự kiện khi click ra ngoài
         * Author: Nguyễn Hoàng Anh (8/8/2022)
         */
        clickOutside(){   
            this.isShowItems = false
            this.isFocus = false
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
        handleMouseOver(index){
            this.indexItemSelected = index
        },
        /**
         * Hàm xử lý sự kiện khi blur khỏi input tìm kiếm
         * Author: Nguyễn Hoàng Anh (31/7/2022)
         */
        handleBlur(event) {
            this.$emit('handleBlur');
        },
        /**
         * Hàm xử lý sự kiện khi focus vào ô input tìm kiếm
         * Author: Nguyễ Hoàng Anh (31/7/2022)
         */
        handleFocus() {
            this.isFocus = true
            this.$refs.inputFilterRef.select()
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
                            // Duyệt danh sách truyền vào và set thuộc tính selected bằng false
                            this.data.forEach(item => function () {
                                item.selected = false;
                            })
                            for (var i = 0; i < this.data.length; i++) {
                                if (this.data[i][`${this.displayText}`] == this.options[this.indexItemSelected][`${this.displayText}`]){
                                    // Set giá trị được chọn là item trong danh sách đang được chọn
                                    this.label_selected = this.data[i][`${this.displayText}`];
                                    // Set thuộc tính selected bằng true cho item đó
                                    this.data[i].selected = true;
                                    this.$emit('update:modelValue', this.label_selected)
                                    this.$emit('handleValueChange', this.options[this.indexItemSelected][`${this.valueText}`])
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
                        if (this.indexItemSelected != -1&& this.options.length > 0) {
                            this.label_selected = this.options[0][`${this.displayText}`];
                            this.$emit('update:modelValue', this.label_selected)
                            this.$emit('handleValueChange', this.options[0][`${this.valueText}`])
                        }
                        this.isShowItems = false
                        this.isFocus = false
                    },
                    Escape: () => {
                        event.preventDefault();
                        
                        this.isFocus = false
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
            if (this.indexItemSelected != -1) {
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
            this.label_selected = item[`${this.displayText}`];
            item.selected = true;
            // Hiển thị label của item được chọn
            this.$emit('update:modelValue', this.label_selected)
            this.$emit('handleValueChange', item[`${this.valueText}`])
            this.isShowItems = false
            var me = this;
            setTimeout(function() {
                me.$refs.inputFilterRef.focus()
            }, 50);
        },
        /**
         * Hàm tắt mở menu
         * Author: Nguyễn Hoàng Anh (21/7/2022)
         */
        openItems() {
            this.isShowItems = !this.isShowItems;
            this.$nextTick(() => this.$refs.inputFilterRef.focus())
            this.getOptionFromData();
            if (this.modelValue && this.isShowItems == true) {
                this.$nextTick(() => this.fixScrolling())
            }
        },
        /**
         * Hàm lọc danh sách item khi tìm kiếm
         * Author: Nguyễn Hoàng Anh (31/7/2022) 
         */
        filterOptions() {
            // Lọc danh sách 
            this.options = []
            this.isShowItems = true;
            const regOption = new RegExp(this.label_selected, 'ig');
            for (var i =0; i < this.data.length; i++){
                if (this.data[i][`${this.displayText}`].match(regOption)){
                    this.options.push(this.data[i])
                }
            }
            
            if (this.options.length > 0) {
                // Set lại vị trí item đang được chọn trong danh sách hiện tại
                for (var i =0; i < this.options.length; i++){
                    if (this.options[i][`${this.valueText}`] === this.value){
                        this.indexItemSelected = i;
                        break
                    }
                    else 
                        this.indexItemSelected = 0;
                }
                this.isShowItems = true;
            }
            
            if (this.options.length > 0)
                this.$nextTick(() => this.fixScrolling())
            this.$emit('update:modelValue', this.label_selected)
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
                if (this.data[i][`${this.displayText}`] == this.modelValue && this.data[i][`${this.valueText}`]  === this.value){
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
        window.addEventListener('keydown', this.onKey)
    },
    unmounted() {
        window.removeEventListener('keydown', this.onKey)
    },
    updated() {
        if (this.isShowItems == true && this.options.length > 0){
            var menu = this.$refs.scrollContainer
            var combobox = this.$refs.msComboboxRef
            menu.style.width = `${combobox.offsetWidth}px`
        }
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
.select-clicked {
    border: 1px #0071c1 solid !important;
    background-color: #fff;
}

.ms-combobox {
    width: 100%;
    height: 100%;
    position: relative;
}

.ms-combobox * {
    box-sizing: border-box;
}

.select {
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    min-height: 22px;
    cursor: pointer;
}


.ms-combobox-filter{
    color: #000;
    background-color: transparent;
    padding: 5px 10px 4px!important;
    width: 100%;
    font-family: tahoma;
    border: 0;
    min-height: 22px;
    outline: none;
}

.ms-combobox-filter-focus {
    color: #000;
    padding: 3px 5px 3px!important;
    font-size: 12px!important;
    width: 100%;
    font-family: tahoma;
    border: 0;
    min-height: 22px;
    outline: none;
}

.caret{
    min-width: 22px;
    height: 22px;
    background-image: url(../../assets/img/trigger2.png)!important;
    background-position: 0 center;
}

.caret:hover{
    background-color: #e1e1e1;
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
    position: fixed;
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
    text-align: left;
}

.actived {
    background: #c1ddf1 !important;
}

.item-hover {
    background-color: #d6e8f6;
}
</style>