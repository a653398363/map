<template>
    <div class="Overall-situation">
        <div class="showtable">
        <el-table :data="DWData" >
          <el-table-column type="expand" label="修改" >
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-row>
                    <el-form-item label="点位代码：" >
                      <!-- <el-input v-model="props.row.INSTANT_ID" placeholder="请输入内容"></el-input> -->
                      <el-input v-model="props.row.INSTANT_ID" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="点位名称：">
                      <!-- <span>{{ props.row.INSTANT_NAME }}</span> -->
                      <el-input v-model="props.row.INSTANT_NAME" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="计量单位：">
                      <el-input v-model="props.row.ENGUNIT" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="  设计值：">
                      <el-input v-model="props.row.SJZ" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="  下拉">
                      <template slot-scope="scope">
               <el-select v-model="ZCDWData.ZCDM" filterable placeholder="请选择" :disabled="inputs">
                    <el-option v-for="item in zcoptions" :key="item.ItemId" :label="item.ItemName" :value="item.ItemId">
                    </el-option>
               </el-select>
                      </template>
                    </el-form-item> -->
                    </el-row>
                    <el-row>
                    <el-form-item label="压力负荷分组：">
                      <el-input v-model="props.row.YLFHFZ" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="使用标志：">
                      <el-switch active-value="1" inactive-value="0" v-model="props.row.SYBZ"></el-switch>
                    </el-form-item>
                    <!-- <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="EditFun()">保存</el-button> -->
                    </el-row>
                  </el-form>
                </template>
              </el-table-column>
            <el-table-column prop="ZCMC"  header-align="center" align="center" label="站场名称">
            </el-table-column>
            <el-table-column prop="GXMC"  header-align="center" align="center" label="管线名称">
            </el-table-column>
            <el-table-column prop="INSTANT_NAME"  header-align="center" align="center" label="点位名称">
            </el-table-column>
            <el-table-column prop="INSTANT_ID"  header-align="center" align="center" label="点位代码">
            </el-table-column>
            <el-table-column prop="ENGUNIT"  header-align="center" align="center" label="计量单位">
            </el-table-column>
            <el-table-column prop="SJZ"  header-align="center" align="center" label="设计值">
            </el-table-column>
            <el-table-column prop="YLFHFZ"  header-align="center" align="center" label="压力负荷分组">
            </el-table-column>
            <el-table-column prop="caozuo" header-align="left" align="left" label="操作">
                <template slot-scope="scope"> 
                      <el-tooltip content="保存" placement="top">
                        <i @click="EditFun(scope.row)" class="el-icon-edit"></i>
                      </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="butten">
          <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="dialogVisible = true">新增</el-button>
        </div>
      <el-dialog title="新增点位信息" :visible.sync="dialogVisible" width="100%" >
          <div class="Addtable">
            <el-table :data="addPlanRoute" border style="width:100%">
              <el-table-column  label="站场名称">
                <template slot-scope="scope">
                   <el-select v-model="ZCDWDatas.ZCDM" filterable clearable placeholder="请选择" >
                    <el-option v-for="item in zcoptions" :key="item.ItemId" :label="item.ItemName" :value="item.ItemId">
                    </el-option>
                   </el-select>
                 </template>
              </el-table-column>
            <el-table-column  label="管线名称">
              <template slot-scope="scope">
               <el-select v-model="ZCDWDatas.GXBM" filterable clearable placeholder="请选择">
                    <el-option v-for="item in gxoptions" :key="item.ItemId" :label="item.ItemName" :value="item.ItemId">
                    </el-option>
               </el-select>
              </template>
            </el-table-column>
            <el-table-column  label="点位代码">
              <template slot-scope="scope">
               <el-input v-model="ZCDWDatas.INSTANT_ID" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="点位名称">
              <template slot-scope="scope">
               <el-input v-model="ZCDWDatas.INSTANT_NAME" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="计量单位">
              <template slot-scope="scope">
               <el-input v-model="ZCDWDatas.ENGUNIT" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="设计值">
              <template slot-scope="scope">
               <el-input v-model="ZCDWDatas.SJZ" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="压力负荷分组">
              <template slot-scope="scope">
               <el-input v-model="ZCDWDatas.YLFHFZ" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
           <el-table-column  label="使用标识">
              <template slot-scope="scope">
               <el-switch active-value="1" inactive-value="0"  v-model="ZCDWDatas.SYBZ"></el-switch>
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
      </el-dialog>
    </div>
</template>

<script>
//import AddNewView from "./add-new-view";

export default {
  props: {
    coorObj: Object
  },
  data() {
    return {
      dialogVisible: false,
      DWData: [
        {
          KeyId: "",
          ZCDM: "",
          ZCMC: "",
          GXMC: "",
          INSTANT_ID: "",
          INSTANT_NAME: "",
          ENGUNIT: "",
          SJZ: "",
          YLFHFZ: "",
          SYBZ: ""
        }
      ], //表格集合
      ZCDWData:{
          KeyId: "",
          ZCDM: "",
          ZCMC: "",
          GXMC: "",
          INSTANT_ID: "",
          INSTANT_NAME: "",
          ENGUNIT: "",
          SJZ: "",
          YLFHFZ: "",
          SYBZ: ""
      },
      addPlanRoute: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      zcoptions:[],
      gxoptions:[],
      ZCDWDatas:{
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
      Zcdm: ""
    };
  },
  watch: {},
  created() {
    this.Zcdm = this.$route.query.ZCDM;
    this.ShowFun(this.Zcdm);
    console.log('222',this.DWData);
    this.LoadZCmc();
    this.LoadGXmc();
  },
  methods: {
    EditFun(obj) {
      // this.$router.push({ name: "add-new-view", query: { KeyId: KeyId } });
      debugger;
      //var KeyIds = val || "";
      let _this = this;
      //_this.ZCDWData = obj;
      //_this.ZCDWData = _this.DWData[0];
      debugger;
      let url = '/Stationaddition/UpDWXXdata';
       _this.axios
          .post( url , obj)
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
    ShowFun(Zcdm) {
      //更具主界面传来的站场代码查询出该站场的所有点位
      var zcdm = Zcdm
      this.axios
        .post("Stationaddition/ShowAllDWdata?zcdm="+zcdm+"", { zcdm: zcdm }) //查询
        .then(_ => {
          this.DWData = _.data.Data;
        })
        .catch(err => {
          // errorMessage(err)
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
    },
    saveInfo(){
      let _this = this;
      debugger
      let url = '/Stationaddition/AddDWXXdata';
        _this.axios
          .post( url , _this.ZCDWDatas)
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
            _this.ShowFun(this.Zcdm);
    }
  },
    // components: {
    //   AddNewView
    // }
};
</script>

<style scoped lang="css">
.Overall-situation {
  width: 100%;
  height: 100%;

  .showtable {
    margin: 30px 0;
    height: 100%;
  }
  .addtable {
    margin: 30px 0;
  }
}
</style>


