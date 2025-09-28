import { useState } from "react";
import { Table, Space, message, Modal, Image, Avatar } from "antd";
import { MdBlock } from "react-icons/md";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { API, useAllCategories } from "../../api/api";
import CreateCategory from "./CreateCategory";
import EditCategory from "./EditCategory";

function Categories() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const [selectedFood, setSelectedFood] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { allCategories, isLoading, isError, error, refetch } =
    useAllCategories(filter);

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
      await API.delete(`/api/shop/categories/${selectedFood.id}/`);

      message.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedFood(null);
      setDeleteLoading(false);
      refetch();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to delete Category");
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
            className="!w-[45px] !h-[45px] p-0.5 bg-gray-300 rounded-full mt-[-5px]"
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
            <h2>{record?.translations?.en?.category_name}</h2>
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
            <h2> {record?.translations?.nl?.category_name}</h2>
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
          <EditCategory record={record} refetch={refetch} />
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
        <CreateCategory refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={allCategories}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: allCategories.length,
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
        <p>Are you sure you want to delete this Category?</p>
      </Modal>
    </div>
  );
}

export default Categories;
