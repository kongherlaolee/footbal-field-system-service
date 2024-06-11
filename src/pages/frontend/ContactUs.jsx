import FrontendNavbar from "./FrontendNavbar";
import Layout from "./Layout";
import { Email, Home, Key, Password, Phone } from '@mui/icons-material';
import { FaUser, FaUserCircle } from 'react-icons/fa';
import { Button, Form, Modal, Spinner } from "react-bootstrap";
// import { useState } from "react";

export default function ContactUs() {
    // const [loading, setLoading] = useState(true);

    // const comfirm = async () => {
    //     if (change() < 0 || comfirmLoading) return;
    //     comfirmLoading(true);

    //     await axios(config)

    //     comfirmLoading(false);
    // }
    return (
        <Layout style={{
            height: '100vh',
            width: '100vw',
            overflow: 'scroll',
            overflowX: 'hidden'
        }}>
            <div className="container-fuild p-2" style={{ marginBottom: 50 }}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <iframe className="location-controll"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3793.93893661872!2d102.6295579748178!3d18.028037284034507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31245d8e03c3df37%3A0xbe477adcd1b3eade!2z4LuA4LqU4Lq14LuI4LqZ4Lqa4Lqy4LqZ4Lqr4Lq84Lqx4LqBOQ!5e0!3m2!1sen!2sla!4v1685860345336!5m2!1sen!2sla"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                >
                                </iframe>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3>ຂໍ້ມູນຕິດຕໍ່</h3>
                                <hr />
                                <h4>ເບີໂທລະສັບ: 020 7899 1963</h4>
                                <h4>ອີເມວ: tubqhaughlub@gmail.com</h4>
                                <h4>ທີ່ຢູ່: ບ້ານຄໍາຮຸ່ງ, ໄຊທານີ, ນະຄອນຫລວງ</h4>
                            </div>
                        </div>
                        {/* <div className="card mt-2 mb-2">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="form-group mt-4 col-md-6">
                                        <label><FaUser style={{ marginBottom: 5, fontSize: 17 }} />&ensp;ຊື່ ແລະ ນາມສະກຸນ:</label>
                                        <input type="text" className="form-control" name='fullname' placeholder='ຊື່ ແລະ ນາມສະກຸນ' />
                                    </div>
                                    <div className="form-group mt-4 col-md-6">
                                        <label><Phone style={{ fontSize: 20 }} />&ensp;ເບີໂທລະສັບ:</label>
                                        <input type="text" className="form-control" name='phone' placeholder='ເບີໂທລະສັບ' />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label><Email style={{ fontSize: 20 }} />&ensp;ອີເມວ:</label>
                                    <input type="email" className="form-control" name='email' placeholder='ອີເມວ' />
                                </div>
                                <div className="form-group">
                                    <label><Home style={{ marginBottom: 5 }} />&ensp;ຂໍ້ຄວາມ:</label>
                                    <textarea type="text" className="form-control" name='address' placeholder='ລາຍລະອຽດ' rows={3} />
                                </div>
                                <div className="mt-4" style={{ display: 'flex', justifyContent: 'end', marginBottom: 20 }}>
                                    <button style={{ fontSize: 18, height: 45, width: 100 }} className="btn btn-primary">
                                    
                                        ສົ່ງຂໍ້ຄວາມ
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </Layout>
    )
}