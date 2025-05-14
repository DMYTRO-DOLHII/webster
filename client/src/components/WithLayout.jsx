import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const WithLayout = () => (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
);

export default WithLayout;
