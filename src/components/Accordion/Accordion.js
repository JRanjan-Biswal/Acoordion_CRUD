import { useState, useEffect } from "react";
import "./Accordion.css";
import DeleteModal from '../DeleteModal/DeleteModal';

const Gender = ({ gender, id, handleChange, name }) => {
    useEffect(() => {
        let options = Array.from(document.getElementsByTagName('option'))
        options.forEach(ele => ele.id == gender ? ele.setAttribute('selected', 'selected') : "")
    }, [])
    return (
        <select
            disabled={true}
            id="genderDropDown"
            value={gender}
            name="gender"
            className={`celeb-info-edit${id}`}
            onChange={(event) => handleChange(event, 'gender')}
        >
            <option id="male" value={"male"}>Male</option>
            <option id="female" value={'female'}>Female</option>
            <option id="transgender" value={'transgender'}>Transgender</option>
            <option id="ratherNotSay" value='ratherNotSay'>Rather Not Say</option>
            <option id='other' value={'other'}>Other</option>
        </select>
    );
};

const Accordion = ({ info, data, setDeleteMode, deleteMode, setDelete, handleShowDescription, showDescription, editMode, setEditMode, wrongDataType, setWrongDataType, windowWidth }) => {

    const {
        id,
        first,
        last,
        dob,
        gender,
        email,
        picture,
        country,
        description,
    } = info;

    const [celebInfo, setCelebInfo] = useState({
        id,
        name: first + " " + last,
        picture,
        gender,
        country,
        description,
        age: ""
    });

    // this use state store the previous value. so when clicked on cancel. this value is used to revert back
    // this changed when handleOk is clicked since it then stores the new Data
    const [currentCelebInfo, setCurrentCelebInfo] = useState({
        id,
        name: first + " " + last,
        picture,
        gender,
        country,
        description,
        age: ""
    })


    const handleDelete = (id) => {

        setDeleteMode(() => {
            return { ...deleteMode, showDeleteComponent: true, celebDataToDelete: celebInfo.id, celebDataName: celebInfo.name }
        })

    }

    const handleCancel = (e) => {

        setCelebInfo(() => {
            return { ...celebInfo, name: currentCelebInfo.name, age: currentCelebInfo.age, gender: currentCelebInfo.gender, country: currentCelebInfo.country, description: currentCelebInfo.description }
        })

        setEditMode(false)

        const dataToEdit = document.getElementsByClassName(`celeb-info-edit${id}`);
        let flag = dataToEdit[0].disabled == true ? false : true;

        for (let i = 0; i < dataToEdit.length; i++) {
            dataToEdit[i].disabled = flag;
            dataToEdit[i].classList.toggle("edit-border");
            dataToEdit[i].value = currentCelebInfo[dataToEdit[i].name];
        }
    }

    const handleOk = (id) => {
        if (wrongDataType.flag) {
            alert(`Enter correct data type in ${wrongDataType.type}`)
            return
        }

        // if any data is not similar to previous data that means it has been edited.
        // if not edited then isEdited remains false
        let isEdited = false;
        for (let key in currentCelebInfo) {
            if (currentCelebInfo[key] !== celebInfo[key]) {
                isEdited = true;
            }
        }

        if (isEdited == false) {
            alert('Please click cancel or edit something first');
            return;
        }

        setCurrentCelebInfo(() => {
            return { ...currentCelebInfo, ...celebInfo }
        })

        setEditMode(false)

        const dataToEdit = document.getElementsByClassName(
            `celeb-info-edit${id}`
        );

        let flag = dataToEdit[0].disabled == true ? false : true;

        for (let i = 0; i < dataToEdit.length; i++) {
            dataToEdit[i].disabled = flag;
            dataToEdit[i].classList.toggle("edit-border");
        }

    }


    const handleEdit = (id) => {

        // if (celebInfo.age < 18 && editedCurrent == false) {
        //     alert('celeb is not an adult')
        //     return;
        // }

        // if the celeb is not an adult than don't allow edit
        if (celebInfo.age < 18) {
            alert('celeb is not an adult')
            return;
        }

        setEditMode(true);

        // normally all the input elements are disabled. this sets disabled = false,
        // so the input elements can be edited
        const dataToEdit = document.getElementsByClassName(
            `celeb-info-edit${id}`
        );

        let flag = dataToEdit[0].disabled == true ? false : true;

        for (let i = 0; i < dataToEdit.length; i++) {
            dataToEdit[i].disabled = flag;
            dataToEdit[i].classList.toggle("edit-border");
        }
    };


    // if anything changes then only this onchange event handler is called
    // key ==> name, age, gender, country, description
    const handleChange = (e, key) => {

        //  if data type of any element is wrong 
        //  but now trying to change the value of other element then prevent it
        if (wrongDataType.flag && key !== wrongDataType.type) {
            e.target.value = e.target.defaultValue;
            alert('please correct the error first');
            return
        }

        let wrongTypeFlag = false;

        // if trying to make then input box empty then don't  allow
        if (e.target.value == "") {
            e.target.value = e.target.defaultValue
            alert('cannot leave the field empty');
            return;
        }

        // if age contains any number PREVENT it
        if (key == 'age') {
            let number = e.target.value;
            let regex = /[a-zA-Z]/.test(number)
            if (regex || e.target.value > 110) {
                wrongTypeFlag = true
            }
        }

        // if name and country contains number then PREVENT it
        if (key == 'name' || key == 'country') {
            let string = e.target.value;
            let regex = /[0-9]/.test(string);
            if (regex) {
                wrongTypeFlag = true;
            }
        }

        // this is the PREVENTION part for the above scenarios.
        // this sets a wrongDataTypeFlag
        if (wrongTypeFlag == true) {
            setWrongDataType(() => { return { ...wrongDataType, flag: true, type: key } });
            e.target.style.border = '5px solid red';
            alert(`Enter correct data type in ${key}`)
            return;
        }

        // if no error then save the new data
        e.target.style.border = 'none'
        setWrongDataType(() => { return { ...wrongDataType, flag: false, type: '' } });

        setCelebInfo(() => {
            return { ...celebInfo, [key]: e.target.value }
        })
    };


    // calculate age and add age data to the celebInfo
    function calculateAge() {
        let anotherDate = new Date(dob);
        let month = Date.now() - anotherDate.getTime();
        let age_dt = new Date(month);
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
    useEffect(() => {
        let currentAge = calculateAge();
        setCelebInfo(() => {
            return { ...celebInfo, age: `${currentAge}` };
        });
        setCurrentCelebInfo(() => {
            return { ...celebInfo, age: `${currentAge}` };
        });
    }, []);

    // ONLY FOR TEXTAREA HEIGHT - calculates text area height and set it -- CSS
    useEffect(() => {
        const textArea = document.getElementsByTagName("textarea");
        for (let i = 0; i < textArea.length; i++) {
            textArea[i].style.height = "5px";
            textArea[i].style.height = textArea[i].scrollHeight + "px";
        }
    }, [showDescription, windowWidth]);


    return (
        <div className="content-wrapper">

            <div className="header-wrapper">
                <div>
                    <img src={celebInfo.picture} />
                </div>
                <div>
                    <input
                        disabled={true}
                        defaultValue={celebInfo.name}
                        name="name"
                        className={`celeb-info-edit${id}`}
                        style={{
                            width: `${celebInfo.name.length}ch`,
                            fontSize: "1.4rem",
                            fontWeight: "800",
                        }}
                        onChange={(event) => handleChange(event, 'name')}
                    />
                </div>
                <div onClick={(event) => handleShowDescription(id, event)} className="plus" style={{ fontSize: '4rem' }}>
                    {showDescription == id ? '-' : '+'}
                </div>
            </div>
            {showDescription == id && (
                <>
                    <div className="info-wrapper">
                        <div className="info-child1">
                            <div className="info-child1-age">
                                <div>Age</div>
                                <div>
                                    <input
                                        className={`celeb-info-edit${id}`}
                                        disabled={true}
                                        defaultValue={celebInfo?.age}
                                        name='age'
                                        id={dob}
                                        style={{
                                            width: `${celebInfo?.age?.length}ch`,
                                        }}
                                        onChange={(event) => handleChange(event, 'age')}
                                    />years
                                </div>
                            </div>
                            <div className="info-child1-gender">
                                <div style={{ textAlign: "center" }}>
                                    Gender
                                </div>
                                <div>
                                    <Gender
                                        gender={celebInfo.gender}
                                        id={celebInfo.id}
                                        handleChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="info-child1-country">
                                <div>Country</div>
                                <div>
                                    <input
                                        className={`celeb-info-edit${id}`}
                                        disabled={true}
                                        defaultValue={celebInfo.country}
                                        name="country"
                                        style={{
                                            width: `${celebInfo.country.length}ch`,
                                        }}
                                        onChange={(event) => handleChange(event, 'country')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="info-child2">
                            <textarea
                                className={`celeb-info-edit${id}`}
                                disabled={true}
                                defaultValue={celebInfo.description}
                                name='description'
                                onChange={(event) => handleChange(event, 'description')}
                            ></textarea>
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "right",
                        }}
                    >
                        {!editMode &&
                            <>
                                <span onClick={() => handleDelete(id)} className="plus marginToRight">
                                    <img src="trash.svg" width={"25px"} />
                                </span>
                                <span onClick={() => handleEdit(id)} className="plus">
                                    <img
                                        src="pencil.svg"
                                        style={{ width: "45px", height: "25px" }}
                                    />
                                </span>
                            </>
                        }
                        {
                            editMode &&
                            <>
                                <span onClick={() => handleCancel(id)} className="plus marginToRight">
                                    <img src="x-circle.svg" width={"25px"} />
                                </span>
                                <span onClick={() => handleOk(id)} className="plus">
                                    <img
                                        src="check-circle.svg"
                                        style={{ width: "45px", height: "25px", color: 'green' }}
                                    />
                                </span>
                            </>
                        }
                    </div>
                </>
            )}

        </div>
    );
};

export default Accordion;
