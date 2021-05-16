import { Layout as AntdLayout, Menu, Breadcrumb } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import { Calc } from '../calc';

export const Layout = () => {
  return (
    <AntdLayout>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', backgroundColor: '#fff' }}>       
        <Calc />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
       Created by Bonelol
      </Footer>
    </AntdLayout>
  );
};
