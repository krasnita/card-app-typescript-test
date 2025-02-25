import { useState } from "react";
import { NavLink } from "react-router-dom";
import SettingsDialog from "./SettingsDialog";

/**
 * NavBar Component
 * 
 * Provides navigation between different sections of the application
 * and includes a settings dialog toggle.
 */
export default function NavBar() {
  // State to control the visibility of the settings dialog
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <nav className="flex justify-center gap-5 bg-gray-200 dark:bg-gray-900 p-4 shadow-md">
      {/* Navigation link to view all entries */}
      <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={"/"}>
        All Entries
      </NavLink>

      {/* Navigation link to create a new entry */}
      <NavLink
        className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white"
        to={"/create"}
      >
        New Entry
      </NavLink>

      {/* Button to open the settings dialog */}
      <button
        className="m-3 p-4 text-xl bg-gray-400 hover:bg-gray-500 rounded-md font-medium text-white"
        onClick={() => setIsSettingsOpen(true)}
      >
        ⚙️ Settings
      </button>

      {/* Settings Dialog - opens when the settings button is clicked */}
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
}
