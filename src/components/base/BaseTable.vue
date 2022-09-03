<template>
    <div class="flex" style="flex-direction: column; height: 100%;">
        <div class="ms-table">
            <table ref="table_resizable" class="ms-table-base" id="table-resizable">
                <thead class="ms-table-header">
                    <tr class="ms-table-tr">
                        <th class="ms-table-th" 
                        v-for="(header,index) in headers" :key="index" 
                        :style="{minWidth: header.width + 'px'}">
                            <div class="ms-header-col" 
                            :style="{minWidth: header.width + 'px' }">
                                <div @click="btnTableHeaderOnClick(header.value)" class="ms-header-col-title">
                                    <span 
                                    :class="[{'ms-column-header-sort-ASC' : columnSorted.property == header.value && columnSorted.direction == 0},
                                    {'ms-column-header-sort-DESC' : columnSorted.property == header.value && columnSorted.direction == 1}]">
                                        {{header.text}}
                                    </span>
                                </div>
                                <div>
                                    <slot name="header" v-bind:="header"></slot>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="ms-table-body">
                    <slot name="body">
                        <tr
                        @dblclick="rowOnDbClick(item,index)"
                        @click="rowOnClick($event,item,index)"
                        @contextmenu="rowOnRightClick($event, item, index)"
                        :class="{'ms-body-tr-selected':item.selected == true}" 
                        v-for="(item,index) in items" :key="item[`${keyId}`]" class="ms-body-tr">

                            <td v-for="(data,index2) in headers" :key="index2" 
                            :class="[{'text-center':headers[index2].align == 'center'} , {'text-left' : headers[index2].align == 'left'} , {'text-right': headers[index2].align == 'right'}]" 
                            class="ms-body-td">
                                <div class="ms-body-td-content" :style="{width: headers[index2].width + 'px'}" v-if="headers[index2].type == 'Date'">{{formatDate(item[`${headers[index2].value}`])}}</div>
                                <div v-else-if="headers[index2].type == 'Money'" class="ms-body-td-content" :class="'ms-body-td-'+ encrypt(headers[index2].value)" :style="{width: headers[index2].width + 'px'}">
                                    {{formatMoney(item[`${headers[index2].value}`])}}
                                </div>
                                <div class="ms-body-td-content" :class="'ms-body-td-'+ encrypt(headers[index2].value)" :style="{width: headers[index2].width + 'px'}" v-else>
                                    <slot name="item" :item="item" :x="index" :y="index2" :key="headers[index2].value" :value="item[`${headers[index2].value}`]">{{item[`${headers[index2].value}`]}}</slot>
                                </div>
                            </td>
                        </tr>
                    </slot>
                </tbody>
            </table>
        </div>
        <div v-if="isShowFooter" class="ms-table-footer">
            <slot name="table-footer"></slot>
        </div>
    </div>
</template>

<script>
import {Direction} from '../../enums/MISAEnum'

export default {
    components: {
        
    },
    props: {
        // Giá trị v-model truyền vào
        modelValue:{
            
        },
        // Danh sách các tiêu đề
        headers: {
            required: true
        },
        // Danh sách các item
        items: {
            required: true,
        },
        // Khóa chính để xác định giữa các item
        keyId: {
            //required: true,
        },
        // Xác định có hiện footer không
        isShowFooter: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // Biến lưu danh sách nhân viên đang được chọn
            itemsSelected: [],
            // Biến lưu danh sách khóa key của các item đang được chọn
            arrayKeySelected: [],
            // Biến lưu số item được chọn tìm thấy trong danh sách hiện tại
            currentItemsSelectedInPage: 0,
            // Biến lưu vị trí item đang được chọn
            indexItemSelected: 0,
            // Biến lưu cột đang được sắp xếp
            columnSorted: {property: null, direction: null}
        }
    },
    watch: {
        /**
         * Hàm xử lý khi items truyền vào thay đổi
         * Author: Nguyễn Hoàng Anh (23/7/2022)
         */
        items: function(){
            try {
                if (this.items.length > 0 && this.items != null) {
                    this.items[0].selected = true;
                    this.indexItemSelected = 0;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý khi danh sách các item được chọn thay đổi
         * Author: Nguyễn Hoàng Anh (23/7/2022)
         */
        itemsSelected: function() {
            try {
                //console.log(this.itemsSelected.length);
            } catch (error) {
                console.log(error);
            }
        }
    },
    methods: {
        /**
         * Hàm sắp xếp khi click vào cột
         * @param {*} value // Tên của cột
         * Author: Nguyễn Hoàng Anh (15/8/2022) 
         */
        btnTableHeaderOnClick(value){
            if (value != this.columnSorted.property) {
                this.columnSorted.property = value;
                this.columnSorted.direction = Direction.ASC;
            }
            else {
                if (this.columnSorted.direction == Direction.ASC)
                    this.columnSorted.direction = Direction.DESC;
                else
                    this.columnSorted.direction = Direction.ASC
            }
            this.$emit('btnTableHeaderOnClick', this.columnSorted);
        },
        /**
         * Hàm mã hóa class mỗi column
         * Author: Nguyễn Hoàng Anh (12/8/2022)
         */
        encrypt(value) {
            var number = "0x";
            var length = value.length;
            for (var i = 0; i < length; i++)
                number += value.charCodeAt(i).toString(16);
            return number;
        },
        /**
         * Focus vào dòng khi click vào
         * Author: Nguyễn Hoàng Anh (12/8/2022)
         */
        rowOnClick(event, item, index){
            try {
                if (event.shiftKey){
                    this.items.forEach(item => {
                        item.selected = false
                    });
                    if (index > this.indexItemSelected) {
                        for (var i = this.indexItemSelected; i <= index ; i++){
                            this.items[i].selected = true;
                        }
                    }
                    else {
                        for (var i = this.indexItemSelected; i >= index ; i--){
                            this.items[i].selected = true;
                        }
                    }
                    this.getAllItemSelected();
                }
                else if (event.ctrlKey) {
                    if (item.selected == false){
                        item.selected = true;
                        //this.indexItemSelected = index
                    }
                    else 
                        item.selected = false
                        
                    this.getAllItemSelected();
                }
                else {
                    this.items.forEach(item => {
                        item.selected = false
                    });
                    item.selected = true;
                    this.indexItemSelected = index
                    this.getAllItemSelected();
                    this.$emit('rowOnClick',item);
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm sử lý định dạng dữ liệu tiền
         * Author: Nguyễn Hoàng Anh (22/6/2022)
         */
        formatMoney(value) {
            if (typeof value == 'number' && (value || value === 0)) {
                var money = Math.round(value);
                return money.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
        },
        /**
         * Hàm sử lý dữ liệu ngày tháng năm sinh
         * Author: Nguyễn Hoàng Anh (22/6/2022)
         */
        formatDate(dob){
            try {
                let dateConvert = new Date(dob);
                if (dob && (dateConvert instanceof Date && !isNaN(dateConvert.valueOf()))){
                    let date = dateConvert.getDate();
                    // Lấy ra ngày
                    date = date < 10 ? `0${date}` : date;
                    // Lấy ra tháng:
                    let month = dateConvert.getMonth() + 1;
                    month = month < 10 ? `0${month}` : month;
                    // Lấy ra năm:
                    let year = dateConvert.getFullYear();
                    dob = `${date}/${month}/${year}`;
                    return dob;
                }else{
                    return null;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý sự kiện double click
         * Author: Nguyễn Hoàng Anh (12/8/2022)
         */
        rowOnDbClick(item, index){
            try {
                this.items.forEach(item => {
                    item.selected = false
                });
                item.selected = true;
                this.indexItemSelected = index
                this.$emit('rowOnDbClick',item);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm xử lý sự kiện click chuột phải
         * Author: Nguyễn Hoàng Anh (28/8/2022)
         */
        rowOnRightClick(event, item, index) {
            try {
                event.preventDefault();
                console.log(item.selected);
                if (!item.selected)
                {
                    this.items.forEach(item => {
                        item.selected = false
                    });
                    item.selected = true;
                    this.indexItemSelected = index
                    this.getAllItemSelected();
                }
                // else {
                //     item.selected = true;
                // }
                
                this.$emit('rowOnRightClick', event, item);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * Hàm lấy danh sách các items đang được chọn
         * Author: Nguyễn Hoàng Anh (12/8/2022)
         */
        getAllItemSelected () {
            this.clearItemsSelected();
            this.items.forEach(item => {
                if(item.selected == true) {
                    this.itemsSelected.push(item)
                }
            })
            this.$emit('update:modelValue', this.itemsSelected);
        },
        /**
         * Hàm xóa tất cả các item đang chọn
         * Author: Nguyễn Hoàng Anh (23/7/2022)
         */
        clearItemsSelected(){
            try {
                this.itemsSelected=[];
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        var me = this;
        const createResizableColumn = function (col, resizer, i) {
            // Track the current position of mouse
            let x = 0;
            let w = 0;

            const contentCols = document.getElementsByClassName('ms-body-td-' + me.encrypt(me.headers[i].value));

            const mouseDownHandler = function (e) {
                // Get the current mouse position
                x = e.clientX;

                // Calculate the current width of column
                const styles = window.getComputedStyle(col);
                w = parseInt(styles.width, 10);

                // Attach listeners for document's events
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            };

            const mouseMoveHandler = function (e) {
                // Determine how far the mouse has been moved
                const dx = e.clientX - x;

                // Update the width of column
                col.style.minWidth = `${w + dx}px`;
                me.headers[i].width = `${w + dx}px`;
                for (let i = 0; i < contentCols.length; i++) {
                    contentCols[i].style.minWidth = `${w + dx}px`
                }
                
            };

            // When user releases the mouse, remove the existing event listeners
            const mouseUpHandler = function () {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };

            resizer.addEventListener('mousedown', mouseDownHandler);
        };
        
        // Query the table
        const table = this.$refs.table_resizable;

        //for (var x = 0 ; x < table.length; x ++){
            // Query all headers
            const cols = table.querySelectorAll('th');
            
            var i = 0;
            // Loop over them
            [].forEach.call(cols, function (col) {
                
                // Create a resizer element
                const resizer = document.createElement('div');
                resizer.classList.add('resize');

                // Set the height
                //resizer.style.height = `${table.offsetHeight}px`;

                // Add a resizer element to the column
                col.appendChild(resizer);

                // Will be implemented in the next section
                createResizableColumn(col, resizer,i);

                i++;
            });
        //}
        
    },
}
</script>

<style>
.ms-table{
    overflow: auto;
    height: 100%;
    width: 100%;
    border: 1px solid #c5c5c5;
    border-top: 0;
    position: relative;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}

.ms-table-base {
    width: 100%;
    border-spacing: 0;
    font-size: 13px;
}

.ms-table-header {
    border: 1px solid #c1c1c1;
    background-color: #f5f5f5;
    min-width: 100%;
    position: sticky;
    top: 0;
    z-index: 1;
}

.ms-table-header th {
    font-weight: normal !important;
    position: relative;
}

.ms-table-header-content {
    width: 100%;
}

.ms-table-body {
    width: auto;
    height: auto;
}

.ms-table-tr {
    min-height: 28px;
}

.ms-table-th {
    min-height: 28px;
    text-align: center!important;
    border-right: 1px solid #c5c5c5;
    border-bottom: 1px solid #c5c5c5;
    background-image: none;
    background-color: #ededed;
}

.ms-header-col {
    display: flex;
    flex-direction: column;
    position: relative;
}

.resize {
    position: absolute;
    width: 5px;
    height: 100%;
    top: 0;
    cursor: col-resize;
    right: 0;
}

.ms-header-col-title:hover{
    background-color: #eef6fb;
    cursor: default;
}

.ms-header-col-title {
    padding: 7px 10px 7px 10px;
}

.ms-table-body{
    background: #fff;
    border: 1px solid #ccc;
    display: contents;
}

.ms-body-tr {
    font-size: 13px;
    color: #000;
    line-height: 15px;
}

.ms-body-tr:hover {
    background-color: #e2eff8 !important;
}

.ms-body-tr-selected {
    background-color: rgba(155,199,227,.4)!important;
}

.ms-body-tr:nth-child(even) {
  background-color: #fafafa;
}

.ms-body-td {
    border-right: 1px solid #ccc!important;
    border-bottom: 1px solid #ccc!important;
}

.ms-body-td-content {
    padding: 5px 10px 4px 10px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    vertical-align: middle;
}

.ms-table-footer {
    position: sticky;
    bottom: 0;
    min-height: 27px;
    border-width: 0 1px 1px 1px ;
    border-style:solid ;
    border-color: #ccc;
}

.ms-column-header-sort-ASC {
    background-image: url(../../assets/img/sort_asc.png);
    padding-right: 17px;
    background-position: right center;
    white-space: nowrap;
    background-repeat: no-repeat;
}

.ms-column-header-sort-DESC {
    background-image: url(../../assets/img/sort_desc.png);
    padding-right: 17px;
    background-position: right center;
    white-space: nowrap;
    background-repeat: no-repeat;
}
</style>