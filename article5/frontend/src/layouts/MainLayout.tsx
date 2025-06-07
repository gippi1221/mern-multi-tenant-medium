import { Link, Navigate, Outlet } from 'react-router';
import classes from './MainLayout.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { appRoutes } from '@/router/routes';
import { Button, Card } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const MainLayout = () => {
  const { user, signUserOut, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={appRoutes.SIGN_IN_ROUTE} />;
  }

  return (
    <div className={classes.container}>
      <Card variant="borderless" classNames={{ body: classes.card }}>
        <div className={classes.header}>
          {user ? (
            <>
              <span className={classes.userName}>👋 Hello, {user.email}</span>
              <Button type="text" onClick={signUserOut} icon={<LogoutOutlined />}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link to={appRoutes.AUTH_ROUTE}>Please sign in</Link>
          )}
        </div>
      </Card>
      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
