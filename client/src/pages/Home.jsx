import {Link} from "react-router-dom";
import {useWallet} from "../context/WalletContext.jsx";
import "../styles/home.css";

function Home()
{
	const {isConnected, connectWallet, account} = useWallet();

	return (
		<div className="home">
			<section className="hero">
				<h1>Blockchain Voting Network</h1>

				<p className="hero-description">
					A decentralized voting platform powered by smart contracts.
					Cast secure, transparent, and tamper-proof votes directly
					from your wallet.
				</p>

				<div className="hero-actions">
					<Link to="/elections">
						<button>View Elections</button>
					</Link>

					{!isConnected ? (
						<button onClick={connectWallet}>Connect Wallet</button>
					) : (
						<div className="wallet-status">
							Connected: {account.slice(0, 6)}
							...
							{account.slice(-4)}
						</div>
					)}
				</div>
			</section>

			<section className="features">
				<h2>How It Works</h2>

				<div className="steps">
					<div className="step-card">
						<h3>Connect Wallet</h3>
						<p>
							Authenticate using MetaMask and access the voting
							platform securely.
						</p>
					</div>

					<div className="step-card">
						<h3>Select Election</h3>
						<p>
							Browse active elections and review participating
							candidates.
						</p>
					</div>

					<div className="step-card">
						<h3>Cast Vote</h3>
						<p>
							Submit your vote directly to the blockchain with
							full transparency.
						</p>
					</div>
				</div>
			</section>

			<section className="benefits">
				<h2>Why Blockchain?</h2>

				<div className="benefit-grid">
					<div className="benefit-card">
						<h3>Transparent</h3>
						<p>Every vote is publicly verifiable on-chain.</p>
					</div>

					<div className="benefit-card">
						<h3>Immutable</h3>
						<p>Votes cannot be modified after submission.</p>
					</div>

					<div className="benefit-card">
						<h3>Secure</h3>
						<p>
							Wallet-based authentication eliminates password
							management.
						</p>
					</div>

					<div className="benefit-card">
						<h3>Decentralized</h3>
						<p>No central authority controls election data.</p>
					</div>
				</div>
			</section>
		</div>
	);
}

export default Home;