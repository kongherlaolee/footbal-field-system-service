import React from "react";
import styled from "styled-components";
import moment from "moment";
import { IMAGE_URL, USER_DATA } from "../../constants";
import { Table } from "react-bootstrap";
import { dateTimeFormat, numberFormat } from "../../helpers";

const ReportBookingBill = React.forwardRef((props, ref) => {
    const { data, status, startDate, endDate } = props
    const userData = JSON.parse(localStorage.getItem(USER_DATA));
    return (
        <div ref={ref} style={{ width: '100vw', height: '100vh', justifyContent: 'center', padding: '50px' }}>
            <div style={{ textAlign: "center" }}>
                <img style={{ width: 100 }} src={'../assets/images/logoicon.png'} />
            </div>
            <div style={{ textAlign: "center" }}>
                <b style={{ fontSize: "25px" }}>ລາຍງານລາຍການຈອງ{status === "success" ? 'ສໍາເລັດ' : status === "cancel" ? "ທີ່ຖືກຍົກເລີກ" : ""}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <div div style={{ textAlign: "left", fontSize: 20 }}>ເດີ່ນບານ KM9</div>
                    <div div style={{ textAlign: "left", fontSize: 20 }}>ລາຍງານລາຍຮັບວັນທີ: {moment(startDate).format('DD/MM/YYYY')} - {moment(endDate).format('DD/MM/YYYY')}</div>
                </div>
                <div>
                    <div style={{ textAlign: "left", fontSize: 20 }}>ລາຍງານໂດຍ : {userData?.fullname} </div>
                    <div style={{ textAlign: "right", fontSize: 20 }}>ວັນທີ : {moment().format('DD/MM/YYYY')}</div>
                </div>
            </div>
            <div style={{ textAlign: "left", marginTop: 10 }}>
                <h4>ລາຍການຈອງ</h4>
            </div>
            <Order>
                <>
                    {
                        data?.length > 0 && <Table >
                            <thead style={{ backgroundColor: 'green' }}>
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
                                    data?.map((booking, index) => (
                                        <tr key={booking + index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img alt="" src={IMAGE_URL + booking?.slip_payment} style={{ width: 60, height: 80, objectFit: 'cover' }} />
                                            </td>
                                            <td>{booking?.customer?.fullname} </td>
                                            <td>{booking?.customer?.phone} </td>
                                            <td>{booking?.price[0]?.number} </td>
                                            <td>
                                                <p>{moment(booking?.date_booking).format('DD/MM/YYYY')}</p>
                                                <span>{booking?.price[0]?.time}</span>
                                            </td>
                                            <td>{numberFormat(booking?.total ?? 0)} </td>
                                            <td> {numberFormat(booking?.total * booking?.pay_percent / 100)}</td>
                                            <td>{dateTimeFormat(booking?.created_at)} </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    }

                    <div style={{ display: "flex", flexDirection: 'column', fontSize: 20, fontWeight: 'bold' }}>
                        <div style={{ display: "flex", justifyContent: 'space-between', color: 'green' }}>
                            <div>ຍອດລວມ: </div>
                            <span>
                                {numberFormat(data.reduce((sum, booking) => sum + booking?.total, 0))} ກີບ
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: 'space-between', color: 'red' }}>
                            <div>ຍອດທີ່ຄ້າງຍັງບໍ່ຈ່າຍ: </div>
                            <span>
                                {numberFormat((data.reduce((sum, booking) => sum + booking?.total, 0)) - (data.reduce((sum, booking) => sum + booking?.total * booking?.pay_percent / 100, 0)))} ກີບ
                            </span>
                        </div>
                    </div>
                    <hr style={{ border: "1px solid #FFFFFF" }} />
                </>
            </Order>
        </div>
    );
}
);

export default ReportBookingBill;

const Name = styled.div`
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 2fr;
    `;
const Price = styled.div`
      display: flex;
    `;
const Container = styled.div`
      width: 100%;
      padding:0;
      margin:0;
      /* maxwidth: 80mm; */
    `;
const Img = styled.div`
      width: 90px;
      height: 90px;
      font-size: 14px;
    `;
const Order = styled.div`
      display: flex;
      flex-direction: column;
    `;
