import moment from 'moment';
import React from 'react';
import { Button } from 'react-bootstrap';
import { RiFileExcel2Fill } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { dateTimeFormat } from '../../../helpers';

class ExcelExportSale extends React.Component {
  exportToExcel = () => {
    const { data, startDate, endDate } = this.props;
    const filteredData = data.map((item, index) => {
      return {
        id: index + 1,
        drink: item?.d_id,
        buy_price: item?.buy_price,
        sale_price: item?.price,
        qty: item?.qty,
        created_at: dateTimeFormat(item?.created_at)
      }
    })
    const totalOriginPrice = filteredData.reduce((sumPrice, item) => sumPrice + item?.buy_price * item?.qty, 0)
    const totalSalePrice = filteredData.reduce((sumPrice, item) => sumPrice + item?.sale_price * item?.qty, 0)

    const _formatData = filteredData.map(item => Object.values(item));

    const completedData = [
      ['ລາຍງານຍອດຂາຍວັນທີ', moment(startDate).format('DD/MM/YYYY'), 'ຫາ', moment(endDate).format('DD/MM/YYYY')],
      [],
      ['ລໍາດັບ', 'ສິນຄ້າ', 'ລາຄາຕົ້ນທືນ', 'ລາຄາຂາຍ', 'ຈໍານວນ', 'ວັນທີຂາຍ'],
      ..._formatData,
      [],
      ['ຍອດຂາຍທັງຫມົດ: ', totalSalePrice],
      ['ລາຄາຕົ້ນທືນທັງໝົດ: ', totalOriginPrice],
      ['ຍອກກໍາໄລທັງໝົດ: ', totalSalePrice - totalOriginPrice],
    ]

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(completedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'report-sale');

  };

  saveAsExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  render() {
    return (
      <div>
        <Button style={{ backgroundColor: 'green', border: 'none', padding: '8px 20px' }} onClick={this.exportToExcel}><RiFileExcel2Fill style={{fontSize: 18, marginBottom: 2}}/>&ensp;Export to Excel</Button>
      </div>
    );
  }
}

export default ExcelExportSale;
