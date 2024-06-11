// import { useState } from "react";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { Form, Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
// import { FaUser, FaLock, FaPhone, FaVoicemail } from "react-icons/fa";
// import LoginIcon from '@mui/icons-material/LoginOutlined'
// import { toast } from "react-toastify";
// import axios from "axios";
// import { Formik, ErrorMessage } from "formik";
// import { CUSTOMER_TOKEN, API_URI, CUSTOMER_DATA } from "../../constants";
// import { AddReaction, Email, Home } from "@mui/icons-material";

// const FrontendAuth = () => {
//     const { state } = useLocation();
//     console.log({ state })
//     const [loading, setLoading] = useState(false);
//     const [type, setType] = useState('login')
//     const [loadingregister, setLoadingregister] = useState(false);
//     const navigate = useNavigate();

//     const _handleSubmit = async (values) => {
//         setLoading(true);
//         var config = {
//             method: 'post',
//             url: API_URI + 'login_customer',
//             data: {
//                 phone: values.phone,
//                 password: values.password
//             }
//         };
//         axios(config)
//             .then(function (response) {
//                 localStorage.setItem(CUSTOMER_DATA, JSON.stringify({ ...response.data?.data}));
//                 localStorage.setItem(CUSTOMER_TOKEN, response.data?.token);
//                 if(state){
//                    navigate("/detail_stadium", { state });
//                 }else{
//                     navigate("/");
//                 }
//                 setLoading(false);
//                 toast.success("ເຂົ້າລະບົບສໍາເລັດແລ້ວ");
//             })
//             .catch(function (error) {
//                 setLoading(false);
//                 toast.error("ເບີໂທລະສັບ ຫລື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ");
//                 console.log(error);
//             });

//     };
//     const _handleregisterSubmit =  (values) => {
//         setLoadingregister(true);
//         console.log('values')
//         console.log(values)
//         var config = {
//             method: 'post',
//             url: API_URI + 'register_customer',
//               data:  {
//                 phone: values.phone,
//                 password: values.password,
//                 fullname: values.fullname,
//                 email: values.email,
//                 address: values.address,

//             }
//         };
//         axios(config)
//             .then(function (response) {
//                 toast.success("ລົງທະບຽນສໍາເລັດແລ້ວ");
//                 setLoadingregister(true);
//                 setType('login');
//             })
//             .catch(function (error) {
//                 handleType('register')
//                 setLoadingregister(false);
//                 toast.error(error?.response?.data?.message);
//                 console.log(error);
//             });
//     };
//     const handleType = () => {
//         setType('register');
//     }
//     const closehandleType = () => {
//         setType('login');
//     }
//     return (
//         <div className="login-container background-image">
//             {

//                 type == 'login' ? (<div className="card login-customer-card">
//                     <div className="card-body">
//                         <center><img style={{width: 150, height: 150, borderRadius: 100, backgroundColor: 'white', border: '5px solid white'}} src="https://www.pngkit.com/png/full/281-2812821_user-account-management-logo-user-icon-png.png" alt="" /></center>
//                         <h2 className="card-title mb-4">ເຂົ້າລະບົບ</h2>
//                         <Formik
//                             initialValues={{
//                                 phone: "",
//                                 password: "",
//                             }}
//                             validate={values => {
//                                 const errors = {};
//                                 if (values.phone === "") {
//                                     errors.phone = 'ກະລຸນາປ້ອນເບີໂທລະສັບກ່ອນ';
//                                 }
//                                 if (values.password === "") {
//                                     errors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານກ່ອນ';
//                                 }
//                                 return errors;
//                             }}
//                             onSubmit={(values) => {
//                                 _handleSubmit(values)
//                             }}
//                         >
//                             {({
//                                 values,
//                                 errors,
//                                 touched,
//                                 handleChange,
//                                 handleBlur,
//                                 handleSubmit,
//                                 isSubmitting,
//                             }) =>
//                                 <Form onSubmit={handleSubmit}>
//                                     <Form.Group controlId="formPhone" className="mb-3">
//                                         <InputGroup>
//                                             <InputGroup.Text>
//                                                 <FaPhone />
//                                             </InputGroup.Text>
//                                             <FormControl
//                                                 type="text"
//                                                 name="phone"
//                                                 placeholder="ເບີໂທ"
//                                                 value={values.phone}
//                                                 onChange={handleChange}
//                                             />
//                                         </InputGroup>
//                                         <ErrorMessage style={{ color: 'red' }} name="phone" component="div" />
//                                     </Form.Group>
//                                     <Form.Group controlId="formPassword" className="mb-3">
//                                         <InputGroup>
//                                             <InputGroup.Text>
//                                                 <FaLock />
//                                             </InputGroup.Text>
//                                             <FormControl
//                                                 type="password"
//                                                 name="password"
//                                                 placeholder="ລະຫັດຜ່ານ"
//                                                 value={values.password}
//                                                 onChange={handleChange}
//                                             // onChange={(event) => setPassword(event.target.value)}
//                                             />
//                                         </InputGroup>
//                                         <ErrorMessage style={{ color: 'red' }} name="password" component="div" />
//                                     </Form.Group>

//                                     <div className="d-flex justify-content-center align-items-center">
//                                         <Button type="submit" className="mt-4" style={{ backgroundColor: 'green', border: 'none', padding: '5px 20px' }}>
//                                             {loading ? <Spinner className="mr-2" animation="border" size="sm" /> : <LoginIcon className="mr-2" />}
//                                             ເຂົ້າສູ່ລະບົບ
//                                         </Button>
//                                     </div>
//                                     <a href="javascript:void(0)" onClick={handleType} className="text-white"><h6 className="text-center mt-2"><u>ລົງທະບຽນ</u></h6></a>
//                                 </Form>
//                             }
//                         </Formik>
//                     </div>
//                 </div>) : (<div className="card login-customer-card">
//                     <div className="card-body">
//                         <center><img style={{width: 150, height: 150, borderRadius: 100, backgroundColor: 'white', border: '5px solid white'}} src="https://www.pngkit.com/png/full/281-2812821_user-account-management-logo-user-icon-png.png" alt=""  /></center>
//                         <h2 className="card-title mb-4">ລົງທະບຽນ</h2>
//                         <Formik
//                             initialValues={{
//                                 phone: "",
//                                 email: "",
//                                 fullname: "",
//                                 address: "",
//                                 password: ""
//                             }}
//                             validate={values => {
//                                 const errors = {};
//                                 if (values.phone === "") {
//                                     errors.phone = 'ກະລຸນາປ້ອນເບີໂທລະສັບກ່ອນ';
//                                 }
//                                 if (values.password === "") {
//                                     errors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານກ່ອນ';
//                                 }
//                                 if (values.fullname === "") {
//                                     errors.fullname = 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນກ່ອນ';
//                                 }
//                                 if (values.address === "") {
//                                     errors.address = 'ກະລຸນາປ້ອນທີ່ຢູ່ກ່ອນ';
//                                 }
//                                 return errors;
//                             }}
//                             onSubmit={(values) => {
//                                 _handleregisterSubmit(values)
//                             }}
//                         >
//                             {({
//                                 values,
//                                 errors,
//                                 touched,
//                                 handleChange,
//                                 handleBlur,
//                                 handleSubmit,
//                                 isSubmitting,
//                             }) =>
//                                 <Form onSubmit={handleSubmit}>
//                                     <Form.Group controlId="formFullname" className="mb-3">
//                                         <InputGroup>
//                                             <InputGroup.Text>
//                                                 <FaUser />
//                                             </InputGroup.Text>
//                                             <FormControl
//                                                 type="text"
//                                                 name="fullname"
//                                                 placeholder="ຊື່ ແລະ ນາມສະກຸນ"
//                                                 value={values.fullname}
//                                                 onChange={handleChange}
//                                             />
//                                         </InputGroup>
//                                         <ErrorMessage style={{ color: 'red' }} name="fullname" component="div" />
//                                     </Form.Group>
//                                     <Form.Group controlId="formPhone" className="mb-3">
//                                         <InputGroup>
//                                             <InputGroup.Text>
//                                                 <FaPhone />
//                                             </InputGroup.Text>
//                                             <FormControl
//                                                 type="text"
//                                                 name="phone"
//                                                 placeholder="ເບີໂທ"
//                                                 value={values.phone}
//                                                 onChange={handleChange}
//                                             />
//                                         </InputGroup>
//                                         <ErrorMessage style={{ color: 'red' }} name="phone" component="div" />
//                                     </Form.Group>
//                                     <Form.Group controlId="email" className="mb-3">
//                                         <InputGroup>
//                                             <InputGroup.Text>
//                                                 <Email />
//                                             </InputGroup.Text>
//                                             <FormControl
//                                                 type="text"
//                                                 name="email"
//                                                 placeholder="ອີເມວ"
//                                                 value={values.email}
//                                                 onChange={handleChange}
//                                             />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Form.Group controlId="formAddress" className="mb-3">
//                                         <InputGroup>
//                                             <InputGroup.Text>
//                                                 <Home />
//                                             </InputGroup.Text>
//                                             <FormControl
//                                                 type="text"
//                                                 name="address"
//                                                 placeholder="ທີ່ຢູ່"
//                                                 value={values.address}
//                                                 onChange={handleChange}
//                                             />
//                                         </InputGroup>
//                                         <ErrorMessage style={{ color: 'red' }} name="address" component="div" />
//                                     </Form.Group>
//                                     <Form.Group controlId="formPassword" className="mb-3">
//                                         <InputGroup>
//                                             <InputGroup.Text>
//                                                 <FaLock />
//                                             </InputGroup.Text>
//                                             <FormControl
//                                                 type="password"
//                                                 name="password"
//                                                 placeholder="ລະຫັດຜ່ານ"
//                                                 value={values.password}
//                                                 onChange={handleChange}
//                                             // onChange={(event) => setPassword(event.target.value)}
//                                             />
//                                         </InputGroup>
//                                         <ErrorMessage style={{ color: 'red' }} name="password" component="div" />
//                                     </Form.Group>

//                                     <div className="d-flex justify-content-center align-items-center">
//                                         <Button type="submit" className="mt-1" style={{ backgroundColor: 'green', border: 'none', padding: '5px 20px' }}>
//                                             {loadingregister ? <Spinner className="mr-2" animation="border" size="sm" /> : <LoginIcon className="mr-2" />}
//                                             ລົງທະບຽນ
//                                         </Button>
//                                     </div>
//                                     <a href="javascript:void(0)" onClick={closehandleType} className="text-white"><h6 className="text-center mt-2"><u>ເຂົ້າສູ່ລະບົບ</u></h6></a>
//                                 </Form>
//                             }
//                         </Formik>
//                     </div>
//                 </div>)

//             }

//         </div>
//     );
// };
// export default FrontendAuth;


import React, { useState } from "react";
import * as Components from '../frontend/Components';
import { ErrorMessage, Formik } from "formik";
import { Form } from "react-bootstrap";
import { API_URI, CUSTOMER_DATA, CUSTOMER_TOKEN } from "../../constants";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "@material-ui/core";
import { ClassNames } from "@emotion/react";
import Layout from "./Layout";

import { FaUser, FaLock, FaPhone } from "react-icons/fa";
import LoginIcon from '@mui/icons-material/LoginOutlined'

function FrontendAuth() {
    const [signIn, toggle] = useState(true);
    const [loading, setLoading] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loadingregister, setLoadingregister] = useState(false);

    const _handleSubmit = async (values) => {
        console.log({ values })
        setLoading(true);
        var config = {
            method: 'post',
            url: API_URI + 'login_customer',
            data: {
                phone: values.phone,
                password: values.password
            }
        };
        axios(config)
            .then(function (response) {
                localStorage.setItem(CUSTOMER_DATA, JSON.stringify({ ...response.data?.data }));
                localStorage.setItem(CUSTOMER_TOKEN, response.data?.token);
                if (state) {
                    navigate("/detail_stadium", { state });
                } else {
                    navigate("/");
                }
                setLoading(false);
                toast.success("ເຂົ້າລະບົບສໍາເລັດແລ້ວ", { theme: 'colored' });
            })
            .catch(function (error) {
                setLoading(false);
                toast.error("ເບີໂທລະສັບ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ", { theme: 'colored' });
                console.log(error);
            });

    };
    const _handleregisterSubmit = (values) => {
        setLoadingregister(true);
        console.log('values')
        console.log(values)
        var config = {
            method: 'post',
            url: API_URI + 'register_customer',
            data: {
                phone: values.phone,
                password: values.password,
                fullname: values.fullname,
                email: values.email,
                address: values.address,

            }
        };
        axios(config)
            .then(function (response) {
                toast.success("ລົງທະບຽນສໍາເລັດແລ້ວ", { theme: "colored" });
                setLoadingregister(true);
                toggle(true)
            })
            .catch(function (error) {
                handleType('register')
                setLoadingregister(false);
                toast.error(error?.response?.data?.message);
                console.log(error);
            });
    };
    return (
        <Layout className="background-image">
            <div className="background-image" style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <center >
                    <Components.Container >
                        <Components.SignUpContainer signinIn={signIn}>
                            <Formik
                                initialValues={{
                                    phone: "",
                                    email: "",
                                    fullname: "",
                                    address: "",
                                    password: ""
                                }}
                                validate={values => {
                                    const errors = {};
                                    if (values.phone === "") {
                                        errors.phone = 'ກະລຸນາປ້ອນເບີໂທລະສັບກ່ອນ';
                                    }
                                    if (values.password === "") {
                                        errors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານກ່ອນ';
                                    }
                                    if (values.fullname === "") {
                                        errors.fullname = 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນກ່ອນ';
                                    }
                                    if (values.address === "") {
                                        errors.address = 'ກະລຸນາປ້ອນທີ່ຢູ່ກ່ອນ';
                                    }
                                    return errors;
                                }}
                                onSubmit={(values) => {
                                    _handleregisterSubmit(values)
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
                                }) =>
                                    <Form>
                                        <Components.Form>
                                            <Components.Title>ສ້າງບັນຊີ</Components.Title>
                                            <Components.Input type='text' placeholder='ຊື່ ແລະ ນາມສະກຸນ' name="fullname" value={values.fullname} onChange={handleChange} />
                                            <ErrorMessage style={{ color: 'red' }} name="fullname" component="div" />
                                            <Components.Input type='text' placeholder='ເບີໂທລະສັບ' name="phone" value={values.phone} onChange={handleChange} />
                                            <ErrorMessage style={{ color: 'red' }} name="phone" component="div" />
                                            <Components.Input type='text' placeholder='ທີ່ຢູ່' name="address" value={values.address} onChange={handleChange} />
                                            <ErrorMessage style={{ color: 'red' }} name="address" component="div" />
                                            <Components.Input type='email' placeholder='ອີເມວ' name="email" value={values.email} onChange={handleChange} />
                                            <ErrorMessage style={{ color: 'red' }} name="email" component="div" />
                                            <Components.Input type='password' placeholder='ລະຫັດຜ່ານ' name="password" value={values.password} onChange={handleChange} />
                                            <ErrorMessage style={{ color: 'red' }} name="password" component="div" />
                                            <Components.Button onClick={handleSubmit}>ລົງທະບຽນ</Components.Button>
                                        </Components.Form>
                                    </Form>
                                }
                            </Formik>
                        </Components.SignUpContainer>

                        <Components.SignInContainer signinIn={signIn}>
                            <Formik
                                initialValues={{
                                    phone: "",
                                    password: "",
                                }}
                                validate={values => {
                                    const errors = {};
                                    if (values.phone === "") {
                                        errors.phone = 'ກະລຸນາປ້ອນເບີໂທລະສັບກ່ອນ';
                                    }
                                    if (values.password === "") {
                                        errors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານກ່ອນ';
                                    }
                                    return errors;
                                }}
                                onSubmit={(values) => {
                                    _handleSubmit(values)
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
                                }) =>
                                    <Form >
                                        <Components.Form>
                                            <center><img src="../assets/logoicon.png" alt="" /></center>
                                            <Components.Title>ເຂົ້າສູ່ລະບົບ</Components.Title>
                                            <Components.Title><h5>ກະລຸນາໃສ່ເບີໂທລະສັບ ແລະ ລະຫັດຜ່ານຂອງທ່ານ!</h5></Components.Title>
                                            <Components.Input type='text' name="phone" value={values.phone} placeholder='ເບີໂທລະສັບ' onChange={handleChange}></Components.Input>
                                            <ErrorMessage style={{ color: 'red' }} name="phone" component="div" />
                                            <Components.Input type='password' name="password" value={values.password} placeholder='ລະຫັດຜ່ານ' onChange={handleChange} />
                                            <ErrorMessage style={{ color: 'red' }} name="password" component="div" />
                                            {/* <Components.Anchor href='#'>Forgot your password?</Components.Anchor> */}
                                            <Components.Button onClick={handleSubmit}>ເຂົ້າລະບົບ</Components.Button>
                                        </Components.Form>
                                    </Form>
                                }
                            </Formik>
                        </Components.SignInContainer>

                        <Components.OverlayContainer signinIn={signIn}>
                            <Components.Overlay signinIn={signIn}>

                                <Components.LeftOverlayPanel signinIn={signIn}>
                                    <Components.Title>ຍິນ​ດີ​ຕ້ອນ​ຮັບ​ກັບ!</Components.Title>
                                    <Components.Paragraph>
                                        ເພື່ອສືບຕໍ່ເຂົ້າລະບົບຂອງພວກເຮົາ ກະລຸນາເຂົ້າສູ່ລະບົບດ້ວຍຂໍ້ມູນລົງທະບຽນຂອງທ່ານ
                                    </Components.Paragraph>
                                    <Components.GhostButton onClick={() => toggle(true)}>
                                        ເຂົ້າສູ່ລະບົບ
                                    </Components.GhostButton>
                                </Components.LeftOverlayPanel>

                                <Components.RightOverlayPanel signinIn={signIn}>
                                    <Components.Title>ສະບາຍດີ, ເພື່ອນ!</Components.Title>
                                    <Components.Paragraph>
                                        ເລີ່ມຕົ້ນການລົງທະບຽນເພື່ອເຂົ້າສູ່ລະບົບຂອງພວກເຮົາ ກະລຸນາໃສ່ລາຍລະອຽດສ່ວນຕົວຂອງທ່ານ
                                    </Components.Paragraph>
                                    <Components.GhostButton onClick={() => toggle(false)}>
                                        ລົງທະບຽນ
                                    </Components.GhostButton>
                                </Components.RightOverlayPanel>

                            </Components.Overlay>
                        </Components.OverlayContainer>

                    </Components.Container>
                </center>
            </div>
        </Layout>
    )
}

export default FrontendAuth;