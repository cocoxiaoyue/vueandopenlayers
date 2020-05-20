import Vue from 'vue'
import Router from 'vue-router'
import LinePoint from '../pages/linePoint';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/linepoint",
      name: "LinePoint",
      component: LinePoint
    }
  ]
})
