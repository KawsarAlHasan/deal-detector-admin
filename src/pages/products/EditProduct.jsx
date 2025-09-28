import React, { useState } from "react";
import {
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Select,
  Card,
  Row,
  Col,
  message,
  Tag,
  Divider,
} from "antd";
import { useAllCategories, useAllSupershops } from "../../api/api";
import { API } from "../../api/api";

const { TextArea } = Input;
const { Option } = Select;

function EditProduct({ record, refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
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

    // Set form values directly from record
    form.setFieldsValue({
      category: record.category?.id || record.category, // Category ID
      uom: record.uom,
      name_en: record.translations?.en?.product_name || "",
      description_en: record.translations?.en?.description || "",
      name_nl: record.translations?.nl?.product_name || "",
      description_nl: record.translations?.nl?.description || "",
    });

    // Set prices from record
    setPrices(record.prices || []);
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

      // Add other fields - category ID
      formData.append("translations", JSON.stringify(translations));
      formData.append("category", values.category);
      formData.append("uom", values.uom);

      // Add prices
      const validPrices = prices.filter((price) => price.shop && price.price);

      // formData.append("prices", JSON.stringify(validPrices));

      await API.patch(
        `/api/shop/products/update-delete/${record.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Product updated successfully!");
      handleCancel();

      // Refetch products list
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ImageUploader = ({ imageKey, label, currentImage }) => (
    <Form.Item label={label}>
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
        ) : currentImage ? (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <img
              src={currentImage}
              alt="Product"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "2px",
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              Current
            </div>
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

  // Get current category name for display
  const getCurrentCategoryName = () => {
    if (record.category?.translations?.en?.category_name) {
      return record.category.translations.en.category_name;
    }

    // If category is just an ID, find the name from allCategories
    if (allCategories && typeof record.category === "number") {
      const category = allCategories.find((cat) => cat.id === record.category);
      return (
        category?.translations?.en?.category_name ||
        `Category ${record.category}`
      );
    }

    return "Unknown Category";
  };

  return (
    <div>
      <EditOutlined
        onClick={showModal}
        className="text-xl text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
      />

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
            <EditOutlined style={{ color: "#1890ff" }} />
            <span>Edit Product</span>
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
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "#f0f8ff",
            borderRadius: "6px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#1890ff" }}>
            <strong>Editing Product ID: {record.id}</strong>
            <div style={{ marginTop: "4px" }}>
              Current Category:{" "}
              <Tag color="blue">{getCurrentCategoryName()}</Tag>
            </div>
          </div>
        </div>

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
          >
            <Row gutter={16}>
              <Col span={8}>
                <ImageUploader
                  imageKey="image1"
                  label="Main Image"
                  currentImage={record.product_image1}
                />
              </Col>
              <Col span={8}>
                <ImageUploader
                  imageKey="image2"
                  label="Additional Image 1"
                  currentImage={record.product_image2}
                />
              </Col>
              <Col span={8}>
                <ImageUploader
                  imageKey="image3"
                  label="Additional Image 2"
                  currentImage={record.product_image3}
                />
              </Col>
            </Row>
            <div style={{ color: "#666", fontSize: "12px", marginTop: "8px" }}>
              <div>• Upload new images to replace current ones</div>
              <div>• Keep empty to maintain current images</div>
            </div>
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
                    {allCategories?.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.translations?.en?.category_name ||
                          `Category ${category.id}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Unit of Measure (UOM)"
                  name="uom"
                  rules={[{ required: true, message: "Please enter UOM" }]}
                >
                  <Input placeholder="e.g., piece, kg, liter" size="large" />
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
                <div>No prices configured for this product.</div>
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
                Update Product
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EditProduct;
