import React, { useEffect, useState } from 'react';
import { numberFormat } from '../../helpers';
import { Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ACCESS_TOKEN, API_URI } from '../../constants';
import moment from 'moment';
import ReactApexChart from 'react-apexcharts';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [originBookings, setOriginBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState([]);
  const [bookingCancel, setBookingCancel] = useState([]);
  const [bookingTime, setBookingTime] = useState([]);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});
  const [changeValue, setChangeValue] = useState("week");
  const [dates, setDates] = useState([]);
  const [sales, setSales] = useState([])
  const [originSales, setOriginSales] = useState([])

  useEffect(() => {
    fetchBooking();
    fetchSale();
  }, [])

  useEffect(() => {
    if (originBookings.length <= 0) return
    if (changeValue === "week") {
      var date = [];
      for (var i = 6; i >= 0; i--) {
        date.push(moment().add(-i, "d").format("YYYY-MM-DD"));
      }
      setDates(date);
      return;
    }

    if (changeValue === "month") {
      var numInCurrentMonth = moment().daysInMonth();
      var date = [];
      for (var weekIndex = 0; weekIndex <= 4; weekIndex++) {
        if (numInCurrentMonth < 7 * (weekIndex + 1)) {
          date.push({
            startDate: moment().format("YYYY-MM") + "-29",
            endDate: moment().format("YYYY-MM") + "-" + (numInCurrentMonth).toString()
          });
        } else {
          date.push({
            startDate: moment().format("YYYY-MM") + "-" + (weekIndex * 7 + 1).toString(),
            endDate: moment().format("YYYY-MM") + "-" + ((weekIndex + 1) * 7).toString()
          });
        }
      }
      setDates(date);
      return;
    }

    if (changeValue === "year") {
      var currentYear = moment().format('YYYY')
      var date = [];
      for (var i = 1; i <= 12; i++) {
        date.push(currentYear + "-" + i.toString());
      }
      setDates(date);
      return;
    }
  }, [changeValue, originBookings])

  useEffect(() => {
    // console.log("dates: ", dates)
    if (changeValue === "week") { getWeekBookingTime(); return; }

    if (changeValue === "month") { getMonthBookingTime(); return; }

    if (changeValue === "year") { getYearBookingTime(); return; }
  }, [dates]);

  useEffect(() => {
    getChartData();
  }, [bookingTime]);

  const fetchBooking = () => {
    setLoading(true)
    const token = localStorage.getItem(ACCESS_TOKEN);
    axios.get(API_URI + 'report_bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const _bookings = response?.data?.data;
        setOriginBookings(_bookings);
        setBookings(_bookings.filter(({ status }) => status === 'booking'));
        setBookingSuccess(_bookings.filter(({ status }) => status === 'success'));
        setBookingCancel(_bookings.filter(({ status }) => status === 'cancel'));
        setLoading(false)
      })
      .catch(error => {
        console.error(error);
        setLoading(false)
      });
  }

  const fetchSale = () => {
    setLoading(true)
    const token = localStorage.getItem(ACCESS_TOKEN);
    axios.get(API_URI + 'report_sale_drinks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        // setSales(response?.data?.data);
        setOriginSales(response?.data?.data);
        console.log(response?.data?.data)
        setLoading(false)
      })
      .catch(error => {
        console.error(error);
        setLoading(false)
      });
  }

  const getWeekBookingTime = async () => {
    setBookingTime([]);
    var bookingData = [];
    var saleData = [];
    for (var dayIndex in dates) {
      var weekData = await originBookings.filter(function (date) {
        return (
          moment(dates[dayIndex]).format("YYYY-MM-DD").toString() ==
          moment(date?.created_at).format("YYYY-MM-DD").toString()
        );
      });
      bookingData.push({
        xaxis: moment(dates[dayIndex]).format("dddd"),
        data: weekData.length,
      });

      var weekSaleData = await originSales.filter(function (date) {
        return (
          moment(dates[dayIndex]).format("YYYY-MM-DD").toString() ==
          moment(date?.created_at).format("YYYY-MM-DD").toString()
        );

      });
      saleData = [...saleData, { qty: weekSaleData.reduce((sumQty, currentDrink) => sumQty + currentDrink?.qty, 0), total: weekSaleData.reduce((sumPrice, currentDrink) => sumPrice + currentDrink?.total, 0) }]
    }
    setBookingTime(bookingData);
    console.log({ saleData })
    setSales(saleData)

    let _bookings = originBookings.filter((booking) => {
      return moment(dates[0]).format("YYYY-MM-DD").toString() <= moment(booking?.created_at).format("YYYY-MM-DD").toString()
        && moment(dates[dates.length - 1]).format("YYYY-MM-DD").toString() >= moment(booking?.created_at).format("YYYY-MM-DD").toString()
    })

    setBookings(_bookings.filter(({ status }) => status === 'booking'));
    setBookingSuccess(_bookings.filter(({ status }) => status === 'success'));
    setBookingCancel(_bookings.filter(({ status }) => status === 'cancel'));
  };

  const getMonthBookingTime = async () => {
    setBookingTime([]);
    var bookingData = [];
    var saleData = [];
    // var numInCurrentMonth = moment().daysInMonth();
    for (var weekIndex in dates) {
      var monthData;
      var monthSaleData;

      monthData = await originBookings.filter(function (booking) {
        var date = moment(booking.created_at).format("YYYY-MM-DD");
        return (
          date >= moment(dates[weekIndex].startDate).format("YYYY-MM-DD") &&
          date <= moment(dates[weekIndex].endDate).format("YYYY-MM-DD")
        );
      });

      bookingData.push({
        xaxis: (moment(dates[weekIndex].startDate).format("DD")) + "-" + (moment(dates[weekIndex].endDate).format("DD")) + " " + moment().format('MMM'),
        data: monthData.length,
      });

      monthSaleData = await originSales.filter(function (booking) {
        var date = moment(booking.created_at).format("YYYY-MM-DD");
        return (
          date >= moment(dates[weekIndex].startDate).format("YYYY-MM-DD") &&
          date <= moment(dates[weekIndex].endDate).format("YYYY-MM-DD")
        );
      });
      saleData = [...saleData, { qty: monthSaleData.reduce((sumQty, currentDrink) => sumQty + currentDrink?.qty, 0), total: monthSaleData.reduce((sumPrice, currentDrink) => sumPrice + currentDrink?.total, 0) }]
    }
    setBookingTime(bookingData);
    setSales(saleData);

    console.log(dates[0]?.startDate + "," + dates[dates.length - 1]?.endDate)
    let _bookings = originBookings.filter((booking) => {
      return moment(dates[0]?.startDate).format("YYYY-MM-DD").toString() <= moment(booking?.created_at).format("YYYY-MM-DD").toString()
        && moment(dates[dates.length - 1].endDate)?.format("YYYY-MM-DD").toString() >= moment(booking?.created_at).format("YYYY-MM-DD").toString()
    })

    setBookings(_bookings.filter(({ status }) => status === 'booking'));
    setBookingSuccess(_bookings.filter(({ status }) => status === 'success'));
    setBookingCancel(_bookings.filter(({ status }) => status === 'cancel'));
  };

  const getYearBookingTime = async () => {
    setBookingTime([]);
    var bookingData = [];
    var saleData = [];
    for (var dayIndex in dates) {
      var yearData = await originBookings.filter(function (date) {
        return (
          moment(dates[dayIndex]).format("YYYY-MM").toString() ==
          moment(date?.created_at).format("YYYY-MM").toString()
        );
      });
      bookingData.push({
        xaxis: moment(dates[dayIndex]).format("MMMM"),
        data: yearData.length,
      });

      var yearSaleData = await originSales.filter(function (date) {
        return (
          moment(dates[dayIndex]).format("YYYY-MM").toString() ==
          moment(date?.created_at).format("YYYY-MM").toString()
        );
      });
      saleData = [...saleData, { qty: yearSaleData.reduce((sumQty, currentDrink) => sumQty + currentDrink?.qty, 0), total: yearSaleData.reduce((sumPrice, currentDrink) => sumPrice + currentDrink?.total, 0) }]


    }
    setBookingTime(bookingData);
    setSales(saleData)

    let _bookings = originBookings.filter((booking) => {
      return moment(dates[0]).format("YYYY-MM-DD").toString() <= moment(booking?.created_at).format("YYYY-MM-DD").toString()
        && moment(dates[dates.length - 1]).format("YYYY-MM-DD").toString() >= moment(booking?.created_at).format("YYYY-MM-DD").toString()
    })

    setBookings(_bookings.filter(({ status }) => status === 'booking'));
    setBookingSuccess(_bookings.filter(({ status }) => status === 'success'));
    setBookingCancel(_bookings.filter(({ status }) => status === 'cancel'));
  };

  const getChartData = () => {
    setOptions({
      chart: {
        fontFamily: "FontLao2",
        id: "",
        toolbar: {
          show: false,
        },
        fill: {
          colors: ["#FFA41B"],
        },
      },
      xaxis: {
        categories: bookingTime.map((day) => {
          return day.xaxis;
        }), //will be displayed on the x-asis
      },

    });
    setSeries([
      {

        name: "ຈຳນວນມື້ນີ້", //will be displayed on the y-axis
        data: bookingTime.map((day) => {
          return day.data;
        }),

      },
    ]);
  };


  return (
    <div className='main'>
      <h3 className='mt-2 mb-4' style={{ fontSize: '24px', fontWeight: 'bold', color: '#616161' }}>ສະຖິຕິການຈອງເດີ່ນບານ</h3>
      <Form.Select className='ml-2 col-6 mb-2'
        onChange={(e) => {
          setChangeValue(e.target.value);
        }}
      >
        <option value="week">ລາຍການຈອງປະຈໍາອາທິດ</option>
        <option value="month">ລາຍການຈອງປະຈໍາເດືອນ</option>
        <option value="year">ລາຍການຈອງປະຈໍາປີ</option>

      </Form.Select>
      <div style={{ display: 'flex' }}>
        <div className='container-home' style={{ background: "linear-gradient(to bottom, yellow, #0000ff)", color: 'white', borderRadius: '5px' }}>
          <h4>ລາຍການຈອງເຂົ້າ</h4>
          <h6>{loading ? <Spinner animation='border' size='sm' className='mb-1' /> : numberFormat(bookings?.length)} ລາຍການ</h6>
          <h5>{loading ? <Spinner animation='border' size='sm' className='mb-2' /> : numberFormat(bookings?.reduce((sumPrice, booking) => sumPrice + (booking?.total * booking?.pay_percent / 100), 0))} ກີບ</h5>
        </div>
        <div className='container-home' style={{ background: "linear-gradient(to bottom, green, #0000ff)", color: 'white', borderRadius: '5px' }}>
          <h4>ລາຍການຈອງສໍາເລັດ</h4>
          <h6>{loading ? <Spinner animation='border' size='sm' className='mb-1' /> : numberFormat(bookingSuccess?.length)} ລາຍການ</h6>
          <h5>{loading ? <Spinner animation='border' size='sm' className='mb-2' /> : numberFormat(bookingSuccess?.reduce((sumPrice, booking) => sumPrice + (booking?.total * booking?.pay_percent / 100), 0))} ກີບ</h5>
        </div>
        <div className='container-home' style={{ background: "linear-gradient(to bottom, #ff0000, #0000ff)", color: 'white', borderRadius: '5px' }}>
          <h4>ລາຍການຈອງຖືກຍົກເລີກ</h4>
          <h6>{loading ? <Spinner animation='border' size='sm' className='mb-1' /> : numberFormat(bookingCancel?.length)} ລາຍການ</h6>
          <h5>{loading ? <Spinner animation='border' size='sm' className='mb-2' /> : numberFormat(bookingCancel?.reduce((sumPrice, booking) => sumPrice + (booking?.total * booking?.pay_percent / 100), 0))} ກີບ</h5>
        </div>
        <div className='container-home' style={{ background: "linear-gradient(to bottom, black, #0000ff)", color: 'white', borderRadius: '5px' }}>
          <h4>ລາຍງານຍອດຂາຍເຄື່ອງດື່ມ</h4>
          <h6>{loading ? <Spinner animation='border' size='sm' className='mb-1' /> : numberFormat(sales.reduce((sumQty, curentDrink) => sumQty + curentDrink?.qty, 0))} ຍອດຂາຍ</h6>
          <h5>{loading ? <Spinner animation='border' size='sm' className='mb-2' /> : numberFormat(sales?.reduce((sumPrice, curentDrink) => sumPrice + curentDrink?.total, 0))} ກີບ</h5>
        </div>
      </div>
      <ReactApexChart
        options={options}
        type="bar"
        series={series}
        width="100%"
        height="450px"
      />
    </div>
  );
};

export default HomePage;
