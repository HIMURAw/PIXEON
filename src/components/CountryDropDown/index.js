import Button from '@mui/material/Button';
import { FaAngleDown } from 'react-icons/fa6';

const countryDrop=() => {
    return (
        <>
            <Button className='countryDrop'>
                <div className='info d-flex flex-column'>
                    <span className='lable'>Your Location</span>
                    <span className='name'>India</span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>
        </>
    );
}

export default countryDrop;