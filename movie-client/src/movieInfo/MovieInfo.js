import React from 'react'
import {
    Col,
    Row,
    Button,
    Popover
} from 'antd';

import {
    Link
} from 'react-router-dom'

import Api from '../Api'
import './MovieInfo.css'


class MovieInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            isLoading: false
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch(Api.movieDetail(this.props.match.params.title), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        })
            .then(response => response.json())
            .then(info => this.setState({ data: info.data, isLoading: false }))
            .catch(error => console.error('Error:', error));
    }


    render() {
        const { data } = this.state;
        if (data == null) {
            return <div></div>;
        }

        const play = (<div id="play">
            <Link to={`/play/${this.props.match.params.title}`}>
                <Button type="primary" icon="play-circle-o" size="large">
                    click to play
                </Button>
            </Link>
        </div>);

        return (
            <div>
                <br />
                <br />
                <br />
                <Row>
                    <Col span={4} />
                    <Col span={5}>
                        <div>
                            <img id="post" alt="post" src={data.post} />
                            {play}
                        </div>
                    </Col>
                    <Col span={1} />
                    <Col span={5}>
                        <h1>{data.title}</h1>
                        <hr />
                        <p>Douban frequency division:<span id="score">{data.score}</span></p>
                        <p>director:{data.director}</p>
                        <p>screenwriter:{data.screenwriter}</p>
                        <p>Alias:{data.alias}</p>
                        <p>Release date:{data.releaseDate}</p>
                        <p>type:{data.type}</p>
                        <p>Length:{data.length}minute</p>
                        <Popover content={data.cast} title="actor information" trigger="hover">
                            <Button type="primary" ghost>actor information</Button>
                        </Popover>
                    </Col>
                    <Col span={1} />
                    <Col span={5} id="overview">
                        <h1>plot</h1>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;{data.overview}</p>
                    </Col>
                    <Col span={4} />
                </Row>
                <br />
                <br />
                <br />
                <br />
            </div>

        );
    }
}

export default MovieInfo;