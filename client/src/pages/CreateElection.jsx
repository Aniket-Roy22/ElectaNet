import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useWallet} from "../context/WalletContext.jsx";
import "../styles/createElection.css";

function CreateElection()
{
	const {contract, isOwner} = useWallet();
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [candidates, setCandidates] = useState([]);
	const [selectedCandidates, setSelectedCandidates] = useState([]);

	useEffect(() => {
		if (!contract) return;

		async function loadCandidates()
		{
			const count = await contract.getCandidateCount();
			const data = [];

			for (let i = 1; i <= Number(count); i++)
			{
				const candidate = await contract.getCandidateById(i);
				data.push(candidate);
			}

			setCandidates(data);
		};

		loadCandidates();
	}, [contract]);

	function toggleCandidate(candidateId)
	{
		setSelectedCandidates((previous) => {
			if (previous.includes(candidateId))
			{
				return previous.filter((id) => id !== candidateId);
			}

			return [...previous, candidateId];
		});
	};

	async function handleSubmit(e)
	{
		e.preventDefault();

		if (!isOwner) return;

		const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
		const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
		const tx = await contract.createElection(
			title,
			startTimestamp,
			endTimestamp,
		);
		const receipt = await tx.wait(1);
		const electionCount = await contract.getElectionCount();

		for (const candidateId of selectedCandidates)
		{
			const tx = await contract.addCandidateToElection(
				electionCount,
				candidateId,
			);

			await tx.wait();
		}

		navigate(`/elections/${electionCount}`);
	};

	return (
		<div className="create-election-page">
			<div className="page-header">
				<h1>Create Election</h1>

				<p>
					Create a new election and assign candidates eligible to
					participate.
				</p>
			</div>

			<form className="election-form" onSubmit={handleSubmit}>
				<div className="form-card">
					<h2>Election Details</h2>

					<div className="input-group">
						<label>Election Title</label>

						<input
							type="text"
							placeholder="Student Council Election"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>

					<div className="date-grid">
						<div className="input-group">
							<label>Start Date</label>

							<input
								type="datetime-local"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</div>

						<div className="input-group">
							<label>End Date</label>

							<input
								type="datetime-local"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="form-card">
					<h2>Assign Candidates</h2>

					<p>Select candidates that will appear in this election.</p>

					<div className="candidate-selection-grid">
						{candidates.map((candidate) => (
							<label
								key={candidate.id}
								className="candidate-option"
							>
								<input
									type="checkbox"
									onChange={() =>
										toggleCandidate(Number(candidate.id))
									}
								/>

								<div className="candidate-details">
									<h3>{candidate.name}</h3>

									<span>ID #{Number(candidate.id)}</span>
								</div>
							</label>
						))}
					</div>
				</div>

				<button className="submit-btn" type="submit">
					Create Election
				</button>
			</form>
		</div>
	);
}

export default CreateElection;