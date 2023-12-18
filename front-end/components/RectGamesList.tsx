import React, { Component, useState } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import africanGames from '../services/mocks/africanGames';
// import { WithRouterProps, withRouter } from './WithRouterProps';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import { withRouter } from 'next/router';
import { baseUrl } from '../services/apiUrl';
import contentService from '../services/content.service';


interface Props {

  title:string,
  rubricId:any,
  items : any[]
}

interface State {

  index : number,
  items : any[],
  completed : boolean
}
 
const pattern = [[1,1],[1,1],[2,2],[1,1],[1,1]]


class RectGamesList extends Component<any,
State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      index : 0,
      items : [],
      completed : false,
    };
  }


  componentDidMount(): void {
 
    this.getGames();

  }

  getGames = ()=>{

    var rubricId = this.props.rubricId;

    contentService.getRubricGames(rubricId)
    .then((d:any)=>{

      var games = d.data.attributes.games.data;

      games.forEach(g => {
        if(g.attributes.tags == null) g.attributes.tags = [];
        else g.attributes.tags = g.attributes.tags.split(",")
      });

      games.forEach(g => {
        if(!g.attributes.tags.includes("All")) g.attributes.tags.push("All")
      });

      games = games.filter(e=>e.attributes.published != false);
      games = games.sort((a,b)=>b.attributes.priority - a.attributes.priority);

      this.setState({items : games, completed:true})
       this.props.mainActions.setAllGames({key:rubricId, games : games})
      // console.log(games)

    })
    .catch((e)=>{console.log("Error while getting games")})

  }

  gotoGames = (_title:string)=>{
    const { router } = this.props;
    router.push({pathname:"/games", query : {title : _title, rubricId : this.props.rubricId} })
  }

  gotoGameDetail = (_game:any, _index:number)=>{
    const { router } = this.props;

    this.props.mainActions.setGame(_game);
    localStorage.setItem("game", JSON.stringify(_game))
    router.push({pathname:"/gamedetail"})
    
    this.createStat("viewed", _game.id)

  }
 
  createStat(_type, _gameId){

    var stat = 
      {data:{
        type: _type,
        game : _gameId
      }}

    contentService.createStat(stat)
    .then(d=>{
      console.log("Created stat")
    })
    .catch(e=>{
      console.log(e)
    })

  }

   render(): React.ReactNode {
     return(
        <Container>
            <Row className='kayfo-block-header' onClick={()=>this.gotoGames(this.props.title)}>
             <div className='kayfo-block-title'><span>{this.props.title}</span></div>
             <div className='kayfo-block-arrow' ><Image src={require("../assets/icons/arrow.png")} alt="" /></div>
            </Row>
            <Row>
             <Col className='kayfo-masonry-main' style={{overflowX:'auto', overflowY:'hidden'}}>

                <div style={{minWidth:"100%", display:'flex', flexDirection:'row'}}>

                    {this.state.items.filter(item => item.attributes.tags.includes(this.props.mainState.filterTag)).map((item,index)=>
                        <div className='kayfo-masonry-container' key={index} style={{display:'flex', maxHeight:110, minHeight:130, flexDirection:'column', justifyContent:'space-between'}}>
                            <Col className='kayfo-masonry-item' style={{maxHeight:110}}  onClick={()=>this.gotoGameDetail(item, index)}  >
                              <Tooltip placement='top' title={item.attributes.title}>
                                <Image src={baseUrl + item.attributes.banner.data.attributes.url} alt="" width={234} height={110} style={{width:234, height:'100%', objectFit:'cover', borderRadius:6}}/>
                              </Tooltip>
                            </Col>
                        </div>
                    )}
                    {this.state.items.filter(item => item.attributes.tags.includes(this.props.mainState.filterTag)).length == 0 &&
                      <Col className='kayfo-filter-no-result-box'>
                        {this.state.completed ? 'Aucun résultat' : 'Chargement...'}
                      </Col>
                    }

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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RectGamesList));
