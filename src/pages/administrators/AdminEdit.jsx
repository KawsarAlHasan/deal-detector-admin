import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, message, Select } from "antd";
import { API } from "../../api/api";

const AdminEdit = ({ adminProfile, refetch }) => {
  const isSuperAdmin = adminProfile.role === "superadmin";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const submitData = {
        name: values.full_name,
        phone_number: values.phone,
        role: values.role,
        user_id: adminProfile.id,
      };

      const res = await API.patch("/admin-dashboard/admin-update/", submitData);

      if (res.status === 200) {
        message.success("Admin updated successfully!");
        refetch();
        setIsModalOpen(false);
      }
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to update Admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EditOutlined
        className={`text-[23px] my-main-button p-1 rounded-sm text-white ${
          isSuperAdmin
            ? "!cursor-not-allowed opacity-50"
            : "hover:text-blue-300 cursor-pointer"
        }`}
        onClick={isSuperAdmin ? undefined : showModal}
      />

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            id: adminProfile?.id,
            full_name: adminProfile?.full_name,
            email: adminProfile?.email,
            phone: adminProfile?.phone,
            role: adminProfile?.role,
          }}
        >
          <Form.Item
            label="Name"
            name="full_name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            // rules={[
            //   { required: true, message: "Please enter your email" },
            //   { type: "email", message: "Please enter a valid email" },
            // ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select placeholder="Select role">
              <Option value="superadmin">Super Admin</Option>
              <Option value="admin">Admin</Option>
              <Option value="categorymanagement">Category Manager</Option>
              <Option value="moderator">Moderator</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="my-main-button"
              htmlType="submit"
              loading={loading}
              block
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminEdit;
