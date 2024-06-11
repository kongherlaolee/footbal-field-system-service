import React, { useState, useEffect } from 'react'
import moment from 'moment';
// react bootrap
import { Table, Form, Modal, Spinner, Button } from 'react-bootstrap';
import { ErrorMessage, Formik } from 'formik';
import EmptyComponent from '../../components/EmptyComponent';

import axios from 'axios';
import { CUSTOMER_TOKEN, API_URI, IMAGE_URL } from '../../constants';
import FrontendNavbar from './FrontendNavbar';
import { dateTimeFormat, numberFormat } from '../../helpers';
import Layout from './Layout';

export default function FrontendHistory() {
  const [bookings, setbookings] = useState()
  const [showbooking, setshowbooking] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState();
  const [loading, setLoading] = useState(true);
  const [isDetail, setIsDetail] = useState(false);
  useEffect(() => {
    fetchBooking();
  }, []);
  const fetchBooking = () => {
    const token = localStorage.getItem(CUSTOMER_TOKEN);
    axios.get(API_URI + 'get_all_bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setLoading(false)
        setbookings(response?.data?.data);
        console.log(response?.data?.data)
      })
      .catch(error => {
        console.error(error);
      });
  }
  const onClickShowDetailModal = (booking) => {
    try {
      setSelectedBooking(booking);
      setshowbooking(true);
      setIsDetail(true)
    } catch (error) {
      console.log({ error })
    }
  }
  return (
    <Layout>
      <div style={{
        height: '100vh',
        width: '100vw',
        overflow: 'scroll',
        overflowX: 'hidden'
      }}>
        <div style={{ marginBottom: 50 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: "#3C169B",
            padding: 10
          }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#6B7280' }}>
              ລາຍການຈອງເດີ່ນ ({loading ? "..." : bookings?.length})
            </span>
          </div>
          {
            loading ? <> <center><Spinner animation='border' /></center></> : <>
              {/* table */}
              {
                bookings?.length > 0 ? (
                  <Table responsive size='xl' style={{
                    marginTop: "0px",
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
                        <th>ຮູບຊໍາລະ</th>
                        <th>ເດີ່ນ</th>
                        <th>ວັນທີເຂົ້າບໍລິການ</th>
                        <th>ລວມລາຄາ</th>
                        <th>ຈ່າຍກ່ອນ</th>
                        <th>ສະຖານະ</th>
                        <th>ວັນທີຈອງ</th>
                      </tr>
                    </thead>
                    <tbody >
                      {
                        bookings?.map((booking, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td onClick={() => onClickShowDetailModal(booking)}>
                              <img src={IMAGE_URL + booking?.slip_payment} alt="" style={{ height: 100, width: 55 }} />
                            </td>
                            <td>{booking?.price[0]?.number}</td>
                            <td>{moment(booking?.date_booking).format('DD/MM/YYYY')} {booking?.price[0]?.time}</td>
                            <td> <b>{numberFormat(booking?.total)} ກີບ</b> </td>
                            <td> <b style={{ color: "orange" }}>{numberFormat(booking?.total * ((booking?.pay_before_percent ?? booking?.pay_percent) / 100))} ກີບ</b> </td>
                            <td> {booking?.status == 'booking' ? (<span className='text-primary'>ລໍຖ້າອະນຸມັດ</span>) : booking?.status == 'cancel' ? (<span className='text-danger'>ຖືກຍົກເລີກ</span>) : (<span className='text-success'>ສໍາເລັດແລ້ວ</span>)} </td>
                            <td>{dateTimeFormat(booking?.created_at)}</td>
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
                  <EmptyComponent message={'ຍັງບໍ່ມີຂໍ້ມູນການຈອງ!'} />
                </div>)
              }

              {/* end table */}
            </>
          }
          {/* end table */}
        </div>
      </div>
      <Modal show={showbooking} onHide={() => setshowbooking(false)}>
        <Modal.Header style={{ backgroundColor: "green" }}>
          <Modal.Title style={{ color: "white" }}>ລາຍລະອຽດການຈອງເດີ່ນ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            number: isDetail ? selectedBooking?.price[0]?.number : "",
            detail: isDetail ? selectedBooking?.price[0]?.detail : "",
            total: isDetail ? selectedBooking?.total : 0,
            pay_percent: isDetail ? selectedBooking?.pay_percent : 0,
            pay_before_percent: isDetail ? selectedBooking?.pay_before_percent : 0,
            date_booking: isDetail ? selectedBooking?.date_booking : '',
            created_at: isDetail ? selectedBooking?.created_at : 0,
            time: isDetail ? selectedBooking?.price[0]?.time : '',
            slip_payment: isDetail ? selectedBooking?.slip_payment : "",
            status: isDetail ? selectedBooking?.status : "",
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
          }) => (
            <>
              <Modal.Body>
                <div className='row'>
                  <div className='col-md-12'>
                    <center><img src={IMAGE_URL + values.slip_payment} alt="Preview" className="img-payment-bcelone" /></center>
                  </div>
                  <div className='col-md-12'>
                    <br />
                    <h6><b>ຈ່າຍກ່ອນ: <span className="text-success">{numberFormat(values.total * (values.pay_before_percent / 100))} ກີບ</span> </b></h6>
                  </div>
                  <div className='col-md-12'>
                    <h6><b>ລວມລາຄາ: {numberFormat(values.total)} ກີບ</b></h6>
                  </div>
                  <div className='col-md-12'>
                    <h6><b>ວັນທີເຂົ້າບໍລິການ: {moment(values.date_booking).format('DD/MM/YYYY')} {values.time}</b></h6>
                  </div>
                  <div className='col-md-12'>
                    <h6><b>ວັນທີຈອງ: {dateTimeFormat(values.created_at)}</b></h6>
                  </div>
                  <div className='col-md-12'>
                    <h6><b>ສະຖານະ: {values.status == 'booking' ? (<span className='text-primary'>ລໍຖ້າອະນຸມັດ</span>) : values?.status == 'cancel' ? (<span className='text-danger'>ຖືກຍົກເລີກ</span>) : (<span className='text-success'>ສໍາເລັດແລ້ວ</span>)}</b></h6>
                  </div>
                  <div className='col-md-12'>
                    <h6><b>ເດີ່ນ: {values.number}</b></h6>
                  </div>
                  <div className='col-md-12'>
                    <h6><b>ລາຍລະອຽດເດີ່ນ:</b></h6>
                    <h6>{values.detail}</h6>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => setshowbooking(false)}
                  style={{ background: "grey", color: "white", width: "100px", borderRadius: "5px", height: 45, border: 'none', fontSize: 18 }}
                >ຍົກເລີກ</Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </Modal>
    </Layout >
  )
}
