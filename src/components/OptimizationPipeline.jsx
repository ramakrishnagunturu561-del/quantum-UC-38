import React, { useEffect, useState } from 'react';
import { Database, Binary, Zap, Route } from 'lucide-react';

export const OptimizationPipeline = ({ isRunning, result }) => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (isRunning) {
      // Simulate pipeline progression
      setActiveStage(1);
      const timer1 = setTimeout(() => setActiveStage(2), 300);
      const timer2 = setTimeout(() => setActiveStage(3), 600);
      const timer3 = setTimeout(() => setActiveStage(4), 1000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else if (result) {
      setActiveStage(5);
    } else {
      setActiveStage(0);
    }
  }, [isRunning, result]);

  const stages = [
    { label: "Dataset", icon: <Database size={20} /> },
    { label: "CVRP Model", icon: <Binary size={20} /> },
    { label: "QUBO Formulation", icon: <Binary size={20} /> },
    { label: "Ising Hamiltonian", icon: <Binary size={20} /> },
    { label: "QAOA", icon: <Zap size={20} /> },
    { label: "Optimized Route", icon: <Route size={20} /> }
  ];

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: '32px' }}>Optimization Pipeline</h3>
      <div className="pipeline-container">
        <div className="pipeline-line"></div>
        <div 
          className="pipeline-line-active" 
          style={{ width: `${activeStage === 0 ? 0 : (activeStage / (stages.length - 1)) * 100}%` }}
        ></div>
        
        {stages.map((stage, index) => {
          let stateClass = "";
          if (activeStage > index || result) stateClass = "completed";
          else if (activeStage === index && isRunning) stateClass = "active animate-pulse";
          
          return (
            <div key={index} className="pipeline-stage">
              <div className={`stage-icon ${stateClass}`}>
                {stage.icon}
              </div>
              <span className={`stage-label ${stateClass ? 'active' : ''}`}>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
