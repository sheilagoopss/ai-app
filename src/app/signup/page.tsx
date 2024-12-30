"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Form, Input, Button, Card, Layout } from "antd";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const { signup, loading: signupLoading } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSignup = async () => {
    console.log("signup");
    form.validateFields().then(async () => {
      const values = form.getFieldsValue();
      await signup({ email: values.email, password: values.password });
      router.push("/");
    });
  };

  return (
    <Layout className="flex justify-center items-center h-screen w-full">
      <Card title="Sign Up" className="w-1/3">
        <Form form={form} onFinish={handleSignup} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!"),
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm your password" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={signupLoading}
            style={{ float: "right" }}
          >
            Sign Up
          </Button>
        </Form>
      </Card>
    </Layout>
  );
};

export default SignupPage;
