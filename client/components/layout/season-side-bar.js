import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {NavLink, Link} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;
const MenuItemGroup = Menu.ItemGroup;
import axios from'axios';
import { API_ROOT } from '../../api-config';
import "./layout.css"



class SeasonSideBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            collections: null,
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.newCollection !== this.props.newCollection){
            axios.get(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`)
                .then(response => {
                    this.setState({
                        collections: response.data[0].collections
                    });
                })
                .catch(err => console.error(err));
        }
    }

    componentDidMount() {
        axios.get(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`)
            .then(response => {
                this.setState({
                    collections: response.data[0].collections
                });
            })
            .catch(err => console.error(err));
    }

    render(){
        let renderCollectionList = null;
        if(this.state.collections){
            renderCollectionList = this.state.collections.map(collection =>
                <Menu.Item className="collection-item" style={{paddingLeft:45}} key={collection.id}>
                    <NavLink to={`/${this.props.match.params.seasonId}/${collection.name}`} className="nav-text">
                        {collection.name}
                    </NavLink>
                </Menu.Item>
            );
        }
        return (
            <Sider>
                <Menu mode="inline" className="side-bar-menu">
                    <Menu.Item key="products">
                        <NavLink to={`/${this.props.match.params.seasonId}/products`} className={'nav-text'}>
                                Products
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="budget">
                        <NavLink to={`/${this.props.match.params.seasonId}/budget`} className={'nav-text'}>
                            Budget
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="colors">
                        <NavLink to={`/${this.props.match.params.seasonId}/colors`} className={'nav-text'}>
                            Colors
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="collections">
                        <NavLink to={`/${this.props.match.params.seasonId}/collections`} className={'nav-text'}>
                            Collections
                        </NavLink>Collection
                    </Menu.Item>
                    {renderCollectionList}
                </Menu>
            </Sider>
        )
    }
}

export default SeasonSideBar;
