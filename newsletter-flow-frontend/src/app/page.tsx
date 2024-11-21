"use client";

import { useEffect, useState } from "react";
import { Card, Divider, Progress, Spacer } from "@nextui-org/react";
import { StepProgressBar } from "@/components/StepProgressBar";
import { SimulationButton } from "@/components/SimulationButton";
import { SimulationLogs } from "@/components/SimulationLogs";
import { SimulationStatus } from "@/components/SimulationStatus";
import Confetti from "react-confetti";
import EmailPosition from "@/components/EmailPosition";

export default function NewsletterRenewalSimulation() {
  // State management for the simulation flow
  // flowState tracks the current state of the simulation (idle, running, completed, error)
  const [flowState, setFlowState] = useState("idle");
  // Logs array to store simulation events and messages
  const [logs, setLogs] = useState<string[]>([]);
  // Tracks the current step in the simulation process
  const [currentStep, setCurrentStep] = useState(0);
  // Keeps track of which steps should be visible during the simulation
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  // for confetti- (celebration)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Define the steps in the newsletter renewal simulation process
  const steps = [
    { id: 1, name: "Send Reminder" },
    { id: 2, name: "Wait 3 Days" },
    { id: 3, name: "Check Renewal" },
    { id: 4, name: "Send 2nd Reminder" },
    { id: 5, name: "Wait 2 Days" },
    { id: 6, name: "Final Check" },
  ];

  // Helper function to add timestamped logs to the simulation
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prevLogs) => [...prevLogs, `${timestamp} - ${message}`]);
  };

  // Generate a random user ID for simulation purposes
  const generateRandomUserId = () => {
    return "user" + Math.floor(Math.random() * 1000000);
  };

  // Main simulation flow function
  const simulateFlow = async () => {
    // Generate a random user ID for this simulation
    const randomUserId = generateRandomUserId();

    // Initialize simulation state
    addLog(`Starting simulation for user ${randomUserId}`);
    setFlowState("running");
    setCurrentStep(0);
    setLogs([]);
    setVisibleSteps([]);

    // Start the flow by calling the backend API
    const response = await fetch("/api/flows/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: randomUserId }),
    });

    // Handle flow start failure
    if (!response.ok) {
      addLog("Failed to start the flow");
      setFlowState("error");
      return;
    }

    // Extract flow ID from the response
    const { flowId } = await response.json();
    addLog("Flow started successfully");

    // Iterate through each step of the simulation
    for (let i = 0; i < steps.length; i++) {
      // Update current step and visible steps
      setCurrentStep(i);
      setVisibleSteps((prev) => [...prev, i]);
      addLog(steps[i].name);

      // Simulate waiting period between steps
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        // Simulate the current step by calling backend API
        const simulateResponse = await fetch("/api/flows/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flowId }),
        });

        // Handle simulation step failure
        if (!simulateResponse.ok) {
          const errorText = await simulateResponse.text();
          console.error("Detailed error:", errorText);
          addLog("Simulation failed");
          setFlowState("error");
          return;
        }

        // Process simulation result
        const result = await simulateResponse.json();
        addLog(`Simulation result: ${result.status}`);

        // If renewed, complete the flow
        if (result.status === "Renewed") {
          addLog("Thank you email sent");
          setFlowState("completed");
          setCurrentStep(steps.length);
          setVisibleSteps((prev) => [...prev, steps.length - 1]);
          return;
        }

        // If final step is reached without renewal
        if (i === steps.length - 1) {
          addLog("No further action taken");
          setFlowState("completed");
          return;
        }
      } catch (error) {
        // Handle any network or parsing errors
        console.error("Network or parsing error:", error);
        addLog("Simulation failed");
        setFlowState("error");
      }
    }
  };

  // confetti effect
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // Full-screen container with gradient background
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-8 flex items-center justify-center">
      <EmailPosition />

      {/* Confetti effect when simulation is completed */}
      {flowState === "completed" && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}
      {/* Main card container */}
      <Card className="max-w-4xl w-full bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-8">
          {/* Title and description */}
          <h3 className="text-3xl font-bold text-indigo-700 mb-2 flex justify-center">
            Newsletter Renewal
          </h3>
          <p className="text-gray-600 mb-6 flex justify-center">
            Simulate the process of renewing a newsletter subscription.
          </p>

          <Divider className="my-6" />

          {/* Step Progress Bar */}
          <StepProgressBar
            steps={steps}
            currentStep={currentStep}
            visibleSteps={visibleSteps}
            flowState={flowState}
          />

          {/* Overall Progress Indicator */}
          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            color={
              flowState === "running"
                ? "primary"
                : flowState === "completed"
                ? "success"
                : "danger"
            }
            className="w-full h-2"
          />

          {/* Simulation Control Button */}
          <SimulationButton
            flowState={flowState}
            onSimulateFlow={simulateFlow}
          />

          {/* Simulation Logs Display */}
          <SimulationLogs logs={logs} />

          <Spacer y={4} />

          {/* Simulation Status Indicator */}
          <SimulationStatus flowState={flowState} />
        </div>
      </Card>
    </div>
  );
}
