import { useEffect, useRef, useState } from "react";
import { Table, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import ExcelExportSale from "./ExcelExportSale";
import { useReactToPrint } from "react-to-print";
import { PrintDisabled } from "@mui/icons-material";
import ReportSaleBill from "./ReportSaleBill";
import { ACCESS_TOKEN, API_URI } from "../../../constants";
import { dateTimeFormat, numberFormat } from "../../../helpers";

export default function ReportSale() {
    const [sales, setSales] = useState([])
    const [originSales, setOriginSales] = useState([])
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());

    useEffect(() => {
        fetchSale();
    }, []);

    useEffect(() => {
        if (sales) _filterByDate();
    }, [startDate, endDate, sales])

    const fetchSale = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get(API_URI + 'report_sale_drinks', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setLoading(false)
                setSales(response?.data?.data);
                setOriginSales(response?.data?.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const _filterByDate = () => {
        const filtered = originSales.filter((item) => {
            const itemDate = moment(item.created_at).format('YYYY-MM-DD');
            return itemDate >= moment(startDate).format('YYYY-MM-DD') && itemDate <= moment(endDate).format('YYYY-MM-DD');
        });
        setSales(filtered);
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="main">
            <h4 style={{ color: '#616161' }} className="mt-2">ລາຍງານການຂາຍນໍ້າດື່ມ</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', marginBottom: 10 }}>
                    <Form.Group className="mr-4">
                        <Form.Label>ເລີ່ມວັນທີ</Form.Label>
                        <input
                            style={{ width: 230 }}
                            type="date"
                            name="startDate"
                            className='form-control'
                            value={moment(startDate).format("YYYY-MM-DD")}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>ຫາວັນທີ</Form.Label>
                        <input
                            style={{ width: 230 }}
                            type="date"
                            name="endDate"
                            className='form-control'
                            value={moment(endDate).format("YYYY-MM-DD")}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Form.Group>
                </div>
                <div style={{ display: 'flex', alignItems: 'end', paddingBottom: 10 }}>
                    <ExcelExportSale data={sales} startDate={startDate} endDate={endDate} />
                    <Button onClick={handlePrint} style={{ backgroundColor: '#1565C0', height: 40, border: 'none', color: 'white', marginLeft: 10, padding: '8px 20px' }}><PrintDisabled style={{ fontSize: 20, marginBottom: 2 }} />&ensp;Print</Button>
                </div>
            </div>

            {loading ? <center> <Spinner animation="border" /></center> :
                <Table responsive size='xl' hover style={{
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
                            <th>ຊື່ສິນຄ້າ</th>
                            <th>ລາຄາຕົ້ນທືນ</th>
                            <th>ລາຂາຂາຍ</th>
                            <th>ຈໍານວນ</th>
                            <th>ວັນທີ່ຂາຍ</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            sales?.map((sale, index) => (
                                <tr key={sale + index}>
                                    <td>{index + 1}</td>
                                    <td>{sale?.name} </td>
                                    <td>{numberFormat(sale?.buy_price)} </td>
                                    <td>{numberFormat(sale?.price ?? 0)} </td>
                                    <td> {numberFormat(sale?.qty)}</td>
                                    <td>{dateTimeFormat(sale?.created_at)} </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            }
            <div style={{ display: 'none' }}>
                <ReportSaleBill ref={componentRef} data={sales} startDate={startDate} endDate={endDate} />
            </div>
        </div>
    )
}