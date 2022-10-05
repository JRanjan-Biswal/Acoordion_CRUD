import { useEffect, useState } from "react";
import celebData from "../../celebrities.json";
import Accordion from "../Accordion/Accordion";
import DeleteModal from "../DeleteModal/DeleteModal";

const CelebList = () => {
    const [data, setData] = useState(celebData);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showDescription, setShowDescription] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [wrongDataType, setWrongDataType] = useState({ flag: false, type: "" });
    const [deleteMode, setDeleteMode] = useState({
        showDeleteComponent: false,
        celebDataToDelete: '',
        celebDataName: '',
        deleteTheData: false
    });

    const handleShowDescription = (id, e) => {
        if (editMode) {
            alert('cancel the edit mode');
            return;
        }
        if (showDescription == id) {
            return setShowDescription(null)
        }
        setShowDescription(id)
    };

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);

        return (_) => window.removeEventListener("resize", handleResize);
    });

    useEffect(() => {
        const body = document.querySelector('body');
        if (deleteMode.showDeleteComponent) {
            body.style.overflow = 'hidden';
        }
        else {
            body.style.overflow = '';
        }

        if (deleteMode.deleteTheData) {
            let newData = data.filter(item => item.id !== deleteMode.celebDataToDelete);
            setData(newData);
            setDeleteMode(() => {
                return {...deleteMode, showDeleteComponent: false, celebDataToDelete: '', deleteTheData: false, celebDataName:''}
            })
        }
    }, [deleteMode])

    return (
        <div className="main-wrapper">
            <DeleteModal deleteMode={deleteMode} setDeleteMode={setDeleteMode} />
            {data.map((celeb) => {
                return (
                    <Accordion
                        key={celeb.id}
                        info={{ ...celeb }}
                        setDelete={setData}
                        data={data}
                        handleShowDescription={handleShowDescription}
                        showDescription={showDescription}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        wrongDataType={wrongDataType}
                        setWrongDataType={setWrongDataType}
                        windowWidth={windowWidth}
                        deleteMode={deleteMode}
                        setDeleteMode={setDeleteMode}
                    />
                );
            })}
        </div>
    );
};

export default CelebList;
