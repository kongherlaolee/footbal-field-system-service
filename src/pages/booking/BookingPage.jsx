import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Spinner, Tab, Table, Tabs } from 'react-bootstrap';
import { ACCESS_TOKEN, API_URI, IMAGE_URL } from '../../constants';
import axios from 'axios';
import { bookingStatusColor, convertedBookingStatus, dateTimeFormat, numberFormat } from '../../helpers';
import { MdCancel, MdConfirmationNumber, MdOutlineBorderColor } from 'react-icons/md';
import { toast } from 'react-toastify';
import moment from 'moment';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { PrintDisabled } from '@mui/icons-material';
import ExcelExport from './ExcelExport';
import ReportBookingBill from './ReportBookingBill';
import { useReactToPrint } from 'react-to-print';
import Bill from './Bill';
import DoneAllSharp from "@mui/icons-material/DoneAllSharp";
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import { GrPowerReset } from "react-icons/gr";
import styled from '@emotion/styled';

const BookingPage = () => {
    const [loading, setLoading] = useState(true)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [cancelLoading, setCancelLoading] = useState(false)
    const [showSlipModal, setShowSlipModal] = useState(false)
    const [isConfirmBooking, setIsConfirmBooking] = useState(false)
    const [originBookings, setOriginBookings] = useState([])
    const [allBooking, setAllBooking] = useState([])
    const [bookings, setBookings] = useState([]);
    const [bookingSuccess, setBookingSuccess] = useState([]);
    const [bookingCancel, setBookingCancel] = useState([]);
    const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState();
    const [bookingStatus, setBookingStatus] = useState("booking");
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const [isSelectedDetail, setIsSelectedDetail] = useState(false)
    const [isShowConfirmDeleteModal, setIsShowConfirmDeleteModal] = useState(false);

    useEffect(() => {
        fetchBooking();
    }, [])


    useEffect(() => {
        _filterByDate();
    }, [startDate, endDate, JSON.stringify(originBookings)])

    useEffect(() => {
        _filterByKeyWord();
    }, [searchKeyWord])

    const fetchBooking = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get(API_URI + 'report_bookings', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const _bookings = response?.data?.data;
                setOriginBookings(_bookings);
                setLoading(false)
            })
            .catch(error => {
                console.error(error);
                setLoading(false)
            });
    }

    const onConfirmBooking = () => {
        if (confirmLoading) return
        setConfirmLoading(true);
        const token = localStorage.getItem(ACCESS_TOKEN);
        var config = {
            method: 'put',
            url: API_URI + 'confirm_booking/' + selectedBooking?.id,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ pay_percent: 100 })
        };
        axios(config)
            .then(response => {
                setShowBookingDetailModal(false);
                const _newOriginBookings = [...originBookings];
                const updatedOriginBookingData = _newOriginBookings.map(booking => {
                    if (booking?.id === selectedBooking?.id) return { ...booking, status: 'success' }
                    return booking
                })
                setOriginBookings(updatedOriginBookingData)

                const _newAllBooking = [...allBooking];
                const updatedAllBookingData = _newAllBooking.map(booking => {
                    if (booking?.id === selectedBooking?.id) return { ...booking, status: 'success' }
                    return booking
                })
                setAllBooking(updatedAllBookingData)

                const _newBookings = [...bookings];
                const updatedData = _newBookings.filter(({ id }) => id != selectedBooking?.id);
                setBookings(updatedData)

                const _newBookingSuccess = [...bookingSuccess, { ...selectedBooking, status: 'success' }]
                setBookingSuccess(_newBookingSuccess)

                // toast("ຢືນຢົນການຈອງສໍາເລັດ!", { theme: 'colored' });
                toast.success("ຢືນຢົນການຈອງສໍາເລັດ!", { theme: 'colored' });
                setConfirmLoading(false);
            })
            .catch(error => {
                setConfirmLoading(false);
                console.error(error);
                toast.error(error?.response?.data?.message);
            });
    }

    const onCancelBooking = () => {
        if (cancelLoading) return
        setCancelLoading(true);
        const token = localStorage.getItem(ACCESS_TOKEN);
        var config = {
            method: 'put',
            url: API_URI + 'cancel_booking/' + selectedBooking?.id,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
        };
        axios(config)
            .then(response => {
                setShowBookingDetailModal(false);
                const _newOriginBookings = [...originBookings];
                const updatedOriginBookingData = _newOriginBookings.map(booking => {
                    if (booking?.id === selectedBooking?.id) return { ...booking, status: 'cancel' }
                    return booking
                })
                setOriginBookings(updatedOriginBookingData)

                const _newAllBooking = [...allBooking];
                const updatedAllBookingData = _newAllBooking.map(booking => {
                    if (booking?.id === selectedBooking?.id) return { ...booking, status: 'cancel' }
                    return booking
                })
                setAllBooking(updatedAllBookingData)

                const _newBookings = [...bookings];
                const updatedData = _newBookings.filter(({ id }) => id != selectedBooking?.id);
                setBookings(updatedData)

                const _newBookingCancel = [...bookingCancel, { ...selectedBooking, status: 'cancel' }]
                setBookingCancel(_newBookingCancel)

                // toast("ຍົກເລີກການຈອງສໍາເລັດ!");
                toast.success("ຍົກເລີກການຈອງສໍາເລັດ!", { theme: 'colored' });
                setCancelLoading(false);
                setIsShowConfirmDeleteModal(false)
            })
            .catch(error => {
                setConfirmLoading(false);
                console.error(error);
                setIsShowConfirmDeleteModal(false)
                toast.error(error?.response?.data?.message);
            });
    }

    const onSave = () => {
        onConfirmBooking();
    }

    const componentRef = useRef();
    const billRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const handlePrintBill = useReactToPrint({
        content: () => billRef.current,
    });

    const _filterByDate = () => {
        const filtered = originBookings.filter((item) => {
            const itemDate = moment(item?.created_at).format('YYYY-MM-DD');
            return itemDate >= moment(startDate).format('YYYY-MM-DD') && itemDate <= moment(endDate).format('YYYY-MM-DD');
        });
        setAllBooking(filtered);
        setBookings(filtered.filter(({ status }) => status === 'booking'));
        setBookingSuccess(filtered.filter(({ status }) => status === 'success'));
        setBookingCancel(filtered.filter(({ status }) => status === 'cancel'));
    }

    const _filterByKeyWord = () => {
        if (searchKeyWord === "") {
            setBookings(allBooking.filter(({ status }) => status === 'booking'));
            setBookingSuccess(allBooking.filter(({ status }) => status === 'success'));
            setBookingCancel(allBooking.filter(({ status }) => status === 'cancel'));
            return
        }

        if (searchKeyWord) {
            if (bookingStatus === 'booking') return setBookings(
                allBooking.filter((booking) => {
                    return booking?.status === 'booking'
                        && (searchKeyWord.toUpperCase().includes(booking?.customer?.fullname.toUpperCase())
                            || booking?.customer?.fullname.toUpperCase().includes(searchKeyWord.toUpperCase())
                            || searchKeyWord.toUpperCase().includes(booking?.customer?.phone.toUpperCase())
                            || booking?.customer?.phone.toUpperCase().includes(searchKeyWord.toUpperCase())
                            || searchKeyWord.toUpperCase().includes(booking?.price[0]?.number.toUpperCase())
                            || booking?.price[0]?.number.toUpperCase().includes(searchKeyWord.toUpperCase())
                        )
                }
                ));

            if (bookingStatus === 'success') return setBookingSuccess(
                allBooking.filter((booking) =>
                    booking?.status === 'success'
                    && (searchKeyWord.toUpperCase().includes(booking?.customer?.fullname.toUpperCase())
                        || booking?.customer?.fullname.toUpperCase().includes(searchKeyWord.toUpperCase())
                        || searchKeyWord.toUpperCase().includes(booking?.customer?.phone.toUpperCase())
                        || booking?.customer?.phone.toUpperCase().includes(searchKeyWord.toUpperCase())
                        || searchKeyWord.toUpperCase().includes(booking?.price[0]?.number.toUpperCase())
                        || booking?.price[0]?.number.toUpperCase().includes(searchKeyWord.toUpperCase())
                    )
                ));

            if (bookingStatus === 'cancel') return setBookingCancel(
                allBooking.filter((booking) =>
                    booking?.Istatus === 'cancel'
                    && (searchKeyWord.toUpperCase().includes(booking?.customer?.fullname.toUpperCase())
                        || booking?.customer?.fullname.toUpperCase().includes(searchKeyWord.toUpperCase())
                        || searchKeyWord.toUpperCase().includes(booking?.customer?.phone.toUpperCase())
                        || booking?.customer?.phone.toUpperCase().includes(searchKeyWord.toUpperCase())
                        || searchKeyWord.toUpperCase().includes(booking?.price[0]?.number.toUpperCase())
                        || booking?.price[0]?.number.toUpperCase().includes(searchKeyWord.toUpperCase())
                    )
                ));
        }
    }

    return (
        <div className='main'>
            <h3 className='mt-2' style={{ fontSize: '24px', fontWeight: 'bold', color: '#616161' }}>ລາຍການຈອງທັງໝົດ ({allBooking?.length})</h3>
            <div style={{ display: 'flex', marginBottom: 10 }}>
                <Form.Group className="mr-4">
                    <Form.Label>ເລີ່ມວັນທີ</Form.Label>
                    <input
                        style={{ width: 230 }}
                        type="date"
                        name="startDate"
                        className='form-control'
                        value={moment(startDate).format("YYYY-MM-DD")}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>ຫາວັນທີ</Form.Label>
                    <input
                        style={{ width: 230 }}
                        type="date"
                        name="endDate"
                        className='form-control'
                        value={moment(endDate).format("YYYY-MM-DD")}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Form.Group>
            </div>
            <Tabs defaultActiveKey="booking" onSelect={(e) => { setBookingStatus(e); setSearchKeyWord('') }}>
                <Tab eventKey="booking" title={"ລາຍການຈອງເຂົ້າ " + " (" + (bookings?.length) + ")"}>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {loading ? <Spinner className='text-center' style={{ marginTop: 10, alignSelf: "center" }} /> :
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                    <Form.Control
                                        value={searchKeyWord}
                                        className='mt-2'
                                        type='text'
                                        placeholder='ຄົ້ນຫາຊື່, ເບີໂທ ຫຼື ແລກເດີ່ນ'
                                        name='searchKeyWord'
                                        onChange={(e) => setSearchKeyWord(e.target.value)}
                                    />
                                    <div className='mt-2 ml-5' style={{ display: 'flex' }}>
                                        <ExcelExport startDate={startDate} endDate={endDate} data={bookings} />
                                        <Button onClick={handlePrint} style={{ backgroundColor: '#1565C0', height: 40, border: 'none', color: 'white', marginLeft: 10, padding: '8px 20px', width: 105 }}><PrintDisabled style={{ fontSize: 20, marginBottom: 2 }} />&ensp;Print</Button>
                                    </div>
                                </div>
                                <Table responsive size='xl' hover style={{
                                    marginTop: "10px",
                                    borderCollapse: "collapse",
                                    width: "100%",
                                }}>
                                    <thead style={{
                                        background: "linear-gradient(180deg, #3C169B 0%, green 0.01%, green 100%)",
                                        borderRadius: " 8px 8px 0px 0px",
                                        color: "#FFFFFF"
                                    }}>
                                        <tr>
                                            <th>ລ/ດ</th>
                                            <th>ຮູບການຊໍາລະ</th>
                                            <th>ລູກຄ້າ</th>
                                            <th>ເບີໂທ</th>
                                            <th>ແລກເດີ່ນ</th>
                                            <th>ເວລາເຂົ້າບໍລິການ</th>
                                            <th>ຈໍານວນເງິນທັງໝົດ</th>
                                            <th>ຈໍານວນເງິນທີ່ຈ່າຍ</th>
                                            <th>ວັນທີ່ຈອງ</th>
                                            <th>ຈັດການ</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {
                                            bookings?.map((booking, index) => (
                                                <tr key={booking + index} onClick={() => { setSelectedBooking(booking); setShowBookingDetailModal(true); setIsSelectedDetail(true) }} style={{ cursor: 'pointer' }}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <img alt="" src={IMAGE_URL + booking?.slip_payment} style={{ width: 50, height: 80, objectFit: 'cover' }} onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedBooking(booking);
                                                            setShowSlipModal(true);
                                                        }} />
                                                    </td>
                                                    <td>{booking?.customer?.fullname} </td>
                                                    <td>{booking?.customer?.phone} </td>
                                                    <td>{booking?.price[0]?.number} </td>
                                                    <td>
                                                        <p>{moment(booking?.date_booking).format('DD/MM/YYYY')}</p>
                                                        <span>{booking?.price[0]?.time}</span>
                                                    </td>
                                                    <td>{numberFormat(booking?.total ?? 0)} </td>
                                                    <td> {numberFormat(booking?.total * booking?.pay_before_percent / 100)}</td>
                                                    <td>{dateTimeFormat(booking?.created_at)} </td>
                                                    <td style={{ width: "0%" }}>
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <Button
                                                                style={{ borderRadius: 5, width: '100px', height: '45px', background: "#F7F7F7", color: "green", border: "1px solid green", textAlign: "center" }}
                                                                onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); setShowBookingDetailModal(true); setIsSelectedDetail(false) }}
                                                            >
                                                                <DoneAllSharp style={{ color: "green", fontSize: '20px' }} />&ensp;ຢືນຢັນ
                                                            </Button>
                                                            &ensp;
                                                            <Button
                                                                style={{ border: "1px solid #D50000", borderRadius: 5, background: "#F7F7F7", color: "#D50000", width: '100px', height: '45px', textAlign: "center" }}
                                                                onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); setIsShowConfirmDeleteModal(true); setIsSelectedDetail(false) }}
                                                            >
                                                                <MdCancel style={{ color: '#D50000', fontSize: "20px" }} />&ensp;ຍົກເລີກ
                                                            </Button>

                                                        </div>

                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        }
                    </div>
                </Tab>
                <Tab eventKey="success" title={"ລາຍການຈອງສໍາເລັດ" + " (" + (bookingSuccess?.length) + ")"}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            loading ? <Spinner className='text-center' /> :
                                <div style={{ display: 'flex', flexDirection: 'column ', marginTop: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Form.Control
                                            value={searchKeyWord}
                                            className='mt-2'
                                            type='text'
                                            placeholder='ຄົ້ນຫາຊື່, ເບີໂທ ຫຼື ແລກເດີ່ນ'
                                            name='searchKeyWord'
                                            onChange={(e) => setSearchKeyWord(e.target.value)}
                                        />
                                        <div className='mt-2 ml-5' style={{ display: 'flex' }}>
                                            <ExcelExport startDate={startDate} endDate={endDate} data={bookings} />
                                            <Button onClick={handlePrint} style={{ backgroundColor: '#1565C0', height: 40, border: 'none', color: 'white', marginLeft: 10, padding: '8px 20px', width: 105 }}><PrintDisabled style={{ fontSize: 20, marginBottom: 2 }} />&ensp;Print</Button>
                                        </div>
                                    </div>
                                    <Table responsive size='xl' hover style={{
                                        marginTop: "10px",
                                        borderCollapse: "collapse",
                                        width: "100%",
                                    }}>
                                        <thead style={{
                                            background: "linear-gradient(180deg, #3C169B 0%, green 0.01%, green 100%)",
                                            borderRadius: " 8px 8px 0px 0px",
                                            color: "#FFFFFF"
                                        }}>
                                            <tr>
                                                <th>ລ/ດ</th>
                                                <th>ຮູບການຊໍາລະ</th>
                                                <th>ລູກຄ້າ</th>
                                                <th>ເບີໂທ</th>
                                                <th>ແລກເດີ່ນ</th>
                                                <th>ເວລາເຂົ້າບໍລິການ</th>
                                                <th>ຈໍານວນເງິນທັງໝົດ</th>
                                                <th>ຈໍານວນເງິນທີ່ຈ່າຍ</th>
                                                <th>ວັນທີ່ຈອງ</th>
                                                <th>ຈັດການ</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                bookingSuccess?.map((booking, index) => (
                                                    <tr key={booking + index} onClick={() => { setSelectedBooking(booking); setShowBookingDetailModal(true) }} style={{ cursor: 'pointer' }}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img alt="" src={IMAGE_URL + booking?.slip_payment} style={{ width: 50, height: 80, objectFit: 'cover' }} onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedBooking(booking);
                                                                setShowSlipModal(true);
                                                            }} />
                                                        </td>
                                                        <td>{booking?.customer?.fullname} </td>
                                                        <td>{booking?.customer?.phone} </td>
                                                        <td>{booking?.price[0]?.number} </td>
                                                        <td>
                                                            <p>{moment(booking?.date_booking).format('DD/MM/YYYY')}</p>
                                                            <span>{booking?.price[0]?.time}</span>
                                                        </td>
                                                        <td>{numberFormat(booking?.total ?? 0)} </td>
                                                        <td> {numberFormat(booking?.total * booking?.pay_before_percent / 100)}</td>
                                                        <td>{dateTimeFormat(booking?.created_at)} </td>
                                                        <td style={{ width: "0%" }}>

                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <Button onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    await setSelectedBooking(booking);
                                                                    handlePrintBill();
                                                                }} style={{ height: '45px', width: 100 }}>
                                                                    <PrintDisabled />&ensp;Print
                                                                </Button>
                                                                &ensp;
                                                                <Button
                                                                    style={{ border: "1px solid #D50000", borderRadius: 5, background: "#F7F7F7", color: "#D50000", width: '100px', height: '45px', textAlign: "center" }}
                                                                    onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); setIsShowConfirmDeleteModal(true); setIsSelectedDetail(false) }}
                                                                >
                                                                    <MdCancel style={{ color: '#D50000', fontSize: "20px" }} />&ensp;ຍົກເລີກ
                                                                </Button>
                                                            </div> </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                        }
                    </div>
                </Tab>
                <Tab eventKey="cancel" title={"ຍົກເລີກລາຍການຈອງ" + " (" + (bookingCancel?.length) + ")"}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            loading ? <Spinner /> :
                                <div style={{ display: 'flex', flexDirection: 'column ', marginTop: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Form.Control
                                            value={searchKeyWord}
                                            className='mt-2'
                                            type='text'
                                            placeholder='ຄົ້ນຫາຊື່, ເບີໂທ ຫຼື ແລກເດີ່ນ'
                                            name='searchKeyWord'
                                            onChange={(e) => setSearchKeyWord(e.target.value)}
                                        />
                                        <div className='mt-2 ml-5' style={{ display: 'flex' }}>
                                            <ExcelExport startDate={startDate} endDate={endDate} data={bookings} />
                                            <Button onClick={handlePrint} style={{ backgroundColor: '#1565C0', height: 40, border: 'none', color: 'white', marginLeft: 10, padding: '8px 20px', width: 105 }}><PrintDisabled style={{ fontSize: 20, marginBottom: 2 }} />&ensp;Print</Button>
                                        </div>
                                    </div>
                                    <Table responsive size='xl' hover style={{
                                        marginTop: "10px",
                                        borderCollapse: "collapse",
                                        width: "100%",
                                    }}>
                                        <thead style={{
                                            background: "linear-gradient(180deg, #3C169B 0%, green 0.01%, green 100%)",
                                            borderRadius: " 8px 8px 0px 0px",
                                            color: "#FFFFFF"
                                        }}>
                                            <tr>
                                                <th>ລ/ດ</th>
                                                <th>ຮູບການຊໍາລະ</th>
                                                <th>ລູກຄ້າ</th>
                                                <th>ເບີໂທ</th>
                                                <th>ແລກເດີ່ນ</th>
                                                <th>ເວລາເຂົ້າບໍລິການ</th>
                                                <th>ຈໍານວນເງິນທັງໝົດ</th>
                                                <th>ຈໍານວນເງິນທີ່ຈ່າຍ</th>
                                                <th>ວັນທີ່ຈອງ</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                bookingCancel?.map((booking, index) => (
                                                    <tr key={booking + index} onClick={() => { setSelectedBooking(booking); setShowBookingDetailModal(true) }} style={{ cursor: 'pointer' }}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img alt="" src={IMAGE_URL + booking?.slip_payment} style={{ width: 50, height: 80, objectFit: 'cover' }} onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedBooking(booking);
                                                                setShowSlipModal(true);
                                                            }} />
                                                        </td>
                                                        <td>{booking?.customer?.fullname} </td>
                                                        <td>{booking?.customer?.phone} </td>
                                                        <td>{booking?.price[0]?.number} </td>
                                                        <td>
                                                            <p>{moment(booking?.date_booking).format('DD/MM/YYYY')}</p>
                                                            <span>{booking?.price[0]?.time}</span>
                                                        </td>
                                                        <td>{numberFormat(booking?.total ?? 0)} </td>
                                                        <td> {numberFormat(booking?.total * booking?.pay_before_percent / 100)}</td>
                                                        <td>{dateTimeFormat(booking?.created_at)} </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                        }
                    </div>
                </Tab>
            </Tabs>

            <Modal show={showBookingDetailModal} onHide={() => setShowBookingDetailModal(false)}>
                <Modal.Header style={{ backgroundColor: "green" }} >
                    <Modal.Title style={{ color: 'white' }}>{(selectedBooking?.status === "booking" && !isSelectedDetail) ? "ຢືນຢັນການຈອງ" : "ລາຍລະອຽດການຈອງ"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row mb-2'>
                        <div className='col-6 text-end' >ຊື່ລູກຄ້າ: </div>
                        <div className='col-6'>{selectedBooking?.customer?.fullname}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-6 text-end' >ເບີໂທ: </div>
                        <div className='col-6'>{selectedBooking?.customer?.phone}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-6 text-end' >ແລກເດີ່ນ: </div>
                        <div className='col-6'>{selectedBooking?.price[0]?.number}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-6 text-end' >ລາຄາເດີ່ນ: </div>
                        <div className='col-6'>{numberFormat(selectedBooking?.total ?? 0) + " ກີບ"} </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-6 text-end' >ຈໍານວນເງິນທີ່ຈ່າຍກ່ອນ: </div>
                        <div className='col-6'>{numberFormat(selectedBooking?.total * selectedBooking?.pay_percent / 100) + " ກີບ"}</div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-6 text-end'>ສະຖານະການຈອງ: </div>
                        <div className='col-3 text-center' style={{ color: bookingStatusColor(selectedBooking?.status), borderRadius: 5, border: '1px solid ' + bookingStatusColor(selectedBooking?.status) }}>{convertedBookingStatus(selectedBooking?.status)}</div>
                    </div>
                    <div className='text-center'>
                        <b style={{ color: "green" }}>ຮູບການຊໍາລະ</b>
                        <div className='row mt-2'>
                            <center><img src={IMAGE_URL + selectedBooking?.slip_payment} style={{ width: 150, height: 270, borderRadius: 5 }} alt="" /></center>
                        </div>
                    </div>
                </Modal.Body>
                {(selectedBooking?.status === "booking" && !isSelectedDetail) && <Modal.Footer>
                    <Button onClick={() => setShowBookingDetailModal(false)} style={{ border: 'none', backgroundColor: 'grey', color: 'white', height: 45, width: 100 }}><MdCancel style={{ marginBottom: 2, fontSize: 20 }} />&ensp;ຍົກເລີກ</Button>
                    <Button onClick={onSave} style={{ border: 'none', backgroundColor: 'green', width: 100, height: 45 }}><DoneAllSharp style={{ marginBottom: 2 }} />&ensp;ຢືນຢັນ</Button>
                </Modal.Footer>}
            </Modal>

            <Modal show={showSlipModal} onHide={() => setShowSlipModal(false)} size='md'>
                <Modal.Header style={{ backgroundColor: "green" }}><Modal.Title style={{ color: "white" }}>ຮູບການຊໍາລະ</Modal.Title></Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <img className='col-12' src={IMAGE_URL + selectedBooking?.slip_payment} alt="" />
                    </div>
                </Modal.Body>
            </Modal>

            <ConfirmDeleteModal
                title={'ຍົກເລີກການຈອງ'}
                body={'ທ່ານຕ້ອງການທີ່ຈະຍົກເລີກການຈອງນີ້ແທ້ບໍ່?'}
                isShowConfirmDeleteModal={isShowConfirmDeleteModal}
                setIsShowConfirmDeleteModal={setIsShowConfirmDeleteModal}
                ok={onCancelBooking}
            />

            <div style={{ display: 'none' }}>
                <ReportBookingBill ref={componentRef} startDate={startDate} endDate={endDate} data={bookingStatus === "booking" ? bookings : bookingStatus === "success" ? bookingSuccess : bookingCancel} status={bookingStatus} />
            </div>

            <div style={{ display: 'none' }}><Bill ref={billRef} billData={selectedBooking} /></div>

        </div >
    );
};

export default BookingPage;
