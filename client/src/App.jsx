import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Candidates from "./pages/Candidates.jsx";
import Elections from "./pages/Elections.jsx";
import CreateElection from "./pages/CreateElection.jsx";
import ElectionDetails from "./pages/ElectionDetails.jsx";
import Results from "./pages/Results.jsx";
import "./App.css";

function App()
{
	return (
		<BrowserRouter>
			<Navbar />

			<Routes>
				<Route path="/" element={<Home />} />

				<Route path="/elections" element={<Elections />} />

				<Route path="/admin/candidates" element={<Candidates />} />

				<Route
					path="/admin/create-election"
					element={<CreateElection />}
				/>

				<Route path="/elections/:id" element={<ElectionDetails />} />

				<Route path="/results/:id" element={<Results />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;