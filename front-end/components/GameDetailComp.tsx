import React, { Component, useState } from 'react';
import { Container, Row, Col, ListGroup, Button, Pagination, Carousel, Card } from 'react-bootstrap';
import gameslistGames from '../services/mocks/gameslistGames';
import Image from 'next/image';
import { baseUrl } from '../services/apiUrl';
import contentService from '../services/content.service';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'
import userService from '../services/user.service';
import { Alert, Snackbar } from '@mui/material';
import moment from 'moment';

interface Props {

  title:string
}

interface State {

  index : number,
  item : any,
  cardWidth :any,
  user : any,
  success : boolean,

  dev :boolean,
}



class GamesDetailComp extends Component<any,
State> {

   
    constructor(props: any) {
      super(props);
      this.state = {
        index : 0,
        item : null,
        cardWidth : 600,
        user : null,
        success : false,
        dev : false
      };
    }
  

  componentDidMount(): void {
 
    var game = JSON.parse(localStorage.getItem("game") || '{}')
    var user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user") || "{}") : null;

    const { router } = this.props;
    if(router.asPath.includes("?dev")) this.setState({dev:true})

    this.setState({item : game, user : user})
    // localStorage.setItem("game", JSON.stringify(game))

    var card = document.querySelector('.kayfo-game-detail-container');

    var cardWidth = card?.getBoundingClientRect().width;

    this.setState({cardWidth})

    setTimeout(() => {
      window?.scrollTo(0,0);
    }, 500);


    // Request user updates
    if(user)
    {
      this.getUser(user.id);
    }

  }

  getUser(id){

    userService.getUser(id)
    .then(d=>{

      var user = d;
      this.props.mainActions.setUser(user);
      sessionStorage.setItem('user', JSON.stringify(user))
      this.setState({user : user})

    })
    .catch(e=>{
      console.log(e)
    })

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


  requestAccess(){

    var data = 
      {
        access: "REQUESTED",
      }

    userService.updateUser(this.state.user.id, data)
    .then(d=>{
      console.log("Access requested")
      
      var user = {...this.state.user};

      user.access = "REQUESTED";
      this.props.mainActions.setUser(user);
      sessionStorage.setItem('user', JSON.stringify(user))
      
      this.setState({success : true, user : user})
    })
    .catch(e=>{
      console.log(e)
    })

  }

  isSubscriptionValid()
  {
    var subscription = this.state.user.subscription;

    var valid = false;
    var creationDateString = this.state.user.subscriptionDate;
    const creationDate = moment(creationDateString);
    const currentDate = moment();
    var limitDate;

    switch (subscription) {
      case "TRIAL":
        
        var subsDuration = this.props.mainState.trialDuration;
      
        //Add subs duration
        limitDate = creationDate.add(subsDuration, 'hours');
        // 
        valid = currentDate.isBefore(limitDate);

        break;

      case "PACK 30D":
    
        var subsDuration = this.props.mainState.pack30dDuration;

        //Add subs duration
        limitDate = creationDate.add(subsDuration, 'hours');

        // 
        valid = currentDate.isBefore(limitDate);
 

        break;
      
      default:
        valid = false;
      break;
       
    }

    return valid;
  }
 
  goplayGame = (_game:any)=>{
    // const navigate = useNavigate();
    // this.props.navigate("/gamedetail", {state : {game : _game}})
    
  }

  gotoAccount = ()=>{
    const { router } = this.props;

    router.push({pathname:"/account"})
  }


  gotoLogin = ()=>{
    const { router } = this.props;

    this.props.mainActions.setPageOrigin("/gamedetail")

    router.push({pathname:"/login"})
  }

 
   render(): React.ReactNode {
     return(
        <Container className='' style={{padding:0, position:'relative'}}>
            <Row className='' style={{width:'100%', marginLeft:'auto', marginRight:'auto', marginTop:5}}>
              <Col >
                {this.state.item &&
                  <Card className='kayfo-game-detail-container'>
                  <div style={{position:'relative'}}>
                    <img  src={baseUrl + this.state.item?.attributes?.banner.data.attributes.url} className='kayfo-game-detail-img' width={this.state.cardWidth || 600} style={{objectFit:'cover', width:'100%', minHeight:250}} alt='' />
                    {/* {this.state.dev && */}
                      <>
                        {(this.state.user && this.isSubscriptionValid()) && <Button onClick={()=>this.createStat("played",this.state.item?.id)} href={this.state.item?.attributes?.link} target="_blank" className='kayfo-playnow-btn' >Jouer maintenant</Button>}
                        {(this.state.user && !this.isSubscriptionValid()) && <Button onClick={()=>{this.gotoAccount()}} className='kayfo-playnow-btn' >S'abonner</Button>}
                        {(!this.state.user) && <Button onClick={()=>this.gotoLogin()} className='kayfo-playnow-btn' >Jouer maintenant</Button>}
                      </>
                    {/* } */}
                    {/* {!this.state.dev &&
                      <Button onClick={()=>this.createStat("played",this.state.item?.id)} href={this.state.item?.attributes?.link} target="_blank" className='kayfo-playnow-btn' >Jouer maintenant</Button>
                    } */}
                  </div>
                  <Card.Body>
                    <Card.Title>
                      <Row>
                        <Col xs={8} style={{fontWeight:'bolder'}} >{this.state.item?.attributes?.title} - {this.state.item?.attributes?.developer}</Col>
                        <Col xs={4} style={{display:'flex', justifyContent:'flex-end'}}>
                          {/* <Image className='kayfo-addfav' src={require("../assets/icons/add-to-favs-icon.png")} alt="" /> */}
                        </Col>
                      </Row>
                    </Card.Title>
                    <Card.Text style={{fontWeight:400, fontSize:'larger'}}>
                      {this.state.item?.attributes?.description != null ? this.state.item?.attributes?.description : 'Aucune description'} 
                    </Card.Text>

                    <Col style={{display:'flex', alignItems:'center'}}>
                        <Row style={{flex:1}}>
                            {/* {this.props.game.externals[0] &&
                              <Col style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <a href="#" className='kayfo-social-link'>
                                    <Image style={{width:'100%'}} src={require('../assets/icons/gplay-icon.png')} alt="" />
                                </a>
                            </Col>
                            }
                            {this.props.game.externals[1] &&
                              <Col style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <a href="#" className='kayfo-social-link'>
                                    <Image style={{width:'100%'}} src={require('../assets/icons/appstore-icon.png')} alt="" />
                                </a>
                            </Col>
                            } */}
                        </Row>
                    </Col>

                    <Col style={{display:'flex', alignItems:'center', justifyContent:'center', marginTop:20}}>
                        {/* <Button variant="default kayfo-progress-btn" size='lg'>Suivre votre progression</Button> */}
                    </Col>

                  </Card.Body>
                </Card>
                }
              </Col>
              
              {this.state.success &&
                <Snackbar open={true}  anchorOrigin={{ vertical:'top', horizontal:"center" }} autoHideDuration={5000}>
                  <Alert severity="success" sx={{ width: 200 }}>
                    Demande envoyée avec succés !
                  </Alert>
                </Snackbar>
              }
              {/* <Carousel>
                <Carousel.Item>
                  <Image style={{width:'100%', maxHeight:300 ,objectFit:'cover'}} src={this.props.game.media} alt="" />
                  <Carousel.Caption>
                    <Button className='kayfo-playnow-btn'>Jouer maintenant</Button>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel> */}
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GamesDetailComp));
