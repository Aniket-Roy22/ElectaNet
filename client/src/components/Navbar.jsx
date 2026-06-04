import {Link} from "react-router-dom";
import {useWallet} from "../context/WalletContext.jsx";
import "../styles/navbar.css";

function Navbar()
{
	const {account, isConnected, isOwner, connectWallet} = useWallet();

	return (
		<nav className="navbar">
			<div className="navbar-left">
				<Link to="/" className="logo">
					VoteChain
				</Link>
			</div>

			<div className="navbar-center">
				<Link to="/">Home</Link>

				{isOwner && (
					<>
						<Link to="/admin/candidates">Candidates</Link>

						<Link to="/admin/create-election">New Election</Link>
					</>
				)}

				<Link to="/elections">Elections</Link>
			</div>

			<div className="navbar-right">
				{isConnected ? (
					<button>
						{account.slice(0, 6)}
						...
						{account.slice(-4)}
					</button>
				) : (
					<button onClick={connectWallet}>Connect Wallet</button>
				)}
			</div>
		</nav>
	);
}

export default Navbar;