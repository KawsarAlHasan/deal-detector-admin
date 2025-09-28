import { useState } from "react";
import { Modal, Typography, Button, Space, notification, Tag } from "antd";
import { API } from "../../api/api";

const { Text } = Typography;

function ViewUser({ userDetailsData, isOpen, onClose, refetch }) {
  const [enableLoading, setEnableLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleUserEnable = async (userData) => {
    setEnableLoading(true);
    try {
      const response = await API.patch(`/admin-dashboard/user-block-unblock/`, {
        user_id: userData.id,
        block: false,
      });

      if (response.status === 200) {
        openNotification("success", "Success", "User Unblocked successfully");
        refetch();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to unblock user";
      openNotification("error", "Error", errorMessage);
    } finally {
      setEnableLoading(false);
    }
  };

  const handleUserDisable = async (userData) => {
    setDisableLoading(true);
    try {
      const response = await API.patch(`/admin-dashboard/user-block-unblock/`, {
        user_id: userData.id,
        block: true,
      });

      if (response.status === 200) {
        openNotification("success", "Success", "User Blocked successfully");
        refetch();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to block user";

      openNotification("error", "Error", errorMessage);
    } finally {
      setDisableLoading(false);
    }
  };

  const handleUserDelete = async (userData) => {
    setDeleteLoading(true);
    try {
      const response = await API.post(`/admin-dashboard/delete-user/`, {
        user_id: userData.id,
      });

      if (response.status === 200) {
        openNotification("success", "Success", "User deleted successfully");
        refetch();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete user";

      openNotification("error", "Error", errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Modal
      title="User Action"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      {userDetailsData ? (
        <>
          <p>
            <Text strong>Name: </Text>
            {userDetailsData.full_name}
          </p>
          <p>
            <Text strong>Email: </Text>
            {userDetailsData.email}
          </p>
          <p>
            <Text strong>Phone Number: </Text>
            {userDetailsData.phone}
          </p>
          <p>
            <Text strong>Total Saved Money: </Text>
            {userDetailsData?.total_saved_money || 0}
          </p>
          <p>
            <Text strong>Favorite Items: </Text>
            {userDetailsData?.favorite_items || 0}
          </p>
          <p>
            <Text strong>Status: </Text>
            {userDetailsData.is_active == true ? (
              <Tag color="green">Active</Tag>
            ) : (
              <Tag color="red">Blocked</Tag>
            )}
          </p>

          <Space style={{ marginTop: 20 }}>
            {userDetailsData.is_active == true ? (
              <Button
                danger
                loading={disableLoading}
                onClick={() => handleUserDisable(userDetailsData)}
              >
                Block User
              </Button>
            ) : (
              <Button
                type="primary"
                loading={enableLoading}
                onClick={() => handleUserEnable(userDetailsData)}
              >
                Unblock User
              </Button>
            )}

            <Button
              danger
              type="primary"
              loading={deleteLoading}
              onClick={() => handleUserDelete(userDetailsData)}
            >
              Delete User
            </Button>
          </Space>
        </>
      ) : (
        <Text>No user data available</Text>
      )}
    </Modal>
  );
}

export default ViewUser;
