import React from 'react'
import {
    Row,
    Col,
    Menu,
    Icon,
    Tabs,
    message,
    Form,
    Input,
    Button,
    Dropdown,
    Modal,
    Checkbox
} from 'antd';
import {
    Link
} from 'react-router-dom'

import './header.css'
import Api from '../Api'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 'unknown',
            modalVisible: false,
            action: 'login',
            hasLogined: false,
            username: '',
            signInLoading: false,
            signUpLoading: false,
            permission: '0'
        }
    }

    componentWillMount() {
        if (localStorage.username !== '') {
            this.setState({
                hasLogined: true,
                username: localStorage.username,
                permission: localStorage.permission
            });
        }
    };

    setModalVisible(value) {
        this.setState({modalVisible: value});
    };

    handleMenuClick(e) {
        this.setState({
            current: e.key,
        });
    }

    handleButtonClick(e) {
        this.setModalVisible(true);
    }
    handleSignIn(e) {
        e.preventDefault();

        this.setState({signInLoading: true});
        const formData = this.props.form.getFieldsValue();

        const username = formData.username;
        const password = formData.password;
        const permission = formData.permission ? 1 : 0;


        if (username === null || password === null) {
            message.warning("Information cannot be empty");
            this.setState({signUpLoading: false});
            return;
        }


        fetch(Api.userSignIn(username, password, permission), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .then(info => {
                if (info.status !== 1) {
                    message.error("Login failed, please check if the user name or password is correct");
                    console.log(`error message: ${info.msg}`);
                } else {
                    message.success("Login successfully");
                    this.setState({username});
                    localStorage.username = username;
                    localStorage.permission = `${permission}`;
                    if (this.state.action === "login") {
                        this.setState({hasLogined: true});
                    }
                    this.setModalVisible(false);
                }
                this.setState({signInLoading: false});
            })
    };


    handleSignUp(e) {
        e.preventDefault();

        this.setState({signUpLoading: true});

        const formData = this.props.form.getFieldsValue();
     

        const username = formData.r_username;
        const password = formData.r_password;
        const confirmPassword = formData.r_confirmPassword;
        const permission = formData.r_permission ? 1 : 0;

 
        if (username === null || password === null || confirmPassword === null) {
            message.warning("Information cannot be empty");
            this.setState({signUpLoading: false});
            return;
        }
        if (password !== confirmPassword) {
            message.warning("The password is not the same twice");
            this.setState({signUpLoading: false});
            return;
        }

  
        fetch(Api.userSignUp(username, password, permission), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
        }).then(response => response.json())
            .then(info => {
                if (info.status !== 1) {
                    message.error("Registration failed");
                    console.log(`error message: ${info.msg}`);
                } else {
                    message.success("Registered, registered successfully");
                    this.setState({username});
                    localStorage.username = username;
                    localStorage.permission = `${permission}`;
                    if (this.state.action === "login") {
                        this.setState({hasLogined: true});
                    }
                    this.setModalVisible(false);
                }
                this.setState({signUpLoading: false});
            });
    }

  
    logout() {
        localStorage.username = '';
        localStorage.permission = '0';
        this.setState({hasLogined: false});
    };


    onHandleAdminToggle(e) {
        this.setState({isAdmin: !this.state.isAdmin});
    }

    render() {

        const upload = this.state.permission !== "0" ?
            <Menu.Item>
                <Link to="/upload"><Button icon="appstore-o" size="small">Resource management</Button></Link>
            </Menu.Item>
            :
            <div></div>;


        const menu = (<Menu>
            {upload}
            <Menu.Item>
                <Button icon="logout" type="danger" size="small" onClick={this.logout.bind(this)}>Log out</Button>
            </Menu.Item>
        </Menu>);

        let {getFieldDecorator} = this.props.form;
        const userShow = this.state.hasLogined
            ?
            <Dropdown overlay={menu} placement="topCenter">
                <Button className="user" icon="user" type="primary" htmlType="button" size="large">
                    {this.state.username} <Icon type="down"/>
                </Button>
            </Dropdown>
            :
            <Button className="user" icon="user" type="primary" htmlType="button" ghost
                    onClick={this.handleButtonClick.bind(this)}>Login/Registration</Button>;

        return (
            <header>
                <Row>
                    <Col span={3}/>
                    <Col span={3}>
                        <a href="/" id="logo">
                            <img src={require('../images/logo.png')} alt="logo"/>
                            <span>ET-MOVIE</span>
                        </a>
                    </Col>
                    <Col span={4}>
                        <Menu
                            onClick={this.handleMenuClick.bind(this)}
                            selectedKeys={[this.state.current]}
                            mode="horizontal"
                            style={{lineHeight: '64px'}}>
                            <Menu.Item key="home">
                                <Link to={'/'}/><Icon type="home"/>page
                            </Menu.Item>
                            <Menu.Item key="app">
                                <Icon type="profile"/>Search by category
                                <Link to={'/category'}/>
                            </Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={10}/>
                    <Col span={2}>
                        {userShow}
                    </Col>
                    <Col span={3}/>
                </Row>
                <Modal title="User center"
                       wrapClassName="vertical-center-modal"
                       visible={this.state.modalVisible}
                       onCancel={() => this.setModalVisible(false)}
                       onOk={() => this.setModalVisible(false)}
                       cancelText="cancel"
                       okText="Shut down">
                    <Tabs type="card">
                        <TabPane tab="Login" key="1">
                            <Form horizontal onSubmit={this.handleSignIn.bind(this)} className="login-form">
                                <FormItem label="User name">
                                    {getFieldDecorator('username', {
                                        rules: [{required: true, message: 'Please enter your user name!'}],
                                    })(
                                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder="User name"/>
                                    )}
                                </FormItem>
                                <FormItem label="Password">
                                    {getFieldDecorator('password', {
                                        rules: [{required: true, message: 'Please enter your password!'}],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               type="password" placeholder="Password"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('permission', {
                                        valuePropName: 'unchecked',
                                        initialValue: false,
                                    })(
                                        <Checkbox onChange={this.onHandleAdminToggle.bind(this)}>Administrator</Checkbox>
                                    )}
                                </FormItem>
                                <Button type="primary" htmlType="submit" loading={this.state.signInLoading}
                                        className="login-form-button">Log in</Button>
                            </Form>
                        </TabPane>

                        <TabPane tab="register" key="2">
                            <Form horizontal="true" onSubmit={this.handleSignUp.bind(this)} className="login-form">
                                <FormItem label="username">
                                    {getFieldDecorator('r_username', {
                                        rules: [{required: true, message: 'Please enter your username!'}],
                                    })(
                                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder="username"/>
                                    )}
                                </FormItem>
                                <FormItem label="password">
                                    {getFieldDecorator('r_password', {
                                        rules: [{required: true, message: 'Please enter your password!'}],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               type="password" placeholder="password"/>
                                    )}
                                </FormItem>
                                <FormItem label="Confirm Password">
                                    {getFieldDecorator('r_confirmPassword', {
                                        rules: [{
                                            required: true, message: 'Please confirm your password'
                                        }]
                                    })(
                                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               type="password" placeholder="enter password again"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('r_permission', {
                                        valuePropName: 'unchecked',
                                        initialValue: false,
                                    })(
                                        <Checkbox onChange={this.onHandleAdminToggle.bind(this)}>Administrator</Checkbox>
                                    )}
                                </FormItem>
                                <Button type="primary" htmlType="submit" loading={this.state.signUpLoading}
                                        className="login-form-button">register Login Here</Button>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Modal>
                <br/>
                <br/>
            </header>
        )
    }
}

export default Header = Form.create({})(Header);