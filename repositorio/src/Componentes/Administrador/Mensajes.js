import React from 'react';
import { Comment, Form, Button, List, Input } from 'antd';
import moment from 'moment';
import '../../../src/App.css';
import fondo from '../../images/fondo.jpg'

const { TextArea } = Input;

const CommentList = ({ comments }) => (
    
    <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={props => 
            <>
                <Comment {...props} style={
                    {
                        borderRadius:"20px", 
                        width:"50%", 
                        color:"white", 
                        backgroundColor:"#287EFF", 
                        marginTop:"5px",
                    }
                } />
            </>
        }
    />

);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} autoSize={false} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Enviar
        </Button>
        </Form.Item>
    </>
);

class Mensajes extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
    };

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    ...this.state.comments,
                    {
                        author: <p style={{color:"white"}}><strong>Han Solo</strong></p>,
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content: <p>{this.state.value}</p>,
                        datetime: <p style={{color:"white"}}>{moment().fromNow()}</p>,
                    },
                ],
            });
            var div = document.getElementsByClassName('mensajes')[0];
            div.scrollTop = div.scrollHeight;
        }, 100);
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    render() {
        const { comments, submitting, value } = this.state;

        return (
            <>
                <div className="mensajes" style={{backgroundImage: `url(${fondo})`, marginBottom:"10px"}}>
                    
                    {comments.length > 0 && <CommentList comments={comments} />}
                    <br />
                    <Comment />
                </div>
                <Editor
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                    submitting={submitting}
                    value={value}
                />
            </>
        );
    }
}

export default Mensajes;