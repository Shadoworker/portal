
'use client';

import React, { Component, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoriesCards from '../components/CategoriesBanner';
import MasonryGames from '../components/MasonryGames';
import RectGamesList from '../components/RectGamesList';
import BoxGamesList from '../components/BoxGamesList';
import BottomTabNav from '../components/BottomTabNav';
import CategoriesFooter from '../components/CategoriesFooter';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'
import storyGames from '../services/mocks/storyGames';
import featuredGames from '../services/mocks/featuredGames';
import contentService from '../services/content.service';
import utils from '../services/common/utils';
import { withRouter } from 'next/router';


interface State {
   index : number,
   rubrics : any[],
   rendererTime : any
}


class HomePage extends Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      index : 0,
      rubrics : this.props.mainState.rubrics,
      rendererTime : new Date().getTime().toString()
    };
  }


  componentDidMount(): void {
    

    this.getRubrics();

    this.getSubscription();

  }

  getRubrics = ()=>{

    // Get Rubrics
    var currentRubrics : any[] = this.props.mainState.rubrics;
    // if(!currentRubrics.length)
    {

      contentService.getRubrics()
      .then((d:any)=>{

        var rubrics = d.data;
        this.setState({rubrics})
        this.props.mainActions.setRubrics(rubrics)

      })
      .catch((e)=>{console.log("Error while getting rubrics")})
    }

  }

  getSubscription()
  {
    contentService.getSubscription()
    .then((d:any)=>{
      var trialDuration = d.data.attributes.trialDuration
      var pack30dDuration = d.data.attributes.pack1Duration

      this.props.mainActions.setTrialDuration(trialDuration)
      this.props.mainActions.setPack30dDuration(pack30dDuration)

    })
    .catch(e=>{
      console.log(e)
    })
  }

 
   render(): React.ReactNode {
     return(
        <div className="cmd-page">
            <Header />
            <CategoriesCards />
            <div className='kayfo-body-content'>
              {this.state.rubrics.map((rubric,index)=>{
                var view : any = null;
                switch (rubric.attributes.layout) {
                  case utils.layouts.MASONRY :
                    view = <MasonryGames key={index} rubricId={rubric.id} title={rubric.attributes.title} />
                    break;
                  
                  case utils.layouts.BOX :
                    view = <BoxGamesList key={index} rubricId={rubric.id} title={rubric.attributes.title} items={storyGames} />
                    break;
                  
                  case utils.layouts.RECT :
                    view = <RectGamesList key={index} rubricId={rubric.id} title={rubric.attributes.title} />
                    break;

                  default:
                    break;
                }
                return view;
              })

              }
              {/* <MasonryGames />
              <RectGamesList title="Jeux africains" />
              <BoxGamesList title="Jeux Narratifs" items={storyGames} />
              <BoxGamesList title="Classique" items={featuredGames} />
              <RectGamesList title="Spécial Dakar" /> */}

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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomePage));
