import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Tabs,
  Row,
  Col,
  Divider,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { API } from "../../api/api";

const { TextArea } = Input;

function AddSuperShop({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageFile(null);
  };

  const handleImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    setImageFile(file);
    return false; // Prevent automatic upload
  };

  const removeImage = () => {
    setImageFile(null);
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Prepare translations object
      const translations = {
        en: {
          super_shop_name: values.shop_name_en || "",
          description: values.description_en || "",
        },
        nl: {
          super_shop_name: values.shop_name_nl || "",
          description: values.description_nl || "",
        },
      };

      // Add image if exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Add translations
      formData.append("translations", JSON.stringify(translations));

      await API.post("/api/shop/supershops/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Super Shop created successfully!");
      form.resetFields();
      setImageFile(null);
      setIsModalOpen(false);

      // Refetch super shops list
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error("Error creating super shop:", error);
      message.error("Failed to create super shop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={showModal}
        type="primary"
        className="my-main-button"
        icon={<PlusOutlined />}
        size="large"
      >
        Create Super Shop
      </Button>

      <Modal
        title={
          <div
            style={{ textAlign: "center", fontSize: "18px", fontWeight: "600" }}
          >
            Create New Super Shop
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        width={700}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          style={{ marginTop: "20px" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Super Shop Image" name="image">
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={handleImageUpload}
                  accept="image/*"
                >
                  {imageFile ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Super Shop"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                      <Button
                        type="link"
                        danger
                        size="small"
                        style={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          background: "#ff4d4f",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          minWidth: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <UploadOutlined
                        style={{ fontSize: "20px", color: "#1890ff" }}
                      />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">English</Divider>
          <Form.Item
            label="Super Shop Name (English)"
            name="shop_name_en"
            rules={[
              {
                required: true,
                message: "Please enter Super Shop name in English",
              },
              {
                min: 2,
                message: "Super Shop name must be at least 2 characters",
              },
            ]}
          >
            <Input
              placeholder="Enter Super Shop name in English"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Description (English)" name="description_en">
            <TextArea
              placeholder="Enter description in English"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Divider orientation="left">Dutch</Divider>
          <Form.Item
            label="Super Shop Name (Dutch)"
            name="shop_name_nl"
            rules={[
              {
                required: true,
                message: "Please enter Super Shop name in Dutch",
              },
              {
                min: 2,
                message: "Super Shop name must be at least 2 characters",
              },
            ]}
          >
            <Input placeholder="Enter Super Shop name in Dutch" size="large" />
          </Form.Item>

          <Form.Item label="Description (Dutch)" name="description_nl">
            <TextArea
              placeholder="Enter description in Dutch"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="my-main-button"
            >
              Create Super Shop
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddSuperShop;
