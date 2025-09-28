import { Menu } from "antd";
import { AppstoreOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { FaBuildingFlag } from "react-icons/fa6";
import { signOutAdmin } from "../api/api";

const Sidebar = ({ onClick }) => {
  const location = useLocation();

  const navigate = useNavigate();
  const handleSignOut = () => {
    signOutAdmin();
    navigate("/login");
  };

  // Determine the selected key based on current route
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return ["1"];
    if (path === "/user-management") return ["user-management"];
    if (path === "/products") return ["products"];
    if (path === "/categories") return ["categories"];
    if (path === "/super-shop") return ["super-shop"];
    if (path === "/promo-codes") return ["promo-codes"];
    return ["1"];
  };

  const sidebarItems = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },

    {
      key: "user-management",
      icon: <FaUsers />,
      label: <Link to="/user-management">User Management</Link>,
    },
    {
      key: "products",
      icon: <FaBuildingFlag />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: "categories",
      icon: <FaBuildingFlag />,
      label: <Link to="/categories">Categories</Link>,
    },
    {
      key: "super-shop",
      icon: <FaBuildingFlag />,
      label: <Link to="/super-shop">Super Shop</Link>,
    },
    {
      key: "promo-codes",
      icon: <FaBuildingFlag />,
      label: <Link to="/promo-codes">Promo Codes</Link>,
    },

    // Add logout as a menu item at the bottom
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      className: "bottom-20",
      onClick: handleSignOut,
      style: {
        position: "absolute",
        width: "100%",
      },
      danger: true,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={sidebarItems}
        onClick={onClick}
        style={{
          height: "calc(100% - 64px)",
          backgroundColor: "#ffffff",
          color: "#002436",
        }}
      />
    </div>
  );
};

export default Sidebar;
