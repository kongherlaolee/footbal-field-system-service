import React from "react";
import styled from "styled-components";
import moment from "moment";
import { IMAGE_URL, USER_DATA } from "../../../constants";
import { Table } from "react-bootstrap";
import { dateTimeFormat, numberFormat } from "../../../helpers";
import logo from '../../../assets/images/logo.jpg'

const ReportDrinkBill = React.forwardRef((props, ref) => {
    const { data } = props
    const userData = JSON.parse(localStorage.getItem(USER_DATA));
    return (
        <div ref={ref} style={{ width: '100vw', height: '100vh', justifyContent: 'center', padding: '50px' }}>
            <div style={{ textAlign: "center" }}>
                    <img style={{width:100}} src={'../assets/images/logoicon.png'} />
                </div>
            <div style={{ textAlign: "center", marginTop: 10 }}>
                <b style={{ fontSize: "25px" }}>ລາຍງານເຄື່ອງດື່ມໃກ້ຈະຫມົດ</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <div div style={{ textAlign: "left", fontSize:"20px" }}>ເດີ່ນບານ KM9</div>
                </div>
                <div>
                    <div style={{ textAlign: "left", fontSize:"20px" }}>ລາຍງານໂດຍ : {userData?.fullname} </div>
                    <div style={{ textAlign: "right", fontSize:"20px" }}>ວັນທີ : {moment().format('DD/MM/YYYY')}</div>
                </div>
            </div>
            <div style={{ textAlign: "left" }}>
                <h4>ລາຍການເຄື່ອງດື່ມ</h4>
            </div>
            <Order>
                <>
                    {
                        data?.length > 0 && <Table >
                            <thead style={{ backgroundColor: 'green' }}>
                                <tr>
                                    <th>ລໍາດັບ</th>
                                    <th>ສິນຄ້າ</th>
                                    <th>ລາຄາຂາຍ</th>
                                    <th>ຈໍານວນ</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    data?.map((sale, index) => (
                                        <tr key={sale + index}>
                                            <td style={{ paddingTop: '1rem' }}>{index + 1}</td>
                                            <td style={{ paddingTop: '1rem' }}>{sale?.name} </td>
                                            <td style={{ paddingTop: '1rem' }}>{numberFormat(sale?.sale_price)} ກີບ</td>
                                            <td style={{ paddingTop: '1rem' }}>{numberFormat(sale?.qty ?? 0)} </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    }
                </>
            </Order>
        </div>
    );
}
);

export default ReportDrinkBill;

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
