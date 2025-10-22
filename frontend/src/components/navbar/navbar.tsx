import './navbar.css'
import { SiLeetcode,SiCodeforces,SiCodechef } from "react-icons/si";
import { FaHome } from "react-icons/fa";

export default function Navbar () {
    return (
        <>
            <div className='nav-main'>
                <div className='nav-ele'>
                    <ul className='nav-lst'>
                        <li><a href="#"> <FaHome /> </a></li>
                        <li><a href="#"> <SiLeetcode/> </a></li>
                        <li><a href="#"> <SiCodeforces/> </a></li>
                        <li><a href="#"> <SiCodechef/> </a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}