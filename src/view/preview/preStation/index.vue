<template>
    <div class="frame">
        <el-form class="query-from"  :model="details">
            <el-row >
                <el-col :span="24"> 
                    {{details.dataName}}（{{details.dataType}}）
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="24">35~C
                </el-col>
            </el-row>
            <el-row>
               <el-col :span="24">
                    <el-form-item label="实时输量:">
                       3M2/s,30%负荷
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="footer">
            <el-button type="primary" @click="saveInfo" size="mini" class="button">关注</el-button>
        </span>
    </div>
</template>

<script>
import {errorMessage,successMessage} from '@/util/message.js';
export default {
  props: {
    detailObj: Object
  },
  data() {
    return {
      details: {},
    };
  },
  created() {
    //自定义方法
    console.log("detailObj",this.detailObj)
  },
  watch:{
      "$parent.detailObj"(){
          this.showData()
      }
  },
  methods: {
    showData(){
        console.log('detailObj',this.$parent.detailObj)
        this.details = this.$parent.detailObj.values_;

    },
    saveInfo(){

    },
    cancel(){
        
    }
  }
};
</script>

<style scoped>
.frame{
    width: 240px;
}
/* .el-form-item__label{
    padding: 0!important;
} */
.el-form-item{
    margin: 0!important;
}
.el-col{
    height: 20px!important;
    line-height: 20px!important;
}
.el-row{
    height: 20px!important;
    line-height: 20px!important;
}
.footer{
    width: 100%;
    display: inline-block;
}
.button{
    margin-left: 20px;
    float: right;
}
</style>