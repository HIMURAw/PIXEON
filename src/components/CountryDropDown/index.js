import { useState, useEffect, forwardRef } from 'react';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import { FaAngleDown } from 'react-icons/fa6';
import Dialog from '@mui/material/Dialog';
import { IoIosSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { FilterList } from '@mui/icons-material';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDrop = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [countriesData, setCountriesData] = useState([]);
    const [selectedTab, setSelectedTab] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState('Turkey');
    const [isFiltering, setIsFiltering] = useState(false);

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
        const name = countriesData[index];
        if (name) setSelectedCountry(name);
        setIsOpenModal(false);
    }

    const FilterList = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setIsFiltering(true);
        fetch('https://countriesnow.space/api/v0.1/countries')
            .then((res) => res.json())
            .then((json) => {
                const list = Array.isArray(json?.data) ? json.data.map((c) => c.country).filter(Boolean) : [];
                const filteredList = list.filter((country) =>
                    country.toLowerCase().includes(searchTerm)
                );
                setCountriesData(filteredList);
            })
            .catch(() => setCountriesData([]))
            .finally(() => setIsFiltering(false));
    };

    return (
 <>
            <Button className='countryDrop' onClick={() => setIsOpenModal(true)}>
                <div className='info d-flex flex-column'>
                    <span className='label'>Your Location</span>
                    <span className='name'>{selectedCountry}</span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>

            <Dialog open={isOpenModal} onClose={() => setIsOpenModal(false)} className='locationModal' TransitionComponent={Transition} >
                <h4 className='mb-0'>Choose your Delivery Location</h4>
                <p>Enter your adress and we will specify the offer for your area.</p>

                <Button className='close-btn' onClick={() => setIsOpenModal(false)}><MdClose /></Button>

                <div className='headerSearch w-100 d-flex align-items-center'>
                    <input type='text' placeholder='Search for area...' onChange={FilterList} />
                    <Button><IoIosSearch /></Button>
                    {isFiltering && <span className='list-loader ml-2' aria-label='loading' />}
                </div>

                <ul className={`countryList mt-3 ${isFiltering ? 'filtering' : ''}`}>
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