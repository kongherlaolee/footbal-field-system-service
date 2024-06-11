
import { React, useEffect, useState } from 'react';
import FrontendNavbar from './FrontendNavbar';
import { Link, json, useLocation } from 'react-router-dom';
import { CUSTOMER_TOKEN, API_URI, IMAGE_URL, CUSTOMER_DATA } from '../../constants';
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { dateTimeFormat, numberFormat } from '../../helpers';
import { FaUser } from 'react-icons/fa';
import { Ballot, CheckCircle, CheckCircleOutline, Stadium, Timer, Wallet } from '@mui/icons-material';
// import DoneAllSharp from "@mui/icons-material/DoneAllSharp";
import { BsImage } from "react-icons/bs";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { toast } from 'react-toastify';
import moment from 'moment';
import Layout from './Layout';

import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
export default function FrontendDetailStatium() {
  const { state } = useLocation();
  console.log('===', { state })
  const [prices, Setprices] = useState([]);
  const [loading, Setloading] = useState(true);
  const [loadingBuying, SetloadingBuying] = useState(false);
  const [price_id, SetpriceId] = useState();
  const [step, Setstep] = useState(1);
  const [total, Settotal] = useState(0);
  const [stadium, Setdstadium] = useState();
  const [loading_stadium, SetLoadingStadium] = useState(true);
  const [totalprice, SettotalPrice] = useState(0);
  const [validateprice, SetValidatePrice] = useState('');
  const [percent, setPercent] = useState(25);
  const user = JSON.parse(localStorage.getItem(CUSTOMER_DATA));
  const [booking, setBooking] = useState();
  const [datebooking, setdateBooking] = useState(moment(new Date()).format('YYYY-MM-DD HH:MM'));
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [checkimage, setCheckImage] = useState('');
  const [bookings, setBookings] = useState();
  useEffect(() => {
    fetchStadium();
    if (selectedFile == null) {
      setPreviewImage(null)
    }
  }, []);

  useEffect(() => {
    if (state?.stadiumId) {
      SetpriceId(state?.priceId)
      fetchPrice();
    }
  }, [state])
  useEffect(() => {
    fetchbookings(datebooking)
  }, [datebooking]);
  const fetchPrice = () => {
    axios.get(API_URI + 'get_price_customer_by_id/' + state?.stadiumId).then((res) => {
      Setprices(res?.data?.data);
      var data = res?.data?.data.filter((e) => e.id == state?.priceId);
      if (data.length > 0) {
        Settotal(data[0].price);
        setBooking(data);
      }
      Setloading(false);
    }).catch(error => {
      Setloading(false);
      console.log(error);
    })
  }
  const fetchbookings = (date) => {
    axios.get(API_URI + 'get_bookings/' + moment(date).format('YYYY-MM-DD')).then((res) => {
      Setloading(false);
      setBookings(res?.data?.data);
      console.log(res?.data?.data)
    }).catch(error => {
      Setloading(false);
      console.log(error);
    })
  }
  function fetchStadium() {
    axios.get(API_URI + 'get_stadium_customer_byId/' + state?.stadiumId).then((res) => {
      SetLoadingStadium(false);
      Setdstadium(res?.data?.data);
    }).catch(error => {
      console.log(error);
    })
  }
  const handleselectedPrice = (event) => {
    SetpriceId(event.target.value);
    var data = prices.filter((e) => e.id == event.target.value);
    Settotal(data[0].price);
    setBooking(data);
  }
  const selectPercent = (event) => {
    var sum_total = (total * event.target.value) / 100;
    SettotalPrice(sum_total);
    setPercent(event.target.value)
  }
  const handleopenStepOne = () => {
    if (!price_id || total <= 0) {
      SetValidatePrice('ກະລຸນາເລືອກເວລາກ່ອນ')
    } else {
      if (percent > 0) {
        var sum_total = (total * percent) / 100;
        SettotalPrice(sum_total);
      }
      Setstep(2);
    }
  }
  const handlecloseStepOne = () => {
    Setstep(1);
  }
  const percentData = [
    {
      'id': 1,
      'percent': 25
    },
    {
      'id': 2,
      'percent': 50
    },
    {
      'id': 3,
      'percent': 100
    }
  ];
  const handleBooking = () => {
    if (loadingBuying) return;
    if (selectedFile == null) {
      setCheckImage('ກະລຸນາອັບໂຫຼດຮູບພາບການໂອນເງິນທ່ານເພື່ອເປັນການຢືນຢັນ')
      toast.error('ກະລຸນາເລືອກຮູບຊໍາລະຜ່ານ BCEL ONE ກ່ອນ!', { theme: 'colored' });
    } else {
      SetloadingBuying(true)
      const token = localStorage.getItem(CUSTOMER_TOKEN);
      var data = new FormData();
      data.append('date_booking', datebooking);
      data.append('price_id', price_id);
      data.append('total', total);
      data.append('pay_percent', percent);
      data.append('slip_payment', selectedFile);
      var config = {
        method: 'post',
        url: API_URI + 'booking',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        data: data
      };
      axios(config)
        .then(response => {
          console.log(response?.data?.data);
          Setstep(3)
          SetloadingBuying(false)
        })
        .catch(error => {
          console.error(error);
          toast.error(error?.response?.data?.message);
          SetloadingBuying(false)
        });
      console.log(selectedFile);
    }
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    if (previewImage != null) {
      setCheckImage('')
    }
  };
  useEffect(() => {
  }, [previewImage])
  const changebookingDate = (e) => {
    setdateBooking(e.target.value)
  }
  const checkBooking = (priceId) => {
    return bookings?.some(({ price_id }) => priceId == price_id)
  }

  const checkStadium = (_stadium, _dateBooking) => {
    const _check = moment(_dateBooking).format('YYYY-MM-DD').includes(moment(_stadium[0]?.date_not_empty).format('YYYY-MM-DD'));
    return _check
  }

  return (
    <Layout style={{
      height: '100vh',
      width: '100vw',
    }}>
      <div className="container-fuild p-2">
        <div className="card">
          {
            step == 1 ? (<div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body" style={{ height: 547 }}>
                      <div className="row">
                        <div className="col-md-12">
                          {
                            loading_stadium ? <><center><Spinner size='sm' animation='border'></Spinner></center></> : <>
                              {stadium?.length > 0 ? (
                                stadium?.map((item) => (
                                  <div>
                                    <h3 className="media-text text-center"><b>ເດີ່ນ {item?.number}</b></h3>
                                    <hr />
                                    <center><img src={IMAGE_URL + item?.image} alt="" className="img-detail-stadium" /></center>
                                    <p className='text-left'><b>{item?.detail}</b></p>
                                  </div>
                                ))
                              ) : (
                                <div>
                                </div>
                              )}
                            </>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">

                        <div className="col-md-6">
                          <h3><b> <Ballot /> ບໍລິການ</b></h3>
                        </div>
                        <div className="col-md-6" style={{ justifyContent: 'end', display: 'flex' }}>
                          <h5 style={{ whiteSpace: 'nowrap', marginTop: 5 }}>ວັນທີຈອງ&nbsp;&nbsp;&nbsp;</h5>
                          <input type="date" min={new Date().toISOString().split('T')[0]} value={moment(datebooking).format('YYYY-MM-DD')} className="form-control" onChange={changebookingDate} />
                        </div>

                        {/* <div className="row">
                          <div className="col-md-4 d-flex flex-row">
                            <h4 style={{ whiteSpace: 'nowrap' }}>ວັນທີຈອງ&nbsp;&nbsp;&nbsp;&nbsp;</h4>
                            <input type="date" min={new Date().toISOString().split('T')[0]} value={moment(datebooking).format('YYYY-MM-DD')} className="form-control" onChange={changebookingDate} />
                          </div>
                        </div> */}
                        <div className="row"><div className="col-md-12">
                          <div className="form-group">
                            <div className='row'>
                              <div className='col-md-6'>
                                <h5><Timer className='text-primary' /> ກະລຸນາເລືອກເວລາຈອງ</h5>

                              </div>
                            </div>
                            {
                              loading ? <><center><Spinner size="sm" animation='border'></Spinner> </center></> : <>
                                {
                                  prices?.length > 0 && stadium?.length > 0 ? (
                                    prices?.map((item) => (
                                      <div className='marginLeft-check' class="form-check" key={item}>
                                        <input class="form-check-input" disabled={checkBooking(item?.id) || checkStadium(stadium, datebooking)} checked={price_id == item?.id} type="radio" value={item?.id} onChange={handleselectedPrice} name="flexRadioDefault" id="flexRadioDefault1" />
                                        <label class="form-check-label" for="flexRadioDefault1">
                                          {item?.time} <span className="text-primary">{numberFormat(item?.price)} ກີບ</span> {(checkBooking(item?.id) || checkStadium(stadium, datebooking)) && (<span className="text-danger">ບໍ່ຫວ່າງ</span>)}
                                        </label>
                                      </div>
                                    ))
                                  ) : (<option value="">ຍັງບໍ່ມີຂໍ້ມູນລາຄາ</option>)
                                }
                              </>
                            }
                          </div>
                        </div></div>
                        {
                          validateprice != '' ? (
                            <div className="col-md-12">
                              <h6 className="text-danger">{validateprice}</h6>
                            </div>
                          ) : (<div></div>)
                        }
                        <div className="col-md-12 d-flex justify-content-between mt-2">
                          <a style={{ height: 45, width: 100, fontSize: 18, justifyContent: 'center' }} href='/reserve_yard' className="btn btn-warning"><AiOutlineArrowLeft />&ensp;ກັບຄືນ</a>
                          {
                            localStorage.getItem(CUSTOMER_TOKEN) ? (
                              <button style={{ height: 45, width: 100, fontSize: 18 }} className="btn btn-primary" onClick={handleopenStepOne}>
                                {/* {loading ? <Spinner animation="border" /> : "ຢືນຢັນ"} */}
                                ຈອງເລີຍ</button>
                            ) : (<Link to="/customer_auth" state={{ stadiumId: state?.stadiumId, priceId: price_id }}>
                              <button style={{ height: 45, width: 100, fontSize: 18 }} className="btn btn-primary">
                                {/* {loading ? <Spinner animation="border" /> : "ຢືນຢັນ"} */}
                                ຈອງເລີຍ</button>
                            </Link>)
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>) : step == 2 ?
              (<div className="card-body">
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <h3><b>ລາຍລະອຽດການຈອງເດີ່ນ</b></h3>
                            <hr />
                            <div className="form-group">
                              <label><FaUser style={{ fontSize: 20 }} />&ensp;ຊື່ ແລະ ນາມສະກຸນ:</label>
                              <input type="text" className="form-control" value={user?.fullname} placeholder='ຊື່ ແລະ ນາມສະກຸນ' disabled />
                            </div>
                            <div className="form-group">
                              <label><Timer />&ensp;ວັນທີຈອງ:</label>
                              <input type="text" className="form-control" value={moment(datebooking).format('DD/MM/YYYY')} disabled />
                            </div>
                            <div className="form-group">
                              <label><Stadium />&ensp;ຈອງເດີ່ນ:</label>
                              <input type="text" className="form-control" value={booking[0]?.number} disabled />
                            </div>
                            <div className="form-group">
                              <label><Wallet />&ensp;ລາຄາເດີ່ນ:</label>
                              <input type="text" className="form-control" value={numberFormat(total) + '₭'} disabled />
                            </div>
                            {/* <h3><b>ຊຳລະຜ່ານ QR Code</b></h3> */}
                            {/* <h5>ເລືອກເປີເຊັນຊໍາລະຄ່າຈອງເດີ່ນ</h5>
                            {
                              percentData.length > 0 ? (
                                percentData.map((item, index) => (
                                  <div class="form-check" key={index}>
                                    <input class="form-check-input" type="radio" value={item?.percent} checked={percent == item?.percent} onChange={selectPercent} name="flexRadioDefault" id="flexRadioDefault1" />
                                    <label class="form-check-label" for="flexRadioDefault1">
                                      {item?.percent}%
                                    </label>
                                  </div>
                                ))
                              ) : (<option value="">ຍັງບໍ່ມີຂໍ້ມູນລາຄາ</option>)
                            } */}
                            {/* <p>-ລູກຄ້າຕ້ອງໂອນເງິນມັດຈໍາໃຫ້ທາງເດີ່ນກ່ອນຈໍານວນ <span className='text-danger'>{numberFormat(totalprice) + '₭'}</span> ຈຶ່ງສາມາດຈອງໄດ້</p> */}


                            {/* <div className="form-group">
                              <label htmlFor=""><span className="text-danger">*</span>ອັບໂຫຼດຮູບພາບການໂອນເງິນ</label>
                              <input type="file" className='form-control' onChange={handleFileChange} /><br />
                              {
                                checkimage != '' && (
                                  <p className="text-danger">{checkimage}</p>
                                )
                              }
                              {previewImage && (
                                <div className="d-flex flex-column">
                                  <img src={previewImage} alt="Preview" className="img-payment-bcelone" />
                                  <CheckCircle style={{ color: "green", fontSize: '50px' }} />
                                </div>
                              )}
                            </div> */}
                            {/* <p className='text-primary'>ເມື່ອທ່ານຢືນຢັນການຈອງແລ້ວຈະບໍ່ສາມາດຍົກເລີກການຈອງໄດ້ ກະລຸນາກວດສອບການຈອງໃຫ້ແນ່ໃຈແລ້ວຈຶ່ງຈອງ!</p> */}
                          </div>
                          <center>
                            <h3><b>QR Code</b></h3>
                            <img src="assets/images/onepay.jpg" alt="" className="onepay_image" /><br />
                            <h5 className='mt-2'><b>131-12-00-01497362-001</b></h5>
                          </center>
                        </div>
                        {/* <div className="row">
                          <div className="col-md-12 d-flex justify-content-between">
                            <button className="btn btn-warning" onClick={handlecloseStepOne}>ກັບຄືນ</button>
                            <button className="btn btn-primary" onClick={handleBooking}>ຢືນຢັນການຈອງ</button>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <h3><b>ການຊໍາລະເງິນ</b></h3>
                            <hr />
                            <h5>ເລືອກເປີເຊັນຊໍາລະຄ່າຈອງເດີ່ນ</h5>
                            {
                              percentData.length > 0 ? (
                                percentData.map((item, index) => (
                                  <div class="form-check" key={index}>
                                    <input class="form-check-input" type="radio" value={item?.percent} checked={percent == item?.percent} onChange={selectPercent} name="flexRadioDefault" id="flexRadioDefault1" />
                                    <label class="form-check-label" for="flexRadioDefault1">
                                      {item?.percent}%
                                    </label>
                                  </div>
                                ))
                              ) : (<option value="">ຍັງບໍ່ມີຂໍ້ມູນລາຄາ</option>)
                            }
                            <p>ລູກຄ້າຕ້ອງໂອນເງິນມັດຈໍາໃຫ້ທາງເດີ່ນກ່ອນຈໍານວນ <span className='text-danger'>{numberFormat(totalprice) + ' ກີບ'}</span> ຈຶ່ງສາມາດຈອງໄດ້</p>
                            <div className="form-group">
                              <label htmlFor="" style={{ fontSize: 20 }}><span className="text-danger"></span><BsImage />&ensp;ອັບໂຫຼດຮູບພາບການໂອນເງິນ</label>
                              <input style={{ marginBottom: 5 }} type="file" className='form-control' onChange={handleFileChange} />
                              {
                                checkimage != '' && (
                                  <p className="text-danger">{checkimage}</p>
                                )
                              }
                              {previewImage && (
                                <div >
                                  <img src={previewImage} alt="Preview" className="img-payment-bcelone" />
                                  <CheckCircle style={{ color: "green", fontSize: '50px' }} />
                                </div>
                              )}
                            </div>
                            <p className='text-primary'>ເມື່ອທ່ານຢືນຢັນການຈອງແລ້ວຈະບໍ່ສາມາດຍົກເລີກການຈອງໄດ້ ກະລຸນາກວດສອບການຈອງໃຫ້ແນ່ໃຈແລ້ວຈຶ່ງຈອງ!</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 d-flex justify-content-between">
                            <button className="btn btn-warning" style={{ height: 45, width: 100, fontSize: 18 }} onClick={handlecloseStepOne}><AiOutlineArrowLeft />&ensp;ກັບຄືນ</button>
                            <button className="btn btn-primary" style={{ height: 45, fontSize: 18 }} onClick={handleBooking}>ຢືນຢັນການຈອງ</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>) : (
                <div className="card-body" style={{ height: '71vh' }}>
                  <div className="row">
                    <div className="col-md-12 text-center">
                      <CheckCircleOutline style={{ color: "green", fontSize: '200px', marginTop: 90 }} />
                      <h3 style={{ color: "green" }}><b>ສໍາເລັດແລ້ວ</b></h3>
                      <h5>ການສັ່ງຈອງເດີ່ນຂອງທ່ານສໍາເລັດແລ້ວ</h5>
                      <h6 style={{ fontStyle: 'italic' }}>ຂໍຂອບໃຈລູກຄ້າຫຼາຍໆ ທີ່ເຂົ້າໃຊ້ບໍລິການຂອງພວກເຮົາ</h6>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-12 text-center">
                      <a style={{ backgroundColor: "green", color: "white", height: 45, fontSize: 18 }} href="/customer_history" className="btn w-100">ສໍາເລັດແລ້ວ</a>

                    </div>
                  </div>
                </div>
              )
          }
        </div>
      </div>
      {
        loading ? <><center><Spinner size="sm" animation='border'></Spinner> </center></> : <>
          {
            <div className="footer-fontend" >
              <div className="row">
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 style={{ justifyContent: 'center', display: 'flex', color: 'white' }}>ໝາຍເຫດ:</h5>
                    </div>
                    <div className="col-md-12">
                      <h5 style={{ justifyContent: 'center', display: 'flex', color: 'white', fontSize: 16 }}>ເມື່ອທ່ານຢືນຢັນການຈອງແລ້ວທ່ານຈະບໍ່ສາມາດຍົກເລີກການຈອງໄດ້ ຖ້າຫາກທ່ານຕ້ອງການຍົກເລີກຈິງກະລຸນາຕິດຕໍ່ພວກເຮົາ (ຖ້າຍົກເລີກກ່ອນເວລາແຕະ 2 ຊົ່ວໂມງ ທາງເຮົາຈະຄືນເງິນໃຫ້ໝົດ ຖ້າບໍ່ດັ່ງນັ້ນ, ເຮົາຈະບໍ່ສາມາດຄືນເງິນໃຫ້)</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 style={{ justifyContent: 'center', display: 'flex', color: 'white' }}>ຕິດຕາມພວກເຮົາໃນສື່ສັງຄົມ</h5>
                    </div>
                    <div className="col-md-12">
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <center><a href="https://www.facebook.com/KM9FC?mibextid=ZbWKwL " target="_blank"><img className="social-media-icon" src="../assets/images/facebooklogo.png" alt="" /></a></center>
                        <center><img className="social-media-icon" src="../assets/images/Whatsapp.png" alt="" /></center>
                        <center><img className="social-media-icon" src="../assets/images/youtube-logo.png" alt="" /></center>
                        <center><img className="social-media-icon" src="../assets/images/TikTok.png" alt="" /></center>
                        <center><img className="social-media-icon" src="../assets/images/Line.png" alt="" /></center>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 style={{ justifyContent: 'center', display: 'flex', color: 'white' }}>ຂໍ້ມູນຕິດຕໍ່:</h5>
                    </div>
                    <div className="col-md-12">
                      <h5 style={{ justifyContent: 'center', display: 'flex', color: 'white', fontSize: 16 }}><BsFillTelephoneFill />&ensp;020 78991963 </h5>
                    </div>
                    <div className="col-md-12">
                      <h5 style={{ justifyContent: 'center', display: 'flex', color: 'white', fontSize: 16 }}><MdEmail style={{ fontSize: 20, marginBottom: 1 }} />&ensp;KM9@gmail.com </h5>
                    </div>
                    <div className="col-md-12">
                      <h5 style={{ justifyContent: 'center', display: 'flex', color: 'white', fontSize: 16 }}><MdLocationOn style={{ marginBottom: 2, fontSize: 20 }} />&ensp;ບ້ານຄໍາຮຸ່ງ, ໄຊທານີ, ນະຄອນຫລວງ </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </>
      }

    </Layout>
  );
}
