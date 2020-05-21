<template>
  <div style="min-width:140px;background-color:#fff;border:1px solid #ccc;padding:5px">
      <!-- :default-expanded-keys="['0-0-0', '0-0-1']"
      :default-selected-keys="['0-0-0', '0-0-1']" -->
    <a-tree
      checkable
      :tree-data="treeData"
      :default-checked-keys="['0']"
      @select="onSelect"
      @check="onCheck"
    >
    </a-tree>
  </div>
</template>

<script>
const treeData = [
  {
    title: "管网图层",
    key: "0",
    children: [
      {
        title: "管网线路",
        key: "0-1",
      },
      {
        title: "设备",
        key: "0-2",
      },
    ]
  }
];

export default {
  name: "SelectMap",
  data() {
    return {
      treeData
    };
  },
  mounted() {
    console.log(this.layers);
  },
  methods: {
    onSelect(selectedKeys, info) {
      console.log("selected", selectedKeys, info);
    },
    onCheck(checkedKeys, info) {
      console.log("onCheck", checkedKeys, info);
    }
  },
  props: ["layers"]
};
</script>

<style scoped>
</style>