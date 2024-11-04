module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { 
        jsxImportSource: "nativewind",
        "targets": {
          "node": "current"
        }
      }],
      "nativewind/babel",
    ],
    plugins: [
      "@babel/plugin-transform-export-namespace-from",
      "react-native-reanimated/plugin"
    ]
  };
};
