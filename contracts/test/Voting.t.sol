// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Test} from "forge-std/Test.sol";
import {Voting, Voting__NotOwner} from "../src/Voting.sol";
import {VotingDeploy} from "../script/VotingDeploy.s.sol";

contract VotingTest is Test {
    Voting voting;

    address USER_1 = makeAddr("user1");
    address USER_2 = makeAddr("user2");
    address USER_3 = makeAddr("user3");

    uint256 START_TIME;
    uint256 END_TIME;

    function setUp() external {
        VotingDeploy votingDeploy = new VotingDeploy();
		voting = votingDeploy.run();

        START_TIME = block.timestamp + 1 hours;
        END_TIME = block.timestamp + 7 days;
    }

    // Owner Tests

	function testOwnerIsMsgSender() public view {
		assertEq(voting.getOwner(), msg.sender);
	}

    function testOnlyOwnerCanCreateCandidate() public {
        vm.prank(USER_1);

        vm.expectRevert(Voting__NotOwner.selector);

        voting.createCandidate("Alice");
    }

    function testOnlyOwnerCanCreateElection() public {
        vm.prank(USER_1);

        vm.expectRevert(Voting__NotOwner.selector);

        voting.createElection("Election", START_TIME, END_TIME);
    }

    function testOnlyOwnerCanAddCandidateToElection() public {
		vm.startPrank(msg.sender);
        voting.createCandidate("Alice");

        voting.createElection("Election", START_TIME, END_TIME);
		vm.stopPrank();

        vm.prank(USER_1);

        vm.expectRevert(Voting__NotOwner.selector);

        voting.addCandidateToElection(1, 1);
    }

    // Candidate Creation

    function testCreateCandidate() public {
		vm.prank(msg.sender);
        voting.createCandidate("Alice");

        Voting.Candidate memory candidate = voting.getCandidateById(1);

        assertEq(candidate.id, 1);
        assertEq(candidate.name, "Alice");
    }

    // Election Creation

    function testCreateElection() public {
		vm.prank(msg.sender);
        voting.createElection("Student Council", START_TIME, END_TIME);

        Voting.Election memory election = voting.getElectionById(1);

        assertEq(election.id, 1);
        assertEq(election.title, "Student Council");
        assertEq(election.startTime, START_TIME);
        assertEq(election.endTime, END_TIME);
    }

    // Add Candidate to Election

    function testAddCandidateToElection() public {
		vm.startPrank(msg.sender);
        voting.createCandidate("Alice");

        voting.createElection("Election", START_TIME, END_TIME);

        voting.addCandidateToElection(1, 1);
		vm.stopPrank();

        uint256[] memory ids = voting.getElectionCandidateIds(1);

        assertEq(ids.length, 1);
        assertEq(ids[0], 1);
    }

    function testCannotAddSameCandidateTwice() public {
		vm.startPrank(msg.sender);
        voting.createCandidate("Alice");

        voting.createElection("Election", START_TIME, END_TIME);

        voting.addCandidateToElection(1, 1);

        vm.expectRevert(bytes("Already participating"));

        voting.addCandidateToElection(1, 1);
		vm.stopPrank();
    }

    // Voting

    function _setupElection() internal {
        vm.startPrank(msg.sender);
        voting.createCandidate("Alice");
        voting.createCandidate("Bob");

        voting.createElection("Election", START_TIME, END_TIME);

        voting.addCandidateToElection(1, 1);

        voting.addCandidateToElection(1, 2);
        vm.stopPrank();
    }

    function testCannotVoteBeforeElectionStarts() public {
        _setupElection();

        vm.prank(USER_1);

        vm.expectRevert(bytes("Election not started"));

        voting.vote(1, 1);
    }

    function testCanVoteDuringElection() public {
        _setupElection();

        vm.warp(START_TIME + 1);

        vm.prank(USER_1);

        voting.vote(1, 1);

        uint256 votes = voting.getVoteCount(1, 1);

        assertEq(votes, 1);

        assertTrue(voting.userHasVoted(1, USER_1));
    }

    function testCannotVoteTwice() public {
        _setupElection();

        vm.warp(START_TIME + 1);

        vm.startPrank(USER_1);

        voting.vote(1, 1);

        vm.expectRevert(bytes("Already voted"));

        voting.vote(1, 1);

        vm.stopPrank();
    }

    function testCannotVoteForNonParticipatingCandidate() public {
        _setupElection();

		vm.prank(msg.sender);
        voting.createCandidate("Charlie");

        vm.warp(START_TIME + 1);

        vm.prank(USER_1);

        vm.expectRevert(bytes("Candidate not participating"));

        voting.vote(1, 3);
    }

    function testCannotVoteAfterElectionEnds() public {
        _setupElection();

        vm.warp(END_TIME + 1);

        vm.prank(USER_1);

        vm.expectRevert(bytes("Election ended"));

        voting.vote(1, 1);
    }

    function testMultipleUsersCanVote() public {
        _setupElection();

        vm.warp(START_TIME + 1);

        vm.prank(USER_1);
        voting.vote(1, 1);

        vm.prank(USER_2);
        voting.vote(1, 1);

        vm.prank(USER_3);
        voting.vote(1, 2);

        assertEq(voting.getVoteCount(1, 1), 2);

        assertEq(voting.getVoteCount(1, 2), 1);
    }

    // Result

    function testElectionResults() public {
        _setupElection();

        vm.warp(START_TIME + 1);

        vm.prank(USER_1);
        voting.vote(1, 1);

        vm.prank(USER_2);
        voting.vote(1, 1);

        vm.prank(USER_3);
        voting.vote(1, 2);

        Voting.ElectionResult[] memory results = voting.getElectionResults(1);

        assertEq(results.length, 2);

        assertEq(results[0].candidateId, 1);

        assertEq(results[0].voteCount, 2);

        assertEq(results[1].candidateId, 2);

        assertEq(results[1].voteCount, 1);
    }

    // Election Status tests

    function testElectionStatusUpcoming() public {
		vm.prank(msg.sender);
        voting.createElection("Election", START_TIME, END_TIME);

        assertEq(uint256(voting.getElectionStatus(1)), 0);
    }

    function testElectionStatusActive() public {
		vm.prank(msg.sender);
        voting.createElection("Election", START_TIME, END_TIME);

        vm.warp(START_TIME + 1);

        assertEq(uint256(voting.getElectionStatus(1)), 1);
    }

    function testElectionStatusEnded() public {
		vm.prank(msg.sender);
        voting.createElection("Election", START_TIME, END_TIME);

        vm.warp(END_TIME + 1);

        assertEq(uint256(voting.getElectionStatus(1)), 2);
    }
}
