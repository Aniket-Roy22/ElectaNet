// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

error Voting__NotOwner();

contract Voting {
    // Entities
    struct Election {
        uint256 id;
        string title;
        uint256 startTime;
        uint256 endTime;
    }

    struct Candidate {
        uint256 id;
        string name;
    }

    struct ElectionResult {
        uint256 candidateId;
        uint256 voteCount;
    }

    // Variables
    address private immutable I_OWNER;
    uint256 private sElectionCount;
    uint256 private sCandidateCount;

    // Mappings
    mapping(uint256 electionId => Election election) private sElections;
    mapping(uint256 candidateId => Candidate candidate) private sCandidates;
    mapping(uint256 electionId => uint256[] candidateIds)
        private sElectionIdToCandidateIds;
    mapping(uint256 electionId => mapping(uint256 candidateId => bool isParticipating))
        private sElectionIdToCandidateIdToIsParticipating;
    mapping(uint256 electionId => mapping(uint256 candidateId => uint256 voteCount))
        private sElectionIdToCandidateIdToVoteCount;
    mapping(uint256 electionId => mapping(address voter => bool hasVoted))
        private sElectionIdToVoterToHasVoted;

    constructor() {
        I_OWNER = msg.sender;
    }

    // Election Functions
    function createCandidate(string calldata _name) public ownerOnly {
        ++sCandidateCount;

        Candidate memory newCandidate = Candidate({
            id: sCandidateCount,
            name: _name
        });

        sCandidates[sCandidateCount] = newCandidate;
    }

    function createElection(
        string calldata _title,
        uint256 _startTime,
        uint256 _endTime
    ) public ownerOnly {
        require(_startTime < _endTime, "Invalid time range");

        ++sElectionCount;

        Election memory newElection = Election({
            id: sElectionCount,
            title: _title,
            startTime: _startTime,
            endTime: _endTime
        });

        sElections[sElectionCount] = newElection;
    }

    function addCandidateToElection(
        uint256 _electionId,
        uint256 _candidateId
    ) public ownerOnly {
        require(sElections[_electionId].id != 0, "Election not found");
        require(sCandidates[_candidateId].id != 0, "Candidate not found");
        require(
            !sElectionIdToCandidateIdToIsParticipating[_electionId][
                _candidateId
            ],
            "Already participating"
        );

        sElectionIdToCandidateIds[_electionId].push(_candidateId);

        sElectionIdToCandidateIdToIsParticipating[_electionId][
            _candidateId
        ] = true;
    }

    function vote(uint256 _electionId, uint256 _candidateId) public {
        Election memory election = sElections[_electionId];

        require(election.id != 0, "Election not found");
        require(block.timestamp >= election.startTime, "Election not started");
        require(block.timestamp <= election.endTime, "Election ended");
        require(
            !sElectionIdToVoterToHasVoted[_electionId][msg.sender],
            "Already voted"
        );
        require(
            sElectionIdToCandidateIdToIsParticipating[_electionId][
                _candidateId
            ],
            "Candidate not participating"
        );

        sElectionIdToVoterToHasVoted[_electionId][msg.sender] = true;

        sElectionIdToCandidateIdToVoteCount[_electionId][_candidateId]++;
    }

    // Getter Functions
    function getElectionById(
        uint256 _electionId
    ) external view returns (Election memory) {
        return sElections[_electionId];
    }

    function getCandidateById(
        uint256 _candidateId
    ) external view returns (Candidate memory) {
        return sCandidates[_candidateId];
    }

    function getElectionCandidateIds(
        uint256 _electionId
    ) external view returns (uint256[] memory) {
        return sElectionIdToCandidateIds[_electionId];
    }

    function getVoteCount(
        uint256 _electionId,
        uint256 _candidateId
    ) external view returns (uint256) {
        return sElectionIdToCandidateIdToVoteCount[_electionId][_candidateId];
    }

    function getElectionResults(
        uint256 _electionId
    ) external view returns (ElectionResult[] memory) {
        uint256[] memory allCandidates = sElectionIdToCandidateIds[_electionId];

        ElectionResult[] memory results = new ElectionResult[](
            allCandidates.length
        );

        for (uint256 i; i < allCandidates.length; i++) {
            uint256 candidateId = allCandidates[i];

            results[i] = ElectionResult({
                candidateId: candidateId,
                voteCount: sElectionIdToCandidateIdToVoteCount[_electionId][
                    candidateId
                ]
            });
        }

        return results;
    }

    function userHasVoted(
        uint256 _electionId,
        address _voterAddress
    ) external view returns (bool) {
        return sElectionIdToVoterToHasVoted[_electionId][_voterAddress];
    }

    enum ElectionStatus {
        Upcoming,
        Active,
        Ended
    }

    function getElectionStatus(
        uint256 _electionId
    ) public view returns (ElectionStatus) {
        Election memory election = sElections[_electionId];

        if (block.timestamp < election.startTime) {
            return ElectionStatus.Upcoming;
        }

        if (block.timestamp <= election.endTime) {
            return ElectionStatus.Active;
        }

        return ElectionStatus.Ended;
    }

    function getOwner() external view returns (address) {
        return I_OWNER;
    }

    // Modifiers
    modifier ownerOnly() {
        _ownerOnly();
        _;
    }

    function _ownerOnly() internal view {
        if (msg.sender != I_OWNER) {
            revert Voting__NotOwner();
        }
    }
}