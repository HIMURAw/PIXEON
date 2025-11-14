import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';
// materials
import Button from '@mui/material/Button';

// Icons
import { IoIosSearch } from "react-icons/io";
import { FiUser } from "react-icons/fi";

// components
import CountryDropDown from '../CountryDropDown';

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

                            <div className='col-sm-10 d-flex align-items-center part2'>
                                <div className='d-flex justify-content-start w-100 align-items-center h-100'>
                                    <CountryDropDown />


                                    {/* Header Search Bar Here */}
                                    <div className='headerSearch ml-3 mr-3 '>
                                        <input type='text' placeholder='Search for products...' />
                                        <Button><IoIosSearch /></Button>
                                    </div>
                                    {/* Header Search En d Here */}


                                    <div className='part3 d-flex align-items-center ml-auto'>
                                        <Button className='circle'><FiUser /></Button>
                                    </div>
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