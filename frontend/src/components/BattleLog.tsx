import React from "react";

interface BattleLogProps {
  logs: string[];
}

const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  return (
    <div className="battle-log h-32 md:h-48 overflow-y-auto text-xs leading-relaxed">
      {logs.length === 0 ? (
        <p className="text-gray-700 italic text-center">
          BATTLE LOG WILL APPEAR HERE...
        </p>
      ) : (
        logs.map((message, index) => (
          <div key={index} className="mb-1">
            {message}
          </div>
        ))
      )}
    </div>
  );
};

export default BattleLog;