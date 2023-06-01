import React from 'react'
import {
    Col,
    Row,
    Form,
    Select,
    Button,
    Slider,
    Upload,
    Icon,
    Input,
    InputNumber,
    message,
    Tabs,
    Checkbox,
    Divider,
    Popover,
    Pagination,
    notification,
    Spin
} from 'antd';
import IconTitle from '../iconTitle/IconTitle'
import './MovieResourceManage.css'
import Api from '../Api'

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const TabPane = Tabs.TabPane;
const Dragger = Upload.Dragger;

class MovieResourceManage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post: 'http://via.placeholder.com/300x150?text=post',
            uploadLoading: false,
            deleteLoading: false,
            data: [],
            count: 0,
            selectedMovies: [],
            fileList: [],
        };
    }


    componentDidMount() {
        this.fetchDataCount();
        this.fetchData(0);
    }


    onPageChange(pageNumber) {
        console.log('Page: ', pageNumber);
        this.setState({selectedMovies: []});
        this.fetchData(pageNumber - 1);
    }

    fetchDataCount() {
        fetch(Api.movieCount(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        })
            .then(response => response.json())
            .then(info => this.setState({count: info.data}))
            .catch(error => console.error('Error:', error));
    }
    fetchData(page) {
        fetch(Api.movieList(page), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/js on',
            },
            mode: 'cors',
        })
            .then(response => response.json())
            .then(info => this.setState({data: info.data}))
            .catch(error => console.error('Error:', error));
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({uploadLoading: true});

        const formData = this.props.form.getFieldsValue();

        const title = formData.title;
        const score = formData.score;
        const alias = formData.alias;
        const releaseDate = formData.releaseDate;
        const length = formData.length;
        const director = formData.director.join(" ");
        const screenwriter = formData.screenwriter.join(" ");
        const cast = formData.cast.join(" ");
        const overview = formData.overview;
        const post = formData.post;
        const movieType = formData.movieType;

        fetch(Api.addMovieInfo(movieType), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                title: title,
                score: score,
                alias: alias,
                releaseDate: releaseDate,
                length: length,
                director: director,
                screenwriter: screenwriter,
                cast: cast,
                overview: overview,
                post: post
            })
        }).then(response => response.json())
            .then(info => {
                if (info.status !== 1) {
                    message.error("Failed to add movie, please check movie information");
                    console.log(`error message: ${info.msg}`);
                } else {
                    message.success("Movie added successfully");
                    this.setState({post: 'http://via.placeholder.com/300x150?text=post'});
                    this.props.form.resetFields();
                }
                this.setState({uploadLoading: false});
            });
    };
    onHandleChangePostUrl(e) {
        const {value} = e.target;
        const reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
        if ((reg.test(value))) {
            this.setState({post: value});
        }
    };
    onSelectedMovie(e) {
        const selectedMovies = this.state.selectedMovies;
        const target = e.target;
        if (target.checked) {
            if (selectedMovies.indexOf(target.value) === -1) {
                selectedMovies.push(target.value);
            }
        } else {
            const index = selectedMovies.indexOf(target.value);
            if (index !== -1) {
                selectedMovies.splice(index, 1);
            }
        }
        this.setState({selectedMovies});
    }

    onHandleConfirmDeleteTips() {
        const key = `open${Date.now()}`;
        if (this.state.selectedMovies.length === 0) {
            notification.info({
                message: "remind",
                description: "no movies selected",
                duration: 2,
                key,
                placement: "topLeft",
            })
        } else {
            notification.warning(
                {
                    message: 'Are you sure you want to delete these movie resources?',
                    description: this.state.selectedMovies.join("\n"),
                    key,
                    btn: (<Button icon="delete" type="danger" ghost onClick={() => {
                        notification.close(key);
                        this.onHandleDeleteMovies();
                    }}>
                        confirm </Button>),
                    placement: "topLeft",
                }
            )
        }
    }
    onHandleDeleteMovies() {
        const {data, selectedMovies}= this.state;

        for (let i = 0; i < selectedMovies.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (selectedMovies[i] === data[j].title) {
                    data.splice(j, 1);
                }
            }
        }

        this.setState({selectedMovies: [], data, deleteLoading: true});

        fetch(Api.deleteMovies(selectedMovies), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
        }).then(response => response.json())
            .then(info => {
                if (info.status !== 1) {
                    message.error("Movie deletion failed, please refresh");
                    console.log(`error message: ${info.msg}`);
                } else {
                    message.success("Movie deleted successfully");
                }
                this.setState({deleteLoading: false});
            });
    }

    render() {
        let {data, count} = this.state;
        const that = this;
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const uploadProps = {
            accept: "video／*",
            name: 'file',
            listType: 'text',
            action: Api.uploadMovie(),
            beforeUpload(file, fileList) {
                that.setState(({fileList}) => ({
                    fileList: [...fileList, file],
                }));
                // return false;
                // that.setState({fileList});
            },
            fileList: this.state.fileList,
            customRequest() {
                const {fileList} = that.state;
                const formData = new FormData();
                formData.append("file", fileList[0]);
                const hide = message.loading('resource uploading', 0);
                fetch(Api.uploadMovie(), {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        // "Content-Type": "multipart/form-data"
                    },
                    body: formData,
                })
                    .then(response => response.json())
                    .then(info => {
                        setTimeout(hide, 1);
                        if (info.status !== 1) {
                            message.error("Movie upload failed");
                            console.log(`error message: ${info.msg}`);
                        } else {
                            message.success("Movie uploaded successfully");
                        }

                    })
                    .catch(error => console.error('Error:', error));
            },
        };

        return (
            <div>
                <IconTitle/>
                <br/>
                <br/>
                <Row>
                    <Col span={5}/>
                    <Col span={14}>
                        <div id="pad">
                            <Divider orientation="left"><h2>Movie Resource Management</h2></Divider>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={<span><Icon type="cloud-upload"/>resource upload</span>} key="1">
                                    <div id="info">
                                        <Form onSubmit={this.handleSubmit.bind(this)}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="movie name">
                                                {getFieldDecorator('title', {
                                                    rules: [{required: true, message: 'Please enter a movie name!'}],
                                                })(
                                                    <Input className="inputFiled"/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="score"
                                            >
                                                {getFieldDecorator('score')(
                                                    <Slider max="10"
                                                            step="0.1"
                                                            marks={{
                                                                0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5',
                                                                6: '6', 7: '7', 8: '8', 9: '9', 10: '10'
                                                            }}/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="alias">
                                                {getFieldDecorator('alias', {
                                                    rules: [{required: true, message: 'Please enter a movie alias!'}],
                                                })(
                                                    <Input className="inputFiled"/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="duration"
                                            >
                                                {getFieldDecorator('length', {initialValue: 120})(
                                                    <InputNumber min={1}/>
                                                )}
                                                <span className="ant-form-text"> minute</span>
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="release date">
                                                {getFieldDecorator('releaseDate', {
                                                    rules: [{required: true, message: 'Please enter a movie movie release date!'}],
                                                })(
                                                    <Input className="inputFiled"/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="director">
                                                {getFieldDecorator('director', {
                                                    rules: [{required: true, message: 'Please enter the director!'}],
                                                })(
                                                    <Select
                                                        mode="tags"
                                                        style={{width: '100%'}}
                                                        tokenSeparators={[',']}/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="screenwriter">
                                                {getFieldDecorator('screenwriter', {
                                                    rules: [{required: true, message: 'Please enter the screenwriter!'}],
                                                })(
                                                    <Select
                                                        mode="tags"
                                                        style={{width: '100%'}}
                                                        tokenSeparators={[',']}/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="starring">
                                                {getFieldDecorator('cast', {
                                                    rules: [{required: true, message: 'Please enter the leading role!'}],
                                                })(
                                                    <Select
                                                        mode="tags"
                                                        style={{width: '100%'}}
                                                        tokenSeparators={[',']}/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="movie type"
                                                hasFeedback>
                                                {getFieldDecorator('movieType', {
                                                    rules: [
                                                        {required: true, message: 'Please select a movie type!'},
                                                    ],
                                                })(
                                                    <Select mode="tags"
                                                            style={{width: '100%'}}
                                                            tokenSeparators={[',']}
                                                            placeholder="select movie type">
                                                        <Option value="plot">plot</Option>
                                                        <Option value="comedy">comedy</Option>
                                                        <Option value="thriller">thriller</Option>
                                                        <Option value="action">action</Option>
                                                        <Option value="love">love</Option>
                                                        <Option value="crime">crime</Option>
                                                        <Option value="fear">fear</Option>
                                                        <Option value="adventure">adventure</Option>
                                                        <Option value="suspenseful">suspenseful</Option>
                                                        <Option value="sciencefiction">science fiction</Option>
                                                        <Option value="family">family</Option>
                                                        <Option value="fantasy">fantasy</Option>
                                                        <Option value="animation">animation</Option>
                                                        <Option value="war">war</Option>
                                                        <Option value="history">history</Option>
                                                        <Option value="biography">biography</Option>
                                                        <Option value="music">music</Option>
                                                        <Option value="songanddance">song and dance</Option>
                                                        <Option value="sports">sports</Option>
                                                        <Option value="west">west</Option>
                                                        <Option value="documentary">documentary</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="plot">
                                                {getFieldDecorator('overview', {
                                                    rules: [{required: true, message: 'Please enter the plot!'}],
                                                })(
                                                    <TextArea className="inputFiled" rows={5}/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="poster"
                                                extra={<img src={this.state.post} alt="post"/>}>
                                                {getFieldDecorator('post', {
                                                    rules: [{required: true, message: 'Please enter a poster URL！'}],
                                                })(
                                                    <Input onChange={this.onHandleChangePostUrl.bind(this)}
                                                           className="inputFiled"/>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="Movie resource upload"
                                            >
                                                {getFieldDecorator('upload')(
                                                    <Dragger {...uploadProps}>
                                                        <p className="ant-upload-drag-icon">
                                                            <Icon type="inbox"/>
                                                        </p>
                                                        <p className="ant-upload-text">Click this area to upload movie files</p>
                                                        <p className="ant-upload-hint">Uploaded movie file type is MP4</p>
                                                    </Dragger>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                wrapperCol={{span: 12, offset: 6}}
                                            >
                                                <Button type="primary" htmlType="submit"
                                                        icon="upload"
                                                        loading={this.state.uploadLoading}> upload upload </Button>
                                            </FormItem>
                                        </Form>
                                    </div>
                                </TabPane>
                                <TabPane tab={<span><Icon type="delete"/>movie delete</span>} key="2">
                                    <br/>
                                    <br/>
                                    <Spin tip="Deleting movie info, please wait" spinning={this.state.deleteLoading}>
                                        <Row>
                                            <Col span={2}/>
                                            <Col span={2}>
                                                <Button icon="delete" type="danger" ghost
                                                        onClick={this.onHandleConfirmDeleteTips.bind(this)}> delete
                                                        remove </Button>
                                            </Col>
                                            <Col span={2}/>
                                            <Col span={10}>
                                                {
                                                    (data[0] == null || count == null) ? <div></div>
                                                        :
                                                        data.map(item =>
                                                            <div id="movieItem">
                                                                <Popover content={<img src={item.post} alt="post"/>}
                                                                         placement="rightTop">
                                                                    <Checkbox value={item.title}
                                                                              onChange={this.onSelectedMovie.bind(this)}
                                                                              key={item.title}>{item.title}</Checkbox>
                                                                    <br/><br/>
                                                                </Popover>
                                                            </div>
                                                        )
                                                }
                                            </Col>
                                        </Row>
                                        <br/>
                                        <br/>
                                        <Row>
                                            <Col span={6}/>
                                            <Col span={10}>
                                                <Pagination defaultCurrent={1} total={count} defaultPageSize={12}
                                                            onChange={this.onPageChange.bind(this)}/>
                                            </Col>
                                        </Row>
                                    </Spin>
                                    <br/>
                                    <br/>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Col>
                    <Col span={5}/>
                </Row>
            </div>
        )
    }
}

export default MovieResourceManage = Form.create({})(MovieResourceManage);
