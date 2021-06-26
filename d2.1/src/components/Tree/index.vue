<template>
  <div>
    <el-tree
      ref="tree"
      :data="permissionmenu"
      :show-checkbox="showcheckbox"
      empty-text="此值为空"
      node-key="name"
      :default-expanded-keys="roleitemmenu && roleitemmenu.list || openincreased || []"
      :default-checked-keys="roleitemmenu && roleitemmenu.list || openincreased || []"
      :props="defaultprops"
      @check="checkNode"
    />
  </div>
</template>

<script>
export default {
  props: {
    defaultprops: {
      type: Object,
      default: () => {}
    },
    permissionmenu: {
      type: Array,
      default: () => []
    },
    selectnodes: {
      type: Array,
      default: () => []
    },
    showcheckbox: {
      type: Boolean,
      default: () => true
    },
    role: {
      type: Array,
      default: () => []
    },
    roleitemmenu: {
      type: Object,
      default: () => {}
    },
    openincreased: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  methods: {
    checkNode(a, b){
      //console.log('b', b)
      const fn = (item) => item !== undefined
      if (this.roleitemmenu && this.roleitemmenu.list) {
        this.roleitemmenu.list.length = 0
        this.roleitemmenu.list.push(...new Set([...b.halfCheckedKeys.filter(fn), ...b.checkedKeys.filter(fn)]))
        //console.log(this.roleitemmenu.list)
      }
    }
  }
}
</script>
