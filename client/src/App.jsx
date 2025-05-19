import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AxiosInterceptor } from './services/api';
import { Toaster } from 'react-hot-toast';

// Pages import
import Main from './pages/Main/Main'
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Workspace from './pages/Workspace/Workspace';
import Editor from './pages/Canvas/Canvas'
import Canvas from './pages/Canvas/Canvas'
import Success from './pages/Success/Success'
import Error404 from './pages/404/404';

// Components import
import Header from './components/Header';
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ScrollToTop from './components/ScrollToTop';
import WithLayout from './components/WithLayout'
import Pricing from './pages/Main/components/Pricing';

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
            <div>
                <Toaster position='top-right' />
            </div>
            <Routes>
                <Route element={<WithLayout />}>
                    <Route path='/' element={<Main />} />
                    <Route path='/pricing' element={<Pricing />} />
                    <Route path='/subscription/success' element={<Success />} />

                    {/* Add other pages here that need Header/Footer */}
                </Route>

                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/workspace' element={<Workspace />} />
                <Route path='/canvas/:projectId' element={<Canvas />} />

                {/* Catch-all for 404 */}
                <Route path="*" element={<Error404 />} />
            </Routes>

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
