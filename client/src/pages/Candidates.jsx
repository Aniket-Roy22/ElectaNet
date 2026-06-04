import {useEffect, useState} from "react";
import {useWallet} from "../context/WalletContext.jsx";
import "../styles/candidates.css";

function Candidates()
{
	const {contract} = useWallet();
	const [name, setName] = useState("");
	const [candidates, setCandidates] = useState([]);

	async function loadCandidates()
	{
		if (!contract) return;

		const count = await contract.getCandidateCount();
		const data = [];

		for (let i = 1; i <= Number(count); i++)
		{
			const candidate = await contract.getCandidateById(i);
			data.push(candidate);
		}

		setCandidates(data);
	};

	useEffect(() => {
		loadCandidates();
	}, [contract]);

	async function createCandidate(e)
	{
		e.preventDefault();
		const tx = await contract.createCandidate(name);
		await tx.wait();
		setName("");
		loadCandidates();
	};

	return (
		<div className="candidates-page">
			<div className="candidates-header">
				<h1>Candidates</h1>
				<p>
					Create and manage candidates that can be assigned to
					elections.
				</p>
			</div>

			<div className="candidate-form-card">
				<h2>Add Candidate</h2>

				<form onSubmit={createCandidate}>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Candidate Name"
					/>

					<button type="submit">Add</button>
				</form>
			</div>

			<div className="candidate-list">
				{candidates.map((candidate) => (
					<div className="candidate-card" key={candidate.id}>
						<div className="candidate-id">
							#{Number(candidate.id)}
						</div>

						<h3>{candidate.name}</h3>
					</div>
				))}
			</div>
		</div>
	);
}

export default Candidates;