import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo_Header.png';
// materials
import Button from '@mui/material/Button';

// Icons
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import { TbHandStop } from "react-icons/tb";
import { FaAngleDown } from 'react-icons/fa6';

// components
import CountryDropDown from '../CountryDropDown';
import SearchBox from './SearchBox';
import Navigation from './Navigation';

const Header = () => {
    return (
        <>
            <div className="headerWrapper">
                
                <div className="top-strip bg-blue">
                    <div className="container">
                        <p className="mb-0 mt-0 text-center">Sitemizde <b>"HOSGELDIN12"</b> kodu ile %10 kar edebilirsiniz</p>
                    </div>
                </div>

                <div className="mid-strip">
                    <ul className='ml-auto'>
                        <li className='list-inline-item'><Link to="/">About Us</Link></li>
                        <li className='list-inline-item'><Link to="/">My account</Link></li>
                        <li className='list-inline-item'><Link to="/">Wishlist</Link></li>
                        <li className='list-inline-item'><Link to="/">Order Tracking</Link></li>
                    </ul>

                    <span className='mid-text'><TbHandStop /> 100% Safe delivery and instant support</span>
                    <span className='mid-text2'>Need help? Contact Us: <span className='clr-blue'>help.pixeon.com</span></span>

                    <div className='mid-actions'>
                        <Button className='btn-outline' disableRipple>English <FaAngleDown /></Button>
                        <Button className='btn-primary' disableRipple>USD <FaAngleDown /></Button>
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
                                    <SearchBox />

                                    <div className='part3 d-flex align-items-center ml-auto'>
                                        <Button className='circle mr-3'><FiUser /></Button>
                                        <div className='ml-auto cartTab d-flex align-items-center'>
                                            <span className='price'>$23.2</span>
                                            <div className='position-relative ml-2'>
                                                <Button className='circle'><IoBagOutline /></Button>
                                                <span className='count d-flex align-items-center justify-content-center'>1</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Navigation />

            </div>
        </>
    );
}

export default Header;