import { ReactNode, createContext, useEffect, useState } from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Load dark mode preference from localStorage when the app starts
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      setDarkMode(savedTheme === "true");
    }
  }, []);

  // Apply or remove the "dark" class on the <html> tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark"); // Add dark mode class
    } else {
      document.documentElement.classList.remove("dark"); // Remove dark mode class
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode)); // Save preference
      return newMode;
    });
  };

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
};
