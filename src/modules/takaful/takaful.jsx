import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'

import 'assets/scss/takaful.scss'
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { updatePlan} from 'features/planSlice'

function Takaful() {

    const history = useHistory()
    const dispatch = useDispatch()

    const [plan, setPlan] = useState()

    const handleRoute = () => {
        dispatch(updatePlan(plan));
        history.push('/game');
    }

    const handlePreviewA = () => {
        Swal.fire({
            title: 'Life Takaful Plan',
            html: '<ul style="text-align:left";><li>Yearly fee: RM810.00</li><li>This plan ensures your loved ones receive financial support up to <b>RM500,000</b>.</li> <li>You can participate for yourself or as a whole family.</li></ul>',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Cool'
        }).then((result) => {
            if (result.isConfirmed) {
              
              const planInfo = {
                plan: "Life Takaful Plan",
                id: 1,  
                yearlyFees: 810.00,
                protection: {hibah: 500000.00, hospitalization: false, icu: false}
                
              }

              setPlan(planInfo)

              dispatch(updatePlan(planInfo));
              Swal.fire(
                'Smart Move!',
                'Your plan has been added.',
                'Success'
              )
            }
          })
    }

    const handlePreviewB = () => {
        Swal.fire({
            title: 'Hospitalisation Plan',
            html: '<ul style="text-align:left";><li>Yearly fee: RM508.00</li><li> When you are hospitalised, we pay you a Daily Hospitalisation Cash Allowance for <b> each day </b> you are hospitalised <b>(RM350)</b>.</li> <li>If you are admitted to the ICU “Intensive Care Unit”, we pay you <b>200% </b> of Daily Hospitalisation Cash Allowance <b>(RM700)</b></li></ul>',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Cool'
        }).then((result) => {
            if (result.isConfirmed) {

                const planInfo = {
                    plan: "Hospitalisation Plan",
                    id: 2,
                    yearlyFees: 508.00,
                    protection: {hibah: false, hospitalization: true, icu: true}
                    }
                
                setPlan(planInfo)
                dispatch(updatePlan(planInfo)); 
                
                Swal.fire(
                    'Great Move!',
                    'Your plan has been added.',
                    'Success'
                )
            }
          })
    }

    const handlePreviewC = () => {
        Swal.fire({
            title: 'Critical Illness Plan',
            html: '<ul style="text-align:left";><li  >Yearly fee: RM188.00</li> <li><b>Up to RM250,000</b> sum covered upon diagnosis with Cancer, Heart Attack or Stroke.</li> <li><b>RM20,000</b> for death due to all causes.</li></ul>',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Cool'
        }).then((result) => {
            if (result.isConfirmed) {

                const planInfo = {
                    plan: "Critical Illness Plan",
                    id: 3,
                    yearlyFees: 188.00,
                    protection: {hibah: 20000.00, hospitalization: false, icu: false, critical: 250000.00}
                }

                setPlan(planInfo) 
                dispatch(updatePlan(planInfo));
                Swal.fire(
                    'Nice!',
                    'Your plan has been added.',
                    'success'
                )
            }
          })
    }


    

    return (
        
        <div className={'takaful w-100 h-100 d-flex flex-column justify-content-around align-items-center'}>

            <div className={'takaful-header text-center'}>
                <h4 className={'title'}>CHOOSE TAKAFUL PLAN</h4>
            </div>

            <div className={'takaful-plan-container d-flex flex-column justify-content-center align-items-center'}>
                <div className="takaful-plan-A bg-light">
                        <button type="submit" className="button btn btn-info text-white px-1" onClick={handlePreviewA}>Life Takaful Plan</button>
                </div>

                <div className="takaful-plan-B bg-light">
                    <button type="submit" className="button btn btn-info text-white px-1" onClick={handlePreviewB}>Hospitalisation Plan</button>
                </div>

                <div className="takaful-plan-C bg-light">
                    <button type="submit" className="button btn btn-info text-white px-1" onClick={handlePreviewC}>Critical Illness Plan</button>
                </div>
                
            </div>

            <div className="takaful-button-action d-flex justify-content-center align-items-center">
                <button type="submit" className="button-back btn btn-outline-warning rounded-pill shadow" onClick={() => history.push('/info')}>{'Back'}</button>
                <button type="submit" className="button-next text-white btn btn-warning rounded-pill shadow" onClick={(e) => handleRoute(e)}>{'Start'}</button> 
            </div>
             
        </div>
    )
}

export default Takaful
