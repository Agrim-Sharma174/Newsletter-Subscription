"use client";

import { useState, useEffect } from "react";
import { Card, Button, Divider, Progress, Spacer } from "@nextui-org/react";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { BsArrowRight, BsClock } from "react-icons/bs";

export default function NewsletterRenewalSimulation() {
  const [flowState, setFlowState] = useState("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, name: "Send Reminder" },
    { id: 2, name: "Wait 3 Days" },
    { id: 3, name: "Check Renewal" },
    { id: 4, name: "Send 2nd Reminder" },
    { id: 5, name: "Wait 2 Days" },
    { id: 6, name: "Final Check" },
  ];

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prevLogs) => [...prevLogs, `${timestamp} - ${message}`]);
  };

  const simulateFlow = async () => {
    setFlowState("running");
    setCurrentStep(0);
    setLogs([]);

    const response = await fetch("/api/flows/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user123" }),
    });

    if (!response.ok) {
      addLog("Failed to start the flow");
      setFlowState("error");
      return;
    }

    const { flowId } = await response.json();
    addLog("Flow started successfully");

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      addLog(steps[i].name);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (i === 2 || i === 5) {
        const simulateResponse = await fetch("/api/flows/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flowId }),
        });

        if (!simulateResponse.ok) {
          addLog("Simulation failed");
          setFlowState("error");
          return;
        }

        const result = await simulateResponse.json();
        addLog(`Simulation result: ${result.status}`);

        if (result.status === "Renewed") {
          addLog("Thank you email sent");
          setFlowState("completed");
          setCurrentStep(steps.length); // Set to the last step to show full progress
          return;
        }

        if (i === 5) {
          addLog("No further action taken");
          setFlowState("completed");
          return;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-8 flex items-center justify-center">
      <Card className="max-w-4xl w-full bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-8">
          <h3 className="text-3xl font-bold text-indigo-700 mb-2">Newsletter Renewal Simulation</h3>
          <p className="text-gray-600 mb-6">Simulate the process of renewing a newsletter subscription.</p>

          <Divider className="my-6" />

          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-full flex justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="text-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-semibold ${
                      index < currentStep || flowState === "completed"
                        ? "bg-green-500"
                        : index === currentStep
                        ? "bg-indigo-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {index < currentStep || flowState === "completed" ? (
                      <BiCheckCircle size={24} />
                    ) : index === currentStep ? (
                      <BsClock size={24} />
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className="text-xs mt-2 text-gray-600">{step.name}</p>
                </div>
              ))}
            </div>

            <Progress
              value={((currentStep + 1) / steps.length) * 100}
              color={flowState === "running" ? "primary" : flowState === "completed" ? "success" : "danger"}
              className="w-full h-2"
            />
          </div>

          <div className="w-full flex justify-center items-center">
            <Button
              onPress={simulateFlow}
              disabled={flowState === "running"}
              color="default"
              size="lg"
              className="flex justify-center mb-8 text-black border border-purple-600 w-fit px-8 py-4 rounded-lg hover:bg-purple-600 hover:text-white"
            >
              {flowState === "idle"
                ? "Start Simulation"
                : flowState === "running"
                ? "Simulating..."
                : flowState === "completed"
                ? "Simulation Complete"
                : "Retry Simulation"}
            </Button>
          </div>

          <Card className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h4 className="text-xl font-semibold text-indigo-700 mb-4">Simulation Log</h4>
            <Divider className="mb-4" />
            <div className="max-h-60 overflow-y-auto">
              {logs.map((log, index) => (
                <p key={index} className="text-sm text-gray-600 mb-2">
                  {log}
                </p>
              ))}
            </div>
          </Card>

          <Spacer y={4} />

          {flowState === "completed" && (
            <div className="flex justify-center items-center text-green-500">
              <BiCheckCircle size={24} />
              <p className="ml-2 text-lg font-semibold">Simulation completed successfully</p>
            </div>
          )}

          {flowState === "error" && (
            <div className="flex justify-center items-center text-red-500">
              <BiXCircle size={24} />
              <p className="ml-2 text-lg font-semibold">An error occurred during simulation</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
