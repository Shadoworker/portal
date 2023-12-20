import React, { Component, useState } from 'react';
import { Container, Row, Col, ListGroup, Button, Form } from 'react-bootstrap';
import filterCatgories from '../services/mocks/filterCategories';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'
import { withRouter } from 'next/router';


interface State {
   index : number,
   categories : any[]
}


class CategoriesBanner extends Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      index : 0,
      categories : filterCatgories
    };
  }

  setFilterTag = (_tag:string) =>{

    this.props.mainActions.setFilterTag(_tag);

    const { router } = this.props;
    router.push({pathname:"/"})

  }
 
   render(): React.ReactNode {
     return(
        <Container className='kayfo-categories-banner'>
            <ListGroup horizontal>
                {this.state.categories.map((item, index)=>
                
                    <ListGroup.Item key={index}>
                        <Button variant="outline-primary" className={`kayfo-category-btn ${item.tag == this.props.mainState.filterTag ? "active":""}`} onClick={()=>this.setFilterTag(item.tag)}>{item.name}</Button>
                    </ListGroup.Item>
                )
                    
                }
                {/* <div style={{width:1, height:20, marginTop:'auto', marginBottom:'auto', borderRight:'solid 1px white', marginRight:10, marginLeft:-10}}></div>
                <ListGroup.Item >
                    
                    <Form.Select className='kayfo-select-filter'>
                        <option className='kayfo-select-option'>Tous les filtres</option>
                        <option className='kayfo-select-option'>Filtre 2</option>
                        <option className='kayfo-select-option'>Filtre 3</option>
                    </Form.Select>
                                
                </ListGroup.Item> */}

            </ListGroup>
        </Container>
    )
  };
};


const mapStateToProps = (state:any) => {
  return {
    mainState: state.mainReducer
  };
};

const mapDispatchToProps = (dispatch:any) => {
  return {
    mainActions: bindActionCreators(mainActions, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CategoriesBanner));
