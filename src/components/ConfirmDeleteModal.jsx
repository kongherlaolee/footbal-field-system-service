import { Modal, Button } from "react-bootstrap";
import DoneAllSharp from "@mui/icons-material/DoneAllSharp";
import { RiDeleteBin6Line, RiInformationLine, RiQuestionAnswerFill, RiQuestionMark } from "react-icons/ri";
import { MdCancel, MdConfirmationNumber, MdOutlineBorderColor } from 'react-icons/md';
export default function ConfirmDeleteModal({
    title,
    body,
    isShowConfirmDeleteModal,
    setIsShowConfirmDeleteModal,
    ok
}) {
    return <Modal
        show={isShowConfirmDeleteModal}
        onHide={() => setIsShowConfirmDeleteModal(false)}
        centered
    >
        {/* <Modal.Header >
            <div>{title}</div>
        </Modal.Header> */}
        <Modal.Header  style={{backgroundColor: "green",  }} >
                    <Modal.Title style={{color: 'white'}}>{title}</Modal.Title>
                </Modal.Header>
        <Modal.Body
            style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
            }}
        >
            {/* <FontAwesomeIcon
                icon={faExclamationCircle}
                style={{ fontSize: 90, color: "orange" }}
            /> */}
            <RiQuestionMark style={{ fontSize: 100, color: "orange" }} />
            <br />
            <h5>{body}</h5>
        </Modal.Body>
        <Modal.Footer
            style={{
                display: "flex",
                flexDirection: "row",
                // justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button
                // variant="outline-dark"
                // className="btn btn-app hoverme"
                style={{ border: '1px solid #eee', backgroundColor: 'red', color: 'white', width: 105, height: 45, borderRadius: 5 }}
                onClick={() => setIsShowConfirmDeleteModal(false)}
            ><MdCancel style={{fontSize:20}}/>&ensp;ຍົກເລີກ
            </Button>
            {/* <div style={{ width: 24 }} /> */}
            <button
                // className="btn btn-app hoverme"
                // style={{display: "flex", border: 'none', backgroundColor: 'green', marginLeft: 10, color: 'white', width: 105, height: 45, borderRadius: 5}}
                style={{border: 'none',backgroundColor: "green", color: "white", width: "105px", height: "45px", borderRadius: "5px", whiteSpace: 'nowrap', alignItems: 'center', marginLeft: 10 }}
                onClick={ok}
            ><DoneAllSharp/>&ensp;ຢືນຢັນ
            </button>
        </Modal.Footer>
    </Modal>
}