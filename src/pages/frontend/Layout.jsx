import FrontendNavbar from "./FrontendNavbar"

const Layout = ({ children }) => {
    return (
        <div style={{ overflow: 'hidden', height: '100vh', width: '100vw' }}>
            <FrontendNavbar />
            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 0px)' }}>
                {children}
            </div>
        </div>

    )
}

export default Layout