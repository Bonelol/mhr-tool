import { Layout as AntdLayout, Menu } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { Calc } from '../calc';
import './index.css'

export const Layout = () => {
  return (
    <AntdLayout>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">没什么用 1</Menu.Item>
          <Menu.Item key="2">没什么用 2</Menu.Item>
          <Menu.Item key="3">没什么用 3</Menu.Item>
        </Menu>
        <div className="github-star">
          <iframe
            src="https://ghbtns.com/github-btn.html?user=bonelol&repo=mhr-tool&type=star&count=true&size=large"
            frameBorder="0"
            scrolling="0"
            width="170"
            height="30"
            title="GitHub"
          ></iframe>
        </div>
      </Header>
      <Content style={{ padding: '0 50px', backgroundColor: '#fff' }}>
        <Calc />
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created by Bonelol</Footer>
    </AntdLayout>
  );
};
