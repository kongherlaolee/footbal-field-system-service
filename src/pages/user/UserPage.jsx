import React, { useState, useEffect } from 'react'
import { useAsyncError, useNavigate } from 'react-router-dom'
import moment from 'moment';
import { toast } from "react-toastify";
// icons
import { MdCancel } from 'react-icons/md';
import DoneAllSharp from "@mui/icons-material/DoneAllSharp";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineBorderColor } from "react-icons/md";

// react bootrap
import { Table, Form, Modal, Spinner, Button } from 'react-bootstrap';
import { ErrorMessage, Formik } from 'formik';
import EmptyComponent from '../../components/EmptyComponent';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

import axios from 'axios';
import { ACCESS_TOKEN, API_URI } from '../../constants';
import { convertedRole } from '../../helpers';

export default function UserPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState()
  const [showaddUser, setShowAddUser] = useState(false)
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState();
  const [isEdited, setIsEdited] = useState(false);
  const [isShowConfirmDeleteModal, setIsShowConfirmDeleteModal] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    axios.get(API_URI + 'get_employee', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setLoading(false)
        setUsers(response?.data?.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const onClickShowAddAndEditModal = (user) => {
    try {
      setSelectedUser(user);
      setShowAddUser(true);
      setIsEdited(true);
    } catch (error) {
      console.log({ error })
    }
  }

  const onClickShowDeleteModal = (user) => {
    setSelectedUser(user);
    setIsShowConfirmDeleteModal(true)
  }

  const onCreateEmployee = (values) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log({ values })
    var config = {
      method: 'post',
      url: API_URI + 'add_employee',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(values)
    };
    axios(config)
      .then(response => {
        setShowAddUser(false);
        const _newUsers = [...users, { ...values, id: response.data.data.id }];
        setUsers(_newUsers)
        toast.success("ເພີ່ມຂໍ້ມູນພະນັກງານສໍາເລັດ!", { theme: 'colored' });
      })
      .catch(error => {
        console.error(error);
      });
  }

  const onEditEmployee = (values) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log({ values })
    var config = {
      method: 'put',
      url: API_URI + 'update_employee/' + selectedUser?.id,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(values)
    };
    axios(config)
      .then(response => {
        setShowAddUser(false);
        const _newUsers = [...users];
        const updatedData = _newUsers.map(user => {
          if (user.id === selectedUser?.id) {
            return { ...user, ...values };
          }
          return user;
        });
        setUsers(updatedData)
        toast.success("ແກ້ໄຂຂໍ້ມູນພະນັກງານສໍາເລັດ!", { theme: 'colored' });
      })
      .catch(error => {
        console.error(error);
      });
  }

  const onDeleteEmployee = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    var config = {
      method: 'delete',
      url: API_URI + 'delete_employee/' + selectedUser?.id,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    };
    axios(config)
      .then(response => {
        setIsShowConfirmDeleteModal(false);
        const _newUsers = [...users];
        const updatedData = _newUsers.filter(user => user?.id !== selectedUser?.id)
        setUsers(updatedData)
        toast.success("ລຶບຂໍ້ມູນພະນັກງານສໍາເລັດ!", { theme: 'colored' });
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className="main">
      <div>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: "#3C169B"
          }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#616161' }}>
              ຈັດການພະນັກງານ ({loading ? "..." : users?.length})
            </span>
            <div>
              <Button
                style={{ borderRadius: 5, width: '160px', height: '50px', fontSize: 18 }}
                onClick={() => { setShowAddUser(true); setIsEdited(false) }}>
                <AddBoxOutlinedIcon style={{ marginBottom: 2 }} />&ensp;ເພີ່ມພະນັກງານ
              </Button>
            </div>

          </div>
          {
            loading ? <> <center><Spinner animation='border' style={{ marginTop: 10 }} /></center></> : <>
              {/* table */}
              {
                users?.length > 0 ? (
                  <Table responsive size='xl' style={{
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
                        <th>ຊື່ ເເລະ ນາມສະກຸນ</th>
                        <th>ສິດນຳໃຊ້ລະບົບ</th>
                        <th>ເບີໂທ</th>
                        <th>email</th>
                        <th>ທີ່ຢູ່</th>
                        <th>ຈັດການ</th>
                      </tr>
                    </thead>
                    <tbody >
                      {
                        users?.map((user, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user?.fullname} </td>
                            <td>{convertedRole(user?.role)} </td>
                            <td>{user?.phone} </td>
                            <td>{user?.email} </td>
                            <td> {user?.address}</td>
                            <td style={{ width: "0%" }}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <Button
                                  style={{ borderRadius: 5, width: '100px', height: '45px', background: "#F7F7F7", color: "#2962FF", border: "1px solid #2962FF", textAlign: "center" }}
                                  onClick={() => onClickShowAddAndEditModal(user)}>
                                  <MdOutlineBorderColor style={{ color: "#2962FF", fontSize: '20px' }} />&ensp;ເເກ້ໄຂ
                                </Button>
                                &ensp;
                                <Button
                                  style={{ border: "1px solid #D50000", borderRadius: 5, background: "#F7F7F7", color: "#D50000", width: '100px', height: '45px', textAlign: "center" }}
                                  onClick={() => onClickShowDeleteModal(user)}>
                                  <RiDeleteBin6Line style={{ color: '#D50000', fontSize: "20px" }} />&ensp;ລຶບ
                                </Button>

                              </div>

                            </td>
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
                  color: "#616161",
                  fontWeight: "400"
                }}>
                  <EmptyComponent message={'ຍັງບໍ່ມີຂໍ້ມຸນພະນັກງານກະລຸນາໄປເພີ່ມຂໍ້ມຸນພະນັກງານກ່ອນ'} />
                </div>)
              }

              {/* end table */}
            </>
          }


          {/* end table */}
        </div>
      </div>


      <Modal show={showaddUser} onHide={() => setShowAddUser(false)}>
        <Modal.Header style={{ backgroundColor: "green" }}>
          <Modal.Title style={{ color: "white" }}>{isEdited ? 'ແກ້ໄຂພະນັກງານ' : 'ເພີ່ມພະນັກງານ'}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            email: isEdited ? selectedUser?.email : "",
            role: isEdited ? selectedUser?.role ?? 'employee' : 'employee',
            fullname: isEdited ? selectedUser.fullname : "",
            phone: isEdited ? selectedUser?.phone : "",
            password: "",
            gender: isEdited ? selectedUser?.gender ?? 'ຊາຍ' : "ຊາຍ",
            address: isEdited ? selectedUser?.address : ''
          }}
          validate={values => {
            const errors = {};
            if (!values.fullname) {
              errors.fullname = 'ກະລຸນາປ້ອນຊື່ກ່ອນ';
            }
            if (!values.phone) {
              errors.phone = 'ກະລຸນາປ້ອນເບີໂທກ່ອນ';
            }
            if (!values.password) {
              errors.password = 'ກະລຸນາລະຫັດຜ່ານກ່ອນ';
            }
            if (!values.email) {
              errors.email = 'ກະລຸນາອີເມວກ່ອນ';
            }
            if (!values.address) {
              errors.address = 'ກະລຸນາທີ່ຢູ່ກ່ອນ';
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            isEdited ? onEditEmployee(values) : onCreateEmployee(values)
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

                <div className='row'>
                  <div className='col-6'>
                    <Form.Label>ຊື່ຜູ້ໃຊ້:</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.fullname}
                      placeholder="ຊື່ຜູ້ໃຊ້"
                    />
                    <ErrorMessage style={{ color: 'red' }} name="fullname" component="div" />
                  </div>
                  <div className='col-6'>
                    <Form.Label>ເພດ:</Form.Label>
                    <Form.Select
                      name="gender"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.gender}
                      aria-label="Default select example">
                      <option value="ຍຶງ">ຍິງ</option>
                      <option value="ຊາຍ">ຊາຍ</option>
                    </Form.Select>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-6 mt-2'>
                    <Form.Label>ເບີໂທ:</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      placeholder="ເບີໂທ"
                    />
                    <ErrorMessage style={{ color: 'red' }} name="phone" component="div" />
                  </div>
                  <div className='col-6 mt-2'>
                    <Form.Label>ອີເມວ:</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      placeholder="example@gmail.com"
                    />
                    <ErrorMessage style={{ color: 'red' }} name="email" component="div" />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-6 mt-2'>
                    <Form.Label>ສິດນຳໃຊ້ລະບົບ:</Form.Label>
                    <Form.Select
                      name="role"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.role}
                      aria-label="Default select example">
                      <option value="employee">ພະນັກງານ</option>
                      <option value="admin">ຜູ້ບໍລິຫານ</option>
                    </Form.Select>
                  </div>
                  <div className='col-6 mt-2'>
                    <Form.Label>ລະຫັດຜ່ານ:</Form.Label>
                    <Form.Control
                      type="text"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      placeholder="ລະຫັດຜ່ານ"
                    />
                    <ErrorMessage style={{ color: 'red' }} name="password" component="div" />
                  </div>
                </div>
                <div className='mt-2'>
                  <Form.Label>ທີ່ຢູ່:</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                    placeholder="ບ້ານ, ເມືອງ, ແຂວງ"
                  />
                  <ErrorMessage style={{ color: 'red' }} name="address" component="div" />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => setShowAddUser(false)}
                  style={{ background: "grey", width: "100px", border: 'none', borderRadius: "5px", height: 45 }}
                ><MdCancel style={{ fontSize: 20 }} />&ensp;ຍົກເລີກ</Button>
                <Button
                  onClick={() => handleSubmit()}
                  style={{ width: "100px", borderRadius: "5px", whiteSpace: 'nowrap', alignItems: 'center', height: 45, marginLeft: 10 }}>
                  {loading ? <Spinner /> : ""}<DoneAllSharp />&ensp;ບັນທຶກ
                  {/* {Loading ? <Spinner /> : "ບັນທຶກ"} */}
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </Modal>

      <ConfirmDeleteModal
        title={'ຢືນຢັນການລຶບ'}
        body={'ທ່ານຕ້ອງການທີ່ຈະລຶບຂໍ້ມູນພະນັກງານນີ້ແທ້ບໍ່?'}
        isShowConfirmDeleteModal={isShowConfirmDeleteModal}
        setIsShowConfirmDeleteModal={setIsShowConfirmDeleteModal}
        ok={onDeleteEmployee}
      />
    </div >
  )
}
