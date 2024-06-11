import { NavLink } from "react-router-dom";
import { FaHome, FaSalesforce, FaUser } from "react-icons/fa";
import Logout from '@mui/icons-material/Logout';
import { GrLogout } from "react-icons/gr";
import Times from '@mui/icons-material/WatchLater'
import { MdLibraryBooks } from "react-icons/md";
import { LocalDrinkTwoTone, Person2Sharp, Report, Stadium } from "@mui/icons-material";
import { USER_DATA } from "../constants";
import { ceil } from "lodash";

const Sidebar = () => {
  const userInfo = JSON.parse(localStorage.getItem(USER_DATA))
  const sidebarData = [
    { path: '/home', name: 'ຫນ້າຫຼັກ', icon: <FaHome /> },
    { path: '/booking', name: 'ຈັດການລາຍການຈອງ', icon: <FaUser /> },
    // { path: '/user', name: 'ຈັດການພະນັກງານ', icon: <MdLibraryBooks /> },
    // { path: '/time', name: 'ຈັດການເວລາຈອງ', icon: <Times /> },
    // { path: '/stadium', name: 'ຈັດການເດີ່ນບານ', icon: <Stadium /> },
    // { path: '/drink', name: 'ຈັດການເຄື່ອງດື່ມ', icon: <LocalDrinkTwoTone /> },
    { path: '/sale', name: 'ຂາຍເຄື່ອງດື່ມ', icon: <FaSalesforce /> },
  ];


  const _logout = () => {
    localStorage.clear();
  }

  return (
    <nav className="sidebar">
      <ul className="sidebar-nav">
        <div style={{ margin: '10px 2px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="assets/images/logo-employee.png" style={{ width: 100, height: 100 }} />
          <h4>{userInfo?.fullname}</h4>
        </div>
        {/* {
          sidebarData?.map(({ path, name, icon }) => {
            if (userInfo?.role !== 'admin' & (path === "/home" || path === "/user")) return
            return <li className="sidebar-item">
              <NavLink style={{ padding: 10 }} to={path} exact>
                {icon}
                <span className="sidebar-text">{name}</span>
              </NavLink>
            </li>
          })
        } */}
        {(userInfo?.role === 'admin') && <li className="sidebar-item">
          <NavLink style={{ padding: 10 }} to={'/home'} exact>
            <FaHome />
            <span className="sidebar-text">ຫນ້າຫຼັກ</span>
          </NavLink>
        </li>}
        <li class="nav-item subnav sidebar-item">
          <NavLink style={{ padding: 10 }} to={'/user'} exact>
            <Report />
            <span className="sidebar-text">ຈັດການຂໍ້ມູນພື້ນຖານ</span>
          </NavLink>
          <ul className="sub-nav">
            {(userInfo?.role === 'admin') && <NavLink style={{ padding: 10 }} to={'/user'} exact>
              <div className="ml-4">
                <MdLibraryBooks />
                <span className="sidebar-text">ຈັດການພະນັກງານ</span>
              </div>
            </NavLink>}
            <NavLink style={{ padding: 10 }} to={'/time'} exact>
              <div className="ml-4">
                <Times />
                <span className="sidebar-text">ຈັດການເວລາຈອງ</span>
              </div>
            </NavLink>
            <NavLink style={{ padding: 10 }} to={'/stadium'} exact>
              <div className="ml-4">
                <Stadium />
                <span className="sidebar-text">ຈັດການເດີ່ນບານ</span>
              </div>
            </NavLink>
            <NavLink style={{ padding: 10 }} to={'/drink'} exact>
              <div className="ml-4">
                <LocalDrinkTwoTone />
                <span className="sidebar-text">ຈັດການເຄື່ອງດື່ມ</span>
              </div>
            </NavLink>

          </ul>
        </li>
        <li className="sidebar-item">
          <NavLink style={{ padding: 10 }} to={'/booking'} exact>
            <FaUser />
            <span className="sidebar-text">ກວດສອບລາຍການຈອງ</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink style={{ padding: 10 }} to={'/sale'} exact>
            <FaSalesforce />
            <span className="sidebar-text">ຂາຍເຄື່ອງດື່ມ</span>
          </NavLink>
        </li>
        <li class="nav-item subnav sidebar-item">
          <NavLink style={{ padding: 10 }} to={'/report/sale'} exact>
            <Report />
            <span className="sidebar-text">ລາຍງານ</span>
          </NavLink>
          <ul className="sub-nav">
            <NavLink style={{ padding: 10 }} to={'/report/sale'} exact>
              <span className="sidebar-text ml-4">ລາຍງານການຂາຍເຄື່ອງດື່ມ</span>
            </NavLink>
            <NavLink style={{ padding: 10 }} to={'/report/good-drink'} exact>
              <span className="sidebar-text ml-4">ລາຍງງານເຄື່ອງດື່ມຂາຍດີ</span>
            </NavLink>
            <NavLink style={{ padding: 10 }} to={'/report/drink'} exact>
              <span className="sidebar-text ml-4">ລາຍງງານເຄື່ອງດື່ມໃກ້ຈະຫມົດ</span>
            </NavLink>

          </ul>
        </li>
      </ul>
      <ul className="sidebar-nav">
        <li className="logout-item" style={{ backgroundColor: '#eee' }}>
          <NavLink to="/login" onClick={_logout} exact style={{ color: 'red', fontSize: 20, justifyContent: "center" }}>
            <Logout />&ensp;ອອກຈາກລະບົບ
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
