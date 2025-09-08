import React from "react";
import './NavBar.scss';

function NavBar() {
    return (
        <div className="navbar">
            <div className="nav-logo">AgeV</div>
            <ul className="nav-links">
                <li><a href="#">AnaSayfa</a></li>
                <li><a href="#">Yetkililer</a></li>
                <li><a href="#">Hakkımızda</a></li>
                <li><a href="https://discord.gg/agev">Discord</a></li>
            </ul>
        </div>
    )
}

export default NavBar;