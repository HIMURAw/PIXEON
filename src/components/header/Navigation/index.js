import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { FaAngleDown } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { CiHome } from "react-icons/ci";

const Navigation = () => {
    return (
        <nav>
            <div className="container">
                <div className='row'>
                    <div className='col-sm-3 navPart1'>
                        <Button className='allCatTab align-items-center'>
                            <span className='icon1 mr-2'><IoIosMenu /></span>
                            <span className='text'>All Categories</span>
                            <span className='icon2 ml-2'><FaAngleDown /></span>
                        </Button>
                    </div>
                    <div className='col-sm-9  d-flex align-items-center navPart2'>
                        <ul className='list list-inline ml-auto'>
                            <li className='list-inline-item'><Link to="/"><CiHome /> Home</Link></li>
                            <li className='list-inline-item'><Link to="/">Fashion</Link></li>
                            <li className='list-inline-item'><Link to="/">Clothing</Link></li>
                            <li className='list-inline-item'><Link to="/">Electronic</Link></li>
                            <li className='list-inline-item'><Link to="/">Beauty</Link></li>
                            <li className='list-inline-item'><Link to="/">accessory</Link></li>
                            <li className='list-inline-item'><Link to="/">Shoes</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;