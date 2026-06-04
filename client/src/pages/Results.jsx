import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useWallet} from "../context/WalletContext.jsx";
import "../styles/results.css";

function Results()
{
	const {id} = useParams();
	const {contract} = useWallet();
	const [results, setResults] = useState([]);
	const sortedResults = [...results].sort(
		(a, b) => Number(b.votes) - Number(a.votes),
	);

	useEffect(() => {
		if (!contract) return;

		async function load()
		{
			const rawResults = await contract.getElectionResults(id);

			const formatted = await Promise.all(
				rawResults.map(async (result) => {
					const candidate = await contract.getCandidateById(result.candidateId);

					return {
						name: candidate.name,
						votes: Number(result.voteCount),
					};
				}),
			);

			setResults(formatted);
		};

		load();
	}, [contract, id]);

	return (
		<div className="results-page">
			<div className="results-header">
				<h1>Election Results</h1>
				<p>Live on-chain voting results</p>
			</div>

			{sortedResults.length > 0 && (
				<div className="winner-card">
					<div className="winner-label">Leading</div>

					<h2>{sortedResults[0].name}</h2>

					<div className="winner-votes">
						{Number(sortedResults[0].votes)} Votes
					</div>
				</div>
			)}

			<div className="leaderboard">
				{sortedResults.map((result, index) => {
					const winner = index === 0;

					return (
						<div
							key={index}
							className={`leaderboard-row ${
								winner ? "first-place" : ""
							}`}
						>
							<div className="position">#{index + 1}</div>

							<div className="candidate">{result.name}</div>

							<div className="votes">{Number(result.votes)}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Results;