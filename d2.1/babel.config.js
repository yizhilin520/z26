const plugins = ["@vue/babel-plugin-transform-vue-jsx"];
// 生产环境移除console
if (process.env.NODE_ENV === "production") {
  plugins.push("transform-remove-console");
}
module.exports = {
  plugins: plugins,
  presets: [
    "@vue/app",
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 2
      }
    ]
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3 // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
      }
    ]
  ]
};
