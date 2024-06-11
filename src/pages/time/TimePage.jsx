import React, { useState, useEffect } from 'react'
import { useAsyncError, useNavigate } from 'react-router-dom'
import moment from 'moment';
import { toast } from "react-toastify";
// icons
import { MdCancel } from 'react-icons/md';
import DoneAllSharp from "@mui/icons-material/DoneAllSharp";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineBorderColor, } from "react-icons/md";

// react bootrap
import { Table, Form, Modal, Spinner, Button } from 'react-bootstrap';
import { ErrorMessage, Formik } from 'formik';
import EmptyComponent from '../../components/EmptyComponent';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

import axios from 'axios';
import { ACCESS_TOKEN, API_URI } from '../../constants';
import { numberFormat } from '../../helpers';
import { NumericFormat } from 'react-number-format';

export default function TimePage() {
    const navigate = useNavigate();
    const [times, setTimes] = useState()
    const [stadiums, setStadiums] = useState()
    const [showaddTime, setShowAddTime] = useState(false)
    const [loading, setLoading] = useState(true);
    const [selectedTime, setSelectedTime] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [isShowConfirmDeleteModal, setIsShowConfirmDeleteModal] = useState(false);

    useEffect(() => {
        fetchTimes();
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
                setStadiums(response?.data?.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const fetchTimes = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get(API_URI + 'get_price', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setLoading(false)
                setTimes(response?.data?.data);
                console.log(response?.data?.data)
            })
            .catch(error => {
                console.error(error);
            });
    }

    const onClickShowAddAndEditModal = (stadium) => {
        try {
            setSelectedTime(stadium);
            setShowAddTime(true);
            setIsEdited(true);
        } catch (error) {
            console.log({ error })
        }
    }

    const onClickShowDeleteModal = (stadium) => {
        setSelectedTime(stadium);
        setIsShowConfirmDeleteModal(true)
    }

    const onCreateTime = (values) => {

        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log({ values })
        var config = {
            method: 'post',
            url: API_URI + 'add_price',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ ...values, price: values.price.toString().replace(/,/g, "") })
        };
        axios(config)
            .then(response => {
                setShowAddTime(false);
                const _newtimes = [...times, { ...values, id: response.data.data.id }];
                setTimes(_newtimes)
                toast.success("ເພີ່ມຂໍ້ມູນເວລາສໍາເລັດ!", { theme: 'colored' });
            })
            .catch(error => {
                console.error(error);
            });
    }

    const onEditTime = (values) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var config = {
            method: 'put',
            url: API_URI + 'update_price/' + selectedTime?.id,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ ...values, price: values.price.toString().replace(/,/g, "") })
        };
        axios(config)
            .then(response => {
                setShowAddTime(false);
                const _newtimes = [...times];
                const updatedData = _newtimes.map(stadium => {
                    if (stadium.id === selectedTime?.id) {
                        return { ...stadium, ...values };
                    }
                    return stadium;
                });
                setTimes(updatedData)
                toast.success("ແກ້ໄຂຂໍ້ມູນເວລາສໍາເລັດ!", { theme: 'colored' });
            })
            .catch(error => {
                console.error(error);
            });
    }

    const onDeleteTime = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var config = {
            method: 'delete',
            url: API_URI + 'delete_price/' + selectedTime?.id,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
        };
        axios(config)
            .then(response => {
                setIsShowConfirmDeleteModal(false);
                const _newtimes = [...times];
                const updatedData = _newtimes.filter(stadium => stadium?.id !== selectedTime?.id)
                setTimes(updatedData)
                toast.success("ລຶບຂໍ້ມູນເວລາສໍາເລັດ!");
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
                            ຈັດການເວລາ ({loading ? "..." : times?.length})
                        </span>
                        <div>
                            <Button
                                style={{ borderRadius: 5, width: '160px', height: '50px', fontSize: 18 }}
                                onClick={() => { setShowAddTime(true); setIsEdited(false); setPreviewImage(null); setSelectedFile(null) }}>
                                <AddBoxOutlinedIcon style={{ marginBottom: 2 }} />&ensp;ເພີ່ມເວລາຈອງ
                            </Button>
                        </div>

                    </div>
                    {
                        loading ? <> <center><Spinner animation='border' style={{ marginTop: 10 }} /></center></> : <>
                            {/* table */}
                            {
                                times?.length > 0 ? (
                                    <Table responsive size='xl' style={{
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
                                                <th>ເວລາ</th>
                                                <th>ລາຄາ</th>
                                                <th>ເລກເດີ່ນບານ</th>
                                                <th>ຈັດການ</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                times?.map((stadium, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{stadium?.time} </td>
                                                        <td>{numberFormat(stadium?.price)}</td>
                                                        <td>{stadium?.number}</td>
                                                        <td style={{ width: "0%" }}>
                                                            <div style={{ display: "flex", alignItems: "left" }}>
                                                                <Button
                                                                    style={{ borderRadius: 5, width: '100px', height: '45px', background: "#F7F7F7", color: "#2962FF", border: "1px solid #2962FF", textAlign: "center" }}
                                                                    onClick={() => { onClickShowAddAndEditModal(stadium); setSelectedFile(null) }}>
                                                                    <MdOutlineBorderColor style={{ color: "#2962FF", fontSize: '20px' }} />&ensp;ເເກ້ໄຂ
                                                                </Button>
                                                                &ensp;
                                                                <Button
                                                                    style={{ border: "1px solid #D50000", borderRadius: 5, background: "#F7F7F7", color: "#D50000", width: '100px', height: '45px', textAlign: "center" }}
                                                                    onClick={() => onClickShowDeleteModal(stadium)}>
                                                                    <RiDeleteBin6Line style={{ color: '#D50000', fontSize: "20px" }} />&ensp;ລຶບ
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
                                    <EmptyComponent message={'ຍັງບໍ່ມີຂໍ້ມຸນເວລາກະລຸນາໄປເພີ່ມຂໍ້ມຸນເວລາກ່ອນ'} />
                                </div>)
                            }

                            {/* end table */}
                        </>
                    }


                    {/* end table */}
                </div>
            </div>


            <Modal show={showaddTime} onHide={() => setShowAddTime(false)}>
                <Modal.Header style={{ backgroundColor: "green" }}>
                    <Modal.Title style={{ color: "white" }}>{isEdited ? 'ແກ້ໄຂເວລາຈອງ' : 'ເພີ່ມເວລາຈອງ'}</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{
                        time: isEdited ? selectedTime?.time : "",
                        price: isEdited ? selectedTime?.price : '',
                        stadium_id: isEdited ? selectedTime?.stadium_id : '',
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.time) {
                            errors.time = 'ກະລຸນາປ້ອນເວລາກ່ອນ';
                        }
                        if (!values.price) {
                            errors.price = 'ກະລຸນາປ້ອນຈໍານວນເງິນກ່ອນ';
                        }
                        if (!values.stadium_id) {
                            errors.stadium_id = 'ກະລຸນາເລືອກເດີ່ນບານກ່ອນ';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        isEdited ? onEditTime(values) : onCreateTime(values)
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
                                <div className='row'>
                                    <div className='col-6 mb-2'>
                                        <Form.Label>ເວລາ:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="time"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.time}
                                            placeholder="ເວລາ"
                                        />
                                        <ErrorMessage style={{ color: 'red' }} name="time" component="div" />
                                    </div>
                                    <div className='col-6 mb-2'>
                                        <Form.Label>ລາຄາ:</Form.Label>
                                        <NumericFormat
                                            className='form-control'
                                            name="price"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            thousandSeparator={true}
                                            value={values.price}
                                            placeholder="ລາຄາ"
                                        />
                                        <ErrorMessage style={{ color: 'red' }} name="price" component="div" />
                                    </div>
                                    <div className='col-12'>
                                        <Form.Label>ເລືອກເດີ່ນບານ:</Form.Label>
                                        <Form.Select name="stadium_id" value={values.stadium_id} onChange={handleChange}>
                                            <option value="">ເລືອກເດີ່ນບານ</option>
                                            {
                                                stadiums?.map(stadium => {
                                                    return <option key={stadium} value={stadium?.id}>{stadium?.number}</option>
                                                })
                                            }
                                        </Form.Select>
                                        <ErrorMessage style={{ color: 'red' }} name="stadium_id" component="div" />
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    onClick={() => setShowAddTime(false)}
                                    style={{ background: "grey", width: "100px", border: 'none', borderRadius: "5px", height: 45 }}
                                ><MdCancel style={{ fontSize: 20 }} />&ensp;ຍົກເລີກ</Button>
                                <Button
                                    onClick={() => handleSubmit()}
                                    style={{ width: "100px", borderRadius: "5px", whiteSpace: 'nowrap', alignItems: 'center', height: 45, marginLeft: 10 }}>
                                    {loading ? <Spinner animation='border' /> : ""}<DoneAllSharp />&ensp;ບັນທຶກ
                                </Button>
                            </Modal.Footer>
                        </>
                    )}
                </Formik>
            </Modal>

            <ConfirmDeleteModal
                title={'ຢືນຢັນການລຶບ'}
                body={'ທ່ານຕ້ອງການທີ່ຈະລຶບຂໍ້ມູນເວລານີ້ແທ້ບໍ່?'}
                isShowConfirmDeleteModal={isShowConfirmDeleteModal}
                setIsShowConfirmDeleteModal={setIsShowConfirmDeleteModal}
                ok={onDeleteTime}
            />
        </div >
    )
}
