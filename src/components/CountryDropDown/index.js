import { useState, useEffect, forwardRef } from 'react';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import { FaAngleDown } from 'react-icons/fa6';
import Dialog from '@mui/material/Dialog';
import { IoIosSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDrop = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [countriesData, setCountriesData] = useState([]);
    const [selectedTab, setSelectedTab] = useState(null);

    useEffect(() => {
        fetch('https://countriesnow.space/api/v0.1/countries')
            .then((res) => res.json())
            .then((json) => {
                const list = Array.isArray(json?.data) ? json.data.map((c) => c.country).filter(Boolean) : [];
                setCountriesData(list);
            })
            .catch(() => setCountriesData([]));
    }, []);

    const selectCountry = (index) => {
        setSelectedTab(index);
        setIsOpenModal(false);
    }

    return (
 <>
            <Button className='countryDrop' onClick={() => setIsOpenModal(true)}>
                <div className='info d-flex flex-column'>
                    <span className='label'>Your Location</span>
                    <span className='name'>Turkey</span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>

            <Dialog open={isOpenModal} onClose={() => setIsOpenModal(false)} className='locationModal' TransitionComponent={Transition} >
                <h4 className='mb-0'>Choose your Delivery Location</h4>
                <p>Enter your adress and we will specify the offer for your area.</p>

                <Button className='close-btn' onClick={() => setIsOpenModal(false)}><MdClose /></Button>

                <div className='headerSearch w-100'>
                    <input type='text' placeholder='Search for area...' />
                    <Button><IoIosSearch /></Button>
                </div>

                <ul className='countryList mt-3'>
                    {countriesData.map((country, index) => (
                        <li key={index}>
                            <Button onClick={() => selectCountry(index)} 
                            className={`${selectedTab === index ? 'active' : ''}`}
                            >{country}</Button>
                        </li>
                    ))}
                </ul>
            </Dialog>
        </>
    );
}

export default CountryDrop;