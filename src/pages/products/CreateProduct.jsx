import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  Upload,
  Select,
  Card,
  Row,
  Col,
  Tabs,
  message,
  Tag,
  Divider,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useAllCategories, useAllSupershops } from "../../api/api";
import { API } from "../../api/api";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

function CreateProduct() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
  });
  const [prices, setPrices] = useState([]);

  const { allSupershops } = useAllSupershops({ page: 1, limit: 500 });
  const { allCategories } = useAllCategories({ page: 1, limit: 500 });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageFiles({ image1: null, image2: null, image3: null });
    setPrices([]);
  };

  const handleImageUpload = (imageKey, file) => {
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

    setImageFiles((prev) => ({
      ...prev,
      [imageKey]: file,
    }));
    return false;
  };

  const removeImage = (imageKey) => {
    setImageFiles((prev) => ({
      ...prev,
      [imageKey]: null,
    }));
  };

  const addPrice = () => {
    setPrices((prev) => [...prev, { shop: "", price: "" }]);
  };

  const removePrice = (index) => {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePrice = (index, field, value) => {
    setPrices((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Prepare translations
      const translations = {
        en: {
          product_name: values.name_en || "",
          description: values.description_en || "",
        },
        nl: {
          product_name: values.name_nl || "",
          description: values.description_nl || "",
        },
      };

      // Add images
      if (imageFiles.image1)
        formData.append("product_image1", imageFiles.image1);
      if (imageFiles.image2)
        formData.append("product_image2", imageFiles.image2);
      if (imageFiles.image3)
        formData.append("product_image3", imageFiles.image3);

      // Add other fields
      formData.append("translations", JSON.stringify(translations));
      formData.append("category", values.category);
      formData.append("uom", values.uom);

      // Add prices
      const validPrices = prices.filter((price) => price.shop && price.price);

      formData.append("prices", JSON.stringify(validPrices));

      await API.post("/api/shop/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Product created successfully!");
      handleCancel();
    } catch (error) {
      message.error("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ImageUploader = ({ imageKey, label, required = false }) => (
    <Form.Item
      label={label}
      rules={
        required ? [{ required: true, message: `${label} is required` }] : []
      }
    >
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={(file) => handleImageUpload(imageKey, file)}
        accept="image/*"
      >
        {imageFiles[imageKey] ? (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <img
              src={URL.createObjectURL(imageFiles[imageKey])}
              alt="Product"
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
                removeImage(imageKey);
              }}
            >
              ×
            </Button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <UploadOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
            <div style={{ marginTop: 4, fontSize: "12px" }}>Upload</div>
          </div>
        )}
      </Upload>
    </Form.Item>
  );

  return (
    <div>
      <Button
        onClick={showModal}
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        className="my-main-button"
      >
        Create New Product
      </Button>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            <ShoppingOutlined style={{ color: "#1890ff" }} />
            <span>Create New Product</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        width={900}
        centered
        destroyOnClose
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Product Images Section */}
          <Card
            title="📷 Product Images"
            size="small"
            style={{ marginBottom: 16 }}
            extra={<Tag color="blue">At least 1 image required</Tag>}
          >
            <Row gutter={16}>
              <Col span={8}>
                <ImageUploader imageKey="image1" label="Main Image" required />
              </Col>
              <Col span={8}>
                <ImageUploader imageKey="image2" label="Additional Image 1" />
              </Col>
              <Col span={8}>
                <ImageUploader imageKey="image3" label="Additional Image 2" />
              </Col>
            </Row>
          </Card>

          {/* Basic Information */}
          <Card
            title="📋 Basic Information"
            size="small"
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[
                    { required: true, message: "Please select category" },
                  ]}
                >
                  <Select placeholder="Select category" size="large">
                    {allCategories?.map((shop) => (
                      <Option key={shop.id} value={shop.id}>
                        {shop.translations?.en?.category_name ||
                          `Category ${shop.id}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Unit of Measure (UOM)"
                  name="uom"
                  rules={[{ required: true, message: "Please select UOM" }]}
                >
                  <Input
                    placeholder="e.g., piece, kg, liter"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Multi-language Product Details */}
          <Card
            title="🌍 Product Details"
            size="small"
            style={{ marginBottom: 16 }}
          >
            <Divider orientation="left">English</Divider>
            <Form.Item
              label="Product Name (English)"
              name="name_en"
              rules={[
                {
                  required: true,
                  message: "Please enter product name in English",
                },
                {
                  min: 2,
                  message: "Product name must be at least 2 characters",
                },
              ]}
            >
              <Input
                placeholder="e.g., iPhone 15 Pro, Nike Air Max"
                size="large"
              />
            </Form.Item>
            <Form.Item label="Description (English)" name="description_en">
              <TextArea
                placeholder="Describe the product features, specifications, and benefits..."
                rows={4}
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Divider orientation="left">Dutch</Divider>

            <Form.Item
              label="Product Name (Dutch)"
              name="name_nl"
              rules={[
                {
                  required: true,
                  message: "Please enter product name in Dutch",
                },
                {
                  min: 2,
                  message: "Product name must be at least 2 characters",
                },
              ]}
            >
              <Input
                placeholder="e.g., iPhone 15 Pro, Nike Air Max"
                size="large"
              />
            </Form.Item>
            <Form.Item label="Description (Dutch)" name="description_nl">
              <TextArea
                placeholder="Beschrijf de productkenmerken, specificaties en voordelen..."
                rows={4}
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </Card>

          {/* Pricing Section */}
          <Card
            title="💰 Pricing"
            size="small"
            style={{ marginBottom: 16 }}
            extra={
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addPrice}
                size="small"
              >
                Add Price
              </Button>
            }
          >
            {prices.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "20px", color: "#999" }}
              >
                <ShoppingOutlined
                  style={{ fontSize: "24px", marginBottom: "8px" }}
                />
                <div>
                  No prices added yet. Click "Add Price" to set prices for
                  different shops.
                </div>
              </div>
            ) : (
              prices.map((price, index) => (
                <Row
                  key={index}
                  gutter={8}
                  style={{ marginBottom: "12px", alignItems: "center" }}
                >
                  <Col span={10}>
                    <Select
                      placeholder="Select Shop"
                      value={price.shop}
                      onChange={(value) => updatePrice(index, "shop", value)}
                      size="large"
                      style={{ width: "100%" }}
                    >
                      {allSupershops?.map((shop) => (
                        <Option key={shop.id} value={shop.id}>
                          {shop.translations?.en?.super_shop_name ||
                            `Shop ${shop.id}`}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={10}>
                    <InputNumber
                      placeholder="Price"
                      value={price.price}
                      onChange={(value) => updatePrice(index, "price", value)}
                      size="large"
                      style={{ width: "100%" }}
                      min={0}
                      step={0.01}
                      precision={2}
                    />
                  </Col>
                  <Col span={4}>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removePrice(index)}
                      size="large"
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
              ))
            )}

            {prices.length > 0 && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px",
                  background: "#f6ffed",
                  borderRadius: "6px",
                }}
              >
                <div style={{ fontSize: "12px", color: "#52c41a" }}>
                  <strong>Total Shops:</strong>{" "}
                  {prices.filter((p) => p.shop && p.price).length} shops
                  configured
                </div>
              </div>
            )}
          </Card>

          <Divider />

          {/* Form Actions */}
          <Form.Item style={{ marginBottom: 0 }}>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<PlusOutlined />}
                className="my-main-button"
              >
                Create Product
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateProduct;
