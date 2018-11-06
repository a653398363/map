<template>
    <div class="frame">
        <el-form class="query-from"  :model="details">
            <el-row >
                <el-col :span="12"> <el-form-item label="管段名称:">
                    {{details.dataName}}
                </el-form-item></el-col>
            </el-row>
            <el-row >
                <el-col :span="12"> <el-form-item label="输量负荷率:">
                    80%
                </el-form-item></el-col>
                 <el-col :span="12">
                    <el-form-item label="管存量负荷率:">
                       70%
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
               
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
    margin-top: 10px;
    display: inline-block;
}
.button{
    margin-left: 20px;
    float: right;
}
</style>