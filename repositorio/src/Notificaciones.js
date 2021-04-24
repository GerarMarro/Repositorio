import React from 'react';
import { List, Avatar, Empty } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

class Notificaciones extends React.Component {

    state = {
        data: [],
        loading: false,
        hasMore: true,
    };

    componentDidMount() {
        var info = JSON.parse(localStorage.getItem("Notificaciones"));
        this.setState({
            data: info
        });
    }

    componentRender = () =>{
        if (this.state.data !== null && this.state.data !== undefined) {
            return(
                <>
                    <div className="demo-infinite-container">
                        <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        useWindow={false}
                        >
                            <List
                                dataSource={this.state.data}
                                renderItem={item => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                    avatar={
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    }
                                    title={<a href="https://ant.design">{item.name.last}</a>}
                                    description={item.email}
                                    />
                                    <div>Content</div>
                                </List.Item>
                                )}
                            >
                            </List>
                        </InfiniteScroll>
                    </div>
                </>
            );
        }else{
            return (
                <Empty description={"No hay notificaciones que mostrar"} />
            )
        }
    }


    render(){
        return(
            <this.componentRender />
        )
    }
}

export default Notificaciones;