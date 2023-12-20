import React, { Component, useState } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import featuredGames from '../services/mocks/featuredGames';
// import { WithRouterProps, withRouter } from './WithRouterProps';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import { withRouter } from 'next/router';
import contentService from '../services/content.service';
import { baseUrl } from '../services/apiUrl';


interface Props {
  title:string,
  rubricId:any,
  items : any[]
  }
  
interface State {

    index : number,
    items : any[],
    completed : boolean,
    rendererTime : string
}


const pattern = [[1,1],[1,1],[2,2],[1,1],[1,1]]
class FeaturedGames extends Component<any,
State> {

  constructor(props: any) {
    super(props);
    this.state = {
      index : 0,
      items : [],//featuredGames,
      completed : false,
      rendererTime : new Date().getTime().toString()
    };
  }

  
  componentDidMount(){

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

      this.setState({items : games, completed : true})
       this.props.mainActions.setAllGames({key:rubricId, games : games})

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
  
  renderMasonry = (_items:any[])=>{

       // remove doublons ... ?
        var patternI = 0;
        var itemI = 0;

        var render : any[] = [];

        // for (var i = itemI; i < this.state.items.length; i++) 
        while(itemI < _items.length)
        {
            const element = _items[itemI];
            const nextElement = _items[itemI+1];
            var firstIndex = itemI;
            if(pattern[patternI][0] == 1 && pattern[patternI+1][0] == 1)
            {
                var renderSecond = false;
                itemI = itemI + 1;
                patternI = patternI + 1;
                // var nextIndex = i;
                // console.log(itemI)
                
                // const nextElement = this.state.items[itemI];

                if(patternI >= pattern.length) patternI = 0;
                var secondIndex = itemI;
                if(nextElement && pattern[patternI][0] == 1)
                 {
                    renderSecond = true;
                    itemI = itemI + 1;
                    patternI = patternI + 1;
                    if(patternI >= pattern.length) patternI = 0;
                    // nextIndex = itemI;

                 }
                 else
                 {
                  itemI = itemI + 1;
                  patternI = patternI + 1;
                  if(patternI >= pattern.length) patternI = 0;
                 }
                 
                 secondIndex = itemI;


                var r = (
                <div key={firstIndex} className='kayfo-masonry-container'>
                    <Col className='kayfo-masonry-item' style={{minWidth:'50%'}} onClick={()=>this.gotoGameDetail(element, firstIndex)}  >
                      <Tooltip placement='top' title={element.attributes.title}>
                        <Image src={baseUrl + element.attributes.icon.data.attributes.url} alt="" width={110} height={110} style={{width:110, height:'auto'}}/>
                      </Tooltip>
                    </Col>

                    {renderSecond && 
                    <Col key={secondIndex} className='kayfo-masonry-item' style={{minWidth:'50%'}} onClick={()=>this.gotoGameDetail(nextElement, secondIndex)} >
                        <Tooltip placement='top' title={nextElement.attributes.title}>
                          <Image src={baseUrl + nextElement.attributes.icon.data.attributes.url} alt="" width={110} height={110} style={{width:110, height:'auto'}}/>
                        </Tooltip>
                    </Col>}
                </div>)
 

                render.push(r);

            }
            else
            {
                var r = (
                    <div  key={firstIndex} className='kayfo-masonry-container' style={{display:'flex', minHeight:234, flexDirection:'column', justifyContent:'space-between'}}>
                        <Col className='kayfo-masonry-item' style={{minHeight:234}} onClick={()=>this.gotoGameDetail(element,firstIndex)} >
                            <Tooltip placement='top' title={element.attributes.title}>
                              <Image src={baseUrl + element.attributes.icon.data.attributes.url} alt="" width={234} height={110} style={{width:234, height:'auto'}}/>
                            </Tooltip>
                        </Col>
                    </div>)
                
                itemI = itemI + 1;
                patternI = patternI + 1;

                render.push(r);
                
            }

        }

        return render;

  }
 
   render(): React.ReactNode {
     return(
        <Container>
            <Row className='kayfo-block-header' onClick={()=>this.gotoGames(this.props.title)}>
             <div className='kayfo-block-title'><span>{this.props.title}</span></div>
             <div className='kayfo-block-arrow' ><Image  src={require("../assets/icons/arrow.png")} alt="" /></div>
            </Row>
            <Row>
              <Col className='kayfo-masonry-main' style={{overflowX:'auto', overflowY:'hidden'}}>

                {this.state.items.filter(item => item.attributes.tags.includes(this.props.mainState.filterTag)).length > 0 &&
                <div style={{minWidth:"100%", display:'flex', flexDirection:'row'}}>

                    {this.renderMasonry(this.state.items.filter(item => item.attributes.tags.includes(this.props.mainState.filterTag))).map((item,index)=>
                      {
                        return item
                      }
                    )}

                </div>
                 }
                 {this.state.items.filter(item => item.attributes.tags.includes(this.props.mainState.filterTag)).length == 0 &&
                  <Col className='kayfo-filter-no-result-box'>
                    {this.state.completed ? 'Aucun résultat' : 'Chargement...'}
                  </Col>
                  }
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
  
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeaturedGames));