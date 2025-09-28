import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { FaPlus } from "react-icons/fa";
import { API } from "../../api/api";

const { Option } = Select;

const AddAdmin = ({ refetch }) => {
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
      await API.post("/admin-dashboard/create-admins/", values);
      message.success("Admin created successfully!");
      refetch?.();
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      message.error(
        err.response?.data?.email
          ? err.response?.data?.email[0]
          : "Failed to create admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        className="mb-2 my-main-button"
        onClick={showModal}
      >
        <FaPlus />
        New Administrators Profile Create
      </Button>

      <Modal
        title="Create New Admin"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleFinish} form={form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter admin name" }]}
          >
            <Input placeholder="Enter admin name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter admin email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter admin email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                min: 8,
                message: "Password must be at least 8 characters long",
              },
            ]}
          >
            <Input.Password placeholder="Enter admin password" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="+880..." />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
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
              Create Admin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAdmin;
