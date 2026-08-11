import { Toaster } from "sonner";
import { useTheme } from "../theme/ThemeContext.jsx";

const AppToaster = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      theme={theme}
      toastOptions={{
        style: {
          border: "1px solid var(--glass-border)",
          fontSize: "15px",
          backdropFilter: "blur(18px)",
          backgroundColor: "var(--glass-bg-strong)",
          color: "var(--text-strong)",
          boxShadow: "var(--glass-shadow-hover)",
          borderRadius: "14px",
        },
      }}
    />
  );
};

export default AppToaster;
