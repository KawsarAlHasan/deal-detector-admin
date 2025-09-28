import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Card,
  Row,
  Col,
  Tag,
} from "antd";
import { PlusOutlined, GiftOutlined } from "@ant-design/icons";
import { API } from "../../api/api";

function CreatePromoCode({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const payload = {
        code: values.code,
        duration_days: values.duration_days,
        is_active: values.is_active !== undefined ? values.is_active : true,
      };

      await API.post("/api/auth/promo-code/", payload);

      message.success("Promo code created successfully!");
      form.resetFields();
      setIsModalOpen(false);

      // Refetch promo codes list
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error("Error creating promo code:", error);
      message.error(
        error.response?.data?.message ||
          "Failed to create promo code. Please try again."
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

  return (
    <div>
      <Button
        onClick={showModal}
        type="primary"
        className="my-main-button"
        icon={<GiftOutlined />}
        size="large"
      >
        Create Promo Code
      </Button>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <GiftOutlined style={{ color: "#1890ff" }} />
            <span>Create New Promo Code</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        width={600}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            duration_days: 30,
            is_active: true,
          }}
        >
          <div className="grid grid-cols-3 gap-2">
            <Form.Item
              label="Promo Code"
              name="code"
                className="col-span-2"
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
          </div>

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
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Switch
                defaultChecked
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<GiftOutlined />}
                className="my-main-button"
              >
                Create Promo Code
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CreatePromoCode;
