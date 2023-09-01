/*
 * @Author: 王欣磊
 * @Date: 2023-09-01 14:56:47
 * @LastEditors: 王欣磊
 * @LastEditTime: 2023-09-01 17:15:54
 * @Description:
 * @FilePath: /qrTool/vite.config.js
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/k-qr-tool/",
  build: {
    outDir: "docs",
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
});
