import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext({ theme: "dark" });

export function ThemeProvider({ children, defaultTheme = "dark" }: { children: React.ReactNode; defaultTheme?: string }) {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", defaultTheme === "dark");
  }, [defaultTheme]);

  return <ThemeContext.Provider value={{ theme: defaultTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
