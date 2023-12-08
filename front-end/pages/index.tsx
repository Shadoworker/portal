
'use client';

import React, { Component, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoriesCards from '../components/CategoriesBanner';
import FeaturedGames from '../components/FeaturedGames';
import RectGamesList from '../components/RectGamesList';
import BoxGamesList from '../components/BoxGamesList';
import BottomTabNav from '../components/BottomTabNav';
import CategoriesFooter from '../components/CategoriesFooter';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'
import storyGames from '../services/mocks/storyGames';
import featuredGames from '../services/mocks/featuredGames';


interface State {
   index : number
}


class HomePage extends Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      index : 0
    };
  }

 
   render(): React.ReactNode {
     return(
        <div className="cmd-page">
            <Header />
            <CategoriesCards />
            <div className='kayfo-body-content'>
              <FeaturedGames />
              <RectGamesList title="Jeux africains" />
              <BoxGamesList title="Jeux Narratifs" items={storyGames} />
              <BoxGamesList title="Classique" items={featuredGames} />
              <RectGamesList title="Spécial Dakar" />

              <CategoriesFooter />

              <Footer />
            </div>
           
            <BottomTabNav />
        </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
// export default HomePage;
