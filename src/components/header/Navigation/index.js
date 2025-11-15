import React from 'react';
import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";

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
                    <div className='col-sm-9 navPart2'>
                        <ul className='list list-inline'>
                            <li className='list-inline-item'></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;