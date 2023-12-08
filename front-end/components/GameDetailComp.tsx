import React, { Component, useState } from 'react';
import { Container, Row, Col, ListGroup, Button, Pagination, Carousel, Card } from 'react-bootstrap';
import gameslistGames from '../services/mocks/gameslistGames';
import Image from 'next/image';

interface Props {

  title:string
}

interface State {

  index : number,
  item : any
}



class GamesDetailComp extends Component<any,
State> {

   
    constructor(props: any) {
      super(props);
      this.state = {
        index : 0,
        item : this.props.game || {}
      };
    }
  

  componentDidMount(): void {
 
    this.setState({item : this.props.game})
  }

 componentDidUpdate(prevProps: any, prevState: Readonly<State>, snapshot?: any): void {
  
  // window.scrollTo(0,0);
   
 }
   
  goplayGame = (_game:any)=>{
    // const navigate = useNavigate();
    // this.props.navigate("/gamedetail", {state : {game : _game}})
    
  }

 
   render(): React.ReactNode {
     return(
        <Container className='' style={{padding:0, position:'relative'}}>
            <Row className='' style={{width:'100%', marginLeft:'auto', marginRight:'auto', marginTop:5}}>
              <Col >
                <Card className='kayfo-game-detail-container'>
                  <div style={{position:'relative'}}>
                    <Image  src={this.props.game.banner} className='kayfo-game-detail-img' style={{objectFit:'cover', width:'100%', minHeight:380}} alt='' />
                    <Button href={this.props.game.url} target="_blank" className='kayfo-playnow-btn'>Jouer maintenant</Button>
                  </div>
                  <Card.Body>
                    <Card.Title>
                      <Row>
                        <Col xs={8} style={{fontWeight:'bolder'}} >{this.props.game.title} - By Kayfo Games</Col>
                        <Col xs={4} style={{display:'flex', justifyContent:'flex-end'}}>
                          <Image className='kayfo-addfav' src={require("../assets/icons/add-to-favs-icon.png")} alt="" />
                        </Col>
                      </Row>
                    </Card.Title>
                    <Card.Text style={{fontWeight:400, fontSize:'larger'}}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint reprehenderit sapiente commodi perferendis asperiores est unde quia 
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
                        <Button variant="default kayfo-progress-btn" size='lg'>Suivre votre progression</Button>
                    </Col>

                  </Card.Body>
                </Card>
              </Col>
             
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

export default GamesDetailComp;
