import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import { FaUser, FaLock, FaPhone } from "react-icons/fa";
import LoginIcon from '@mui/icons-material/LoginOutlined'
import { toast } from "react-toastify";
import axios from "axios";
import { Formik, ErrorMessage } from "formik";
import { ACCESS_TOKEN, API_URI, USER_DATA } from "../../constants";
// import logos from '../../../src/assets/images/logos.png'
// import logos from '../../../src/assets/images/logos.png'

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const _handleSubmit = async (values) => {
    // event.preventDefault();
    setLoading(true);

    var config = {
      method: 'post',
      url: API_URI + 'login',
      data: {
        phone: values.phone,
        password: values.password
      }
    };
    axios(config)
      .then(function (response) {
        localStorage.setItem(USER_DATA, JSON.stringify({ ...response.data?.data, password: null }));
        localStorage.setItem(ACCESS_TOKEN, response.data?.token);

        if (response.data?.data?.role === 'admin') navigate("/home");
        else navigate("/booking")
        window.location.reload();
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        toast.error("ເບີໂທລະສັບ ຫລື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ", { theme: 'colored' });
        console.log(error);
      });

  };

  return (
    <div className="login-container background-image">
      <div style={{ height: 500, borderRadius: 10 }} className="card login-card">
        <div className="card-body">
          <center><img style={{ width: 150, height: 150, borderRadius: 5 }} src="../assets/images/logoicon.png" alt="" /></center>
          <h2 className="card-title mt-0">ເຂົ້າສູ່ລະບົບ</h2>
          <h5 className="mb-3">ກະລຸນາໃສ່ເບີໂທລະສັບ ແລະ ລະຫັດຜ່ານຂອງທ່ານ!</h5>
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
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formPhone" className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <FaPhone />
                    </InputGroup.Text>
                    <FormControl
                      type="text"
                      name="phone"
                      placeholder="ເບີໂທລະສັບ"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <ErrorMessage style={{ color: 'red' }} name="phone" component="div" />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-3">
                  <InputGroup>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <FormControl
                      type="password"
                      name="password"
                      placeholder="ລະຫັດຜ່ານ"
                      value={values.password}
                      onChange={handleChange}
                    // onChange={(event) => setPassword(event.target.value)}
                    />
                  </InputGroup>
                  <ErrorMessage style={{ color: 'red' }} name="password" component="div" />
                </Form.Group>

                <div className="d-flex justify-content-center align-items-center">
                  <Button type="submit" className="mt-4" style={{ backgroundColor: 'green', border: 'none', padding: '8px 20px', height: 45, width: 150, fontSize: 18 }}>
                    {loading ? <Spinner animation="border" size="sm" style={{ marginBottom: 5, fontSize: 20 }} /> : <LoginIcon style={{ marginBottom: 2 }} />}&ensp;
                    ເຂົ້າລະບົບ
                  </Button>
                </div>
              </Form>
            }
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
