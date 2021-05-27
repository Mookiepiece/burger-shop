import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, Menu, Card } from 'antd';
const { Header, Content, Footer } = Layout;

const routes = {
  '/': 'Home',
  '/foo': 'Foo',
  '/foo/foo-plus': 'Foo +',
};

const DashboardLayout: React.FC = ({ children }) => {
  const location = useLocation();

  return (
    <Layout className="layout">
      <Header>
        {Object.entries(routes).map(([to, name]) => (
          <NavLink key={to} to={to}>
            {name}
          </NavLink>
        ))}
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Card>{children}</Card>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  );
};

export default DashboardLayout;
