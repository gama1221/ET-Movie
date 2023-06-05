
import React from 'react'
import {
    Rate
} from 'antd';
import {
    Link
} from 'react-router-dom'

import './MovieCard.css';


class MovieCard extends React.Component {

    render() {
        const half = parseInt(this.props.score, 10) % 2 === 1 ? 0.5 : 0;
        const star = parseInt(this.props.score / 2, 10) + half;
        const desc =
            <div id="description">
                <Rate disabled allowHalf value={star}/>{this.props.score}
            </div>;

        return (
            <Link to={`/movieInfo/${this.props.title}`} target='_blank'>
                <div id="figure">
                    <img src="../images/logo.png" alt='another image is displaying ...' />
                    {/* <img alt="post " src={this.props.post} /> */}
                    {
                        console.log("alt post console : "+this.props.post)
                    }
                    <div id="figcaption">
                        <h3>{this.props.title}</h3>
                        <span>{desc}</span>
                    </div>
                </div>
            </Link>
        );
    }
}

export default MovieCard;