import { useState } from "react";
import { Table, Space, message, Modal, Image, Avatar, Tag } from "antd";
import { MdBlock } from "react-icons/md";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { API, useAllCategories, useAllPromoCodes } from "../../api/api";
import AddPromoCode from "./AddPromoCode";

function PromoCodes() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const [selectedFood, setSelectedFood] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { allCategories } = useAllCategories(filter);

  const { allPromoCodes, isLoading, isError, error, refetch } =
    useAllPromoCodes(filter);

  console.log("allPromoCodes", allPromoCodes);

  const handleTableChange = (pagination) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const openDeleteModal = (record) => {
    setSelectedFood(record);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFood) return;

    setDeleteLoading(true);
    try {
      // Simulate API call
      await API.delete(`/api/auth/promo-code/${selectedFood.id}/`);

      message.success("Promo code deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedFood(null);
      setDeleteLoading(false);
      refetch();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to delete Promo code");
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => (
        <span className="">
          #{index + 1 + (filter.page - 1) * filter.limit}
        </span>
      ),
    },

    {
      title: <span>Promo Code</span>,
      dataIndex: "code",
      key: "code",
      render: (code, record) => (
        <div className="">
          <h2>{code}</h2>
        </div>
      ),
    },

    {
      title: <span>Duration Days</span>,
      dataIndex: "duration_days",
      key: "duration_days",
      render: (duration, record) => <div className="">{duration} days</div>,
    },

    {
      title: <span>Create Date</span>,
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at, record) => <div className="">{new Date(created_at).toLocaleDateString()}</div>,
    },

    {
      title: <span>Is Active</span>,
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active, record) => (
        <div className="flex items-center">
          {is_active ? (
            <Tag color="green" className="px-3 py-0.5">
              Active
            </Tag>
          ) : (
            <Tag color="red" className="px-3 py-0.5">
              Inactive
            </Tag>
          )}
        </div>
      ),
    },

    {
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
           <EditOutlined className="text-xl text-blue-500 hover:text-blue-700 cursor-pointer transition-colors" />
          <DeleteOutlined
            className="text-xl text-red-500 hover:text-red-700 cursor-pointer transition-colors"
            onClick={() => openDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div className="p-4">
      <div className="mb-3">
        <AddPromoCode refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={allPromoCodes}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: allPromoCodes.length,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        confirmLoading={deleteLoading}
      >
        <p>Are you sure you want to delete this Promo code?</p>
      </Modal>
    </div>
  );
}

export default PromoCodes;
