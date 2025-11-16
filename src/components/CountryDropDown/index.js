import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FaAngleDown } from 'react-icons/fa6';

const countryDrop=() => {
    return (
        <>
            <Button className='countryDrop'>
                <div className='info d-flex flex-column'>
                    <span className='label'>Your Location</span>
                    <span className='name'>Turkey</span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>

        </>
    );
}

export default countryDrop;