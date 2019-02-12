
<template>
  <div class="hello">
    <div class="header">
      <div class="heder_title">
        <span class="img"><img src="../assets/zsy.png" alt=""></span>
        <span class="title_content">****</span>
        <span class="carche"></span>
      </div>
      <div class="header_menu">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">编辑模式</el-menu-item>
          <el-menu-item index="2">预览模式</el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="map">
      <router-view ref="map"></router-view>
      <!-- <mapconponent ref="map" ></mapconponent> -->
    </div>
      <div class="search">
        <el-select v-model="searchtext" clearable @focus="searFocus" @blur="searblur" filterable placeholder="请选择" @keyup.enter.native="search(searchtext)" @change="search(searchtext)">
          <el-option
            v-for="item in searchData"
            :key="item.properties.dataId"
            :label="item.properties.dataName"
            :value="item.properties.dataName" >
          </el-option>
        </el-select><el-button type="primary" background-color="#545c64" slot="append" icon="el-icon-search" @click="search(searchtext)"></el-button>
        <!-- <el-input v-model="searchtext" filterable placeholder="请输入站点"
           @keyup.enter.native="search(searchtext)">
           <el-button type="primary" background-color="#545c64" slot="append" icon="el-icon-search" @click="search(searchtext)"></el-button>
        </el-input> -->
        <div class="filter_type" v-show="focusShow">
          <span><i class="el-icon-location" :title="'场站'"></i></span>
          <span ><i class="el-icon-share" :title="'管线'"></i></span>
        </div>
      </div>
      <div class="draw" v-show="!Ispreview">
      <el-button-group>
        <el-button :type="Isactive== 'Ispoint' ? 'primary' :'info'" icon="el-icon-location-outline" :title="'站点'" @click="station"></el-button>
        <el-button :type="Isactive== 'IsLine' ? 'primary' :'info'" icon="el-icon-share" :title="'管线'" @click="Line"></el-button>
        <el-button :type="Isactive== 'Isedit' ? 'primary' :'info'" icon="el-icon-edit" :title="'修改'" @click="Ismodify"></el-button>
      </el-button-group>
      </div>
      <div class="bottom" v-show="delete_box">
        <el-button-group>
          <el-button type="primary" icon="el-icon-setting" :title="'编辑'" @click="alertDig">{{stationname}}</el-button>
          <el-button type="danger" icon="el-icon-delete" :title="'删除'" @click="removepoint"></el-button>
        </el-button-group>
      </div>
      <div class="floor">
        <div></div>
      </div>
  </div>
</template>

<script>
import mapconponent from "./map/index.vue"
export default {
  components:{
    mapconponent
  },
  data () {
    return {
      searchtext: '测试1',
      drawtype:"",
      Isedit: false,
      Isactive: "",
      options: [
        {
          value: "Point",
          label: "站点"
        },
        {
          value: "LineString",
          label: "管线"
        }],
      delete_box: false,
      stationname: '编辑',
      activeIndex: '1',
      Ispreview: false,
      searchData:{},
      focusShow: false,
    }
  },
  created(){
    
  },
  watch:{
    "drawtype"(){
      this.typechange();
    },
  },
  mounted(){
    // this.getHeight()
    let self = this
    window.addEventListener("resize", function () {
      self.getHeight()
    }, false);
    this.checkPage()
  },
  methods:{
    getHeight(){
      let map = document.getElementsByClassName("map")
      map[0].style.height = window.innerHeight + "px"
    },
    //SHA256:yXyI6Jocn6VDZA1xuD4wAct+MYt0yXkEk7qMPB6TaiY 653398363@qq.com
    getSearch(){
      this.searchData = JSON.parse(JSON.stringify(this.$refs.map.searchData));
        // obj.map(item=>{
        //     if(item.geometry.type == 'LineString'){
        //       _this.searchData.LineString.push(item)
        //     }else if(item.geometry.type == 'Point'){
        //       _this.searchData.Point.push(item)
        //     }
        //   })
       console.log("_this.searchData",this.searchData)
    },
    typechange(){
      this.$refs.map.typechange()
      this.$refs.map.popupVisble = false;
    },
    //编辑新增站点
    station(){
      this.drawtype = "Point";
      this.Isactive = 'Ispoint';
      this.typechange();
      this.$router.push("/GWJK/edit/Station")
    },
    Line(){
      this.drawtype = "LineString";
      this.Isactive = 'IsLine';
      this.typechange();
      this.$router.push("/GWJK/edit/Line")
    },
    Ismodify(){
      this.$refs.map.typechange();
      this.Isactive = 'Isedit';
      this.$refs.map.canmodify()
      // this.$refs.map.popupVisble = false;
    },
    //显示子组件弹出框
    alertDig(){
      this.$refs.map.showDiag();
    },
    save(){
      this.$refs.map.save()
    },
    removepoint(){
      let  _this = this;
      _this.$confirm('是否删除，删除后可能会你后续操作产生影响', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          _this.$refs.map.ISdelet();
        }).catch(() => {
          
        });
      // this.$refs.map.removeDraw()   //删除所有地图上操作；
    },
    search(searchtext){
      this.$refs.map.searchFeatures(searchtext)
    },
    searFocus(){
      this.focusShow = true
    },
    searblur(){
      this.focusShow = false
    },
    checkPage(){
      console.log('checkPage',this.$route)
      if(this.$route.path.indexOf("Preview")){
        this.handleSelect('2')
      }else{
        this.handleSelect("1");
      }
    },
    handleSelect(item){
      console.log(item)
      if(item == '1'){
        this.activeIndex = '1';
        this.$router.push("/GWJK/edit");
        this.Ispreview = false;
      }else{
        this.activeIndex = '2'
        this.$router.push("/GWJK/preview");
        this.Ispreview = true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.header{
  width: 100%;
  height:  40px;
  box-sizing: border-box;
  font-size: 0;
}
.header .heder_title{
  width: 40%;
  height: 100%;
  box-sizing: border-box;
  background-color: #409EFF;
  display: inline-block;
  float: left;
}
.header .heder_title span{
  display: inline-block;
  height: 100%;
  float: left;
  font-size: 0;
}
.header .heder_title .img img{
  width: 40px;
  height: 40px;
  margin: 4px 0 0 100px;
}
.header .heder_title .title_content{
  color: white;
  font-size: 18px;
  line-height: 40px;
  margin-left: 20px;
}
.header .heder_title .carche{
  width: 0;
  height: 0;
  float: right;
  display: inline-block;
  border-top: 40px solid transparent;  
  border-left: 40px solid transparent;
  border-right: 40px solid white;
}
.header .header_menu{
  width: 60%;
  height: 100%;
  padding-left: 100px;
  display: inline-block;
  box-sizing: border-box;
  float: right;  
}
.map{
  width: 100%;
  height: calc(100% - 40px);
  box-sizing: border-box;
  position: relative;
}
.search{
  width: 400px;
  position: absolute;
  top: 80px;
  left: 20px;
}
.draw{
  position: absolute;
  top: 80px;
  right: 20px;
}
.itme-check{
  height: 40px;
  line-height: 40px;
}

.bottom{
  position: absolute;
  left: calc(50% - 80px);
  bottom: 30px;
}
.el-menu--horizontal>.el-menu-item{
  height: 40px!important;
  line-height: 40px!important;
}
.el-button,.el-button+.el-button {
  margin-left: 0px!important;
  border-radius: 0px!important;
}

.el-select{
  width: 250px!important;
}
.el-input--suffix .el-input__inner{
  border-top-right-radius: 0px!important;
  border-bottom-right-radius: 0px!important;
  border-right: 1px solid white!important;
}
.el-select-dropdown{
  border-right: 1px solid white;
}
.filter_type{
  width: 100px;
  height: 36px;
  background-color: white;
  box-sizing: border-box;
  font-size: 0;
  margin: 12px 0 0 250px;
}
.filter_type span{
  width: 50%;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
