import { React } from 'react';
import { Link } from 'react-router-dom';

function Navigation(){
    return (
        <div>
            <nav>
                <Link class="nav" to="/">Home</Link>
                <Link class="nav" to="/add-exercise">Create an Exercise</Link>
            </nav>
        </div>
    )
}

export default Navigation;