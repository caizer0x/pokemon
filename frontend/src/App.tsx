import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import BattlePage from "./components/BattlePage";

/**
 * We simplified to a minimal router-based app:
 * - / => HomePage (lobby)
 * - /battle => BattlePage
 */
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary-color text-white p-4 shadow-md relative">
          <div className="container mx-auto">
            <div className="flex items-center justify-center">
              <div className="pokeball animate-rotate mr-3"></div>
              <h1 className="text-2xl md:text-3xl font-bold text-center">
                Pokémon Battle
              </h1>
              <div className="pokeball animate-rotate ml-3"></div>
            </div>
            <div className="text-center text-xs mt-2 animate-blink">
              GENERATION I
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <div className="pokedex-button pokedex-button-red"></div>
            <div className="pokedex-button pokedex-button-yellow"></div>
            <div className="pokedex-button pokedex-button-green"></div>
          </div>
        </header>

        <main className="flex-1 container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/battle" element={<BattlePage battleState={null} onSendMessage={() => {}} />} />
          </Routes>
        </main>

        <footer className="bg-dark text-white p-3 text-center text-xs">
          <div className="flex items-center justify-center">
            <div
              className="pokeball mr-2"
              style={{ width: "14px", height: "14px" }}
            ></div>
            <p>Pokémon Battle Engine - Generation I</p>
            <div
              className="pokeball ml-2"
              style={{ width: "14px", height: "14px" }}
            ></div>
          </div>
          <div className="mt-1 text-[10px] opacity-70">
            © {new Date().getFullYear()} Pokémon Trainer
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;