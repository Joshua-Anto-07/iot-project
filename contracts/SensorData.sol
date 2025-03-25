// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SensorData {
    struct Reading {
        uint256 timestamp;
        int256 value;
    }

    mapping(address => Reading[]) public sensorReadings;

    event NewReading(address indexed sensor, int256 value, uint256 timestamp);

    function storeReading(int256 _value) public {
        sensorReadings[msg.sender].push(Reading(block.timestamp, _value));
        emit NewReading(msg.sender, _value, block.timestamp);
    }

    function getReadings(address _sensor) public view returns (Reading[] memory) {
        return sensorReadings[_sensor];
    }
}
