import React, { Component, useState } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import filterCatgories from '../services/mocks/filterCategories';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'

interface State {
   index : number,
   categories : any[]
}


class CategoriesFooter extends Component<any, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      index : 0,
      categories : filterCatgories
    };
  }

 
  setFilterTag = (_tag:string) =>{

    this.props.mainActions.setFilterTag(_tag);

  }
 

   render(): React.ReactNode {
     return(

      <Container className='kayfo-categories-footer'>
            <Row className='kayfo-block-header' style={{marginBottom:20}}>
              <div className='kayfo-block-title'><span>Autres catégories</span></div>
            </Row>
            <Row>
            <Col>

                <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>

                {this.state.categories.map((item, index)=>
                
                  <div key={index} style={{marginBottom:20, marginRight:10}}>
                      <Button variant="outline-primary" className={`kayfo-category-btn ${item.tag == this.props.filterTag ? "active":""}`} onClick={()=>this.setFilterTag(item.tag)}>{item.name}</Button>
                  </div>
                  )}

                </div>
            </Col>
          </Row>
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


export default connect(mapStateToProps, mapDispatchToProps)( CategoriesFooter);
