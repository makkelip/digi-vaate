import React, {Component} from "react";
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {Card,Button, Modal, Select, message,TreeSelect} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'


class SingleProductImg extends Component{
    constructor(props){
        super(props);
        this.state = {
            changeLocationVisible: false,
            value: null,
            moveToSeason: false,
            moveToCollection: false,
            newCollectionUrl: null,
            newSeasonUrl: null
        }
    }

    seasons = null;
    collections = null;
    treeData = [];

    //Change location of product

    handleChangeLocationCancel = (e) => {
        this.setState({
            changeLocationVisible: false,
        });
    };
    changeLocation = () => {
        this.setState({
            changeLocationVisible: true
        })
    };

    onChange = (value) => {
        this.setState({ value });
    };

    handleChangeLocationOk = () => {
        for(let i=0;i<this.seasons.length;i++){
            if(this.state.value === this.seasons[i][1]){
                if(this.state.value === this.props.seasonName && this.props.collectionName === "None"){
                    message.error(`You are currently on ${this.props.seasonName}`,1.5)
                }
                else {
                    axios.patch(`${API_ROOT}/product?name=${this.props.loadedProduct.name}`,{seasonId:this.seasons[i][0]})
                        .then(() => {
                            this.props.changeLocation();
                            message.success("Change successfully",1);
                            this.setState({
                                moveToSeason: true,
                                newSeasonUrl:`/seasons/${this.state.value}/products/${this.props.loadedProduct.name}`,
                            })
                        })
                }
            }
        }
        for(let i=0;i<this.collections.length;i++){
            if(this.state.value === this.collections[i][1]){
                if(this.state.value === this.props.collectionName){
                    message.error(`You are currently on ${this.props.collectionName}`,1.5)
                }
                else {
                    axios.patch(`${API_ROOT}/product?name=${this.props.loadedProduct.name}`, {collectionId: this.collections[i][0]})
                        .then(() => {
                            for (let j = 0; j < this.seasons.length; j++) {
                                if (this.collections[i][2] === this.seasons[j][0]) {
                                    message.success("Change successfully", 1)
                                    this.props.changeLocation();
                                    this.setState({
                                        moveToCollection: true,
                                        newCollectionUrl: `/seasons/${this.seasons[j][1]}/collections/${this.state.value}/products/${this.props.loadedProduct.name}`,
                                    });
                                }
                            }
                        })
                }
            }
        }
    };

    render(){
        const {seasons,collections} = this.props;
        let moveToSeason = null;
        let moveToCollection = null;
        if(this.state.moveToSeason){
            moveToSeason = <Redirect from={`${this.props.match.url}`} to={{
                    pathname: this.state.newSeasonUrl,
                    state: {moveToNewLocation: true}
                }}/>
        }
        if(this.state.moveToCollection){
            moveToCollection = <Redirect to={{
                    pathname: this.state.newCollectionUrl,
                    state: {moveToNewLocation: true}
                }}/>
        }
        let changeLocationBtn = <div style={{height:32}}></div>;
        let currentLocation = null;
        if(this.props.editModeStatus === true) {
            changeLocationBtn = <Button onClick={this.changeLocation}>Change</Button>;
        }
        this.seasons = seasons.map(season => {
            return [season.id,season.name]
        });
        this.collections = collections.map(collection => {
            return [collection.id,collection.name,collection.seasonId]
        });
        this.treeData = seasons.map(season => {
            let collectionsChild = collections.reduce((collections,collection) => {
                if(collection.seasonId === season.id) {
                    collections.push({
                        title: "Collection: " + collection.name,
                        value: collection.name,
                        key: collection.name + collection.id
                    });
                }
                return collections
            },[]);
            return {
                title: "Season: " + season.name,
                value: season.name,
                key: season.name + season.id,
                children: collectionsChild
            }
        });
        if(this.props.collectionName === "None" && this.props.seasonName === "None"){
            currentLocation = (
                <div>
                    <p>Current location:</p>
                    <h3>Company</h3>
                </div>)
        }
        else if(this.props.collectionName === "None"){
            currentLocation = (
                <div>
                    <p>Current location:</p>
                    <h3>Season {this.props.seasonName}</h3>
                </div>)
        }
        else {
            currentLocation = (
                <div>
                    <p>Current location:</p>
                    <h3>Collection {this.props.collectionName}</h3>
                </div>)
        }

        return (
            <Card className="product-description">
                {moveToSeason}
                {moveToCollection}
                {changeLocationBtn}
                <Modal
                    title="Change Location"
                    visible={this.state.changeLocationVisible}
                    onOk={this.handleChangeLocationOk}
                    onCancel={this.handleChangeLocationCancel}
                    bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                >
                    {currentLocation}
                    <p>Change to:</p>
                    <TreeSelect
                        style={{ width: 300 }}
                        value={this.state.value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.treeData}
                        placeholder="Please select"
                        treeDefaultExpandAll
                        onChange={this.onChange}
                    />
                </Modal>
                <p>Season:{this.props.seasonName}</p>
                <p>Collection:{this.props.collectionName}</p>
            </Card>
        )
    }
}

export default SingleProductImg;

