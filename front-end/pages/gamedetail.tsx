import React, { Component, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoriesCards from '../components/CategoriesBanner';
import BottomTabNav from '../components/BottomTabNav';
import CategoriesFooter from '../components/CategoriesFooter';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'
import GamesPageList from '../components/GamesPageList';
import GameDetailComp from '../components/GameDetailComp';
import { withRouter } from 'next/router';



interface Props {
}
interface State {
   index : number,
   navState : any
}


class GameDetailPage extends Component<any,State> {


  constructor(props: any) {
    super(props);
    this.state = {
      index : 0,
      navState : true
    };
  }



  componentDidMount(): void {
    
      window.scrollTo(0,0);
  }
 
   render(): React.ReactNode {
     return(
        <div className="cmd-page">
            <Header />
            <CategoriesCards />
            <div className='kayfo-body-content'>

              <GameDetailComp game={this.props.mainState.game} />

              <GamesPageList />
              
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GameDetailPage));
