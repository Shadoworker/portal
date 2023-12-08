import React, { Component, useState } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import filterCatgories from '../services/mocks/filterCategories';


interface State {
   index : number,
   categories : any[]
}


class CategoriesFooter extends Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      index : 0,
      categories : filterCatgories
    };
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
                      <Button variant="outline-primary kayfo-category-btn">{item.name}</Button>
                  </div>
                  )}

                </div>
            </Col>
          </Row>
        </Container>

         
    )
  };
};

export default CategoriesFooter;
