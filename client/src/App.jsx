import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AxiosInterceptor } from './services/api';

// Pages import
import Main from './pages/Main/Main'
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

// Components import
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner'
import ScrollToTop from './components/ScrollToTop';
import Editor from './pages/Test/Editor'

import './App.css'


function AppContent() {
    const location = useLocation();

    return (
		<div className='flex flex-col h-screen'>
			{location.pathname !== '/login' && location.pathname !== '/register' && <Header />}
			<main className='flex flex-col flex-grow'>
				<Routes>
					<Route path='/' element={<Main />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path='/editor' element={<Editor />} />
				</Routes>
			</main>
		</div>
	);
}

function App() {
    return (
        <Router>
            <AxiosInterceptor />
            <ScrollToTop />
            <AppContent />
        </Router>
    )
}

export default App
