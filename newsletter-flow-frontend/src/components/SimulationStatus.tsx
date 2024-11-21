import React from 'react';
import { BiCheckCircle, BiXCircle } from 'react-icons/bi';

interface SimulationStatusProps {
  flowState: string;
}

export const SimulationStatus: React.FC<SimulationStatusProps> = ({ flowState }) => {
  if (flowState === "completed") {
    return (
      <div className="flex flex-col justify-center items-center text-green-500">
        <div className="flex">
          <BiCheckCircle size={24} />
          <p className="ml-2 text-lg font-semibold flex justify-center items-center">
            Simulation completed successfully
          </p>
        </div>
        <p className="text-red-500 flex justify-center items-center text-sm font-semibold">
          The chances of occuring Renewal/Non renewal is 50-50.
        </p>
        <p className="text-red-500 flex justify-center items-center text-sm font-semibold">
          Keep clicking the button until you see the other case.
        </p>
      </div>
    );
  }

  if (flowState === "error") {
    return (
      <div className="flex justify-center items-center text-red-500">
        <BiXCircle size={24} />
        <p className="ml-2 text-lg font-semibold">
          An error occurred during simulation
        </p>
      </div>
    );
  }

  return null;
};