<template>
<div class="frame">
    <el-dialog title="管段信息" width="520px" :visible.sync="popupVisble" :before-close="handleClose">
      <el-form class="query-from" label-width="110px" ref="query" :model="query">
          <el-row :gutter="0">
          <el-form-item label="管段名称:">
            <el-select v-model="userinfo.gdbm" filterable placeholder="请选择" @change="handleSelect">
              <el-option
                v-for="item in lineData"
                :key="item.ItemId"
                :label="item.ItemName"
                :value="item.ItemId">
              </el-option>
            </el-select>
          </el-form-item>
          </el-row>
          <el-row >
              <el-col>
                  <el-form-item label="起始站点:">
                      <template slot-scope="scoped">
                          <label>{{query.QSDD}}</label>
                      </template>
                  </el-form-item>
                  <el-form-item label="终止站点:">
                      <template slot-scope="scoped">
                          <label>{{query.ZZDD}}</label>
                      </template>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row>
              <el-col>
                  <el-form-item label="管线规格:">
                      <template slot-scope="scoped">
                          <label>外径：{{query.GXWJ}}mm,壁厚：{{query.GXBH}}mm,长度：{{query.GXCD}},{{query.GXCZ}}</label>
                      </template>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row>
              <el-col>
                  <el-form-item label="分支管线:" >
                <el-switch active-value="1" inactive-value="0" disabled v-model="query.SFFZGX"></el-switch>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row>
              <el-col>
                <el-form-item label="管线名称:" >
                <el-select v-model="KeyIdNmuber"  placeholder="请选择" @change="SelectKeyId">
                  <el-option
                    v-for="item in KeyIdData"
                    :key="item.keyId"
                    :label="item.ItemName == null ? '暂无' : item.ItemName"
                    :value="item.keyId">
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row>
              <el-col>
                  <el-form-item label="显示层级:">
                      <el-checkbox-group v-model="checkList" @change="listchange">
                          <el-checkbox label="一层"></el-checkbox>
                          <el-checkbox label="二层"></el-checkbox>
                          <el-checkbox label="三层"></el-checkbox>
                      </el-checkbox-group>
                  </el-form-item>
              </el-col>
          </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveInfo">保 存</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
import {errorMessage,successMessage} from '@/util/message.js';
export default {
  props: {
    coorObj: Object
  },
  data() {
    return {
      KeyIdData:[],
      popupVisble: false,
      KeyIdNmuber:"",
      lineData: [
        {
          value: "站场1",
          label: "站场1"
        },
        {
          value: "站场2",
          label: "站场2"
        },
        {
          value: "站场3",
          label: "站场3"
        }
      ],
      query: {
        GDMC: "暂无", //管段名称
        GXWJ: "暂无", //管线外径
        GXBH: "暂无", //管线壁厚
        GXCZ: "暂无", //管线材质
        GXCD: "暂无", //管线长度
        SFFZGX: "1" //是否分支管线
      },
      checkList: ["一层"],
      userinfo: {
        gdbm: "", //场站名字
        giMd: {
          //地图位置
          keyId: '',
          is_display1: "1", //0 不显示， 1显示
          is_display2: "0",
          is_display3: "0"
        },
        featureVo: "",
      }
    };
  },
  created() {
    //自定义方法
    this.getData();
    this.gxmc();
  },
  watch:{
    '$parent.coorObj'(){
      this.watchCzdm()
    }
  },
  methods: {
    //自定义方法集合
    getData() {
      this.axios
        .post("/Stationdetails/LoadShowGDMC") //查询
        .then(res=> {
          this.lineData = res.data.Data;
          this.userinfo.gdbm = res.data.Data[0].ItemId;
          this.handleSelect(res.data.Data[0].ItemId)
        })
        .catch(err => {
          errorMessage(err)
        });
    },
    //管线名称
    gxmc(){
      this.axios.post("/Stationdetails/LoadShowGXMC")
        .then(res=>{
          this.KeyIdData = res.data.Data;
          this.KeyIdNmuber = res.data.Data[0].keyId;
        })
    },
    //显示层级改变
    listchange(){
      let _this = this;
      if(_this.checkList.indexOf("一层") != '-1'){
        _this.userinfo.giMd.is_display1 = '1'
      }else{
        _this.userinfo.giMd.is_display1 = '0'
      }
      if(_this.checkList.indexOf("二层") != '-1'){
        _this.userinfo.giMd.is_display2 = '1'
      }else{
        _this.userinfo.giMd.is_display2 = '0'
      }
      if(_this.checkList.indexOf("三层") != '-1'){
        _this.userinfo.giMd.is_display3 = '1'
      }else{
        _this.userinfo.giMd.is_display3 = '0'
      }
    },
    //模糊查询;
    handleSelect(item){
      this.axios
        .post("/Stationdetails/ShowGDdata?gdbm="+item) //查询
        .then(res=> {
          this.query = res.data.Data[0];
        })
        .catch(err => {
          // errorMessage(err)
        });
    },
    //选择keyid
    SelectKeyId(keyId){
      console.log(keyId)
    },
    //保存数据    /MapData/CZVectorData     /Stationdetails/AddGDVectorData
    saveInfo(evts){
      console.log('evt',evts,!evts.geometry)
      let _this = this;
      let url = '';
      if(!evts.geometry){
        _this.userinfo.featureVo = _this.coorObj;
      }else{
        _this.userinfo.featureVo = evts;
      }
      console.log('evtevtevt',_this.coorObj)
      if(_this.$parent.Isupdate == true){
        this.lineData.map(item=>{
          if(item.ItemName == _this.userinfo.gdbm){
            this.userinfo.gdbm = item.ItemId;
          }
        })
        _this.userinfo.giMd.keyId = _this.userinfo.featureVo.id
        url = '/Stationdetails/UpGDJBXXdata?gxbm=gxbm&keyId='+_this.KeyIdNmuber
      } else{
        url = `/Stationdetails/AddGDVectorData?gxbm=gxbm`
      }
        _this.axios
          .post( url , _this.userinfo)
          .then(res=> {
            console.log("res",res)
            if (res.data.Code == 1) {
              // _this.$router.push({name:"Index"});
              _this.popupVisble = false;
              _this.$parent.datareturn(res.data.Data)
              successMessage(res.data.Msg);
            } else errorMessage(res.data.Msg);
          })
          .catch(
            err =>{
              
            });
    },
    deletes(evts){
        if(evts.geometry){
          this.userinfo.featureVo = evts;
        }
        this.userinfo.gdbm = this.userinfo.featureVo.properties.dataId
        console.log("this.",this.userinfo.featureVo)
        this.userinfo.giMd.keyId = this.userinfo.featureVo.id
        this.axios.post("/Stationdetails/DeletGDdata?gdbm="+this.userinfo.gdbm,this.userinfo).
        then(
          res=>{
            console.log("res",res)
            if(res.data.Code ==1){
              successMessage(res.data.Msg);
              // this.$router.push({name:"Index"});
              this.popupVisble = false;
              this.$parent.removeLast()
            }else{
              errorMessage(res.data.Msg)
            }
        })
    },
    cancel() {
      this.popupVisble = false;
      if(this.$parent.Isupdate == false){
        this.$parent.drawEnd();
      }
      // this.$router.push({name:"Index"})
    },
    watchCzdm(){
      console.log('coorObj',this.coorObj,!this.coorObj.properties)
      if(this.$parent.Isupdate == true && !this.coorObj.properties == false){
        this.handleSelect(this.coorObj.properties.dataId);

        this.lineData.map(item=>{
          if(item.ItemId == this.coorObj.properties.dataId.trim()){
            this.userinfo.gdbm = item.ItemName;
          }
        })
      }else{
        this.getData();
        this.gxmc();
      }
    },
    handleClose(){
        this.popupVisble = false;
      if(this.$parent.Isupdate == false){
        this.$parent.drawEnd();
      }
    }
  }
};
</script>

<style scoped>
  .frame {
    width: 350px;
    height: 100%;
    box-sizing: border-box;
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
  .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
  }
</style>