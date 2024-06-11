import moment from 'moment';
import React from 'react';
import { Button } from 'react-bootstrap';
import { RiFileExcel2Fill } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { dateTimeFormat } from '../../helpers';

class ExcelExport extends React.Component {
  exportToExcel = () => {
    const { data, startDate, endDate } = this.props;
    const filteredData = data.map((item, index) => {
      return {
        id: index + 1,
        customer: item?.customer?.fullname,
        phone: item?.customer?.phone,
        number: item?.price[0]?.number,
        time: moment(item?.date_booking).format('DD/MM/YYYY') + ' : ' + item?.price[0]?.time,
        total: item?.total,
        paid: item?.total * item?.pay_percent / 100,
        created_at: dateTimeFormat(item?.created_at)
      }
    })
    const totalPrice = filteredData.reduce((sumPrice, item) => sumPrice + item?.total, 0)
    const totalPricePaid = filteredData.reduce((sumPrice, item) => sumPrice + item?.paid, 0)

    const _formatData = filteredData.map(item => Object.values(item));

    const completedData = [
      ['ລາຍງານຍອດຂາຍວັນທີ', moment(startDate).format('DD/MM/YYYY'), 'ຫາ', moment(endDate).format('DD/MM/YYYY')],
      [],
      ['ລໍາດັບ', 'ລູກຄ້າ', 'ເບີໂທ', 'ແລກເດີ່ນ', 'ເວລາເຂົ້າບໍລິການ', 'ຈໍານວນເງິນທັງໝົດ', 'ຈໍານວນເງິນທີ່ຈ່າຍ', 'ວັນທີ່ຈອງ'],
      ..._formatData,
      [],
      ['ລວມເງິນທັງໝົດ: ', totalPrice],
      ['ຈໍານວນເງິນທີ່ຍັງບໍ່ທັນຈ່າຍ: ', totalPrice - totalPricePaid]
    ]

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(completedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'data');

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
        <Button style={{ backgroundColor: 'green', whiteSpace: 'nowrap', border: 'none', padding: '8px 20px' }} onClick={this.exportToExcel}><RiFileExcel2Fill style={{fontSize: 18, marginBottom: 2}}/>&ensp;Export to Excel</Button>
      </div>
    );
  }
}

export default ExcelExport;
