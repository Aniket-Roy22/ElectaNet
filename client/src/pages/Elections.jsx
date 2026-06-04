import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useWallet} from "../context/WalletContext.jsx";
import "../styles/elections.css";

function Elections()
{
	const {contract} = useWallet();
	const [elections, setElections] = useState([]);

	useEffect(() => {
		if (!contract) return;

		async function loadElections()
		{
			const count = await contract.getElectionCount();
			const data = [];

			for (let i = 1; i <= Number(count); i++)
			{
				const election = await contract.getElectionById(i);
				data.push(election);
			}

			setElections(data);
		};

		loadElections();
	}, [contract]);

	return (
		<div className="elections-page">
			<div className="elections-header">
				<h1>Elections</h1>

				<p>Browse active, upcoming, and completed elections.</p>
			</div>

			<div className="elections-grid">
				{elections.map((election) => (
					<div className="election-card" key={election.id}>
						<div className="election-id">
							Election #{Number(election.id)}
						</div>

						<h2>{election.title}</h2>

						<div className="election-dates">
							<p>
								<strong>Starts:</strong>{" "}
								{new Date(
									Number(election.startTime) * 1000,
								).toLocaleString()}
							</p>

							<p>
								<strong>Ends:</strong>{" "}
								{new Date(
									Number(election.endTime) * 1000,
								).toLocaleString()}
							</p>
						</div>

						<Link
							className="open-election-btn"
							to={`/elections/${election.id}`}
						>
							View Election
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}

export default Elections;