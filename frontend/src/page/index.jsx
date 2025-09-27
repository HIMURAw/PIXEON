import React from 'react';


// imports
import NavBar from '../components/NavBar/NavBar';
import Hero from '../components/Hero/Hero';
import Staffs from '../components/staffs/staffs';


function Index() {

    return (
        <div style={{ userSelect: 'none' }}>
            <NavBar />
            <Hero />
            <Staffs />
        </div>
    )
}

export default Index;