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
        // Gi?? tr??? v-model truy???n v??o
        modelValue: {
            
        },
        // Danh s??ch item truy???n v??o
        data: {
            required: true
        },
        // Chu???i x??c ?????nh key text hi???n th???
        keyText: {
            type: String
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
        // Bi???n x??c ?????nh theme combo box
        theme: {
            type: String,
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
        label: {
            type:[String, Boolean],
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
            // Bi???n l??u gi?? tr??? value
            value_selected: this.modelValue,
            // Bi???n l??u text hi???n th???
            label_selected: null,
            // Bi???n x??c ?????nh menu item c?? ???????c hi???n kh??ng
            isShowItems: false,
            // Bi???n l??u danh s??ch data truy???n v??o
            options: [],
            // Bi???n l??u ?????a ch??? item ???????c ch???n
            indexItemSelected: -1,
            // Bi???n x??c ?????nh input filter c?? ???????c focus kh??ng
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
         * H??m x??? l?? khi gi?? tr??? ???????c ch???n thay ?????i
         * Author: Nguy???n Ho??ng Anh (31/7/2022)
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
         * H??m x??? l?? s??? ki???n khi click ra ngo??i
         * Author: Nguy???n Ho??ng Anh (8/8/2022)
         */
        clickOutside(){   
            if (this.isShowItems == true)
                this.isShowItems = false
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
        hanleMouseOver(index){
            this.indexItemSelected = index
        },
        /**
         * H??m x??? l?? s??? ki???n khi blur kh???i input t??m ki???m
         * Author: Nguy???n Ho??ng Anh (31/7/2022)
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
         * H??m x??? l?? s??? ki???n khi focus v??o ?? input t??m ki???m
         * Author: Nguy??? Ho??ng Anh (31/7/2022)
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
                            // Duy???t danh s??ch tuy???n v??o v?? set thu???c t??nh selected b???ng false
                            this.data.forEach(item => function () {
                                item.selected = false;
                            })
                            for (var i = 0; i < this.data.length; i++) {
                                if (this.data[i][`${this.keyText}`] == this.options[this.indexItemSelected][`${this.keyText}`]){
                                    // Set gi?? tr??? ???????c ch???n l?? item trong danh s??ch ??ang ???????c ch???n
                                    this.value_selected = this.data[i][`${this.keyText}`];
                                    // Set thu???c t??nh selected b???ng true cho item ????
                                    this.data[i].selected = true;
                                    // Set display hi???n th???
                                    this.label_selected = this.data[i][`${this.displayText}`];
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
         * H??m scroll list item
         * @param {*} direction x??c ?????nh ??ang scroll l??n hay xu???ng
         * Author: Nguy???n Ho??ng Anh (14/8/2022) 
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
         * H??m x??? l?? s??? ki???n khi click item
         * Author: Nguy???n Ho??ng Anh (21/7/2022)
         */
        handleItemSelected(item) {
            for (let i = 0 ; i < this.options.length; i++){
                this.options[i].selected = false;
            }
            // G??n gi?? tr??? ??c ch???n 
            this.value_selected = item[`${this.keyText}`];
            item.selected = true;
            // Hi???n th??? label c???a item ???????c ch???n
            this.label_selected = item[`${this.displayText}`];
            this.isShowItems = false
        },
        /**
         * H??m t???t m??? menu
         * Author: Nguy???n Ho??ng Anh (21/7/2022)
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
            if ((this.value_selected || this.value_selected === 0) && this.options.length > 0) {
                // Set l???i v??? tr?? item ??ang ???????c ch???n trong danh s??ch hi???n t???i
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
         * H??m t???o danh s??ch item t??? data truy???n v??o v?? set item selected n???u c??
         * Author: Nguy???n Ho??ng Anh (31/7/2022)
         */
        getOptionFromData() {
            this.options = []
            // Duy???t qua t???ng ph???n t??? trong danh s??ch data truy???n v??o
            for (let i = 0 ; i < this.data.length; i++){
                // N???u v-model truy???n v??o ???????c t??m th???y trong danh s??ch
                if (this.data[i][`${this.keyText}`] == this.modelValue){
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