import React, { useState, useEffect } from 'react'
import { useAsyncError, useNavigate } from 'react-router-dom'
import moment from 'moment';
import { toast } from "react-toastify";
// icons
import { GrPowerReset } from "react-icons/gr";
import { MdCancel } from 'react-icons/md';
import DoneAllSharp from "@mui/icons-material/DoneAllSharp";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineBorderColor } from "react-icons/md";
import { MdLockReset } from "react-icons/md";

// react bootrap
import { Table, Form, Modal, Spinner, Button } from 'react-bootstrap';
import { ErrorMessage, Formik } from 'formik';
import EmptyComponent from '../../components/EmptyComponent';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

import axios from 'axios';
import { ACCESS_TOKEN, API_URI, IMAGE_URL } from '../../constants';

export default function Stadiums() {
    const navigate = useNavigate();
    const [stadiums, setStadiums] = useState()
    const [showaddStadium, setShowAddStadium] = useState(false)
    const [loading, setLoading] = useState(true);
    const [selectedStadium, setSelectedStadium] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [isShowConfirmDeleteModal, setIsShowConfirmDeleteModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showStadiumNotEmpty, setShowStadiumNotEmpty] = useState(false);
    const [dateNotEmpty, setDateNotempty] = useState(moment());

    useEffect(() => {
        fetchStadium();
    }, []);

    const fetchStadium = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get(API_URI + 'get_stadium', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setLoading(false)
                setStadiums(response?.data?.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const onClickShowAddAndEditModal = (stadium) => {
        try {
            setSelectedStadium(stadium);
            setPreviewImage(IMAGE_URL + stadium?.image)
            setShowAddStadium(true);
            setIsEdited(true);
        } catch (error) {
            console.log({ error })
        }
    }

    const onClickShowDeleteModal = (stadium) => {
        setSelectedStadium(stadium);
        setIsShowConfirmDeleteModal(true)
    }

    const onCreateStadium = (values) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var data = new FormData();
        data.append('number', values.number);
        data.append('detail', values.detail);
        data.append('image', selectedFile);

        var config = {
            method: 'post',
            url: API_URI + 'add_stadium',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                setShowAddStadium(false);
                const _newstadiums = [...stadiums, ...response?.data?.data];
                setStadiums(_newstadiums)
                toast.success("ເພີ່ມຂໍ້ມູນເດີ່ນບານສໍາເລັດ!", { theme: 'colored' });
            })
            .catch(function (error) {
                console.log(error);
                toast.error(error?.response?.data?.message);
            });

    }

    const onEditStadium = (values) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var data = new FormData();
        console.log({ values })
        data.append('number', values.number);
        data.append('detail', values.detail);
        if (selectedFile) data.append('image', selectedFile);
        data.append('id', selectedStadium?.id);
        console.log(data)
        var config = {
            method: 'post',
            url: API_URI + 'update_stadium',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                setShowAddStadium(false);
                const _newstadiums = [...stadiums];
                const updatedData = _newstadiums.map(stadium => {
                    if (stadium.id === selectedStadium?.id) {
                        return { ...stadium, ...response?.data?.data };
                    }
                    return stadium;
                });
                setStadiums(updatedData)
                toast.success("ແກ້ໄຂຂໍ້ມູນເດີ່ນບານສໍາເລັດ!", { theme: 'colored' });
            })
            .catch(function (error) {
                console.log(error);
                toast.error(error?.response?.data?.message);
            });

    }

    const onDeleteStadium = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var config = {
            method: 'delete',
            url: API_URI + 'delete_stadium/' + selectedStadium?.id,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
        };
        axios(config)
            .then(response => {
                setIsShowConfirmDeleteModal(false);
                const _newstadiums = [...stadiums];
                const updatedData = _newstadiums.filter(stadium => stadium?.id !== selectedStadium?.id)
                setStadiums(updatedData)
                toast.success("ລຶບຂໍ້ມູນເດີ່ນບານສໍາເລັດ!", { theme: 'colored' });
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleShowStadiumNotEmpty = (stadium) => {
        setSelectedStadium(stadium);
        setShowStadiumNotEmpty(true);
    }

    const handleSaveStadiumNotEmpty = (_date_not_empty) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var config = {
            method: 'put',
            url: API_URI + 'update_date_not_empty/' + selectedStadium?.id,
            data: { date_not_empty: moment(dateNotEmpty).format('YYYY-MM-DD') },
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
        };
        axios(config)
            .then(response => {
                setShowStadiumNotEmpty(false);
                const _newstadiums = [...stadiums];
                const updatedData = _newstadiums.map(stadium => {
                    if (stadium.id === selectedStadium?.id) {
                        return { ...stadium, date_not_empty: moment(dateNotEmpty).format('YYYY-MM-DD') };
                    }
                    return stadium;
                });
                setStadiums(updatedData)
                toast.success("ເປີດສະຖານະເດີ່ນຖືກໃຊ້ງານສໍາເລັດ!", { theme: 'colored' });
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleResetStadiumEmpty = (_date_not_empty) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var config = {
            method: 'put',
            url: API_URI + 'update_date_not_empty/' + selectedStadium?.id,
            data: { date_not_empty: null },
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
        };
        axios(config)
            .then(response => {
                setShowStadiumNotEmpty(false);
                const _newstadiums = [...stadiums];
                const updatedData = _newstadiums.map(stadium => {
                    if (stadium.id === selectedStadium?.id) {
                        return { ...stadium, date_not_empty: null };
                    }
                    return stadium;
                });
                setStadiums(updatedData)
                toast.success("ປີດສະຖານະເດີ່ນຖືກໃຊ້ງານສໍາເລັດ!", { theme: 'colored' });
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div className="main">
            <div>
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: "#3C169B"
                    }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#616161' }}>
                            ຈັດການເດີ່ນບານ ({loading ? "..." : stadiums?.length})
                        </span>
                        <div>
                            <Button
                                style={{ borderRadius: 5, width: '160px', height: '50px', fontSize: 18 }}
                                onClick={() => { setShowAddStadium(true); setIsEdited(false); setPreviewImage(null); setSelectedFile(null) }}>
                                <AddBoxOutlinedIcon style={{ marginBottom: 2 }} />&ensp;ເພີ່ມເດີ່ນບານ
                            </Button>
                        </div>

                    </div>
                    {
                        loading ? <> <center><Spinner animation='border' style={{ marginTop: 10 }} /></center></> : <>
                            {/* table */}
                            {
                                stadiums?.length > 0 ? (
                                    <Table responsive hover size='xl' style={{
                                        marginTop: "10px",
                                        borderCollapse: "collapse",
                                        width: "100%",
                                    }}>
                                        <thead style={{
                                            background: "linear-gradient(180deg, #3C169B 0%, green 0.01%, green 100%)",
                                            borderRadius: " 8px 8px 0px 0px",
                                            color: "#FFFFFF"
                                        }}>
                                            <tr style={{ whiteSpace: 'nowrap' }}>
                                                <th>ລ/ດ</th>
                                                <th>ຮູບພາບ</th>
                                                <th>ເລກເດີ່ນບານ</th>
                                                <th>ລາຍລະອຽດ</th>
                                                <th>ວັນທີເດີ່ນບໍ່ຫວ່າງ</th>
                                                <th>ຈັດການ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                stadiums?.map((stadium, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img arl="" src={IMAGE_URL + stadium?.image} style={{ height: 100, width: 215 }} />
                                                        </td>
                                                        <td>{stadium?.number}</td>
                                                        <td>{stadium?.detail}</td>
                                                        <td><a href='javascript:void(0)' onClick={() => handleShowStadiumNotEmpty(stadium)}> {stadium?.date_not_empty ? moment(stadium?.date_not_empty).format('DD/MM/YYYY') : "ຍັງບໍ່ກໍານົດ"}</a></td>
                                                        <td style={{ width: "0%" }}>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <Button
                                                                    style={{ borderRadius: 5, width: '100px', height: '45px', background: "#F7F7F7", color: "#2962FF", border: "1px solid #2962FF", textAlign: "center" }}
                                                                    onClick={() => { onClickShowAddAndEditModal(stadium); setSelectedFile(null) }}>
                                                                    <MdOutlineBorderColor style={{ color: "#2962FF", fontSize: '20px', marginBottom: 2 }} />&ensp;ເເກ້ໄຂ
                                                                </Button>
                                                                &ensp;
                                                                <Button
                                                                    style={{ border: "1px solid #D50000", borderRadius: 5, background: "#F7F7F7", color: "#D50000", width: '100px', height: '45px', textAlign: "center" }}
                                                                    onClick={() => onClickShowDeleteModal(stadium)}>
                                                                    <RiDeleteBin6Line style={{ color: '#D50000', fontSize: "20px", marginBottom: 2 }} />&ensp;ລຶບ
                                                                </Button>

                                                            </div>

                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                ) : (<div style={{
                                    fontSize: "24px",
                                    display: 'flex',
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: 'center',
                                    color: "#6B7280",
                                    fontWeight: "400"
                                }}>
                                    <EmptyComponent message={'ຍັງບໍ່ມີຂໍ້ມຸນເດີ່ນບານກະລຸນາໄປເພີ່ມຂໍ້ມຸນເດີ່ນບານກ່ອນ'} />
                                </div>)
                            }

                            {/* end table */}
                        </>
                    }


                    {/* end table */}
                </div>
            </div>


            <Modal show={showaddStadium} onHide={() => setShowAddStadium(false)}>
                <Modal.Header style={{ backgroundColor: "green" }}>
                    <Modal.Title style={{ color: "white" }}>{isEdited ? 'ແກ້ໄຂເດີ່ນບານ' : 'ເພີ່ມເດີ່ນບານ'}</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{
                        number: isEdited ? selectedStadium?.number : "",
                        detail: isEdited ? selectedStadium?.detail : '',
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.number) {
                            errors.number = 'ກະລຸນາປ້ອນເລກເດີ່ນກ່ອນ';
                        }

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        isEdited ? onEditStadium(values) : onCreateStadium(values)
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                    }) => (
                        <>
                            <Modal.Body>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
                                    <Form.Label>ຮູບເດີ່ນບານ:</Form.Label>
                                    <input type="file" className='form-control' onChange={handleFileChange} />
                                    {previewImage && (
                                        <img src={previewImage} alt="Preview" style={{ width: 465, height: 215, marginTop: 10 }} />
                                    )}
                                </div>
                                <div className='row'>
                                    <div className='col-12 mt-2'>
                                        <Form.Label>ເລກເດີ່ນບານ:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="number"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.number}
                                            placeholder="ເລກເດີ່ນບານ"
                                        />
                                        <ErrorMessage style={{ color: 'red' }} name="number" component="div" />
                                    </div>
                                    <div className='col-12 mt-2'>
                                        <Form.Label>ລາຍລະອຽດ:</Form.Label>
                                        <textarea
                                            className='form-control'
                                            rows={3}
                                            type="textarea"
                                            name="detail"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.detail}
                                            placeholder="ລາຍລະອຽດເດີ່ນບານ"
                                        />
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    onClick={() => setShowAddStadium(false)}
                                    style={{ background: "grey", width: "100px", border: 'none', borderRadius: "5px", height: 45 }}
                                ><MdCancel style={{ fontSize: 20, marginBottom: 2 }} />&ensp;ຍົກເລີກ</Button>
                                <Button
                                    onClick={() => handleSubmit()}
                                    style={{ width: "100px", borderRadius: "5px", whiteSpace: 'nowrap', alignItems: 'center', height: 45, marginLeft: 10 }}>
                                    <DoneAllSharp style={{ marginBottom: 2 }} />&ensp;ບັນທຶກ
                                </Button>
                            </Modal.Footer>
                        </>
                    )}
                </Formik>
            </Modal>

            <ConfirmDeleteModal
                title={'ຢືນຢັນການລຶບ'}
                body={'ທ່ານຕ້ອງການທີ່ຈະລຶບຂໍ້ມູນເດີ່ນບານນີ້ແທ້ບໍ່?'}
                isShowConfirmDeleteModal={isShowConfirmDeleteModal}
                setIsShowConfirmDeleteModal={setIsShowConfirmDeleteModal}
                ok={onDeleteStadium}
            />

            <Modal show={showStadiumNotEmpty} onHide={() => setShowStadiumNotEmpty(false)}>
                <Modal.Header style={{ backgroundColor: "green" }}>
                    <Modal.Title style={{ color: "white" }}>ກໍານົດເວລາທີ່ເດີ່ນຈະບໍ່ຫວ່າງ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        name='dateNotEmpty'
                        type='date'
                        value={moment(dateNotEmpty).format('YYYY-MM-DD')}
                        onChange={(e) => setDateNotempty(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleResetStadiumEmpty}
                        style={{ background: "orange", width: "100px", border: 'none', borderRadius: "5px", height: 45 }}
                    ><MdLockReset style={{ fontSize: 24, marginBottom: 2 }} />&ensp;Reset</Button>
                    <Button
                        onClick={() => setShowStadiumNotEmpty(false)}
                        style={{ background: "grey", width: "100px", border: 'none', borderRadius: "5px", height: 45, marginLeft: 10 }}
                    ><MdCancel style={{ fontSize: 20, marginBottom: 2 }} />&ensp;ຍົກເລີກ</Button>

                    <Button
                        onClick={() => handleSaveStadiumNotEmpty()}
                        style={{ width: "100px", borderRadius: "5px", alignItems: 'center', height: 45, marginLeft: 10 }}>
                        <DoneAllSharp style={{ marginBottom: 2 }} />&ensp;ຕົກລົງ
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}
