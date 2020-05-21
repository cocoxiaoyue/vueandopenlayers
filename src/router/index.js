import Vue from 'vue'
import Router from 'vue-router'
import LinePoint from '../pages/linePoint';
import Popup from '../pages/popup';
import Layers from '../pages/Layers';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/linepoint",
      name: "LinePoint",
      component: LinePoint
    },
    {
      path: "/popup",
      name: "Popup",
      component: Popup
    },
    {
      path: "/layers",
      name: "Layers",
      component: Layers
    }
  ]
})
