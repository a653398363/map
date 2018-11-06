<template>
 <div class="Addtable">
   <!-- <el-dialog :close-on-click-modal="false" :title="isAdd?'新增-点位信息':'修改-点位信息'" :visible.sync="visible"> -->
  <el-table :data="addPlanRoute" border style="width:100%">
    <el-table-column  label="站场名称">
           <template slot-scope="scope">
               <el-select v-model="ZCDWData.ZCDM" filterable placeholder="请选择" :disabled="inputs">
                    <el-option v-for="item in zcoptions" :key="item.ItemId" :label="item.ItemName" :value="item.ItemId">
                    </el-option>
               </el-select>
           </template>
       </el-table-column>
       <el-table-column  label="管线名称">
           <template slot-scope="scope">
               <el-select v-model="ZCDWData.GXBM" filterable placeholder="请选择">
                    <el-option v-for="item in gxoptions" :key="item.ItemId" :label="item.ItemName" :value="item.ItemId">
                    </el-option>
               </el-select>
           </template>
       </el-table-column>
       <el-table-column  label="点位代码">
           <template slot-scope="scope">
               <el-input v-model="ZCDWData.INSTANT_ID" placeholder="请输入内容"></el-input>
           </template>
       </el-table-column>
       <el-table-column  label="点位名称">
           <template slot-scope="scope">
               <el-input v-model="ZCDWData.INSTANT_NAME" placeholder="请输入内容"></el-input>
           </template>
       </el-table-column>
       <el-table-column  label="计量单位">
           <template slot-scope="scope">
               <el-input v-model="ZCDWData.ENGUNIT" placeholder="请输入内容"></el-input>
           </template>
       </el-table-column>
       <el-table-column  label="设计值">
           <template slot-scope="scope">
               <el-input v-model="ZCDWData.SJZ" placeholder="请输入内容"></el-input>
           </template>
       </el-table-column>
       <el-table-column  label="压力负荷分组">
           <template slot-scope="scope">
               <el-input v-model="ZCDWData.YLFHFZ" placeholder="请输入内容"></el-input>
           </template>
       </el-table-column>
       <el-table-column  label="使用标识">
           <template slot-scope="scope">
               <el-switch active-value="1" inactive-value="0"  v-model="ZCDWData.SYBZ"></el-switch>
           </template>
       </el-table-column>
  </el-table>
  <el-row>
    <el-col>
        <el-button type="primary" size="small" icon="el-icon-search" @click="saveInfo()">保存</el-button>
        <!-- //<el-button type="primary" size="small" icon="el-icon-search" @click="editfun(this.query)">修改</el-button> -->
        <!-- <el-button type="primary" size="small" icon="el-icon-search" @click="resetfun()">重置</el-button> -->
    </el-col>
  </el-row>
   <!-- </el-dialog> -->
 </div>
</template>

<script>
export default {
  data() {
    return {
      //visible: false,
      inputs: false,
      addPlanRoute: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      zcoptions:[],
      gxoptions:[],
      ZCDWData:{
        keyId:"",
        ZCDM:"",
        GXBM:"",
        INSTANT_ID:"",
        INSTANT_NAME:"",
        ENGUNIT:"",
        SJZ:"",
        YLFHFZ:"",
        SYBZ:"1"
      },
      //KeyIds:""
    };
  },
  created() {
    //this.KeyIds = this.$route.query.KeyId
    //this.KeyIds = "5";
    //this.querfun(this.KeyIds);
    this.LoadZCmc();
    this.LoadGXmc();
  },
  methods: {
    querfun(KeyIds) {
      if(KeyIds != null){
        var keyId = KeyIds;
      let _this = this;
        _this.axios
        .post("Stationaddition/ShowDWXXdata?keyId="+keyId+" ", { keyId: keyId }) //查询
        .then(res => {
          //console.log('666666',res);
          _this.ZCDWData = res.data.Data[0];
        })
        .catch(err => {
        });
        _this.inputs = true;
      //console.log('777777',_this.ZCDWData);
      }
    },
    saveInfo(){
      let _this = this;
      //_this.ZCDWData.keyId = _this.KeyIds;
      debugger
      let url = '/Stationaddition/AddDWXXdata';
        _this.axios
          .post( url , _this.ZCDWData)
          .then(res=> {
            console.log("res",res)
            if (res.data.Code == 1) {
              _this.$parent.popupVisble = false;
              successMessage(res.data.Msg);
            } else errorMessage(res.data.Msg);
          })
          .catch(
            err =>{
              
            });
    },

    LoadZCmc() {
      this.axios
        .post("/Stationtype/LoadShowZCMC") //填充站场名称
        .then(res=> {
          console.log('rew',res)
          this.zcoptions = res.data.Data;
          this.ZCDWData.ZCDM = res.data.Data[0].ItemId
        })
        .catch(err => {
          errorMessage(err)
        });
    },
    LoadGXmc(){
      this.axios
        .post("/Stationaddition/LoadShowGX") //填充管线名称
        .then(res=> {
          this.gxoptions = res.data.Data;
          this.ZCDWData.GXBM = res.data.Data[0].ItemId
        })
        .catch(err => {
          errorMessage(err)
        });
    }
  }
};
</script>

<style scoped>
</style>
