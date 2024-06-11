import { useEffect, useRef, useState } from "react";
import { Table, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import ExcelExportdrink from "./ExcelExportDrink";
import { useReactToPrint } from "react-to-print";
import { PrintDisabled } from "@mui/icons-material";
import ReportDrinkBill from "./ReportDrinkBill";
import { ACCESS_TOKEN, API_URI } from "../../../constants";
import { dateTimeFormat, numberFormat } from "../../../helpers";

export default function ReportDrink() {
    const [drinks, setDrinks] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchdrink();
    }, []);

    const fetchdrink = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get(API_URI + 'get_drink', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setLoading(false)
                const _newDrinks = response?.data?.data;
                _newDrinks.sort((a, b) => a.qty - b.qty);
                setDrinks(_newDrinks);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="main">
            <h4 style={{ color: '#616161' }} className="mt-2 mb-4">ລາຍງານເຄື່ອງດື່ມໃກ້ຈະຫມົດ</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <ExcelExportdrink data={drinks} />
                    <Button onClick={handlePrint} style={{ backgroundColor: '#1565C0', height: 40, border: 'none', color: 'white', marginLeft: 10, padding: '8px 20px' }}><PrintDisabled style={{ fontSize: 20, marginBottom: 2 }} />&ensp;Print</Button>
                </div>
            </div>

            {loading ? <center> <Spinner animation="border" /></center> :
                <Table responsive size='xl' hover style={{
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
                            <th>ລໍາດັບ</th>
                            <th>ສິນຄ້າ</th>
                            <th>ລາຂາຂາຍ</th>
                            <th>ຈໍານວນ</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            drinks?.map((drink, index) => (
                                <tr key={drink + index}>
                                    <td style={{ paddingTop: '1rem' }}>{index + 1}</td>
                                    <td style={{ paddingTop: '1rem' }}>{drink?.name} </td>
                                    <td style={{ paddingTop: '1rem' }}>{numberFormat(drink?.sale_price ?? 0)} </td>
                                    <td style={{ paddingTop: '1rem' }}> {numberFormat(drink?.qty)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            }
            <div style={{ display: 'none' }}>
                <ReportDrinkBill ref={componentRef} data={drinks} />
            </div>
        </div>
    )
}