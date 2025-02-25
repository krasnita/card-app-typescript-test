import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import AllEntries from "./routes/AllEntries";
import EditEntry from "./routes/EditEntry";
import NewEntry from "./routes/NewEntry";
import { EntryProvider } from "./utilities/globalContext";

export default function App() {
  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <Router>
        <EntryProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<AllEntries />} />
            <Route path="create" element={<NewEntry />} />
            <Route path="edit/:id" element={<EditEntry />} />
          </Routes>
        </EntryProvider>
      </Router>
    </section>
  );
}
