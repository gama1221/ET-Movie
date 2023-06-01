import React from 'react';
import {
    Row,
    Col
} from 'antd';
import './IconTitle.css'

/*
* Logo
* */
class IconTitle extends React.Component {

    render() {
        return (
            <div>
                <Row >
                    <Col span={24}>
                        <div id="title">
                            <img id="bigImg" src={require('../images/JOKUL.png')} alt="logo"/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default IconTitle;
