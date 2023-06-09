
import React from 'react'
import {
    Col,
    Row,
    message,
    Button,
    Tooltip
} from 'antd';
import {
    Player,
    LoadingSpinner,
    BigPlayButton
} from 'video-react';

import './MoviePlay.css'
import Api from '../Api'


class MoviePlay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            src: '',
            isLoading: true,
            text: 'click to download the movie'
        }
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        const hide = message.loading('Video resources are loading, please wait', 0);
        fetch(Api.playMovie(this.props.match.params.movie), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        })
            .then(response => response.json())
            .then(req => {
                setTimeout(hide, 1);
                if (req.status !== 1) {
                    message.error('Failed to get video resource', 10);
                } else {
                    message.success('Video resource loaded successfully');
                    this.setState({ src: req.data, isLoading: false })
                }
            })
            .catch(error => console.error('Error:', error));
    }

    render() {
        const { src, text } = this.state;
        const source = src === '' ? '' :
            <Tooltip placement="right" title={text}>
                <a href={src}>
                    <Button icon="download" size="large" shape="circle" />
                </a>
            </Tooltip>;
        return (
            <div>
                <Row>
                    <Col span={4} />
                    <Col span={5}>
                        <h1>{this.props.match.params.movie}</h1>
                        <hr />
                        {source}
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={4} />
                    <Col span={18}>
                        <Player src={src}>
                            <LoadingSpinner />
                            <BigPlayButton position="center" />
                        </Player>
                    </Col>
                </Row>
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

export default MoviePlay;