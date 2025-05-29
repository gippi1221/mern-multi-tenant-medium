import { Button, Card, Form, Input } from 'antd';
import classes from './SignIn.module.scss';
import { LoginOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import { appRoutes } from '@/router/routes';

const SignUp = () => {
  const { signUserUp } = useAuth();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    signUserUp(values.email, values.password).then(() => {
      navigate(appRoutes.APP_ROUTE);
    });
  };

  return (
    <div className={classes.container}>
      <Card variant="borderless" className={classes.card}>
        <div className={classes.title}>
          <span className={classes.titleText}>Sign Up</span>
        </div>
        <Form
          name="signup"
          form={form}
          layout="vertical"
          requiredMark="optional"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input suffix="@" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <div className={classes.alreadyHaveAccount}>
            If you already have an account, please <Link to={appRoutes.SIGN_IN_ROUTE}>sign in</Link>
            .
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={classes.button}
              icon={<LoginOutlined />}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
