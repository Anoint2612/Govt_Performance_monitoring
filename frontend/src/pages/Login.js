import React from "react";
import { Form, Input, Button, Radio } from "antd";
import "antd/dist/reset.css";

const Login = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px 32px",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src="https://img.icons8.com/fluency/96/000000/login-rounded-right.png"
            alt="Login"
            style={{ marginBottom: 8 }}
          />
          <h2 style={{ fontWeight: 700, color: "#2193b0", marginBottom: 0 }}>
            Welcome Back
          </h2>
          <p style={{ color: "#888", fontSize: 16, marginTop: 8 }}>
            Sign in to your account
          </p>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input size="large" placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="User Type"
            name="userType"
            rules={[
              { required: true, message: "Please select your user type!" },
            ]}
          >
            <Radio.Group style={{ width: "100%" }}>
              <Radio.Button
                value="HQAdmin"
                style={{ width: "33.3%", textAlign: "center" }}
              >
                HQAdmin
              </Radio.Button>
              <Radio.Button
                value="employee"
                style={{ width: "33.3%", textAlign: "center" }}
              >
                Employee
              </Radio.Button>
              <Radio.Button
                value="manager"
                style={{ width: "33.3%", textAlign: "center" }}
              >
                Manager
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                background: "linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)",
                border: "none",
                fontWeight: 600,
              }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
