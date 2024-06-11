
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import FrontendNavbar from './FrontendNavbar';
import { FaUser, FaUserCircle } from 'react-icons/fa';
import { API_URI, CUSTOMER_DATA, CUSTOMER_TOKEN } from '../../constants';
import { Email, Home, Key, Password, Phone } from '@mui/icons-material';

import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import Layout from './Layout';
function FrontendProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [checkPW, setCheckPW] = useState(false)
  const [value, setValue] = useState({
    fullname: '',
    phone: '',
    address: '',
    email: ''
  });
  const [password, setPassword] = useState({
    password: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  useEffect(() => {
    setValue({
      fullname: user?.fullname,
      phone: user?.phone,
      address: user?.address,
      email: user?.email,
    });
  }, [])
  const user = JSON.parse(localStorage.getItem(CUSTOMER_DATA))
  const _handleback = () => {
    navigate('/');
  }
  const _handleUpdate = async () => {
    const token = localStorage.getItem(CUSTOMER_TOKEN)
    setLoading(true);
    console.log(value)
    var config = {
      method: 'put',
      url: API_URI + 'update_customer/' + user?.id,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        ...value
      })
    };
    axios(config)
      .then(function (res) {
        setLoading(false);
        setValue({ ...value, password: '' })
        localStorage.setItem(CUSTOMER_DATA, JSON.stringify({ ...res.data?.data }))
        toast.success("ແກ້ໄຂຂໍ້ມູນສໍາເລັດແລ້ວ", { theme: 'colored' });
      })
      .catch(function (error) {
        setLoading(false);
        toast.error("ມີບາງຢ່າງຜິດພາດ", { theme: 'colored' });
        console.log(error);
      });

  };

  const _handleChangePW = async () => {
    if (password?.newPassword !== password.confirmNewPassword) return setCheckPW(true);
    const token = localStorage.getItem(CUSTOMER_TOKEN)
    setLoading(true);
    console.log(value)
    var config = {
      method: 'put',
      url: API_URI + 'change_customer_password/' + user?.id,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        password: password?.password,
        newPassword: password?.newPassword
      })
    };
    axios(config)
      .then(function (res) {
        setLoading(false);
        setValue({ ...value, password: '' })
        localStorage.setItem(CUSTOMER_DATA, JSON.stringify({ ...res.data?.data }))
        toast.success("ປ່ຽນລະຫັດຜ່ານສໍາເລັດແລ້ວ", { theme: 'colored' });
      })
      .catch(function (error) {
        setLoading(false);
        toast.error(error?.response?.data?.message, { theme: 'colored' });
        console.log(error);
      });
  }
  const _handleChannge = (e) => {
    const { name, value } = e.target;
    setValue(s => ({
      ...s,
      [name]: value
    }))
  }

  const _handleChanngeNewPW = (e) => {
    setCheckPW(false)
    const { name, value } = e.target;
    setPassword(s => ({
      ...s,
      [name]: value
    }))
  }
  return (
    <Layout style={{
      height: '100vh',
      width: '100vw',
      overflow: 'scroll',
      overflowX: 'hidden'
    }}>
      <div className="container-fuild p-2" style={{ marginBottom: 50 }}>
        <div className="row">
          <div className="col-md-6 mb-2">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h3><b>ຂໍ້ມູນສ່ວນຕົວ</b></h3>
                    <hr />
                    <center><FaUserCircle style={{ fontSize: '150px', color: "#0D47A1" }} /></center>
                    <div className="form-group">
                      <label><FaUser style={{ marginBottom: 5, fontSize: 19 }} />&ensp;ຊື່ ແລະ ນາມສະກຸນ:</label>
                      <input type="text" className="form-control" value={value?.fullname} name='fullname' onChange={_handleChannge} placeholder='ຊື່ ແລະ ນາມສະກຸນ' />
                    </div>
                    <div className="form-group">
                      <label><Phone style={{ marginBottom: 5 }} />&ensp;ເບີໂທລະສັບ:</label>
                      <input type="text" className="form-control" value={value?.phone} name='phone' onChange={_handleChannge} placeholder='ເບີໂທລະສັບ' />
                    </div>
                    <div className="form-group">
                      <label><Email style={{ marginBottom: 5 }} />&ensp;ອີເມວ:</label>
                      <input type="email" className="form-control" value={value?.email} name='email' onChange={_handleChannge} placeholder='ອີເມວ' />
                    </div>
                    <div className="form-group">
                      <label><Home style={{ marginBottom: 5, fontSize: 26 }} />&ensp;ທີ່ຢູ່:</label>
                      <textarea type="text" className="form-control" value={value?.address} name='address' onChange={_handleChannge} placeholder='ທີ່ຢູ່' />
                    </div>
                  </div>
                </div>
                <div className="row" >
                  <div className="col-md-12" style={{
                    flexDirection: "column",
                    display: "flex",
                    alignItems: "end",
                  }}>
                    <button style={{ fontSize: 18, height: 45, width: 100, }} className="btn btn-primary" onClick={_handleUpdate}>ແກ້ໄຂ</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-2">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h3><b>ປ່ຽນລະຫັດຜ່ານ</b></h3>
                    <hr />
                    <div className="form-group">
                      <label><Key style={{ marginBottom: 2 }} />&ensp;ລະຫັດຜ່ານປັດຈຸບັນ:</label>
                      <input type="password" className="form-control" value={password?.password} name="password" placeholder='ລະຫັດຜ່ານ' onChange={_handleChanngeNewPW} />
                    </div>
                    <div className="form-group">
                      <label><Key style={{ marginBottom: 2 }} />&ensp;ລະຫັດຜ່ານໃໝ່:</label>
                      <input type="password" className="form-control" name="newPassword" value={password?.newPassword} onChange={_handleChanngeNewPW} placeholder='ລະຫັດຜ່ານໃໝ່' />
                    </div>
                    <div className="form-group">
                      <label><Key style={{ marginBottom: 2 }} />&ensp;ຢືນຢັນລະຫັດຜ່ານໃໝ່:</label>
                      <input type="password" className="form-control" name="confirmNewPassword" value={password?.confirmNewPassword} onChange={_handleChanngeNewPW} placeholder='ຢືນຢັນລະຫັດຜ່ານໃໝ່' />
                      {
                        checkPW && <div style={{ color: 'red' }}>ລະຫັດບໍ່ຕົງກັນ</div>
                      }
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12" style={{ display: "flex", justifyContent: "space-between" }}>
                    <button style={{ height: 45, width: 100, fontSize: 18 }} className="btn btn-warning" onClick={_handleback}><AiOutlineArrowLeft />&ensp;ກັບຄືນ</button>
                    <button style={{ fontSize: 18, height: 45, width: 100 }} className="btn btn-primary" onClick={_handleChangePW}>
                      {/* {loading ? <Spinner animation="border" /> : "ຢືນຢັນ"} */}
                      ຢືນຢັນ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-md-12">
          <div className="row justify-content-center">
            <div className="col-md-6 p-4">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <center><FaUserCircle style={{ fontSize: '150px' }} /></center>
                      <hr />
                      <div className="form-group">
                        <label><FaUser /> ຊື່ ແລະ ນາມສະກຸນ:</label>
                        <input type="text" className="form-control" value={value?.fullname} name='fullname' onChange={_handleChannge} placeholder='ຊື່ ແລະ ນາມສະກຸນ' />
                      </div>
                      <div className="form-group">
                        <label><Phone /> ເບີໂທ:</label>
                        <input type="text" className="form-control" value={value?.phone} name='phone' onChange={_handleChannge} placeholder='ເບີໂທ' />
                      </div>
                      <div className="form-group">
                        <label><Email /> ອີເມວ:</label>
                        <input type="email" className="form-control" value={value?.email} name='email' onChange={_handleChannge} placeholder='ອີເມວ' />
                      </div>
                      <div className="form-group">
                        <label><Home /> ທີ່ຢູ່:</label>
                        <textarea type="text" className="form-control" value={value?.address} name='address' onChange={_handleChannge} placeholder='ທີ່ຢູ່' />
                      </div>
                      <div className="form-group">
                        <label><Key /> ລະຫັດຜ່ານ:</label>
                        <input type="password" className="form-control" value={value?.password} name="password" placeholder='ລະຫັດຜ່ານ' onChange={_handleChannge} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 d-flex justify-content-between">
                        <button className="btn btn-warning" onClick={_handleback}>ກັບຄືນ</button>
                        <button className="btn btn-primary" onClick={_handleUpdate}> {loading ? <Spinner className="mr-2" animation="border" size="sm" /> : <div></div>} ແກ້ໄຂ</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 p-4">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <center><FaUserCircle style={{ fontSize: '150px' }} /></center>
                      <hr />
                      <div className="form-group">
                        <label><FaUser /> ຊື່ ແລະ ນາມສະກຸນ:</label>
                        <input type="text" className="form-control" value={value?.fullname} name='fullname' onChange={_handleChannge} placeholder='ຊື່ ແລະ ນາມສະກຸນ' />
                      </div>
                      <div className="form-group">
                        <label><Phone /> ເບີໂທ:</label>
                        <input type="text" className="form-control" value={value?.phone} name='phone' onChange={_handleChannge} placeholder='ເບີໂທ' />
                      </div>
                      <div className="form-group">
                        <label><Email /> ອີເມວ:</label>
                        <input type="email" className="form-control" value={value?.email} name='email' onChange={_handleChannge} placeholder='ອີເມວ' />
                      </div>
                      <div className="form-group">
                        <label><Home /> ທີ່ຢູ່:</label>
                        <textarea type="text" className="form-control" value={value?.address} name='address' onChange={_handleChannge} placeholder='ທີ່ຢູ່' />
                      </div>
                      <div className="form-group">
                        <label><Key /> ລະຫັດຜ່ານ:</label>
                        <input type="password" className="form-control" value={value?.password} name="password" placeholder='ລະຫັດຜ່ານ' onChange={_handleChannge} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 d-flex justify-content-between">
                        <button className="btn btn-warning" onClick={_handleback}>ກັບຄືນ</button>
                        <button className="btn btn-primary" onClick={_handleUpdate}> {loading ? <Spinner className="mr-2" animation="border" size="sm" /> : <div></div>} ແກ້ໄຂ</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </Layout>
  );
}
export default FrontendProfile;