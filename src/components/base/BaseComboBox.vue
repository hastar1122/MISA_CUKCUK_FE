<template>
    <div style="display: flex; align-items: center;">
        <label v-if="label" class="ms-combobox-label">{{label}}<span v-if="require" class="ms-combobox-required"> (*)</span></label>
        <div ref="msComboboxRef" class="ms-combobox" v-click-outside="clickOutside">
            <div :class="[theme == 'dark' ? 'select-dark' : 'select-light', {'select-clicked':isFocus && theme != 'dark'},isValid == true? '': 'ms-combobox-validate-error']">
                <input :class="[theme == 'dark' ? 'ms-combobox-filter-dark': 'ms-combobox-filter-light', styleForInput]"
                ref="inputFilterRef"
                @blur="handleBlur($event)" 
                @focus="handleFocus" 
                @input="filterOptions" 
                :readonly="filterAble == false" 
                v-model="label_selected">
                <div @click="openItems" :class="[theme == 'dark' ? 'caret-dark': 'caret-light']"></div>
                <slot name="option"></slot>
            </div>
            <ul ref="scrollContainer" v-if="isShowItems == true && options.length > 0" class="menu" :class="[type == 'dropup' ? 'menu-dropup' : 'menu-dropdown']">
                <li ref="options" @mouseover="hanleMouseOver(index)" @mouseleave="handleMouseLeave(index)" v-for="(item,index) in options" :key="item[`${keyText}`]" 
                :class="[item[`${keyText}`] == this.value_selected ? 'actived': '', 
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
        // Biến xác định có filter không 
        filterAble: {
            type: Boolean,
            default: false
        },
        // Biến xác định theme combo box
        theme: {
            type: String,
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
        label: {
            type:[String, Boolean],
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
            // Biến xác định input filter có được focus không
            isFocus: false
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
        data: function(value) {
            this.getOptionFromData()
        },
        /**
         * Hàm xử lý khi giá trị được chọn thay đổi
         * Author: Nguyễn Hoàng Anh (31/7/2022)
         */
        value_selected: function (value) {
            //console.log('value',value);
            if (this.require == true && !this.value_selected)
                this.isValid = false
            else
                this.isValid = true
            this.$emit('update:modelValue', value);
            this.$emit('handleValueChange', value);
        },
    },
    methods: {
        /**
         * Hàm xử lý sự kiện khi click ra ngoài
         * Author: Nguyễn Hoàng Anh (8/8/2022)
         */
        clickOutside(){   
            if (this.isShowItems == true)
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
         * Hàm xử lý sự kiện khi blur khỏi input tìm kiếm
         * Author: Nguyễn Hoàng Anh (31/7/2022)
         */
        handleBlur() {
            
            if (this.indexItemSelected != -1 && !this.value_selected && this.label_selected) {
                this.label_selected = this.options[0][`${this.displayText}`];
                this.value_selected = this.options[0][`${this.keyText}`];
            }
            else if (this.value_selected && this.label_selected) {
                for (var i =0; i < this.data.length; i++){
                    if (this.data[i][`${this.keyText}`] == this.value_selected){
                        this.label_selected = this.data[i][`${this.displayText}`];
                    }
                }
            }
            else if ((this.value_selected || this.value_selected == 0) && !this.label_selected){
                this.label_selected = ''
                this.value_selected = null
            }
            else if (!this.value_selected && this.label_selected){
                this.label_selected = ''
                this.value_selected = null
            } 
            if (this.require == true && !this.value_selected)
                this.isValid = false
            else
                this.isValid = true
            this.isFocus = false
            //this.isShowItems = false
        },
        /**
         * Hàm xử lý sự kiện khi focus vào ô input tìm kiếm
         * Author: Nguyễ Hoàng Anh (31/7/2022)
         */
        handleFocus() {
            this.isFocus = true
            // if ((this.value_selected || this.value_selected === 0)){
            //     this.$refs.inputFilterRef.select()
            // }
            // else{
            //     this.isShowItems = true
            //     this.getOptionFromData();
            // }
            this.$refs.inputFilterRef.select()
            //this.getOptionFromData();
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
            this.$refs.inputFilterRef.focus()
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
            if ((this.value_selected || this.value_selected === 0) && this.options.length > 0) {
                // Set lại vị trí item đang được chọn trong danh sách hiện tại
                for (var i =0; i < this.options.length; i++){
                    if (this.options[i][`${this.keyText}`] == this.value_selected){
                        this.indexItemSelected = i;
                    }
                }
                this.isShowItems = true;
            }
            else if (!this.value_selected && this.options.length > 0)
            {
                this.indexItemSelected = 0
            }
            else {
                this.indexItemSelected = -1
            }

            if (this.options.length > 0)
                this.$nextTick(() => this.fixScrolling())
            
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
}

.ms-combobox {
    width: 100%;
    height: 100%;
    position: relative;
}

.ms-combobox * {
    box-sizing: border-box;
}

.select-dark {
    background-color: #005082!important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* border: 1px solid #005082; */
    height: 100%;
    min-height: 22px;
    cursor: pointer;
}

.select-light {
    background-color: #fff !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    height: 100%;
    min-height: 22px;
    cursor: pointer;
}

.ms-combobox-validate-error{
    border-color: #cf4c35ed;
}
.ms-combobox-label {
    min-width: 125px;
    white-space: nowrap;
}

.ms-combobox-required {
    color: red;
}

.ms-combobox-filter-dark{
    font-size: 12px;
    background-color: #005082!important;
    color: #fff;
    line-height: 26px!important;
    min-height: 22px;
    padding: 3px 5px 3px!important;
    width: 100%;
    font-family: tahoma;
    border: 0;
    outline: none;
}

.ms-combobox-filter-light{
    font-size: 12px;
    background-color: #fff;
    color: #000;
    padding: 3px 5px 3px!important;
    width: 100%;
    font-family: tahoma;
    border: 0;
    min-height: 22px;
    outline: none;
}

.caret-dark {
    width: 22px;
    height: 32px;
    background-image: url(../../assets/img/trigger.png)!important;
    background-position: 0 center;
}

.caret-dark:hover{
    background-color: #003f68;
}

.caret-light{
    min-width: 22px;
    height: 22px;
    background-image: url(../../assets/img/trigger2.png)!important;
    background-position: 0 center;
}

.caret-light:hover{
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
    position: absolute;
    /* position: fixed; */
    width: 100%;
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