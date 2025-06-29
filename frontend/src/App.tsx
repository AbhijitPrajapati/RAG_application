import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import CollectionsPage from './pages/CollectionsPage';
import FilesPage from '@/pages/FilesPage';
import { Toaster } from './components/ui/sonner';
import { useFetchCollections } from '@/stores/useCollectionStore';

function App() {
	const fetchCollections = useFetchCollections();

	useEffect(() => {
		fetchCollections();
	}, []);

	return (
		<>
			<Router>
				<Routes>
					<Route path='/' element={<ChatPage />} />
					<Route path='/collections' element={<CollectionsPage />} />
					<Route path='/files' element={<FilesPage />} />
				</Routes>
			</Router>
			<Toaster />
		</>
	);
}

export default App;
