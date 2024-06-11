import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { CUSTOMER_TOKEN, CUSTOMER_DATA } from '../../constants';
import { useNavigate } from 'react-router-dom';
// import { FaUser } from 'react-icons/fa';
// import { IconName } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineHistory } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
function FrontendNavbar() {
  const user = JSON.parse(localStorage.getItem(CUSTOMER_DATA));
  const navigate = useNavigate();
  const _logout = () => {
    localStorage.clear();
    navigate('/customer_auth')
  }
  const handleLogin = () => {
    navigate('/customer_auth')
  }
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style={{ backgroundColor: 'green' }}>
      <Container>
        <Navbar.Brand href="/" > <img src="assets/images/logoicon.png" style={{ width: '30px' }} />&ensp;Lak9 Soccer</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav >
            <Nav.Link href="/" style={{ fontSize: 18 }}>ໜ້າຫຼັກ</Nav.Link>
            <Nav>
            </Nav>
            {/* {
              localStorage.getItem(CUSTOMER_TOKEN) && (
                <Nav.Link href="/customer_history" style={{ fontSize: 18 }}>ປະຫວັດຈອງເດີ່ນ</Nav.Link>
                // <Nav.Link href="/reserve_yard" style={{ fontSize: 18 }}>ປະຫວັດຈອງເດີ່ນ</Nav.Link>
              )
            } */}
          </Nav>
          <Nav style={{ cursor: "pointer" }}>
            <Nav.Link href="/reserve_yard" style={{ fontSize: 18 }}>ຈອງເດີ່ນ</Nav.Link>
          </Nav>
          <Nav style={{ cursor: "pointer" }}>
            <Nav.Link href="/contact" style={{ fontSize: 18 }}>ຕິດຕໍ່ພວກເຮົາ</Nav.Link>
          </Nav>
          {
            localStorage.getItem(CUSTOMER_TOKEN) ?
              (<Nav>
                <NavDropdown style={{fontSize:18}} title={user?.fullname} id="collasible-nav-dropdown p-4">
                  <NavDropdown.Item href="/customer_profile" style={{ fontSize: 18 }}>
                    <MdAccountCircle style={{ fontSize: 20, marginBottom: 2, color: "blue" }} />&ensp;ຂໍ້ມູນສ່ວນຕົວ
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/customer_history" style={{ fontSize: 18 }}>
                    <AiOutlineHistory style={{ fontSize: 20, marginBottom: 2, color: "orange" }} />&ensp;ປະຫວັດຈອງເດີ່ນ
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="" onClick={_logout} style={{ fontSize: 18, color: "red" }}>
                    <BiLogOut style={{ fontSize: 20, marginBottom: 2 }} />&ensp;ອອກຈາກລະບົບ
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>) : (<button onClick={handleLogin} style={{ width: '120px', height: '40px', borderRadius: '30px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontSize: 18 }}>ເຂົ້າລະບົບ</button>)
          }

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default FrontendNavbar;