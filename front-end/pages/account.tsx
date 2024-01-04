import React, { Component, useState } from 'react';
import Header from '../components/Header';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'
import {withRouter } from 'next/router';
import {Button, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';

import countries from '../services/mocks/countries.json';
import Image from 'next/image';
import userService from '../services/user.service';
import { Alert, Snackbar } from '@mui/material';
import accountErrors from '../services/mocks/accountErrors';
import moment from 'moment';

interface Props {

  title : string
}
 
const subscriptionsTranslations = {"TRIAL" : "ESSAI", "PACK 30D" : "PREMIUM"}
 

class AccountPage extends Component<any,
any> {

  constructor(props:any)
  {
    super(props)
    this.state = {
      index : 0,
      navState : "signin",
      countries : countries.sort((a, b) => parseInt(a.dial_code) - parseInt(b.dial_code)),
      processing:false,
      error:false,
      errorMessage:"Une erreur s'est produite lors de l'opération",
      success : false,
      dialCode : "+221",
      flag : "SN.svg",

      username : "",
      name : "",
      email:"",
      password:"",
      repassword:"",

      user : null,

      subscriptionCountDown : "",
    };
  }



  componentDidMount(): void {
    
    var user = (sessionStorage.getItem("user") && sessionStorage.getItem("user") != 'undefined') ? JSON.parse(sessionStorage.getItem("user") || "{}") : null;
  
    var userEmail = user?.email == user?.username+"@kayfo-portal.games" ? "" : user?.email; // the default mail

    this.setState({user : user, name : user?.name, email:userEmail})

    this.subscriptionLimit(user);

  }
 
  switchNavstate = (state:string)=>{
    this.setState({navState : state})
  }

  updateInput = (key,value) =>{

    this.setState({[key] : value})
  }


  submitForm = () =>{

    if(!this.state.email.trim().length) return;
    if(!this.state.name.trim().length) return;
     
    var updateData = 
    { 
      email : this.state.email,
      name :  this.state.name
    }
        
    this.updateUser(updateData)
      

  }

  updateUser = (updateData : any)=>{

    this.setState({processing : true})
    var userId = this.state.user.id;

    userService.updateUser(userId, updateData).then((d:any)=>{
          
      var user = this.state.user;
      user.name = updateData.name;
      user.email = updateData.email;

      setTimeout(() => {
        
        this.setState({success : true, processing : false})
          
        this.props.mainActions.setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user))
      }, 1000);
    
      
      console.log(user)

    })
    .catch(e=>{

      var errorMessage = e.response.data.error.message;

      switch (errorMessage) {
        case accountErrors.noExistingAccount:
          // setTimeout(() => {
          //   this.setState({
          //     username : "",
          //     password: "",
          //     error: false,
          //     processing:false, 
          //     navState : 'signup'
          //   })
          // }, 10);
          break;
       
      }

      this.setState({error : true, errorMessage : errorMessage})

    })

  }


  updateCountdown(targetDate) {
    // Get the current date and time
    const currentDate = moment();
  
    // Calculate the difference between the target date and the current date
    const duration = moment.duration(targetDate.diff(currentDate));
  
    // Display the remaining time in the format: days, hours, minutes, seconds
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    
    var countdown = `${days}j : ${hours}h : ${minutes}mn : ${seconds}s`
    // console.log(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining.`);

    return countdown;
  }

  subscriptionLimit(user)
  {
    
    if(user)
    {
      var subscription = user.subscription;

      var valid = false;
      var countdown = 'expirée';
      var creationDateString = user.subscriptionDate;
      const creationDate = moment(creationDateString);
      var currentDate = moment();
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


      if(currentDate.isBefore(limitDate))
        countdown = this.updateCountdown(limitDate);
    
      this.setState({subscriptionCountDown:countdown})
      setInterval(() => {

        currentDate = moment();

        if(currentDate.isBefore(limitDate))
        {
          countdown = this.updateCountdown(limitDate);
        }
        else
        {
          countdown = 'expirée'
        }

        this.setState({subscriptionCountDown:countdown})
        
      }, 1000);

    }

    

  }

 

   render(): React.ReactNode {
     return(
        <div className="cmd-page">
          
            <Header hidebtn={true} />
            <div className='kayfo-body-content'>

             <div className='kayfo-block-title' style={{textAlign:'center', marginTop:15, textTransform:'uppercase'}}><span>Mon compte</span></div>

              <Container>
                <Row style={{justifyContent:'center', marginTop:15, color:'#fff'}}>
                  <Col lg="4" sm="8" xs="11" className='kayfo-signin-box'>

                    <Row style={{marginBottom:15}}>
                      <Col style={{flex:1}}>
                        <span style={{fontSize:14, color:'gainsboro'}}>Mon abonnement</span>
                      </Col>
                      <Col style={{display:'flex', justifyContent:'flex-end', flexDirection:'column'}}>
                        <Row>
                          <Col style={{display:'flex', justifyContent:'flex-end'}}>
                            <div style={{position:'relative', padding:'6px 12px', backgroundColor:'#ffffff45', borderRadius:6, overflow:'hidden'}}>
                              <span style={{fontSize:14, color:'white'}}>{subscriptionsTranslations[this.state.user?.subscription]}</span>
                            <div style={{width:14, height:14, backgroundColor:'firebrick', position:'absolute', top:-8, left:-8, transform:'rotate(45deg) scale(1.5)'}}></div>
                            </div>
                            <Button variant="default kayfo-upgrade-btn" style={{}} type="button" >UPGRADE</Button>
                          </Col>
                        </Row>
                        <Row style={{display:'flex', textAlign:'right'}}>
                         <span style={{fontSize:12, fontWeight:'bold', color:'orange'}}>{this.state.subscriptionCountDown}</span>
                        </Row>
                       
                      </Col>

                    </Row>
                    <div style={{width:'100%', height:1, backgroundColor:'gray', margin:'15px 0px'}}></div>
                    <Row>
                      <Col>
                      <span style={{fontSize:14, color:'gainsboro'}}>Mes informations</span>
                      </Col>
                    </Row>

                    {!this.state.processing &&
                      <Form>
                        
                        <Form.Group className="mb-3" controlId="formBasicTel" style={{display:'flex'}}>
                          <Form.Control required className='kayfo-signin-input' placeholder="tel" disabled value={this.state.user?.username} style={{border:'none', color:'gray', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicName" style={{display:'flex'}}>
                          <Form.Control required className='kayfo-signin-input' placeholder="nom" defaultValue={this.state.name} onChange={(e)=>this.updateInput("name", e.target.value)} style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicMail" style={{display:'flex'}}>
                          <Form.Control required pattern='/^[^\s@]+@[^\s@]+\.[^\s@]+$/' className='kayfo-signin-input' onChange={(e)=>this.updateInput("email", e.target.value)} defaultValue={this.state.email} type="email" placeholder="Email de recupération"  style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                        </Form.Group>

                      {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control required className='kayfo-signin-input' onChange={(e)=>this.updateInput("password", e.target.value)} type="password" placeholder="Mot de passe*" style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                      </Form.Group> */}

                      
                      <Button variant="default kayfo-signin-btn" style={{width:'100%', marginTop:45}} onClick={this.submitForm} type="submit" size='lg' >Enregistrer</Button>

                    </Form>
                    }   

                    {this.state.processing && !this.state.error &&
                      <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                          <Spinner animation="grow" style={{marginBottom:15}} />
                          <span>Mise à jour de votre compte en cours ...</span>
                        </div>
                        <Image src={require("../assets/icons/kayfo-icon-white.png")} width={50} style={{position:'relative', bottom:-40, opacity:0.15}} alt="Kayfo"  />
                      </div>
                    }
                     
                    
                    {this.state.error &&
                      <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                          <span>Email ou nom d'utilisateur incorrect</span>
                          <a href="" style={{color:"#FF7A00"}} >reprendre</a>
                        </div>
                      </div>
                    }
                    {this.state.success &&

                      <Snackbar open={true}  anchorOrigin={{ vertical:'top', horizontal:"center" }} autoHideDuration={5000}>
                        <Alert severity="success" sx={{ width: '100%' }}>
                          Compte mis à jour avec succés !
                        </Alert>
                      </Snackbar>
                    }

                   

                  </Col>
                </Row>
              </Container>



            </div>
           
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountPage));
