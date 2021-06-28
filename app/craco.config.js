const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const DEVELOPMENT = "development";
const PRODUCTION = "production";

module.exports = {
  webpack: {
    configure: function override(config, { env }) {
      // make file-loader ignore WASM files
      const wasmExtensionRegExp = /\.wasm$/;
      config.resolve.extensions.push(".wasm");
      config.resolve.alias = {
        "@wasm": path.resolve(__dirname, "../pkg"),
      };
      config.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });

      // add a dedicated loader for WASM
      config.module.rules.push({
        test: wasmExtensionRegExp,
        include: path.resolve(__dirname, "src"),
        use: [{ loader: require.resolve("wasm-loader"), options: {} }],
      });

      // ignore the module scope plugin since `pkg` exists outside of `src` directory
      const scopePluginIndex = config.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      );
      config.resolve.plugins.splice(scopePluginIndex, 1);

      // add the plugin to create a new pkg
      config.plugins.push(
        new WasmPackPlugin({
          crateDirectory: path.resolve(__dirname, "../src"),
          watchDirectories: [path.resolve(__dirname, "../src")],
          forceMode: env,
          forceWatch: env === DEVELOPMENT,
        })
      );

      return config;
    },
  },
};
