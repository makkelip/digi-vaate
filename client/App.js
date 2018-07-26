import React from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import axios from 'axios';
import {API_ROOT} from './api-config';
import BudgetPlanningTable from './components/summary-table'
import HeaderBar from './components/layout/header-bar'
import SideBar from './components/layout/side-bar'
import FooterArea from './components/layout/footer'
import ColorIndexPage from './components/colors/index'
import MaterialList from './components/materials/material-list'
import ProductsDisplay from './components/products/products-display'
import SingleProduct from './components/products/single-product-index'
import SeasonSideBar from './components/layout/season-side-bar'
import CollectionSideBar from './components/layout/collection-side-bar'
import SingleCollection from './components/collections/single_collection'
import ThemeList from './components/themes/theme-list'
import SingleMaterial from './components/materials/single-material'
import SingleSeason from './components/seasons/single-season'
import SingleCompany from './components/company/single-company'
import BreadCrumbDisplay from './components/layout/breadcrumb'

import {BrowserRouter,Route,Switch} from 'react-router-dom'
import { BackTop } from 'antd';
import ProductCard from "./components/products/product-card";


class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newSeasonName: "",
            newCollectionName: "",
            newProductCompany: "",
            mount:false,
            renderBC: false
        }
    }

    productsSeason = [];
    productsCompany = [];
    collections

    newProductCompanyFunc = (newProductCompany) => {
        this.productsCompany.push(newProductCompany);
        this.setState({})
    };

    newProductSeasonFunc = (newProductSeason) => {
        this.productsCompany.push(newProductSeason);
        this.productsSeason.push(newProductSeason);
        this.setState({})
    };

    newProductCollectionFunc = (newProductCollection) => {
        this.productsCompany.push(newProductCollection);
        this.productsSeason.push(newProductCollection);
        this.setState({})
    };

    newSeasonNameFunc = (seasonName) => {
        this.setState({
            newSeasonName: seasonName,
            renderBC: !this.state.renderBC
        })
    };

    newCollectionNameFunc = (collectionName) => {
        this.setState({
            newCollectionName: collectionName,
            renderBC:!this.state.renderBC
        })

    };

    componentDidMount(){
        axios.get(`${API_ROOT}/product`)
            .then(response => {
                for(let i = 0; i< response.data.length; i++){
                    this.productsCompany.push(response.data[i].name);
                    if(response.data[i].collectionId !== null || response.data[i].seasonId !== null){
                        this.productsSeason.push(response.data[i].name);
                    }
                }
                this.setState({})
            })
    }
    render(){
        let productsCompanyRoute = null;
        let productsCompanyRouteSideBar = null;
        let productsSeasonRoute = null;
        let productsSeasonRouteSideBar = null;
        if(this.productsCompany.length > 0){
            productsCompanyRoute = this.productsCompany.map(product =>
                <Route path={`/products/${product}`} key={`company-${product.id}`} exact component={SingleProduct}
                />
            );
            productsCompanyRouteSideBar = this.productsCompany.map(product =>
                <Route path={`/products/${product}`} key={`company-sidebar-${product.id}`} exact component={SideBar}/>
            );
        }
        if(this.productsSeason.length > 0){
            productsSeasonRoute = this.productsSeason.map(product =>
                <Route path={`/:seasonId/products/${product}`} key={`season-${product.id}`} exact component={SingleProduct}/>
            );
            productsSeasonRouteSideBar =  this.productsSeason.map(product =>
                <Route path={`/:seasonId/products/${product}`} key={`season-sidebar-${product.id}`} exact component={SeasonSideBar}/>
            );
        }

        return(
            <BrowserRouter>
                <div className="App">
                    <Route path="/" component={(props) => <HeaderBar {...props}/>}/>
                    <div className="sider">
                        <Switch>
                            <Route path="/" exact component={SideBar}/>
                            <Route path="/products" component = {SideBar}/>
                            <Route path="/seasons" render ={(props) =>
                                <SideBar
                                    {...props}
                                    newSeason = {this.state.newSeasonName}
                                />}
                            />
                            {productsCompanyRouteSideBar}
                            <Route path="/:seasonId" exact component={SeasonSideBar} />
                            <Route path={'/:seasonId/budget'} exact component={SeasonSideBar}/>
                            <Route path={'/:seasonId/products'} exact component={SeasonSideBar}/>
                            <Route path="/:seasonId/collections" exact render={(props) =>
                                <SeasonSideBar
                                    {...props}
                                    newCollection = {this.state.newCollectionName}
                                />}
                            />
                            {productsSeasonRouteSideBar}
                            <Route path="/:seasonId/:collectionId" component={CollectionSideBar} />
                        </Switch>
                    </div>
                    <div className="content">
                        <div>
                            <Switch>
                                <Route path='/products' exact render={(props) =>
                                    <ProductsDisplay
                                        {...props}
                                        newProductCompany={newProductCompany => this.newProductCompanyFunc(newProductCompany)}
                                        requestPath={`/company/products?name=Lumi`}
                                    />}
                                />
                                <Route path="/seasons" exact render={() =>
                                    <SingleCompany
                                        sendNewSeason={seasonName => this.newSeasonNameFunc(seasonName)}
                                    />}
                                />
                                {productsCompanyRoute}
                                <Route path="/:seasonId/products" exact render={(props) =>
                                    <ProductsDisplay
                                        {...props}
                                        newProductSeason={newProductSeason => this.newProductSeasonFunc(newProductSeason)}
                                        requestPath={`/season/products?name=${props.match.params.seasonId}`}
                                    />}
                                />
                                <Route path={'/:seasonId/budget'} exact render={(props) =>
                                    <BudgetPlanningTable
                                        {...props}
                                        requestPath={`/season/products?name=${props.match.params.seasonId}`}
                                        showCollection={true}
                                    />}
                                />
                                <Route path="/:seasonId/collections" exact render={(props) =>
                                    <SingleSeason
                                        {...props}
                                        sendNewCollection = {collectionName => this.newCollectionNameFunc(collectionName)}
                                    />
                                }/>
                                {productsSeasonRoute}
                                <Route path="/:seasonId/:collectionId/budget" exact render={(props) =>
                                    <BudgetPlanningTable
                                        {...props}
                                        requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                    />}
                                />
                                <Route path="/:seasonId/:collectionId/colors" exact component={ColorIndexPage} />
                                <Route path="/:seasonId/:collectionId/materials" exact component={MaterialList} />
                                <Route path="/:seasonId/:collectionId/products" exact render={(props) =>
                                    <ProductsDisplay
                                        {...props}
                                        requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                        newProductCollection = {(newProductCollection) => this.newProductCollectionFunc(newProductCollection)}
                                    />}
                                />
                                <Route path="/:seasonId/:collectionId/themes" exact component={ThemeList} />
                                <Route path="/:seasonId/:collectionId/products/:productId" exact component={SingleProduct} />
                                <Route path="/:seasonId/:collectionId/materials/:materialId" exact component={SingleMaterial} />
                            </Switch>
                        </div>
                    </div>
                    <FooterArea/>
                </div>
            </BrowserRouter>
        )
    }
}

export default App;
