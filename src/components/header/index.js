import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Logo from '../../assets/logo.png';

const Header = () => {
    return (
        <>
            <div className="headerWrapper">
                <div className="top-strip bg-blue">
                    <div className="container">
                        <p className="mb-0 mt-0 text-center">Sitemizde <b>"HOSGELDIN12"</b> kodu ile %10 kar edebilirsiniz</p>
                    </div>
                </div>

                <div className="header">
                    <div className="container">
                        <div className="row">
                            <div className="logoWrapper d-flex align-items-center col-sm-2">
                                <Link to='/'>
                                    <img src={Logo} alt='logo-image' />
                                </Link>
                            </div>

                            <div className='col-sm-10 d-flex align-itemn-center part2'>
                                <div className='d-flex justify-content-end w-100 align-items-center h-100'>
                                    <Button className='countryDrop'>
                                        <div className='info d-flex flex-column'>
                                            <span>Your Location</span>
                                            <span>India</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;