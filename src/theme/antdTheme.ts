import { theme } from "antd";
import type { ThemeConfig } from "antd";

/**
 * Tema escuro do Ant Design alinhado aos tokens de `src/styles/global.css`.
 */
export const antdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#e5322d",
    colorInfo: "#e5322d",
    colorError: "#e5322d",
    colorSuccess: "#3ecf8e",
    colorWarning: "#f0a92e",

    colorBgBase: "#0a0b0d",
    colorBgContainer: "#14161a",
    colorBgElevated: "#191c21",
    colorBgSpotlight: "#21252b",
    colorBorder: "#31363e",
    colorBorderSecondary: "#23262c",

    colorText: "#eef1f5",
    colorTextSecondary: "#a3acb9",
    colorTextTertiary: "#6d7683",
    colorTextPlaceholder: "#6d7683",

    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    controlHeight: 40,
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 15,
  },
  components: {
    Modal: {
      contentBg: "#14161a",
      headerBg: "#14161a",
      titleFontSize: 18,
    },
    Select: {
      optionSelectedBg: "rgba(229, 50, 45, 0.16)",
      optionActiveBg: "#21252b",
    },
    Input: {
      activeShadow: "0 0 0 3px rgba(229, 50, 45, 0.18)",
    },
    Tooltip: {
      colorBgSpotlight: "#21252b",
    },
    Progress: {
      defaultColor: "#e5322d",
    },
  },
};
