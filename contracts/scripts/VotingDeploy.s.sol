// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Script} from "forge-std/Script.sol";
import {Voting} from "../src/Voting.sol";

contract VotingDeploy is Script {
    function run() external returns (Voting) {
		vm.startBroadcast();
        Voting voting = new Voting();
        vm.stopBroadcast();
        return voting;
	}
}