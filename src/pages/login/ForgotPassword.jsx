import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state for login button

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await API.post("/api/auth/forgot-password/", {
        email: values.email,
      });
      if (response.status === 200) {
        localStorage.setItem("email", values.email);
        // Show success message
        message.success("Send code on your email successful!");
        navigate("/check-code");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.error ||
          "Send code on your email failed. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please input valid email.");
  };

  return (
    <div className="flex justify-center items-center bgColor min-h-screen">
      <div className="p-8 py-16 shadow-lg rounded-lg w-[530px] h-[580px]">
        <div>
          <img src={logo} alt="Logo" className=" w-[120px]  mx-auto pb-4" />

          <h2 className="text-[30px] text-[#222222] font-bold text-center mb-6">
            Forget Password?
          </h2>
          <h6 className=" lg:mx-14 text-center text-[#4E4E4E] mb-6 text-[18px]">
            Please enter your email to continue
          </h6>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {/* Email Field */}
            <div className="mb-4">
              <label className="text-[18px] text-[#222222] block mb-1">
                Email address:
              </label>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  type="email"
                  className="p-3"
                  placeholder="Enter your email..."
                />
              </Form.Item>
            </div>

            {/* Submit Button */}
            <div className="mb-4">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full py-6 text-[18px] font-semibold my-main-button"
                  loading={loading}
                >
                  {loading ? "Sending..." : "Send a Code"}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
