import { useState } from "react";
import { Table, Space, message, Modal, Image, Avatar } from "antd";
import { MdBlock } from "react-icons/md";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { API, useAllSupershops } from "../../api/api";
import AddSuperShop from "./AddSuperShop";

function SuperShop() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const [selectedFood, setSelectedFood] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { allSupershops, isLoading, isError, error, refetch } =
    useAllSupershops(filter);

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
      await API.delete(`/api/shop/supershops/${selectedFood.id}/`);

      message.success("Super Shop deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedFood(null);
      setDeleteLoading(false);
      refetch();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to delete Super Shop");
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
      title: <span>Image</span>,
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <Avatar
            src={record?.image}
            alt={record?.image}
            className="!w-[45px] !h-[45px] bg-gray-300 rounded-full mt-[-5px]"
          />
        </div>
      ),
    },

    {
      title: <span>Eng Name</span>,
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <div className="">
          <div className="mt-1">
            <h2>{record?.translations?.en?.super_shop_name}</h2>
            <p className="text-sm">
              {record?.translations?.en?.description.slice(0, 40)}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: <span>Dutch Name</span>,
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <div className="">
          <div className="mt-1">
            <h2> {record?.translations?.nl?.super_shop_name}</h2>
            <p className="text-sm">
              {record?.translations?.nl?.description.slice(0, 40)}
            </p>
          </div>
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
        <AddSuperShop refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={allSupershops}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: allSupershops.length,
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
        <p>Are you sure you want to delete this Super Shop?</p>
      </Modal>
    </div>
  );
}

export default SuperShop;
