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
import SomethingInteresting from './pages/SomethingInteresting';

// Components import
import Header from './components/Header';
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ScrollToTop from './components/ScrollToTop';
import WithLayout from './components/WithLayout'
import Pricing from './pages/Main/components/Pricing';
import EmailConfirmation from './pages/Register/EmailConfirmation';
import EmailSentPasswordReset from './pages/Workspace/components/EmailSentPasswordReset';
import ResetPassword from './pages/Workspace/components/PasswordReset';

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
                    <Route path='/pashalka' element={<SomethingInteresting />} />

                    {/* Add other pages here that need Header/Footer */}
                </Route>

                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/auth/github/callback' element={<Login />} />
                <Route path='/auth/discord/callback' element={<Login />} />

                <Route path='/confirm-email/:token' element={<EmailConfirmation />} />
                <Route path='/workspace' element={<Workspace />} />
                <Route path='/canvas/:projectId' element={<Canvas />} />
                <Route path='/password-reset' element={<EmailSentPasswordReset />} />
                <Route path='/password-reset/:token' element={<ResetPassword />} />
                {/* Catch-all for 404 */}
                <Route path='*' element={<Error404 />} />
            </Routes>
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
