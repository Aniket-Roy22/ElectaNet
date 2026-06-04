import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {useWallet} from "../context/WalletContext.jsx";
import "../styles/electionDetails.css";

function ElectionDetails()
{
	const {id} = useParams();
	const {contract, account} = useWallet();
	const [election, setElection] = useState(null);
	const [candidates, setCandidates] = useState([]);
	const [hasVoted, setHasVoted] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!contract) return;

		async function load()
		{
			try
			{
				setLoading(true);
				setError("");

				const currentElection = await contract.getElectionById(id);

				setElection(currentElection);

				const candidateIds = await contract.getElectionCandidateIds(id);
				const fetchedCandidates = await Promise.all(
					candidateIds.map((candidateId) =>
						contract.getCandidateById(candidateId),
					),
				);

				setCandidates(fetchedCandidates);

				if (account)
				{
					const voted = await contract.userHasVoted(id, account);
					setHasVoted(voted);
				}
			}
			catch (err)
			{
				console.error(err);
				setError("Failed to load election.");
			}
			finally
			{
				setLoading(false);
			}
		}

		load();
	}, [contract, id, account]);

	async function vote(candidateId)
	{
		try
		{
			const tx = await contract.vote(id, candidateId);
			await tx.wait();
			setHasVoted(true);
		}
		catch (err)
		{
			console.error(err);
		}
	}

	if (loading)
	{
		return <p>Loading election...</p>;
	}

	if (error)
	{
		return <p>{error}</p>;
	}

	if (!election)
	{
		return <p>Election not found.</p>;
	}

	return (
		<div className="election-details">
			<div className="election-header">
				<h1>{election.title}</h1>

				<div className="election-meta">
					<div className="meta-card">
						<span>Start</span>

						<p>
							{new Date(
								Number(election.startTime) * 1000,
							).toLocaleString()}
						</p>
					</div>

					<div className="meta-card">
						<span>End</span>

						<p>
							{new Date(
								Number(election.endTime) * 1000,
							).toLocaleString()}
						</p>
					</div>
				</div>
			</div>

			<section className="candidates-section">
				<h2>Candidates</h2>

				{candidates.length === 0 ? (
					<p>No candidates assigned.</p>
				) : (
					<div className="candidates-grid">
						{candidates.map((candidate) => (
							<div
								className="candidate-card"
								key={candidate.id.toString()}
							>
								<div className="candidate-id">
									#{Number(candidate.id)}
								</div>

								<h3>{candidate.name}</h3>

								{hasVoted ? (
									<div className="voted-badge">Voted</div>
								) : (
									<button onClick={() => vote(candidate.id)}>
										Vote
									</button>
								)}
							</div>
						))}
					</div>
				)}
			</section>

			<div className="results-link">
				<Link to={`/results/${id}`}>View Results</Link>
			</div>
		</div>
	);
}

export default ElectionDetails;