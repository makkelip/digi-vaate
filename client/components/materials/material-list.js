import React,{ Component } from "react";
import MaterialCreateForm from './newMaterial'
import { Card, Row, Col,Icon,Avatar,Button,Form,message,Modal } from 'antd';
import {Redirect} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Meta } = Card;


class MaterialList extends Component{
    constructor(props){
        super(props);
        this.state ={
            isFetched: false,
            isSelected:false,
            materialName:null,
            visible: false
        };
    }

    uploadImage=null;

    componentDidMount() {
        axios.get(`${API_ROOT}/material`)
            .then(response => this.materials = response.data)
            .then(() => this.setState({isFetched: true}))
            .catch(err => console.log(err));
    }

    handleSelect = (materialName) =>{
        this.setState({
            isSelected:true,
            materialName: materialName
        })
    };

    handleDelete = (materialName) =>{
        confirm({
            title: 'Are you sure remove this product from collection?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${API_ROOT}/material?name=${materialName}`);
                window.location.reload();
            },
            onCancel() {
                console.log(productName);
            },
        });
    };

    createNewMaterial = () => {
        this.setState({ visible: true })
    };


    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            //values.imagePath = values.imagePath.split('\\').pop().split('/').pop();
            values.imagePath = null;
            console.log('Received values of form: ', values);
            if(this.uploadImage) {
                axios.post(`${API_ROOT}/material`, values)
                    .then(response => {
                        axios.patch(`${API_ROOT}/material/${response.data.id}/image`, this.uploadImage)
                            .then(() => {
                                message.success("Material created",1);
                                axios.get(`${API_ROOT}/material`)
                                    .then(res => {
                                        this.materials = res.data;
                                        this.setState({visible: false});
                                        this.uploadImage = null;
                                    });
                            });
                    })
                    .then(() => this.setState(prevState => prevState));
                form.resetFields();
            }
            else if(!this.uploadImage){
                axios.post(`${API_ROOT}/material`, values)
                    .then(response => {
                        message.success("Material created",1);
                        axios.get(`${API_ROOT}/material`)
                            .then(res => {
                                this.materials = res.data;
                                this.setState({visible: false});
                            });
                    })
                    .then(() => this.setState(prevState => prevState));
                form.resetFields();
            }
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {
        let renderMaterialList = null;
        let singleMaterial= null;
        if (this.state.isSelected) {
            singleMaterial = <Redirect to={{
                pathname: this.props.match.url + "/" + this.state.materialName
            }}/>
        }
        if (this.materials) {
            renderMaterialList = this.materials.map(material =>{
                let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
                if(material.imagePath !== null){
                    imgUrl = `${API_ROOT}/${material.imagePath}`
                }
                    return(
                        <Col span={6} key={material.id}>
                            <div className="material-card-wrapper">
                                <Card
                                    hoverable
                                    bodyStyle={{height:90}}
                                    className="material-card-display"
                                    cover={<img onClick = {() => this.handleSelect(material.name)} alt="example" className="material-img" src={`${imgUrl}`} />}
                                    actions={[
                                        <div onClick = {() => this.handleDelete(material.name)}>
                                            <Icon type="delete" />
                                        </div>
                                    ]}>
                                    <Meta
                                        onClick = {() => this.handleSelect(material.name)}
                                        title={material.name}
                                    />
                                </Card>
                            </div>
                        </Col>
                    )
                }

            );
        }
        if(renderMaterialList){
            if(renderMaterialList.length === 0){
                return (
                    <div>
                        <h1>Materials</h1>
                        <p>No materials yet...</p>
                    </div>
                )
            }
        }
        return (
            <div>
                {singleMaterial}
                <h1>Materials</h1>
                <Button type="primary"
                        size="large"
                        onClick={this.createNewMaterial}
                >
                    Create new material
                </Button>
                <MaterialCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    uploadImage={(data) => this.uploadImage = data}
                />
                <br/>
                <br/>
                <Row gutter={5}>
                    {renderMaterialList}
                </Row>
            </div>
        )
    }
}

export default MaterialList;

