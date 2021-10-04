import React from 'react'
import takaful from 'assets/images/payung-fwd.jpg'
import { useHistory } from 'react-router-dom'

import 'assets/scss/homepage.scss';
function Homepage() {

    const history = useHistory()

    const handleRoute = () => {
        history.push('/info')
    }

    return (
        <div className={'homepage w-100 h-100 d-flex flex-column justify-content-around  align-items-center position-relative'}>
            <h4 className={'home-title text-center'}>FWD TAKAFUL <br></br> GAME</h4>
            <div className={'homepage-icon d-flex flex-column justify-content-center align-items-center'}>
                <img className={'icon mt-2'} src={takaful} alt={'takaful'} />
            </div>
            <div className={'button-container '}>
                <button onClick={handleRoute} type="button" className={'button text-white btn btn-warning rounded-pill shadow-lg'}>Play Game</button>
            </div>
        </div>
    )
}

export default Homepage
