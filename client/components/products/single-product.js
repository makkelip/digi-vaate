import React, {Component} from "react";
import axios from 'axios';
import {Card, Col, Row, Divider, Input, Button, Icon, Modal, Select, message,Spin,TreeSelect} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import FormData from 'form-data';

const Option = Select.Option;

class SingleProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            loadedProduct: null,
            productName: '',
            productImg: null,
            productColors: null,
            colorOptions: null,
            updateColors: null,
            productMaterials: null,
            materialOptions: null,
            updateMaterials: null,
            collectionName:'None',
            seasonName:'None',
            seasons: null,
            collections:null
        };
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorOk = this.handleColorOk.bind(this);
        this.handleColorCancel = this.handleColorCancel.bind(this);
        this.handleMaterialChange = this.handleMaterialChange.bind(this);
        this.handleMaterialOk = this.handleMaterialOk.bind(this);
        this.handleMaterialCancel = this.handleMaterialCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNameOk = this.handleNameOk.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    updatedColors = [];
    updatedMaterials = [];
    treeData = [];
    seasons = null;
    collections = null;

    componentDidMount() {
        this.loadProduct();
        this.loadColors();
        this.loadMaterials();
        this.loadSeason();
        this.loadCollection();
    }

    loadSeason = () => {
        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.setState({
                    seasons: response.data
                })
            })
    };

    loadCollection = () => {
        axios.get(`${API_ROOT}/collection`)
            .then(response => {
                this.setState({
                    collections: response.data
                })
            })
    };

    loadProduct() {
        if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
            const { location } = this.props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            if (!this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId)) {
                axios.get(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`)
                    .then(response => {
                        if(response.data[0].companyId){
                            this.setState({
                                collectionName: "None",
                                seasonName:"None"
                            });
                        }
                        if(response.data[0].seasonId){
                            axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                                .then(res => {
                                    this.setState({
                                        collectionName: "None",
                                        seasonName:res.data[0].name
                                    });
                                });
                        }
                        if(response.data[0].collectionId){
                            axios.get(`${API_ROOT}/product?name=${response.data[0].name}`)
                                .then(response => {
                                    axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                                        .then(res => {
                                            this.setState({
                                                collectionName: res.data[0].name,
                                            });
                                            axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                                                .then(re => {
                                                    this.setState({
                                                        seasonName: re.data[0].name,
                                                    });
                                                })
                                        });
                                })
                        }
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name
                        });
                    })
                    .then(() => this.updatedColors = this.state.productColors)
            }
        }
        else if(this.props.match.params.productId){
            if (!this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId)) {
                axios.get(`${API_ROOT}/product?name=${this.props.match.params.productId}`)
                    .then(response => {
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name
                        });
                    })
                    .then(() => this.updatedColors = this.state.productColors)
            }
        }
    }


    /*Edit color*/
    loadColors() {
        axios.get(`${API_ROOT}/color`)
            .then(response => {
                this.setState({
                    colorOptions: response.data
                })
            })
    }

    handleColorChange(value) {
        this.setState(prevState => prevState);
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.colorOptions.length; j++) {
                if (value[i] === this.state.colorOptions[j].name) {
                    value[i] = this.state.colorOptions[j].id
                }
            }
        }
        this.updatedColors = value;
    }

    showColorModal = (e) => {
        this.setState({
            colorVisible: true,
        });
    };

    handleColorOk(event) {
        if (this.updatedColors.length > 8) {
            message.error('Maximum 8 colors!')
        }

        if (this.updatedColors.length <= 8) {
            if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
                const { location } = this.props;
                const pathSnippets = location.pathname.split('/').filter(i => i);
                axios.patch(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`, {colors: this.updatedColors})
                    .then(() => this.setState(prevState => prevState))
                    .then(() => this.setState({colorVisible: false}))
                    .then(() => {
                        setTimeout(() => {
                            message.success("Colors updated!", 1);
                            axios.get(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`)
                                .then(response => {
                                    this.setState({
                                        productColors: response.data[0].colors
                                    });
                                })
                        }, 100)
                    })
            }
            else if(this.props.match.params.productId){
                axios.patch(`${API_ROOT}/product?name=${this.props.match.params.productId}`, {colors: this.updatedColors})
                    .then(() => this.setState(prevState => prevState))
                    .then(() => this.setState({colorVisible: false}))
                    .then(() => {
                        setTimeout(() => {
                            message.success("Colors updated!", 1);
                            axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                                .then(response => {
                                    this.setState({
                                        productColors: response.data[0].colors
                                    });
                                })
                        }, 100)
                    })
            }
        }
    };

    handleColorCancel = (e) => {
        this.setState({
            colorVisible: false,
        });
    };

    /*Edit material*/

    loadMaterials() {
        axios.get(`${API_ROOT}/material`)
            .then(response => {
                this.setState({
                    materialOptions: response.data
                })
            })
    }

    showMaterialModal = (e) => {
        this.setState({
            materialVisible: true
        })
    };

    handleMaterialCancel = (e) => {
        this.setState({
            materialVisible: false,
        });
    };

    handleMaterialChange(value) {
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.materialOptions.length; j++) {
                if (value[i] === this.state.materialOptions[j].name) {
                    value[i] = this.state.materialOptions[j].id
                }
            }
        }
        this.updatedMaterials = value;
    }

    handleMaterialOk() {
        if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
            const { location } = this.props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            axios.patch(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`, {materials: this.updatedMaterials})
                .then(() => this.setState(prevState => prevState))
                .then(() => this.setState({materialVisible: false}))
                .then(response => {
                    setTimeout(() => {
                        message.success("Materials updated!", 1);
                        axios.get(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`)
                            .then(response => {
                                this.setState({
                                    productMaterials: response.data[0].materials,
                                });
                            })
                    }, 100)
                })
        }
        else if(this.props.match.params.productId){
            axios.patch(`${API_ROOT}/product?name=${this.props.match.params.productId}`, {materials: this.updatedMaterials})
                .then(() => this.setState(prevState => prevState))
                .then(() => this.setState({materialVisible: false}))
                .then(response => {
                    setTimeout(() => {
                        message.success("Materials updated!", 1);
                        axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                            .then(response => {
                                this.setState({
                                    productMaterials: response.data[0].materials,
                                });
                            })
                    }, 100)
                })
        }
    };

    /*Edit name*/
    showNameModal = (e) => {
        this.setState({
            nameVisible: true
        })
    };

    handleNameCancel = (e) => {
        this.setState({
            nameVisible: false,
        });
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleNameOk() {
        if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
            const { location } = this.props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            axios.patch(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`, {name: this.state.productName})
                .then(response => {
                    axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                        .then(response => {
                            this.setState({
                                loadedProduct: response.data[0],
                                productColors: response.data[0].colors,
                                productMaterials: response.data[0].materials,
                                productName: response.data[0].name,
                                nameVisible: false
                            });
                            //window.location.href = `http://localhost:3000/${this.props.seasonId}/${this.props.collectionId}/products/${this.state.productName}`;
                            //this.props.history.replace(`${this.state.productName}`)
                        })
                })
        }
        else if(this.props.match.params.productId){
            axios.patch(`${API_ROOT}/product?name=${this.props.match.params.productId}`, {name: this.state.productName})
                .then(response => {
                    axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                        .then(response => {
                            this.setState({
                                loadedProduct: response.data[0],
                                productColors: response.data[0].colors,
                                productMaterials: response.data[0].materials,
                                productName: response.data[0].name,
                                nameVisible: false
                            });
                            //window.location.href = `http://localhost:3000/${this.props.seasonId}/${this.props.collectionId}/products/${this.state.productName}`;
                            //this.props.history.replace(`${this.state.productName}`)
                        })
                })
        }
    }

    //Edit product image
    onFileChange(e) {
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/product/image?name=${this.state.productName}`, data)
            .then(() => {
                axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                    .then(response => {
                        this.setState({
                            productImg: response.data[0].imagePath
                        });
                    });
            })
    }

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
                if(this.state.value === this.state.seasonName && this.state.collectionName === "None"){
                    message.error(`You are currently on ${this.state.seasonName}`,1.5)
                }
                else {
                    axios.patch(`${API_ROOT}/product?name=${this.state.loadedProduct.name}`,{seasonId:this.seasons[i][0]})
                        .then(() => {
                            message.success("Change successfully",1)
                            setTimeout(() => {
                                window.location.href = `${window.location.origin}/${this.state.value}/products/${this.state.loadedProduct.name}`
                            },1300)
                        })
                }
            }
        }
        for(let i=0;i<this.collections.length;i++){
            if(this.state.value === this.collections[i][1]){
                if(this.state.value === this.state.collectionName){
                    message.error(`You are currently on ${this.state.collectionName}`,1.5)
                }
                else {
                    axios.patch(`${API_ROOT}/product?name=${this.state.loadedProduct.name}`, {collectionId: this.collections[i][0]})
                        .then(() => {
                            for (let j = 0; j < this.seasons.length; j++) {
                                if (this.collections[i][2] === this.seasons[j][0]) {
                                    message.success("Change successfully", 1)
                                    setTimeout(() => {
                                        window.location.href = `${window.location.origin}/${this.seasons[j][1]}/${this.state.value}/products/${this.state.loadedProduct.name}`
                                    }, 1300)
                                }
                            }
                        })
                }
            }
        }
    };

    render() {
        if (this.state.loadedProduct && this.state.colorOptions && this.state.materialOptions && this.state.seasons && this.state.collections) {
            this.seasons = this.state.seasons.map(season => {
                return [season.id,season.name]
            });
            this.collections = this.state.collections.map(collection => {
                return [collection.id,collection.name,collection.seasonId]
            });
            this.treeData = this.state.seasons.map(season => {
                let collections = this.state.collections.map(collection => {
                    if(collection.seasonId === season.id){
                        return {
                            title: "Collection: "+collection.name,
                            value: collection.name,
                            key: collection.name + collection.id
                        }
                    }

                });
                return {
                    title: "Season: " + season.name,
                    value: season.name,
                    key: season.name + season.id,
                    children: collections
                }
            });
            let currentLocation = null;
            let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
            let renderColorOptions = [];
            let renderDefaultColors = [];
            let renderProductColors = <p>This product does not have any colors yet</p>;
            let renderProductMaterials = <p>This product does not have any materials yet</p>;
            let renderMaterialOptions = [];
            let renderDefaultMaterials = [];
            if (this.state.productImg !== null) {
                imgUrl = `${API_ROOT}/${this.state.productImg}`
            }
            if (this.state.materialOptions.length > 0) {
                renderMaterialOptions = this.state.materialOptions.map(material =>
                    <Option key={material.name}>
                        {material.name}
                    </Option>
                )
            }
            if (this.state.colorOptions.length > 0) {
                renderColorOptions = this.state.colorOptions.map(color =>
                    <Option key={color.name} style={{color: color.value}}>
                        {color.name}
                    </Option>
                )
            }
            if (this.state.productColors.length > 0) {
                renderDefaultColors = this.state.productColors.map(color => color.name);
                renderProductColors = this.state.productColors.map(color =>
                    (
                        <Col span={2} key={color.id}>
                            <Card hoverable className="product-color" style={{
                                backgroundColor: color.value,
                            }}/>
                        </Col>
                    )
                )
            }
            if (this.state.productMaterials.length > 0) {
                renderDefaultMaterials = this.state.productMaterials.map(material => material.name);
                renderProductMaterials = this.state.productMaterials.map(material =>
                    (
                        <Col key={material.id} span={4}>
                            <div
                                className="product-material"
                            >
                                <p>{material.name}</p>
                            </div>
                        </Col>
                    )
                )
            }
            if(this.state.collectionName === "None" && this.state.seasonName === "None"){
                currentLocation = (
                    <div>
                        <p>Current location:</p>
                        <h3>Company</h3>
                    </div>)
            }
            else if(this.state.collectionName === "None"){
                currentLocation = (
                    <div>
                        <p>Current location:</p>
                        <h3>Season {this.state.seasonName}</h3>
                    </div>)
            }
            else {
                currentLocation = (
                    <div>
                        <p>Current location:</p>
                        <h3>Collection {this.state.collectionName}</h3>
                    </div>)
            }
            return (
                <div>
                    <Row type="flex">
                        <h1>{this.state.loadedProduct.name}&nbsp;</h1>
                        <Button className="edit-btn"
                                onClick={this.showNameModal}
                        >
                            <Icon type="edit"/>
                        </Button>
                        <Modal
                            title="Edit name"
                            visible={this.state.nameVisible}
                            onOk={this.handleNameOk}
                            onCancel={this.handleNameCancel}
                            bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                        >
                            <Input
                                placeholder="Product name"
                                name="productName"
                                value={this.state.productName}
                                onChange={this.handleChange}
                            />
                        </Modal>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="img-container">
                                <div className="upload-btn-wrapper">
                                    <input type="file" name="file" onChange={this.onFileChange}/>
                                    <button className="btn-upload"><Icon type="upload"/></button>
                                </div>
                                <img alt="example" height="300" width="370" src={`${imgUrl}`}/>
                            </div>
                            <Card className="product-description">
                                <Button onClick={this.changeLocation}>Change</Button>
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
                                <p>Season:{this.state.seasonName}</p>
                                <p>Collection:{this.state.collectionName}</p>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <Card title="Product information" className="product-card-information">
                                <Row gutter={8}>
                                    <h4>Colors</h4>
                                    {renderProductColors}
                                    <Button className="edit-btn"
                                            onClick={this.showColorModal}
                                    >
                                        <Icon type="edit"/>
                                    </Button>
                                    <Modal
                                        title="Edit color"
                                        visible={this.state.colorVisible}
                                        onOk={this.handleColorOk}
                                        onCancel={this.handleColorCancel}
                                        bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                                    >
                                        <p>Number of colors: {this.updatedColors.length}/8</p>
                                        <Select
                                            mode="tags"
                                            size={'default'}
                                            placeholder="Please select"
                                            defaultValue={renderDefaultColors}
                                            onChange={this.handleColorChange}
                                            style={{width: '100%'}}
                                        >
                                            {renderColorOptions}
                                        </Select>
                                    </Modal>
                                </Row>
                                <Divider/>
                                <Row gutter={8}>
                                    <h4>Materials</h4>
                                    {renderProductMaterials}
                                    <Button className="edit-btn"
                                            onClick={this.showMaterialModal}
                                    >
                                        <Icon type="edit"/>
                                    </Button>
                                    <Modal
                                        title="Edit material"
                                        visible={this.state.materialVisible}
                                        onOk={this.handleMaterialOk}
                                        onCancel={this.handleMaterialCancel}
                                        bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                                    >
                                        <Select
                                            mode="tags"
                                            size={'default'}
                                            placeholder="Please select"
                                            defaultValue={renderDefaultMaterials}
                                            onChange={this.handleMaterialChange}
                                            style={{width: '100%'}}
                                        >
                                            {renderMaterialOptions}
                                        </Select>
                                    </Modal>
                                </Row>
                                <Divider/>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
        else {
            return <Spin/>
        }

    }
}
export default SingleProduct;

