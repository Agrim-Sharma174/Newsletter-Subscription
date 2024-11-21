import React from "react";
import { Card, Divider } from "@nextui-org/react";

interface SimulationLogsProps {
  logs: string[];
}

export const SimulationLogs: React.FC<SimulationLogsProps> = ({ logs }) => {
  return (
    <Card className="bg-gray-50 p-6 rounded-lg shadow-inner">
      <h4 className="text-xl font-semibold text-indigo-700 mb-4">
        Simulation Log
      </h4>
      <Divider className="mb-4" />
      <div className="max-h-60 overflow-y-auto">
        {logs.map((log, index) => (
          <p key={index} className="text-sm text-gray-600 mb-2">
            {log}
          </p>
        ))}
      </div>
    </Card>
  );
};
