import Vue from 'vue'
import Router from 'vue-router'
// import { resolve } from 'dns';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:"/",
      name:"Index",
      component: resolve=> require(['@/view/Index'],resolve),
      children: [
        {
          path: '/GWJK/edit',
          name: 'edit',
          component: resolve=> require(['@/view/map/index'],resolve) ,
          children: [
            {
              path: '/GWJK/edit/Station',
              name: 'Stationtype',
              component: resolve=> require(['@/view/map/Stationtype/Stationtype'],resolve) ,
            },
            {
              path: '/GWJK/edit/Line',
              name: 'Stationdetails',
              component: resolve=>require(['@/view/map/Stationdetails/Stationdetails'],resolve) ,
            }
          ]
        },
        {
          path: '/GWJK/preview',
          name: 'preview',
          component: resolve=>require(['@/view/preview/index'],resolve) ,
          children: [
            {
              path: '/GWJK/preview/Station',
              name: 'preStation',
              component: resolve=> require(['@/view/preview/preStation/index'],resolve) ,
            },
            {
              path: '/GWJK/preview/Line',
              name: 'preLine',
              component: resolve=>require(['@/view/preview/preStation/index'],resolve) ,
            }
          ]
        }
      ],
    }
  ]
})
