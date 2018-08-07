import React,{ Component } from "react";
import axios from 'axios';
import { Card, Col,Row,Divider,Input,Button,Icon,Modal,Select,message } from 'antd';
import { API_ROOT } from '../../api-config';
import '../../utils';
import './materials.css'
import FormData from 'form-data';
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;
class SingleMaterial extends Component{
    constructor(props){
        super(props);
        this.state ={
            key: 'tab1',
            loadedMaterial:null,
            name:'',
            freight:0,
            consumption:0,
            minQuality:0,
            unitPrice:0,
            manufacturer:'',
            instructions:'',
            composition:'',
            code: '',
            widthUnit:'',
            weightUnit:'',
            width:0,
            weight:0,
            loadedMaterialOri:null,
            nameOri:'',
            freightOri:0,
            consumptionOri:0,
            minQualityOri:0,
            unitPriceOri:0,
            manufacturerOri:'',
            instructionsOri:'',
            compositionOri:'',
            codeOri: '',
            widthUnitOri:'',
            weightUnitOri:'',
            widthOri:0,
            weightOri:0,
            modified: false
        }
    }

    material =[];
    componentDidMount(){
        axios.get(`${API_ROOT}/material?name=${this.props.match.params.materialId}`)
            .then(response => {
                this.setState({
                    loadedMaterial: response.data[0],
                    name: response.data[0].name,
                    freight: response.data[0].freight,
                    minQuality:response.data[0].minQuality,
                    unitPrice:response.data[0].unitPrice,
                    manufacturer:response.data[0].manufacturer,
                    instructions:response.data[0].instructions,
                    composition:response.data[0].composition,
                    code: response.data[0].code,
                    widthUnit:response.data[0].widthUnit,
                    weightUnit:response.data[0].weightUnit,
                    width:response.data[0].width,
                    weight:response.data[0].weight,
                    loadedMaterialOri: response.data[0],
                    nameOri: response.data[0].name,
                    freightOri: response.data[0].freight,
                    minQualityOri:response.data[0].minQuality,
                    unitPriceOri:response.data[0].unitPrice,
                    manufacturerOri:response.data[0].manufacturer,
                    instructionsOri:response.data[0].instructions,
                    compositionOri:response.data[0].composition,
                    codeOri: response.data[0].code,
                    widthUnitOri:response.data[0].widthUnit,
                    weightUnitOri:response.data[0].weightUnit,
                    widthOri:response.data[0].width,
                    weightOri:response.data[0].weight
                })
            })
    }

    onFileChange = (e) =>{
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/material/${this.state.loadedMaterial.id}/image`, data)
            .then(() => {
                axios.get(`${API_ROOT}/material?name=${this.props.match.params.materialId}`)
                    .then(response => {
                        this.setState({
                            loadedMaterial: response.data[0]
                        });
                    });
            })
    };

    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    };

    handleEdit = () => {
        this.setState({ visible: true })
    };

    handleCancel = (e) =>{
        this.setState({
            visible: false,
        });
    };

    handleOk = () =>{
        const materialChanges = {
            freight: this.state.freight,
            minQuality:this.state.minQuality,
            unitPrice:this.state.unitPrice,
            manufacturer:this.state.manufacturer,
            instructions:this.state.instructions,
            composition:this.state.composition,
            code: this.state.code,
            widthUnit:this.state.widthUnit,
            weightUnit:this.state.weightUnit,
            width:this.state.width,
            weight:this.state.weight
        };
        const materialOri = {
            freight: this.state.freightOri,
            minQuality:this.state.minQualityOri,
            unitPrice:this.state.unitPriceOri,
            manufacturer:this.state.manufacturerOri,
            instructions:this.state.instructionsOri,
            composition:this.state.compositionOri,
            code: this.state.codeOri,
            widthUnit:this.state.widthUnitOri,
            weightUnit:this.state.weightUnitOri,
            width:this.state.widthOri,
            weight:this.state.weightOri
        };
        this.setState({
            freight: this.state.freight,
            minQuality:this.state.minQuality,
            unitPrice:this.state.unitPrice,
            manufacturer:this.state.manufacturer,
            instructions:this.state.instructions,
            composition:this.state.composition,
            code: this.state.code,
            widthUnit:this.state.widthUnit,
            weightUnit:this.state.weightUnit,
            width:this.state.width,
            weight:this.state.weight,
            visible:false,
            modified: !Object.compare(materialChanges, materialOri)
        });

    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleWeightUnitChange = (value) => {
        this.setState({
            weightUnit: value
        })
    };

    handleWidthUnitChange = (value) => {
        this.setState({
            widthUnit: value
        })
    };

    //Edit material name
    showNameModal = (e) => {
        this.setState({
            nameVisible:true
        })
    };

    handleNameCancel = (e) =>{
        this.setState({
            nameVisible: false,
        });
    };

    handleNameOk = () =>{
        axios.patch(`${API_ROOT}/material?name=${this.props.match.params.materialId}`,{name:this.state.name})
            .then(res => {
                axios.get(`${API_ROOT}/material?name=${this.state.name}`)
                    .then(response => {
                        this.setState({
                            loadedMaterial: response.data[0],
                            name:response.data[0].name,
                            freight: response.data[0].freight,
                            minQuality:response.data[0].minQuality,
                            unitPrice:response.data[0].unitPrice,
                            manufacturer:response.data[0].manufacturer,
                            instructions:response.data[0].instructions,
                            composition:response.data[0].composition,
                            code: response.data[0].code,
                            widthUnit:response.data[0].widthUnit,
                            weightUnit:response.data[0].weightUnit,
                            width:response.data[0].width,
                            weight:response.data[0].weight,
                            visible:false
                        });
                        window.location.href= `http://localhost:3000/${this.props.match.params.seasonId}/${this.props.match.params.collectionId}/materials/${this.state.name}`                    });
            })
    };


    discardChanges = () =>{
        let self=this;
        confirm({
            title: 'Are you sure to discard changes?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                axios.get(`${API_ROOT}/material?name=${self.props.match.params.materialId}`)
                    .then(response => {
                        self.setState({
                            loadedMaterial: response.data[0],
                            name: response.data[0].name,
                            freight: response.data[0].freight,
                            minQuality:response.data[0].minQuality,
                            unitPrice:response.data[0].unitPrice,
                            manufacturer:response.data[0].manufacturer,
                            instructions:response.data[0].instructions,
                            composition:response.data[0].composition,
                            code: response.data[0].code,
                            widthUnit:response.data[0].widthUnit,
                            weightUnit:response.data[0].weightUnit,
                            width:response.data[0].width,
                            weight:response.data[0].weight,
                            loadedMaterialOri: response.data[0],
                            nameOri: response.data[0].name,
                            freightOri: response.data[0].freight,
                            minQualityOri:response.data[0].minQuality,
                            unitPriceOri:response.data[0].unitPrice,
                            manufacturerOri:response.data[0].manufacturer,
                            instructionsOri:response.data[0].instructions,
                            compositionOri:response.data[0].composition,
                            codeOri: response.data[0].code,
                            widthUnitOri:response.data[0].widthUnit,
                            weightUnitOri:response.data[0].weightUnit,
                            widthOri:response.data[0].width,
                            weightOri:response.data[0].weight,
                            modified:false
                        })
                    })
            }
        })
    };

    saveInfo = () => {
        const materialChanges = {
            freight: this.state.freight,
            minQuality:this.state.minQuality,
            unitPrice:this.state.unitPrice,
            manufacturer:this.state.manufacturer,
            instructions:this.state.instructions,
            composition:this.state.composition,
            code: this.state.code,
            widthUnit:this.state.widthUnit,
            weightUnit:this.state.weightUnit,
            width:this.state.width,
            weight:this.state.weight
        };
        axios.patch(`${API_ROOT}/material?name=${this.props.match.params.materialId}`,materialChanges)
            .then(res => {
                axios.get(`${API_ROOT}/material?name=${this.props.match.params.materialId}`)
                    .then(response => {
                        message.success("Material updated!",1);
                        this.setState({
                            loadedMaterial: response.data[0],
                            name: response.data[0].name,
                            freight: response.data[0].freight,
                            minQuality:response.data[0].minQuality,
                            unitPrice:response.data[0].unitPrice,
                            manufacturer:response.data[0].manufacturer,
                            instructions:response.data[0].instructions,
                            composition:response.data[0].composition,
                            code: response.data[0].code,
                            widthUnit:response.data[0].widthUnit,
                            weightUnit:response.data[0].weightUnit,
                            width:response.data[0].width,
                            weight:response.data[0].weight,
                            loadedMaterialOri: response.data[0],
                            nameOri: response.data[0].name,
                            freightOri: response.data[0].freight,
                            minQualityOri:response.data[0].minQuality,
                            unitPriceOri:response.data[0].unitPrice,
                            manufacturerOri:response.data[0].manufacturer,
                            instructionsOri:response.data[0].instructions,
                            compositionOri:response.data[0].composition,
                            codeOri: response.data[0].code,
                            widthUnitOri:response.data[0].widthUnit,
                            weightUnitOri:response.data[0].weightUnit,
                            widthOri:response.data[0].width,
                            weightOri:response.data[0].weight,
                            modified:false,
                        });
                    });
            })
    }

    render(){
        if(this.state.loadedMaterial){
            let totalConsumption = this.state.loadedMaterial.products.reduce((sum,product) => sum + product.material_product.consumption,0);
            let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
            const tabList = [{
                key: 'tab1',
                tab: 'Price',
            }, {
                key: 'tab2',
                tab: 'Instruction',
            }, {
                key:'tab3',
                tab:'Composition'
            }];

            const contentList = {
                tab1: <div>
                    <p>Code: <span style={ this.state.code !== this.state.codeOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.code?this.state.code: "None"}</span> </p>
                    <p>Total Consumption: {totalConsumption}</p>
                    <p>Freight: <span style={ this.state.freight !== this.state.freightOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }> {this.state.freight} </span></p>
                    <p>Manufacturer: <span style={ this.state.manufacturer !== this.state.manufacturerOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.manufacturer}</span></p>
                    <p>Min Quality: <span style={ this.state.minQuality !== this.state.minQualityOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.minQuality}</span></p>
                    <p>Unit Price: <span style={ this.state.unitPrice !== this.state.unitPriceOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.unitPrice}</span></p>
                    <p>Width: <span style={ this.state.width !== this.state.widthOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.width}</span> <span style={ this.state.widthUnit !== this.state.widthUnitOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.widthUnit}</span></p>
                    <p>Weight: <span style={ this.state.weight !== this.state.weightOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.weight}</span> <span style={ this.state.weightUnit !== this.state.weightUnitOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.weightUnit}</span></p>
                </div>,
                tab2: <div>
                    <p><span style={ this.state.instructions !== this.state.instructionsOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.instructions}</span></p>
                </div>,
                tab3: <div>
                    <p><span style={ this.state.composition !== this.state.compositionOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.composition}</span></p>
                </div>
            };
            if(this.state.loadedMaterial.imagePath !== null){
                imgUrl = `${API_ROOT}/${this.state.loadedMaterial.imagePath}`;
            }
            return (
                <div>
                    <Row>
                    <Col span={8}>
                    <Row type="flex">
                        <h1>{this.state.name}&nbsp;</h1>
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
                            bodyStyle={{maxHeight:300,overflow:'auto'}}
                        >
                            <Input
                                placeholder="Material name"
                                name = "name"
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                        </Modal>
                    </Row>
                    </Col>
                    <Col span={8} offset={8}>
                        <Row type="flex">
                            <Button size="large" disabled={!this.state.modified} onClick={this.discardChanges}>Discard changes</Button>
                            <Button size="large" disabled={!this.state.modified} onClick={this.saveInfo}>Save</Button>
                        </Row>
                    </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="img-container">
                                <div className="upload-btn-wrapper">
                                    <input type="file" name="file" onChange={this.onFileChange}/>
                                    <button className="btn-upload"><Icon type="upload"/></button>
                                </div>
                                <img alt="example" height="300" width="370" src={`${imgUrl}`} />
                            </div>
                        </Col>
                        <Col span={16}>
                            <Card
                                className="material-card-info"
                                title="Material information"
                                extra={<Button onClick={this.handleEdit}>Edit</Button>}
                                tabList={tabList}
                                defaultActiveTabKey = "tab1"
                                onTabChange={(key) => { this.onTabChange(key, 'key'); }}
                            >
                                <Modal
                                    visible={this.state.visible}
                                    title="Edit material"
                                    okText="Update"
                                    onCancel={this.handleCancel}
                                    onOk={this.handleOk}
                                >
                                    <Row>
                                        Code:
                                        <Input
                                            className="input-style"
                                            value={this.state.code}
                                            name="code"
                                            onChange={this.handleChange}
                                        />
                                    </Row>
                                    <br/>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            Freight:
                                            <Input
                                                className="input-style"
                                                value={this.state.freight}
                                                name="freight"
                                                onChange={this.handleChange}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            Consumption:
                                            <Input
                                                className="input-style"
                                                value={this.state.consumption}
                                                name="consumption"
                                                onChange={this.handleChange}
                                            />
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            Min Quality:
                                            <Input
                                                className="input-style"
                                                value={this.state.minQuality}
                                                name="minQuality"
                                                onChange={this.handleChange}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            Unit Price:
                                            <Input
                                                className="input-style"
                                                value={this.state.unitPrice}
                                                name="unitPrice"
                                                onChange={this.handleChange}
                                            />
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            Width:
                                            <Input
                                                className="input-style"
                                                value={this.state.width}
                                                name="width"
                                                onChange={this.handleChange}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            Width unit:
                                            <br/>
                                            <Select defaultValue={this.state.widthUnit}
                                                    onChange={this.handleWidthUnitChange}
                                                    style={{width:150}}
                                            >
                                                <Option value="milimeters">milimeters</Option>
                                                <Option value="centimeters">centimeters</Option>
                                                <Option value="kilograms">meters</Option>
                                                <Option value="inches">inches</Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            Weight:
                                            <Input
                                                className="input-style"
                                                value={this.state.weight}
                                                name="weight"
                                                onChange={this.handleChange}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            Weight unit:
                                            <br/>
                                            <Select defaultValue={this.state.weightUnit}
                                                    onChange={this.handleWeightUnitChange}
                                                    style={{width:150}}
                                            >
                                                <Option value="miligrams">miligrams</Option>
                                                <Option value="grams">grams</Option>
                                                <Option value="kilograms">kilograms</Option>
                                                <Option value="pounds">pounds</Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        Manufacturer:
                                        <Input
                                            value={this.state.manufacturer}
                                            name="manufacturer"
                                            onChange={this.handleChange}
                                        />
                                    </Row>
                                    <br/>
                                    <Row>
                                        Instruction:
                                        <TextArea
                                            value={this.state.instructions}
                                            name="instructions"
                                            onChange={this.handleChange}
                                            row={4}
                                        />
                                    </Row>
                                    <br/>
                                    <Row>
                                        Composition:
                                        <TextArea
                                            value={this.state.composition}
                                            name="composition"
                                            onChange={this.handleChange}
                                            row={4}
                                        />
                                    </Row>
                                </Modal>
                                {contentList[this.state.key]}
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
        else{
            return "Loading..."
        }
    }
}

export default SingleMaterial;