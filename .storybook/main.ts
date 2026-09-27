import path from "path";
import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (webpackConfig) => {
    webpackConfig.resolve = webpackConfig.resolve ?? {};
    webpackConfig.resolve.extensions = [
      ".ts",
      ".tsx",
      ...(webpackConfig.resolve.extensions ?? []),
    ];
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias ?? {}),
      "@": path.resolve(__dirname, "../src"),
    };
    webpackConfig.module?.rules?.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: require.resolve("ts-loader"),
        options: { transpileOnly: true },
      },
    });
    webpackConfig.module?.rules?.push({
      test: /\.s?css$/,
      use: [
        require.resolve("style-loader"),
        require.resolve("css-loader"),
        require.resolve("sass-loader"),
      ],
    });
    return webpackConfig;
  },
};

export default config;
