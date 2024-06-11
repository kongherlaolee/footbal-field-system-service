import React from "react";
import styled from "styled-components";
import moment from "moment";
import { IMAGE_URL, USER_DATA } from "../../../constants";
import { Table } from "react-bootstrap";
import { dateTimeFormat, numberFormat } from "../../../helpers";
import logo from '../../../assets/images/logo.jpg'

const ReportSaleBill = React.forwardRef((props, ref) => {
    const { data, startDate, endDate } = props
    const userData = JSON.parse(localStorage.getItem(USER_DATA));
    return (
        <div ref={ref} style={{ width: '100vw', height: '100vh', justifyContent: 'center', padding: '50px' }}>
            <div style={{ textAlign: "center" }}>
                    <img style={{width:100}} src={'../assets/images/logoicon.png'} />
                </div>
            <div style={{ textAlign: "center" }}>
                <b style={{ fontSize: "25px" }}>ລາຍງານການຂາຍ</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <div div style={{ textAlign: "left", fontSize:"20px" }}>ເດີ່ນບານ KM9</div>
                    <div div style={{ textAlign: "left", fontSize:"20px" }}>ລາຍງານຍອດຂາຍວັນທີ: {moment(startDate).format('DD/MM/YYYY')} - {moment(endDate).format('DD/MM/YYYY')}</div>
                </div>
                <div>
                    <div style={{ textAlign: "left", fontSize:"20px" }}>ລາຍງານໂດຍ : {userData?.fullname} </div>
                    <div style={{ textAlign: "right", fontSize:"20px" }}>ວັນທີ : {moment().format('DD/MM/YYYY')}</div>
                </div>
            </div>
            <div style={{ textAlign: "left", marginTop: '10px' }}>
                <h4>ລາຍການຂາຍ</h4>
            </div>
            <Order>
                <>
                    {
                        data?.length > 0 && <Table >
                            <thead style={{ backgroundColor: 'green' }}>
                                <tr>
                                    <th>ລໍາດັບ</th>
                                    <th>ສິນຄ້າ</th>
                                    <th>ລາຄາຕົ້ນທືນ</th>
                                    <th>ລາຄາຂາຍ</th>
                                    <th>ຈໍານວນ</th>
                                    <th>ວັນທີ່ຂາຍ</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    data?.map((sale, index) => (
                                        <tr key={sale + index}>
                                            <td>{index + 1}</td>
                                            <td>{sale?.name} </td>
                                            <td>{numberFormat(sale?.buy_price)} ກີບ</td>
                                            <td>{numberFormat(sale?.price)} ກີບ</td>
                                            <td>{numberFormat(sale?.qty ?? 0)} </td>
                                            <td>{dateTimeFormat(sale?.created_at)} </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    }

                    <div style={{ display: "flex", flexDirection: 'column', fontSize: 20, fontWeight: 'bold' }}>
                        <div style={{ display: "flex", justifyContent: 'space-between', color: 'red' }}>
                            <div>ຍອດຂາຍທັງຫມົດ: </div>
                            <span>
                                {numberFormat((data.reduce((sum, sale) => sum + sale?.price * sale?.qty, 0)))} ກີບ
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: 'space-between', color: '#616161' }}>
                            <div>ລາຄາຕົ້ນທືນທັງໝົດ: </div>
                            <span>
                                {numberFormat(data.reduce((sum, sale) => sum + sale?.buy_price * sale?.qty, 0))} ກີບ
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: 'space-between', color: 'green' }}>
                            <div>ຍອກກໍາໄລທັງໝົດ: </div>
                            <span>
                                {numberFormat(data.reduce((sum, sale) => sum + sale?.price * sale?.qty, 0) - data.reduce((sum, sale) => sum + sale?.buy_price * sale?.qty, 0))} ກີບ
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

export default ReportSaleBill;

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
