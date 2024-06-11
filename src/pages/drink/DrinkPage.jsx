import React, { useState, useEffect } from 'react'
import { useAsyncError, useNavigate } from 'react-router-dom'
import moment from 'moment';
import { toast } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// icons
import { MdCancel } from 'react-icons/md';
import DoneAllSharp from "@mui/icons-material/DoneAllSharp";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
// import AiOutlineCloseCircle from '@mui/icons-material
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineBorderColor } from "react-icons/md";

// react bootrap
import { Table, Form, Modal, Spinner, Button } from 'react-bootstrap';
import { ErrorMessage, Formik } from 'formik';
import EmptyComponent from '../../components/EmptyComponent';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

import axios from 'axios';
import { ACCESS_TOKEN, API_URI, IMAGE_URL } from '../../constants';
import { convertedRole, numberFormat } from '../../helpers';
import { NumberFormatBase, NumericFormat } from 'react-number-format';

export default function DrinkPage() {
    const navigate = useNavigate();
    const [drinks, setDrinks] = useState()
    const [showadddrink, setShowAddDrink] = useState(false)
    const [loading, setLoading] = useState(true);
    const [selectedDrink, setSelectedDrink] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [isShowConfirmDeleteModal, setIsShowConfirmDeleteModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        fetchDrink();
    }, []);

    const fetchDrink = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get(API_URI + 'get_drink', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setLoading(false)
                setDrinks(response?.data?.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const onClickShowAddAndEditModal = (drink) => {
        try {
            // setLoading(true);
            setSelectedDrink(drink);
            setPreviewImage(IMAGE_URL + drink?.image)
            setShowAddDrink(true);
            setIsEdited(true);
        } catch (error) {
            console.log({ error })

        }
        // setLoading(false);
    }

    const onClickShowDeleteModal = (drink) => {
        setSelectedDrink(drink);
        setIsShowConfirmDeleteModal(true)
    }

    const onCreateDrink = (values) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var data = new FormData();
        data.append('name', values.name);
        data.append('buy_price', values.buy_price.toString().replace(/,/g, ""));
        data.append('sale_price', values.sale_price.toString().replace(/,/g, ""));
        data.append('qty', values.qty.toString().replace(/,/g, ""));
        data.append('unit', values.unit);
        data.append('image', selectedFile);

        var config = {
            method: 'post',
            url: API_URI + 'add_drink',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                setShowAddDrink(false);
                const _newdrinks = [response?.data?.data, ...drinks];
                setDrinks(_newdrinks)
                toast.success("ເພີ່ມຂໍ້ມູນເຄື່ອງດື່ມສໍາເລັດ!",{theme:'colored'});
            })
            .catch(function (error) {
                console.log(error);
                toast.error(error?.response?.data?.message);
            });

    }

    const onEditDrink = (values) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var data = new FormData();
        data.append('name', values.name);
        data.append('buy_price', values.buy_price.toString().replace(/,/g, ""));
        data.append('sale_price', values.sale_price.toString().replace(/,/g, ""));
        data.append('qty', values.qty.toString().replace(/,/g, ""));
        data.append('unit', values.unit);
        if (selectedFile) data.append('image', selectedFile);
        data.append('id', selectedDrink?.id);

        var config = {
            method: 'post',
            url: API_URI + 'update_drink',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(response.data);
                setShowAddDrink(false);
                const _newdrinks = [...drinks];
                const updatedData = _newdrinks.map(drink => {
                    if (drink.id === selectedDrink?.id) {
                        return { ...drink, ...response?.data?.data };
                    }
                    return drink;
                });
                setDrinks(updatedData)
                toast.success("ແກ້ໄຂຂໍ້ມູນເຄື່ອງດື່ມສໍາເລັດ!",{theme:'colored'});
            })
            .catch(function (error) {
                console.log(error);
                toast.error(error?.response?.data?.message);
            });

    }

    const onDeleteEmployee = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        var config = {
            method: 'delete',
            url: API_URI + 'delete_drink/' + selectedDrink?.id,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
        };
        axios(config)
            .then(response => {
                setIsShowConfirmDeleteModal(false);
                const _newdrinks = [...drinks];
                const updatedData = _newdrinks.filter(drink => drink?.id !== selectedDrink?.id)
                setDrinks(updatedData)
                toast.success("ລຶບຂໍ້ມູນເຄື່ອງດື່ມສໍາເລັດ!",{theme:'colored'});
            })
            .catch(error => {
                console.error(error);
                toast.error(error?.message);
            });
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };


    return (
        <div className="main" style={{ overflow: 'scroll' }}>
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10
                }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#616161' }}>
                        ຈັດການເຄື່ອງດື່ມ ({loading ? "..." : drinks?.length})
                    </span>
                    <div>
                        <Button
                            style={{ borderRadius: 5, width: '160px', height: '50px', fontSize: 18 }}
                            onClick={() => { setShowAddDrink(true); setIsEdited(false); setPreviewImage(null); setSelectedFile(null) }}>
                            <AddBoxOutlinedIcon style={{marginBottom: 2}}/>&ensp;ເພີ່ມເຄື່ອງດື່ມ
                        </Button>
                    </div>
                </div>
                {
                    loading ? <center><Spinner /></center> :
                        <Table responsive>
                            <thead style={{
                                background: "linear-gradient(180deg, #3C169B 0%, green 0.01%, green 100%)",
                                color: "#FFFFFF"
                            }}>
                                <tr>
                                    <th>ລ/ດ</th>
                                    <th>ຮູບພາບ</th>
                                    <th>ຊື່ເຄື່ອງດື່ມ</th>
                                    <th>ລາຄາ</th>
                                    <th>ຫົວຫນ່ວຍ</th>
                                    <th>ຈໍານວນ</th>
                                    <th>ຈັດການ</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    drinks?.map((drink, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img arl="" src={IMAGE_URL + drink?.image} style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                            </td>
                                            <td>{drink?.name} </td>
                                            <td>{numberFormat(drink?.sale_price)} </td>
                                            <td>{drink?.unit} </td>
                                            <td> {numberFormat(drink?.qty)}</td>
                                            <td style={{ width: "0%" }}>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Button
                                                        style={{ borderRadius: 5, width: '100px', height: '45px', background: "#F7F7F7", color: "#2962FF", border: "1px solid #2962FF", textAlign: "center" }}
                                                        onClick={() => { onClickShowAddAndEditModal(drink); setSelectedFile(null) }}>
                                                        <MdOutlineBorderColor style={{ color: "#2962FF", fontSize: '20px' }} /> ເເກ້ໄຂ
                                                    </Button>
                                                    &ensp;
                                                    <Button
                                                        style={{ border: "1px solid #D50000", borderRadius: 5, background: "#F7F7F7", color: "#D50000", width: '100px', height: '45px', textAlign: "center" }}
                                                        onClick={() => onClickShowDeleteModal(drink)}>
                                                        <RiDeleteBin6Line style={{ color: '#D50000', fontSize: "20px" }} /> ລຶບ
                                                    </Button>

                                                </div>

                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                }
            </div>

            <Modal show={showadddrink} onHide={() => setShowAddDrink(false)}>
                <Modal.Header style={{ backgroundColor: "green" }}>
                    <Modal.Title style={{ color: "white" }}>{isEdited ? 'ແກ້ໄຂເຄື່ອງດື່ມ' : 'ເພີ່ມເຄື່ອງດື່ມ'}</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{
                        name: isEdited ? selectedDrink?.name : "",
                        sale_price: isEdited ? selectedDrink?.sale_price ?? '' : '',
                        buy_price: isEdited ? selectedDrink.buy_price : "",
                        qty: isEdited ? selectedDrink.qty : "",
                        unit: isEdited ? selectedDrink?.unit : "",
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'ກະລຸນາປ້ອນຊື່ເຄື່ອງດື່ມກ່ອນ';
                        }
                        if (!values.unit) {
                            errors.unit = 'ກະລຸນາປ້ອນຫົວໜ່ວຍກ່ອນ';
                        }
                        if (!values.sale_price || values.sale_price <= 0) {
                            errors.sale_price = 'ກະລຸນາປ້ອນລາຄາຂາຍກ່ອນ';
                        }
                        if (!values.qty || values.qty <= 0) {
                            errors.qty = 'ກະລຸນາປ້ອນຈໍານວນກ່ອນ';
                        }
                        if (!values.buy_price || values.qty <= 0) {
                            errors.buy_price = 'ກະລຸນາປ້ອນລາຄາຕົ້ນທືນກ່ອນ';
                        }

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        isEdited ? onEditDrink(values) : onCreateDrink(values)
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
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Form.Label>ຮູບພາບເຄື່ອງດື່ມ:</Form.Label>
                                    <input type="file" className='form-control' onChange={handleFileChange} />
                                    {previewImage && (
                                        <img src={previewImage} alt="Preview" style={{ width: 200, height: 200, marginTop: 10 }} />
                                    )}
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-6'>
                                        <Form.Label>ຊື່ເຄື່ອງດື່ມ:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            placeholder="ຊື່ເຄື່ອງດື່ມ..."
                                        />
                                        <ErrorMessage style={{ color: 'red' }} name="name" component="div" />
                                    </div>
                                    <div className='col-6'>
                                        <Form.Label>ຫົວຫນ່ວຍ:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="unit"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.unit}
                                            placeholder="ຫົວຫນ່ວຍ..."
                                        />
                                        <ErrorMessage style={{ color: 'red' }} name="unit" component="div" />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-6 mt-2'>
                                        <Form.Label>ລາຄາຂາຍ:</Form.Label>
                                        <NumericFormat
                                            className='form-control'
                                            type="text"
                                            name="sale_price"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.sale_price}
                                            thousandSeparator={true}
                                            placeholder="0"
                                        />
                                        <ErrorMessage style={{ color: 'red' }} name="sale_price" component="div" />
                                    </div>
                                    <div className='col-6 mt-2'>
                                        <Form.Label>ຈໍານວນ:</Form.Label>
                                        <NumericFormat
                                            className='form-control'
                                            name="qty"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.qty}
                                            thousandSeparator={true}
                                            placeholder="0"
                                            aria-label="Default select example"
                                        />
                                        <ErrorMessage style={{ color: 'red' }} name="qty" component="div" />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12 mt-2'>
                                        <Form.Label>ລາຄາຕົ້ນທືນ:</Form.Label>
                                        <NumericFormat
                                            className='form-control'
                                            name="buy_price"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.buy_price}
                                            thousandSeparator={true}
                                            placeholder="0"
                                            aria-label="Default select example"
                                        />
                                        <ErrorMessage style={{ color: 'red' }} name="buy_price" component="div" />
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    onClick={() => setShowAddDrink(false)}
                                    style={{ background: "grey", width: "105px", height: "45px", border: 'none', borderRadius: "5px" }}
                                ><MdCancel style={{fontSize: 20}}/>&ensp;ຍົກເລີກ</Button>

                                <Button
                                    onClick={() => handleSubmit()}
                                    style={{ width: "105px", height: "45px", borderRadius: "5px", whiteSpace: 'nowrap', alignItems: 'center', marginLeft: 10 }}>
                                    {loading ? <Spinner size='sm' animation='border' /> : ""}<DoneAllSharp />&ensp;ບັນທຶກ
                                </Button>
                                {/* <Button onClick={onSale} style={{ border: 'none', backgroundColor: 'green', color: 'white', width: 105, height: 42, right: -100 }}><DoneAllSharp/>&ensp;{saleLoading ? <Spinner /> : "ຕົກລົງ"}</Button> */}
                            </Modal.Footer>

                        </>
                    )}
                </Formik>
            </Modal>

            <ConfirmDeleteModal
                title={'ຢືນຢັນການລຶບ'}
                body={'ທ່ານຕ້ອງການທີ່ຈະລຶບຂໍ້ມູນເຄື່ອງດື່ມນີ້ແທ້ບໍ່?'}
                isShowConfirmDeleteModal={isShowConfirmDeleteModal}
                setIsShowConfirmDeleteModal={setIsShowConfirmDeleteModal}
                ok={onDeleteEmployee}
            />
        </div >
    )
}
