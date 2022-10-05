import './DeleteModal.css'

const DeleteModal = ({ deleteMode, setDeleteMode }) => {

    const handleCancel=()=> {
        setDeleteMode(() => {
            return {...deleteMode, showDeleteComponent: false, celebDataToDelete:''}
        })
    }

    const handleDelete = () => {
        setDeleteMode(() => {
            return {...deleteMode, deleteTheData: true}
        })
    }
  
    return (
        <div>
            {deleteMode.showDeleteComponent &&
                <div className='delete-modal-wrapper'>
                    <div className='delete-modal'>
                        <div>Want to Remove<br/> <span>{deleteMode.celebDataName}</span> <br/>from Celebrity List ?</div>
                        <div>
                            <span onClick={handleCancel}>cancel</span>
                            <span onClick={handleDelete}>delete</span>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default DeleteModal;