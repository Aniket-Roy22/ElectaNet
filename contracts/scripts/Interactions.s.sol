// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {Voting} from "../src/Voting.sol";

contract VotingInteractionBase is Script {
    function getVoting() internal view returns (Voting) {
        address votingAddress = vm.envAddress("VOTING_ADDRESS");

        return Voting(votingAddress);
    }
}

contract Vote is VotingInteractionBase {
    function run() external {
        Voting voting = getVoting();

        vm.startBroadcast();

        voting.vote(1, 2);

        vm.stopBroadcast();
    }
}

contract ReadVoteCount is VotingInteractionBase {
    function run() external view {
        Voting voting = getVoting();

        Voting.Candidate memory candidate = voting.getCandidateById(1);
        uint256 votes = voting.getVoteCount(1, 1);

        console2.log(candidate.name);
        console2.log(votes);
    }
}

contract ReadElection is VotingInteractionBase {
    function run() external view {
        Voting voting = getVoting();

        Voting.Election memory election = voting.getElectionById(1);

        console2.log("Election ID:", election.id);

        console2.log("Title:", election.title);
    }
}

contract ReadCandidate is VotingInteractionBase {
    function run() external view {
        Voting voting = getVoting();

        Voting.Candidate memory candidate = voting.getCandidateById(1);

        console2.log("Candidate ID:", candidate.id);

        console2.log("Name:", candidate.name);
    }
}

contract ReadElectionResults is VotingInteractionBase {
    function run() external view {
        Voting voting = getVoting();

        uint256 electionId = 1;

        Voting.ElectionResult[] memory results = voting.getElectionResults(
            electionId
        );

        console2.log("Election Results");
        console2.log("----------------");

        for (uint256 i; i < results.length; i++) {
            Voting.Candidate memory candidate = voting.getCandidateById(
                results[i].candidateId
            );

            console2.log("Candidate :", candidate.name);
            console2.log("Votes: ", results[i].voteCount);
            console2.log("----------------");
        }
    }
}

contract SetupElection is VotingInteractionBase {
    function run() external {
        Voting voting = getVoting();

        vm.startBroadcast();

        voting.createCandidate("Alice");
        voting.createCandidate("Bob");

        voting.createElection(
            "Student Council",
            block.timestamp,
            block.timestamp + 7 days
        );

        voting.addCandidateToElection(1, 1);
        voting.addCandidateToElection(1, 2);

        vm.stopBroadcast();
    }
}