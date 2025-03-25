import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React from "react";
import SensorReadings from "./components/SensorReadings";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SensorReadings />
    </div>
  );
}

export default App;
