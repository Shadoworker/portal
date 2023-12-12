import React, { Component, useState } from 'react';
import { Container, Row, Col, ListGroup, Button, Pagination } from 'react-bootstrap';
import gameslistGames from '../services/mocks/gameslistGames';
import Isotope from 'isotope-layout';
import './styles.css';
import { Tooltip } from '@mui/material';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions';
import Image from 'next/image';
import { withRouter } from 'next/router';
import contentService from '../services/content.service';
import { baseUrl } from '../services/apiUrl';


interface Props {

  title:string
}

interface State {

  index : number,
  items : any[]
}

const pattern = [[2,1],[2,2],[1,1],[1,1],[1,1],[1,1],[2,1],[1,1],[1,1]]


class GamesPageList extends Component<any,
State> {

  constructor(props: any) {
    super(props);
    this.state = {
      index : 0,
      items : []
    };
  }

  componentDidMount() {
 
    this.getGames();

  }


  
  getGames = ()=>{

    var rubricId = this.props.rubricId || 1;

    console.log(rubricId)

    contentService.getRubricGames(rubricId)
    .then((d:any)=>{

      var games = d.data.attributes.games.data;

      games.forEach(g => {
        if(g.attributes.tags == null) g.attributes.tags = [""];
        else g.attributes.tags = g.attributes.tags.split(",")
      });

      this.setState({items : games})
      // this.props.mainActions.setAllGames({key:rubricId, games : games})
      // console.log(games)

      this.setLayout(games);

      setTimeout(() => {
        
          new Isotope(".grid", {
            itemSelector: ".grid-item",
            layoutMode: "masonry",
            masonry: {
              columnWidth: 120,
            },
          });
  
      }, 100);


    })
    .catch((e)=>{console.log("Error while getting games")})

  }

  setLayout = (_items)=>{

    var items = [..._items];
    var patternI = 0;

    for (let i = 0; i < items.length; i++) {

      const el = items[i];
      if(patternI >= pattern.length) patternI = 0;
      el.pattern = pattern[patternI];
      patternI++;
      
    }


    this.setState({items : items});

  }


  gotoGameDetail = (_game:any, _index:number)=>{
    const { router } = this.props;

    this.props.mainActions.setGame(_game);
    router.push({pathname:"/gamedetail"})
    
  }
 
   render(): React.ReactNode {
     return(
        <Container>
            <Row className='kayfo-block-header'>
             <div className='kayfo-block-title' style={{marginBottom:10}}><span>{this.props.title}</span></div>
             {/* <div className='kayfo-block-arrow' ><Image src={require("../assets/icons/arrow.png")} alt="" /></div> */}
            </Row>
            <Row>
             <Col className='kayfo-gameslist-masonry' style={{}}>

              <div className="grid" >
                {this.state.items.map((item, index)=>{

                  const width2 = item.pattern[0] == 2 ? "grid-item--width2" : "";
                  const height2 =item.pattern[1] === 2 ? "grid-item--height2" : "";
                                    
                  return  (
                  <div key={index} className={`grid-item ${width2} ${height2}`} onClick={()=>this.gotoGameDetail(item, index)} >
                    <Tooltip placement='top' title={item.attributes.title}>
                      <Image src={baseUrl + item.attributes.banner.data.attributes.url} width={350} height={350} alt="" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:6}}/>
                    </Tooltip>
                  </div>)

                })

                }
                
              </div>

             </Col>
            </Row>

            <div className='kayfo-games-pagination-container'>

              {/* <Pagination className='kayfo-games-pagination'>
                <Pagination.Prev >Précédent</Pagination.Prev>
                <Pagination.Item>{1}</Pagination.Item>
 
                <Pagination.Item active>{2}</Pagination.Item>

                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next>Suivant</Pagination.Next>
              </Pagination> */}

            </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GamesPageList));
