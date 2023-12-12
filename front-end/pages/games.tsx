import React, { Component, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoriesCards from '../components/CategoriesBanner';
import BottomTabNav from '../components/BottomTabNav';
import CategoriesFooter from '../components/CategoriesFooter';

import GamesPageList from '../components/GamesPageList';
import { useRouter, withRouter } from 'next/router';

interface Props {

  title : string
}
interface State {
   index : number,
   navState : any
}
 

class GamesPage extends Component<any,
State> {

  constructor(props:any)
  {
    super(props)
    this.state = {
      index : 0,
      navState : {},
    };
  }



  componentDidMount(): void {
    
    // console.log(this.props.location.state)
  }

 
   render(): React.ReactNode {
     return(
        <div className="cmd-page">
          
            <Header />
            <CategoriesCards />
            <div className='kayfo-body-content'>
              <GamesPageList title={this.props.router.query.title} rubricId={this.props.router.query.rubricId} />

              <CategoriesFooter />

              <Footer />
            </div>
           
            <BottomTabNav />
        </div>
    )
  };
};

export default withRouter(GamesPage);
