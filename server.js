require("dotenv").config();
const express = require("express");
const Web3 = require("web3");
const contractJSON = require("./build/contracts/SensorData.json"); 

const app = express();
app.use(express.json()); // Middleware to parse JSON body

// ✅ Setup Web3 & Contract
const web3 = new Web3(process.env.RPC_URL);
const contract = new web3.eth.Contract(contractJSON.abi, process.env.CONTRACT_ADDRESS);
const sender = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

console.log(`Connected to blockchain at ${process.env.RPC_URL}`);
console.log(`Using contract at ${process.env.CONTRACT_ADDRESS}`);

// ✅ API to Receive Sensor Data & Store on Blockchain
app.post("/storeData", async (req, res) => {
    try {
        const { value } = req.body;  // Get sensor value from ESP32
        console.log("Received sensor value:", value);

        // Create transaction
        const tx = contract.methods.storeReading(value);
        const gas = await tx.estimateGas({ from: sender.address });

        const txData = {
            from: sender.address,
            to: contract.options.address,
            gas,
            data: tx.encodeABI(),
        };

        // Sign and send transaction
        const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("Transaction successful:", receipt.transactionHash);
        res.json({ success: true, txHash: receipt.transactionHash });

    } catch (error) {
        console.error("Error storing data:", error);
        res.status(500).json({ success: false, error: error.toString() });
    }
});

// ✅ API to Read the Latest Stored Value
app.get("/getLatest", async (req, res) => {
    try {
        const latestReading = await contract.methods.latestReading().call();
        console.log("Latest stored value:", latestReading);
        res.json({ success: true, latestReading });
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ success: false, error: error.toString() });
    }
});

app.get("/getReadings/:sensor", async (req, res) => {
    try {
        const sensorAddress = req.params.sensor;
        const readings = await contract.methods.getReadings(sensorAddress).call();
        console.log("Readings:", readings);
        res.json({ success: true, readings });
    } catch (error) {
        console.error("Error retrieving readings:", error);
        res.status(500).json({ success: false, error: error.toString() });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

});
