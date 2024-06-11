
import React, { useEffect, useState } from "react";
import FrontendNavbar from "./FrontendNavbar";
import FrontendCarousel from "./FrontentCarousel";
import { Link } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import EmptyComponent from '../../components/EmptyComponent';
import { API_URI } from '../../constants';
import { IMAGE_URL } from "../../constants";
import Layout from "./Layout";

import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
export default function FrontendHomePage() {
  const [stadiums, setStadiums] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchStatium();
  }, []);
  const fetchStatium = () => {
    axios.get(API_URI + 'get_stadium_customer').then((res) => {
      setLoading(false);
      setStadiums(res?.data?.data);
      console.log(loading);
    }).catch(error => {
      console.log(error)
    })
  }
  return (
    <Layout style={{
      height: '100vh',
      width: '100vw',
      overflow: 'scroll',
      overflowX: 'hidden',
    }}>
      {/* <FrontendNavbar /> */}
      <FrontendCarousel />
      <div className="row p-0" >
        {
          loading ? <><center><Spinner size="sm" animation="border"></Spinner></center></> : <>
            {
              stadiums?.length > 0 ? (
                stadiums?.map((item, index) => (
                  <div className="col-md-6 text-center p-0" key={index}>
                    <Link to="/detail_stadium" state={{ stadiumId: item.id, priceId: '' }}>
                      <img src={IMAGE_URL + item?.image} alt="" className="img-stadium" />
                      <h3 style={{ color: "blue" }}><b>ເດີ່ນ {item?.number}</b></h3>
                    </Link>
                  </div>
                ))

              ) : (<div style={{
                fontSize: "24px",
                display: 'flex',
                flexDirection: "column",
                justifyContent: "center",
                alignItems: 'center',
                color: "#6B7280",
                fontWeight: "400"
              }}>
                <EmptyComponent message={'ຍັງບໍ່ມີຂໍ້ມູນເດີ່ນ'} />
              </div>)

            }
          </>
        }
      </div>
      {
        loading ? <><center><Spinner size="sm" animation='border'></Spinner> </center></> : <>
          {
            <div className="footer-fontend" style={{ marginBottom: 10 }}>
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
      },
    </Layout >
  );
}
