import moment from "moment";

export const useAuth = () => {
  const userData = localStorage.getItem(USER_KEY2)
  // const isAuthenticated = !_.isEmpty(userData)
  return userData ? true : false;
}

export const numberFormat = (number) => {
  var usFormat = number.toLocaleString('en-US');
  return usFormat;
}

export const dateTimeFormat = (dateTime) => {
  return moment(dateTime).format('DD/MM/YYYY HH:mm')
}

export const convertedRole = (role) => {
  switch (role) {
    case 'admin': return 'ຜູ້ບໍລິຫານ'
    case 'employee': return 'ພະນັກງານ'
    default: return 'ຜູ້ບໍລິຫານ'
  }
}

export const convertedBookingStatus = (role) => {
  switch (role) {
    case 'booking': return 'ລໍຖ້າຢືນຢັນ'
    case 'success': return 'ສໍາເລັດ'
    case 'cancel': return 'ຍົກເລີກ'
    default: return 'ລໍຖ້າ'
  }
}

export const bookingStatusColor = (role) => {
  switch (role) {
    case 'booking': return 'rgb(100, 111, 17)'
    case 'success': return 'green'
    case 'cancel': return 'red'
    default: return 'rgb(100, 111, 17)'
  }
}