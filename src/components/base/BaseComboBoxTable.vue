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
        // Gi?? tr??? v-model truy???n v??o
        modelValue: {
            
        },
        // Danh s??ch item truy???n v??o
        data: {
            required: true
        },
        // Chu???i x??c ?????nh key text hi???n th???
        value: {
            
        },
        valueText: {
           
        },
        // Chu???i x??c ?????nh key value
        displayText: {
            type: String
        },
        // Ki???u dropdown
        type: {
            type: String,
            default: 'dropdown'
        },
        // Bi???n x??c ?????nh c?? filter kh??ng 
        filterAble: {
            type: Boolean,
            default: false
        },
        // Custom style cho input filter
        styleForInput: {
            type: String
        },
        // B???t bu???c nh???p kh??ng
        require: {
            type: Boolean,
            default: false
        },
        // Tin nh???n th??ng b??o n???u kh??ng nh???p
        messageRequire: {
            type: String,
            default: 'Th??ng tin n??y kh??ng ???????c b??? tr???ng'
        },
    },
    data() {
        return {
            // Bi???n x??c ?????nh d??? li???u c?? h???p l??? kh??ng
            isValid: true,
            // Bi???n l??u text hi???n th???
            label_selected: this.modelValue,
            // Bi???n x??c ?????nh menu item c?? ???????c hi???n kh??ng
            isShowItems: false,
            // Bi???n l??u danh s??ch data truy???n v??o
            options: [],
            // Bi???n l??u ?????a ch??? item ???????c ch???n
            indexItemSelected: -1,
            isFocus: false
        }
    },
    watch: {
        /**
         * H??m x??? l?? khi gi?? tr??? v-model truy???n v??o thay ?????i
         * Author: Nguy???n Ho??ng Anh (31/7/2022)
         */
        modelValue: function(value){
            this.label_selected = value
        },
        /**
         * H??m x??? l?? khi danh s??ch item truy???n v??o thay ?????i
         * Author: Nguy???n Ho??ng Anh (31/7/2022)
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
         * H??m x??? l?? kh?? ???n tab (khi menu item ko dc hi???n)
         * Author: Nguy???n Ho??ng Anh (21/8/2022)
         */
        handleKeyDownTab(){
            this.isFocus = false
        },
        /**
         * H??m x??? l?? s??? ki???n khi click ra ngo??i
         * Author: Nguy???n Ho??ng Anh (8/8/2022)
         */
        clickOutside(){   
            this.isShowItems = false
            this.isFocus = false
        },
        /**
         * H??m x??? l?? hover khi ????a chu???t ra kh???i danh s??ch item
         * Author: Nguy???n Ho??ng Anh (31/7/2022)
         */
        handleMouseLeave() {
            this.indexItemSelected = -1
        },
        /**
         * H??m x??? l?? hover khi ????a chu???t v??o danh s??ch item
         * Author: Nguy???n Ho??ng Anh (31/7/2022)
         */
        handleMouseOver(index){
            this.indexItemSelected = index
        },
        /**
         * H??m x??? l?? s??? ki???n khi blur kh???i input t??m ki???m
         * Author: Nguy???n Ho??ng Anh (31/7/2022)
         */
        handleBlur(event) {
            this.$emit('handleBlur');
        },
        /**
         * H??m x??? l?? s??? ki???n khi focus v??o ?? input t??m ki???m
         * Author: Nguy??? Ho??ng Anh (31/7/2022)
         */
        handleFocus() {
            this.isFocus = true
            this.$refs.inputFilterRef.select()
        },
        /**
         * h??m x??? l?? khi ???n c??c keyboard enter, l??n, xu???ng
         * Author: Nguy???n Ho??ng Anh (31/7/2021)
         */
        onKey(event) {
            if (this.isShowItems == true) {
                //event.preventDefault();
                
                const key = event.key;

                const map = {
                    Enter: () => {
                        if (this.options.length > 0 && this.indexItemSelected != -1) {
                            // Duy???t danh s??ch truy???n v??o v?? set thu???c t??nh selected b???ng false
                            this.data.forEach(item => function () {
                                item.selected = false;
                            })
                            for (var i = 0; i < this.data.length; i++) {
                                if (this.data[i][`${this.displayText}`] == this.options[this.indexItemSelected][`${this.displayText}`]){
                                    // Set gi?? tr??? ???????c ch???n l?? item trong danh s??ch ??ang ???????c ch???n
                                    this.label_selected = this.data[i][`${this.displayText}`];
                                    // Set thu???c t??nh selected b???ng true cho item ????
                                    this.data[i].selected = true;
                                    this.$emit('update:modelValue', this.label_selected)
                                    this.$emit('handleValueChange', this.options[this.indexItemSelected][`${this.valueText}`])
                                    break
                                }
                            }        
                            // ????ng list danh s??ch
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
         * H??m scroll list item
         * @param {*} direction x??c ?????nh ??ang scroll l??n hay xu???ng
         * Author: Nguy???n Ho??ng Anh (14/8/2022) 
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
         * H??m x??? l?? s??? ki???n khi click item
         * Author: Nguy???n Ho??ng Anh (21/7/2022)
         */
        handleItemSelected(item) {
            for (let i = 0 ; i < this.options.length; i++){
                this.options[i].selected = false;
            }
            // G??n gi?? tr??? ??c ch???n 
            this.label_selected = item[`${this.displayText}`];
            item.selected = true;
            // Hi???n th??? label c???a item ???????c ch???n
            this.$emit('update:modelValue', this.label_selected)
            this.$emit('handleValueChange', item[`${this.valueText}`])
            this.isShowItems = false
            var me = this;
            setTimeout(function() {
                me.$refs.inputFilterRef.focus()
            }, 50);
        },
        /**
         * H??m t???t m??? menu
         * Author: Nguy???n Ho??ng Anh (21/7/2022)
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
         * H??m l???c danh s??ch item khi t??m ki???m
         * Author: Nguy???n Ho??ng Anh (31/7/2022) 
         */
        filterOptions() {
            // L???c danh s??ch 
            this.options = []
            this.isShowItems = true;
            const regOption = new RegExp(this.label_selected, 'ig');
            for (var i =0; i < this.data.length; i++){
                if (this.data[i][`${this.displayText}`].match(regOption)){
                    this.options.push(this.data[i])
                }
            }
            
            if (this.options.length > 0) {
                // Set l???i v??? tr?? item ??ang ???????c ch???n trong danh s??ch hi???n t???i
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
         * H??m t???o danh s??ch item t??? data truy???n v??o v?? set item selected n???u c??
         * Author: Nguy???n Ho??ng Anh (31/7/2022)
         */
        getOptionFromData() {
            this.options = []
            // Duy???t qua t???ng ph???n t??? trong danh s??ch data truy???n v??o
            for (let i = 0 ; i < this.data.length; i++){
                // N???u v-model truy???n v??o ???????c t??m th???y trong danh s??ch
                if (this.data[i][`${this.displayText}`] == this.modelValue && this.data[i][`${this.valueText}`]  === this.value){
                    // Set thu???c t??nh item ???? b???ng true
                    this.data[i].selected = true
                    // Hi???n th??? display c???a item ????
                    this.label_selected = this.data[i][`${this.displayText}`];
                    // Set v??? tr?? ??ang ???????c ch???n
                    this.indexItemSelected = i;
                    // Push v??o danh s??ch ????? t???o list item
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
     * Ph??t hi???n khi click ra ngo??i
     * Author: Nguy???n Ho??ng Anh (8/1/2022)
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