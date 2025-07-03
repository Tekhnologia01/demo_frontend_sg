import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import UploadBoard from "../components/UploadBoard";
// import { memo } from "react";

const Layout = () => {
    const headerHeight = "60px";

    return (
        <div className="h-screen">
            <Header headerHeight={headerHeight} />
            <main
                className="flex-1 overflow-auto"
                style={{ height: `calc(100vh - ${headerHeight})` }}
            >
                <Outlet />
            </main>
            <UploadBoard />
        </div>
    );
};

export default Layout;