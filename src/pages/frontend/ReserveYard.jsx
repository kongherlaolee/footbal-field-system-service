import FrontendNavbar from "./FrontendNavbar";
import Layout from "./Layout";

import { BsFillTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import { useEffect, useState } from "react";
import { API_URI, IMAGE_URL } from "../../constants";
import axios from "axios";
import { Link } from "react-router-dom";
export default function ReserveYard() {
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
            overflowX: 'hidden'
        }}>
            <div className="container-fuild p-2">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            {
                                stadiums?.map((item, index) => <div className="col-md-6" key={index}>
                                    <div className="card">
                                        <div className="card-body" style={{height:547}}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h3 style={{ display: "flex", justifyContent: "center" }}><b>ເດີ່ນ {item?.number}</b></h3>
                                                    <hr />
                                                    <center>
                                                        <Link to="/detail_stadium" state={{ stadiumId: item.id, priceId: '' }}>
                                                            <center><img src={IMAGE_URL + item?.image} alt="" className="img-detail-stadium" /></center>
                                                            {/* <h3 style={{ color: "blue" }}><b>ເດີ່ນ {item?.number}</b></h3> */}
                                                        </Link>
                                                    </center>
                                                    <p className='text-left'><b>{item?.detail}</b></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                            }
                            {/* <div className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h3 style={{ display: "flex", justifyContent: "center" }}><b>ເດີ່ນ A</b></h3>
                                                <hr />
                                                <center><img className="img-detail-stadium" src="../assets/images/A.jpg" alt="" /></center>
                                                <p className='text-left'><b>The specific location of the NYCFC Bowl within the heart of an urban city neighbourhood was inspired by several existing stadiums around the world, including Fulham's Craven Cottage.</b></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h3 style={{ display: "flex", justifyContent: "center" }}><b>ເດີ່ນ B</b></h3>
                                                <hr />
                                                <center><img className="img-detail-stadium" src="../assets/images/B.jpg" alt="" /></center>
                                                <p className='text-left'><b>The specific location of the NYCFC Bowl within the heart of an urban city neighbourhood was inspired by several existing stadiums around the world, including Fulham's Craven Cottage.</b></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

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
                                    <center><a href="https://www.google.com" target="_blank"><img className="social-media-icon" src="../assets/images/Whatsapp.png" alt="" /></a></center>
                                    <center><a href="https://www.google.com" target="_blank"><img className="social-media-icon" src="../assets/images/youtube-logo.png" alt="" /></a></center>
                                    <center><a href="https://www.google.com" target="_blank"><img className="social-media-icon" src="../assets/images/TikTok.png" alt="" /></a></center>
                                    <center><a href="https://www.google.com" target="_blank"><img className="social-media-icon" src="../assets/images/Line.png" alt="" /></a></center>
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
        </Layout>
    )
}