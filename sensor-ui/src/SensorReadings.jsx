import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../../truffle/build/contracts/YourContract.json"; // Adjust path if needed
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SensorReadings = () => {
  const [sensor, setSensor] = useState("");
  const [readings, setReadings] = useState([]);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initBlockchain = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed");
        }
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual address
        const deployedContract = new web3.eth.Contract(contractABI.abi, contractAddress);
        setContract(deployedContract);
      } catch (err) {
        setError("Error initializing blockchain connection");
      }
    };
    initBlockchain();
  }, []);

  const fetchReadingsFromBlockchain = async () => {
    setError(null);
    if (!contract) {
      setError("Contract not loaded");
      return;
    }
    try {
      const data = await contract.methods.getReadings(sensor).call();
      setReadings(data);
    } catch (err) {
      setError("Error fetching readings from blockchain");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Sensor Readings</h1>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter Sensor Address"
          value={sensor}
          onChange={(e) => setSensor(e.target.value)}
        />
        <Button onClick={fetchReadingsFromBlockchain}>Fetch</Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {readings.length > 0 && (
        <Card>
          <CardContent>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Timestamp</th>
                  <th className="border p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {readings.map(([timestamp, value], index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{timestamp}</td>
                    <td className="border p-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SensorReadings;

