import Button from '@mui/material/Button';
import { FaAngleDown } from 'react-icons/fa6';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { IoIosSearch } from "react-icons/io";


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


            <Dialog open={true} className='locationModal'>
                <h4>Choose your Delivery Location</h4>
                <p>Enter your adress and we will specify thr offer your area.</p>

                <div className='headerSearch ml-3 mr-3 '>
                    <input type='text' placeholder='Search for products...' />
                    <Button><IoIosSearch /></Button>
                </div>
            </Dialog>
        </>
    );
}

export default countryDrop;