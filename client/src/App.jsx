import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AxiosInterceptor } from './services/api';
import { Toaster } from 'react-hot-toast';

// Pages import
import Main from './pages/Main/Main'
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

// Components import
import Header from './components/Header';
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ScrollToTop from './components/ScrollToTop';

import { userStore } from './store/userStore';

import { fetchCurrentUser } from './services/userService';

import './App.css'


function AppContent() {
    const location = useLocation();
    const [loading, setLoading] = useState(true); // Loading state
    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await fetchCurrentUser();
                if (!currentUser) {
                    userStore.logout();
                    return;
                }
                userStore.setUser(currentUser);

                // const subs = await getSubscribedEvents(currentUser.id);
                // userStore.setSubscriptions(subs);

            } catch (error) {
                console.error('Failed to fetch user:', error);
                userStore.logout();
            } finally {
                setLoading(false); // Завершаем загрузку
            }
        };
        // if (localStorage.getItem('token')) loadUser();
        loadUser();
    }, []);
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='flex flex-col h-screen scroll-smooth'>
            {location.pathname !== '/login' &&
                location.pathname !== '/register' && <Header />}

            <div>
                <Toaster position='top-right' />
            </div>

            <main className='flex flex-col flex-grow'>
                <Routes>
                    <Route path='/' element={<Main />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                </Routes>
            </main>

            {location.pathname !== '/login' &&
                location.pathname !== '/register' && <Footer />}
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
