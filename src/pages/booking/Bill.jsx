import React from "react";
import styled from "styled-components";
import { numberFormat } from "../../helpers";
import { USER_DATA } from "../../constants";
import moment from "moment";
// import logos from '../../../src/assets/images/logos.png'
import { Table } from "react-bootstrap";

const Bill = React.forwardRef((props, ref) => {
    console.log({ props })
    const { billData } = props
    const userData = JSON.parse(localStorage.getItem(USER_DATA));
    return (
        <div ref={ref} style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <div style={{ width: '100vw' }}>
                <div style={{ textAlign: "center" }}>
                    <img style={{ width: 150 }} src={'../assets/images/logoicon.png'} />
                </div>

                <div style={{ textAlign: "center", marginTop: 10 }}>
                    <b style={{ fontSize: "50px" }}>ໃບບິນຮັບເງິນ</b>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <div>
                        <div div style={{ textAlign: "left", fontSize: "35px" }}>ເດີ່ນບານ KM9</div>
                        <div style={{ textAlign: "left", fontSize: "35px" }}>ເບີໂທ: 020 2882 0000</div>
                        <div style={{ textAlign: "left", fontSize: "35px" }}>ເລກທີບິນ : 00{billData?.id} </div>
                        <div style={{ textAlign: "left", fontSize: "35px" }}>ຈັດການໂດຍ : {userData?.fullname} </div>
                    </div>
                    <div>
                        <div style={{ textAlign: "left", fontSize: "35px" }}>ເວລາ:  {billData?.price[0]?.time}</div>
                        <div style={{ textAlign: "left", fontSize: "35px" }}>ຊື່ລູກຄ້າ: {billData?.customer?.fullname} </div>
                        <div style={{ textAlign: "left", fontSize: "35px" }}>ເບີໂທລູກຄ້າ: {billData?.customer?.phone} </div>
                        <div style={{ textAlign: "left", fontSize: "35px" }}>ວັນທີ : {moment().format('DD/MM/YYYY')}</div>
                    </div>
                </div>
                <Table size='xl'>
                    <thead>
                        <th><tr style={{ borderBottom: 'none', fontSize: "35px" }}>ລຳດັບ</tr></th>
                        <th><tr style={{ borderBottom: 'none', fontSize: "35px" }}>ເດີ່ນບານ</tr></th>
                        <th><tr style={{ borderBottom: 'none', fontSize: "35px" }}>ລາຄາເດີ່ນ</tr></th>
                        <th><tr style={{ borderBottom: 'none', fontSize: "35px" }}>ລາຄາຈ່າຍກ່ອນ</tr></th>
                        <th><tr style={{ borderBottom: 'none', fontSize: "35px" }}>ລາຄາຕ້ອງຈ່າຍ</tr></th>
                    </thead>
                    <tbody>
                        <td><tr style={{ borderBottom: 'none', fontSize: "30px" }}>1</tr></td>
                        <td><tr style={{ borderBottom: 'none', fontSize: "30px" }}>{billData?.price[0]?.number}</tr></td>
                        <td><tr style={{ borderBottom: 'none', fontSize: "30px" }}>{numberFormat(billData?.price[0]?.price ?? 0)}</tr></td>
                        <td><tr style={{ borderBottom: 'none', fontSize: "30px" }}>{numberFormat((billData?.price[0]?.price ?? 0) * (billData?.pay_before_percent) / 100)}</tr></td>
                        <td><tr style={{ borderBottom: 'none', fontSize: "30px" }}>{numberFormat((billData?.price[0]?.price ?? 0) * (100 - billData?.pay_before_percent) / 100)}</tr></td>
                    </tbody>
                </Table>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "40px" }}>
                    {/* <img alt="" src={onepay} /> */}
                    <img style={{ width: 400 }} alt="" src="../assets/images/onepay.jpg" />
                    <div>
                        <h3>131-12-00-01497362-001</h3>
                    </div>
                </div>
                <hr style={{ border: "1px solid #FFFFFF" }} />
            </div>
        </div >

    );
}
);

export default Bill;

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
