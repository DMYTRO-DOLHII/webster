import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AxiosInterceptor } from './services/api';
import { Toaster } from 'react-hot-toast';

// Pages import
import Main from './pages/Main/Main'
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Workspace from './pages/Workspace/Workspace';

// Components import
import Header from './components/Header';
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ScrollToTop from './components/ScrollToTop';

import './App.css'


function AppContent() {
    const location = useLocation();

    return (
        <div className='flex flex-col h-screen scroll-smooth'>
            {location.pathname !== '/login' &&
                location.pathname !== '/register'  &&
                location.pathname !== '/workspace' && <Header />}

            <div>
                <Toaster position='top-right' />
            </div>

            <main className='flex flex-col flex-grow'>
                <Routes>
                    <Route path='/' element={<Main />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/workspace' element={<Workspace />} />
                </Routes>
            </main>

            {location.pathname !== '/login' &&
                location.pathname !== '/register' &&
                location.pathname !== '/workspace' && <Footer />}
        </div>
    )
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
