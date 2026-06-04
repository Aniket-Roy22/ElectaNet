import {createContext, useContext, useEffect, useState} from "react";
import {ethers} from "ethers";
import {CONTRACT_ADDRESS, CONTRACT_ABI} from "../config/contract";

const WalletContext = createContext();

export function WalletProvider({children})
{
	const [account, setAccount] = useState(null);
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isOwner, setIsOwner] = useState(false);

	async function connectWallet()
	{
		try
		{
			if (!window.ethereum)
			{
				throw new Error("MetaMask not installed");
			}

			const provider = new ethers.BrowserProvider(window.ethereum);

			await provider.send("eth_requestAccounts", []);

			const signer = await provider.getSigner();
			const account = await signer.getAddress();
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				CONTRACT_ABI,
				signer,
			);
			const owner = await contract.getOwner();

			setIsOwner(owner.toLowerCase() === account.toLowerCase());
			setProvider(provider);
			setSigner(signer);
			setAccount(account);
			setContract(contract);
			setIsConnected(true);

		}
		catch (error)
		{
			console.error(error);
		}
	}

	async function checkConnection()
	{
		try
		{
			if (!window.ethereum) return;

			const provider = new ethers.BrowserProvider(window.ethereum);
			const accounts = await provider.listAccounts();

			if (accounts.length === 0) return;

			const signer = await provider.getSigner();
			const account = await signer.getAddress();
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				CONTRACT_ABI,
				signer,
			);
			const owner = await contract.getOwner();

			setIsOwner(owner.toLowerCase() === account.toLowerCase());
			setProvider(provider);
			setSigner(signer);
			setAccount(account);
			setContract(contract);
			setIsConnected(true);
		}
		catch (error)
		{
			console.error(error);
		}
	};

	useEffect(() => {
		checkConnection();
	}, []);

	useEffect(() => {
		if (!window.ethereum) return;

		const handleAccountsChanged = (accounts) => {
			if (accounts.length === 0) {
				setAccount(null);
				setSigner(null);
				setContract(null);
				setIsConnected(false);
				return;
			}

			connectWallet();
		};

		window.ethereum.on("accountsChanged", handleAccountsChanged);

		return () => {
			window.ethereum.removeListener(
				"accountsChanged",
				handleAccountsChanged,
			);
		};
	}, []);

	return (
		<WalletContext.Provider
			value={{
				account,
				provider,
				signer,
				contract,
				isConnected,
				isOwner,
				connectWallet,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
}

export function useWallet()
{
	return useContext(WalletContext);
}