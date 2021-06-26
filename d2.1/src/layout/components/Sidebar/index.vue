<template>
  <div :class="{ 'has-logo': showLogo }">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <template v-if="tabkey === 1">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="$store.state.settings.uniqueOpened"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="route in doudongRoutes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </template>
      <template v-else>
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="$store.state.settings.uniqueOpened"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="route in madouRoutes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </template>
    </el-scrollbar>
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
  components: { SidebarItem, Hamburger },
  computed: {
    ...mapGetters(["permission_routers", "sidebar", "tabkey"]),
    activeMenu() {
      const route = this.$route;

      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    doudongRoutes() {
      let routes = this.permission_routers.filter(
        (it) => !it.hasOwnProperty("tabkey")
      );
      return routes;
    },
    madouRoutes() {
      let routes = this.permission_routers.filter((it) =>
        it.hasOwnProperty("tabkey")
      );
      return routes;
    },
  },
  mounted() {
    this.$store.dispatch("settings/cloneDoudongRoutes", this.doudongRoutes);
    this.$store.dispatch("settings/cloneMadouRoutes", this.madouRoutes);
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
  },
};
</script>
<style scoped>
.hamburger-container {
  position: absolute;
  bottom: 70px;
  right: 0px;
  cursor: pointer;
}
</style>
