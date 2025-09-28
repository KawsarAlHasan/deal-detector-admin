import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  message,
  Row,
  Col,
  Tag,
} from "antd";
import { API } from "../../api/api";

function EditPromoCode({ record, refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(record.is_active);

  const showModal = () => {
    setIsModalOpen(true);

    // Set form values directly from record
    form.setFieldsValue({
      code: record.code || "",
      duration_days: record.duration_days || 30,
      is_active: record.is_active !== undefined ? record.is_active : true,
    });

    // Set current status for display
    setCurrentStatus(record.is_active);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setCurrentStatus(record.is_active);
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const payload = {
        code: values.code,
        duration_days: values.duration_days,
        is_active: values.is_active,
      };

      await API.patch(`/api/auth/promo-code/${record.id}/`, payload);

      message.success("Promo code updated successfully!");
      handleCancel();

      // Refetch promo codes list
      if (refetch) {
        refetch();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to update promo code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldValue("code", result);
  };

  // Handle switch change
  const handleSwitchChange = (checked) => {
    form.setFieldValue("is_active", checked);
    setCurrentStatus(checked);
  };

  return (
    <div>
      <EditOutlined
        onClick={showModal}
        className="text-xl text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
      />

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EditOutlined style={{ color: "#1890ff" }} />
            <span>Edit Promo Code</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        width={600}
        centered
        destroyOnClose
      >
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "#f0f8ff",
            borderRadius: "6px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#1890ff" }}>
            <strong>Editing Promo Code ID: {record.id}</strong>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            code: record.code,
            duration_days: record.duration_days,
            is_active: record.is_active,
          }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Promo Code"
                name="code"
                rules={[
                  { required: true, message: "Please enter promo code" },
                  {
                    min: 3,
                    message: "Promo code must be at least 3 characters",
                  },
                  {
                    max: 50,
                    message: "Promo code must be less than 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z0-9\s\-_]+$/,
                    message:
                      "Only letters, numbers, spaces, hyphens and underscores are allowed",
                  },
                ]}
              >
                <Input
                  placeholder="Enter promo code (e.g., SUMMER2024, WELCOME20)"
                  size="large"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label=" ">
                <Button
                  className="my-main-button"
                  onClick={generateRandomCode}
                  size="large"
                  block
                >
                  Generate
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Duration (Days)"
            name="duration_days"
            rules={[
              { required: true, message: "Please enter duration in days" },
              {
                type: "number",
                min: 1,
                message: "Duration must be at least 1 day",
              },
              {
                type: "number",
                max: 365,
                message: "Duration cannot exceed 365 days",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter duration in days"
              size="large"
              style={{ width: "100%" }}
              min={1}
              max={365}
            />
          </Form.Item>

          <Form.Item label="Status" name="is_active" valuePropName="checked">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                checked={currentStatus}
                onChange={handleSwitchChange}
              />
              <div>
                {currentStatus ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">Inactive</Tag>
                )}
              </div>
            </div>
          </Form.Item>

          {/* Current Status Info */}
          <div
            style={{
              padding: "12px",
              background: "#f6f6f6",
              borderRadius: "6px",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#666" }}>
              <strong>Original Status:</strong>
              <div style={{ marginTop: "4px" }}>
                <Tag color={record.is_active ? "green" : "red"}>
                  {record.is_active ? "ACTIVE" : "INACTIVE"}
                </Tag>
                <span style={{ marginLeft: "8px" }}>
                  Expires in {record.duration_days} days
                </span>
              </div>
            </div>
          </div>

          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button
                onClick={handleCancel}
                size="large"
                style={{ minWidth: "100px" }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<EditOutlined />}
                className="my-main-button"
                style={{ minWidth: "130px" }}
              >
                Update Code
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EditPromoCode;
