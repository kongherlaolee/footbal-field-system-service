import React from "react";
import styled from "styled-components";
import { numberFormat } from "../../helpers";
import { USER_DATA } from "../../constants";
import moment from "moment";
// import logos from '../../../src/assets/images/onepay.jpg'

const Bill = React.forwardRef((props, ref) => {
    const { billData, customer, sumPrice, change, receiveMoney } = props
    const userData = JSON.parse(localStorage.getItem(USER_DATA));
    return (
        <div ref={ref} style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '100vw' }}>
                <div style={{ textAlign: "center" }}>
                    <img style={{width:150}} src={'../assets/images/logoicon.png'} />
                </div>
                <div style={{ textAlign: "center"}}>
                    <b style={{ fontSize: "40px" }}>ບິນເກັບເງິນ</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <div div style={{ textAlign: "left", fontSize: "30px" }}>ເດີ່ນບານ KM9</div>
                        <div style={{ textAlign: "left", fontSize: "30px" }}>ເບີໂທ: 020 2882 0000</div>
                        <div style={{ textAlign: "left", fontSize: "30px" }}>ເລກທີບິນ : 0001 </div>
                    </div>
                    <div>
                        <div style={{ textAlign: "left", fontSize: "30px" }}>ພະນັກງານຂາຍ : {userData?.fullname} </div>
                        <div style={{ textAlign: "left", fontSize: "30px" }}>ຊຶ່ລູກຄ້າ: {customer} </div>
                        <div style={{ textAlign: "left", fontSize: "30px" }}>ວັນທີ : {moment().format('DD/MM/YYYY')}</div>
                    </div>
                </div>
                <div style={{ textAlign: "left", marginTop: '20px', fontSize: 35, marginBottom: 20 }}>
                    <h4 style={{ fontSize: 35 }}>ລາຍການເຄື່ອງດື່ມ</h4>
                </div>
                <Order>
                    <>
                        {
                            billData?.map((order, index) => (
                                <div
                                    style={{
                                        fontSize: 1,
                                    }}
                                    key={index}
                                >
                                    <div style={{ textAlign: "left", display: "flex", fontSize: "30px" }}>
                                        <div style={{ fontWeight: "bold", width: "10px", display: "flex", justifyContent: "flex-end", marginRight: "5px", marginLeft: '10px' }}> {index + 1} </div>
                                        <div> {order?.name}</div>
                                    </div>
                                    <div style={{ textAlign: "left", paddingLeft: "15px", display: "flex", justifyContent: "space-between", fontSize: "30px" }}>
                                        <div> {numberFormat(order?.sale_price ?? 0) + ' X ' + numberFormat(order?.sale_qty)} </div>
                                        <div style={{ fontWeight: 'bold' }}>{numberFormat(order?.sale_price * order?.sale_qty) + ' ກີບ'}</div>
                                    </div>
                                </div>
                            ))
                        }

                        <hr style={{ border: "1px solid #000" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "35px" }}>
                            <div>ຍອດລວມ :</div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span>
                                    {numberFormat(sumPrice ?? 0)} ກີບ
                                </span>
                            </div>

                        </div>

                        <hr style={{ border: "1px solid #000" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "35px" }}>
                            <span> <b style={{ fontSize: "35px" }}>ຮັບຈໍານວນເງິນ :</b></span>
                            <b style={{ fontSize: "35px" }}> {numberFormat(receiveMoney ?? 0)} ກີບ</b>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "35px" }}>
                            <span> <b style={{ fontSize: "35px" }}>ເງິນທອນ :</b></span>
                            <b style={{ fontSize: "35px" }}> {numberFormat(change ?? 0)} ກີບ</b>
                        </div>
                        {/* <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "40px" }}> */}
                            {/* <img alt="" src={onepay} /> */}
                            {/* <img style={{width: 400}} alt="" src="../assets/images/onepay.jpg" />
                            <div>
                                <h3>131-12-00-01497362-001</h3>
                            </div>
                        </div>
                        <hr style={{ border: "1px solid #FFFFFF" }} /> */}
                    </>
                </Order>
            </div>
        </div>
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
