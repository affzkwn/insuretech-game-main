import React, { useState } from 'react'

import 'assets/scss/personalInfo.scss'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { updateInfo } from 'features/personalInfoSlice'

function PersonalInfo() {

    const history = useHistory()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [smoking, setSmoking] = useState("")
    const [literacy, setLiteracy] = useState("")
    const [salary, setSalary] = useState()

    const handleGender = e => {
        const { name, value } = e.target;
        setGender(value);
    }

    const handleSmoking = e => {
        const { name, value } = e.target;
        setSmoking(value);
    }

    const handleLiteracy = e => {
        const { name, value } = e.target;
        setLiteracy(value);
    }

    const handleSalary = e => {
        const { name, value } = e.target;
        setSalary(value);
        console.log(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(salary !== "0" && name !== "" && age !== "" && gender !=="" && smoking !== "" && literacy !== "") {
            //handle redux
            const data = { name, age, gender, smoking, literacy, salary}
            dispatch(updateInfo(data))
            history.push('/plan')
        }
    }

    return (
        <div className={'personalInfo d-flex flex-column justify-content-around align-items-center'}>

            <h4 className="title mb-2">PLAYER INFORMATION</h4>

            <form className={"form-info w-75 px-4 py-3 rounded-3 shadow"}>
                <h5 className="form-title mb-4">Insert your details:</h5>
                <div className="form-floating mb-2">
                    <input type="text" className="form-control" id="name-input" placeholder="Ahmad" value={name} onChange={(e) => setName(e.target.value)}/>
                    <label for="name-input">Name</label>
                </div>

                <div className="form-floating mb-2">
                    <input type="text" className="form-control" id="age-input" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)}/>
                    <label for="age-input">Age</label>
                </div>
                
                <div className="gender-input mb-2">
                    <span className="gender-title pe-3">Gender:</span>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="gender-input" id="gender-input1" value={"Male"} onChange={(e) => handleGender(e)}/>
                        <label className="form-check-label" for="gender-input1">
                           Male
                        </label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="gender-input" id="gender-input2" value={"Female"}  onChange={(e) => handleGender(e)}/>
                        <label className="form-check-label" for="gender-input2">
                            Female
                        </label>
                    </div>
                </div>

                <div className="smoking-input mb-2">
                    <span className="smoking-title pe-3">Smoking:</span>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="smoking-input" id="smoking-input1" value={true} onChange={(e) => handleSmoking(e)}/>
                        <label className="form-check-label" for="smoking-input1">
                           Yes
                        </label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="smoking-input" id="smoking-input2" value={false} onChange={(e) => handleSmoking(e)}/>
                        <label className="form-check-label" for="smoking-input2">
                            No
                        </label>
                    </div>
                </div>

                <div className="literacy-input mb-2">
                    <div className="smoking-title mb-1">Takaful Literacy:</div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="literacy-input" id="literacy-input1" value={"Average"} onChange={(e) => handleLiteracy(e)}/>
                        <label className="form-check-label" for="literacy-input1">
                           Average
                        </label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="literacy-input" id="literacy-input2" value={"Basic"} onChange={(e) => handleLiteracy(e)}/>
                        <label className="form-check-label" for="literacy-input2">
                            Basic
                        </label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="literacy-input" id="literacy-input3" value={"No Idea"} onChange={(e) => handleLiteracy(e)}/>
                        <label className="form-check-label" for="literacy-input3">
                            No Idea
                        </label>
                    </div>
                </div>

                <div className="monthly-salary form-floating mb-2">
                    <select className="form-select" id="floatingSelect" aria-label="Floating label select example" defaultValue="0" value={salary} onChange={(e) => handleSalary(e)}>
                        <option value="0">Select your range</option>
                        <option value="2000">{"1) < RM2000"}</option>
                        <option value="3500">{"2) RM2001 - RM4000"}</option>
                        <option value="5000">{"3) > RM4000"}</option>
                    </select>
                    <label for="floatingSelect">Monthly Salary</label>
                </div>
            </form>
            <div className="personalInfo-button-action d-flex justify-content-center align-items-center">
                <button type="submit" className="button-back btn btn-outline-warning rounded-pill shadow" onClick={() => history.push('/')}>{'Back'}</button>
                <button type="submit" className="button-next text-white btn btn-warning rounded-pill shadow" onClick={(e) => handleSubmit(e)}>{'Submit'}</button>
            </div>
        </div>
    )
}

export default PersonalInfo
