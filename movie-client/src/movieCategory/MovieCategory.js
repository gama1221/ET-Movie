


import React from 'react'
import {
    Col,
    Row,
    Tag
} from 'antd';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import Api from '../Api';
import './MovieCategory.css';
import MovieList from '../movieList/MovieList';
import MovieCategoryList from './MovieCategoryList';


class MovieCategory extends React.Component {

    constructor() {
        super();

        this.state = {
            data: [],
            isLoading: false,
            selectedTag: 'all'
        }
    }

 
    componentDidMount() {
        this.setState({isLoading: true});

        fetch(Api.types(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        })
            .then(response => response.json())
            .then(info => this.setState({data: info.data, isLoading: false}))
            .catch(error => console.error('Error:', error));
    }
    handleClick(tag) {
        this.setState({selectedTag: tag});
    }

    render() {
        const {data} = this.state;
        const {selectedTag} = this.state;

        if (data == null) {
            return <div></div>;
        }

        return (
            <Router>
                <div>
                    <br/>
                    <Row>
                        <Col span={3}/>
                        <Col span={18}>
                            <div>
                                <h3 style={{marginRight: 8, display: 'inline'}}>Classification:</h3>
                                <Link to="/category">
                                    <Tag
                                        key={"all"}
                                        color={selectedTag === "all" ? "#108ee9" : "geekblue"}
                                        onClick={this.handleClick.bind(this, "all")}>
                                        {"all"}
                                    </Tag>
                                </Link>
                                {data.map(tag => (
                                    <Link to={`/category/${tag}`}>
                                        <Tag
                                            key={tag}
                                            color={selectedTag === tag ? "#108ee9" : "geekblue"}
                                            onClick={this.handleClick.bind(this, tag)}> {tag}
                                        </Tag>
                                    </Link>
                                ))}
                            </div>

                        </Col>
                        <Col span={3}/>
                    </Row>
                    <br/>
                    <br/>
                    <div>
                        <Route exact path={`/category/:type`} component={MovieCategoryList}/>
                        <Route exact path="/category" component={MovieList}/>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>

                </div>
            </Router>

        );
    }
}

export default MovieCategory;