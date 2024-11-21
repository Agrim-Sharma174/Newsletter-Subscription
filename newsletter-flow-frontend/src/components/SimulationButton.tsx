import React from 'react';
import { Button } from '@nextui-org/react';

interface SimulationButtonProps {
  flowState: string;
  onSimulateFlow: () => void;
}

export const SimulationButton: React.FC<SimulationButtonProps> = ({
  flowState,
  onSimulateFlow
}) => {
  return (
    <div className="w-full flex justify-center items-center">
      <Button
        onPress={onSimulateFlow}
        disabled={flowState === "running"}
        color="default"
        size="lg"
        className="flex justify-center mb-8 text-black border border-purple-600 w-fit px-8 py-4 rounded-lg hover:bg-purple-600 hover:text-white"
      >
        {flowState === "idle"
          ? "Start Flow"
          : flowState === "running"
          ? "Simulating..."
          : flowState === "completed"
          ? "Simulation Complete"
          : "Retry Simulation"}
      </Button>
    </div>
  );
};