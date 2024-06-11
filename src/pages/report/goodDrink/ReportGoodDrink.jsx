import { useEffect, useRef, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import _ from 'lodash';
import { useReactToPrint } from "react-to-print";
import { PrintDisabled } from "@mui/icons-material";
import { ACCESS_TOKEN, API_URI } from "../../../constants";
import { numberFormat } from "../../../helpers";
import ExcelExportGoodDrink from "./ExcelExportGoodDrink";
import ReportGoodDrinkBill from "./ReportGoodDrinkBill";

export default function ReportGoodDrink() {
    const [goodDrinks, setGoodDrinks] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSale();
    }, []);

    const fetchSale = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get(API_URI + 'report_sale_drinks', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                let groupedData = _.groupBy(response?.data?.data, 'd_id');
                groupedData = Object.values(groupedData);
                const updateData = groupedData.map((item) => {
                    return {
                        name: item[0]?.name,
                        qty: item?.reduce((sum, sale) => sum + sale?.qty, 0)
                    }
                })
                updateData.sort((a, b) => b?.qty - a?.qty);
                setLoading(false)
                setGoodDrinks(updateData);
            })
            .catch(error => {
                console.error('error=;;;::', error);
            });
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="main">
            <h4 style={{color: '#616161'}} className="mt-2 mb-4">ລາຍງານເຄື່ອງດື່ມຂາຍດີ</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <ExcelExportGoodDrink data={goodDrinks}/>
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
                            <th>ຈໍານວນ</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            goodDrinks?.map((drink, index) => (
                                <tr key={drink + index}>
                                    <td style={{ paddingTop: '1rem' }}>{index + 1}</td>
                                    <td style={{ paddingTop: '1rem' }}>{drink?.name} </td>
                                    <td style={{ paddingTop: '1rem' }}>{numberFormat(drink?.qty ?? 0)} </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            }
            <div style={{ display: 'none' }}>
                <ReportGoodDrinkBill ref={componentRef} data={goodDrinks} />
            </div>
        </div>
    )
}