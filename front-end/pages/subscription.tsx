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
import packs from '../services/mocks/packs';
import paymentMethods from '../services/mocks/paymentMethods';
import paymentService from '../services/payment.service';

interface Props {

  title : string
}
 
const subscriptionsTranslations = {"TRIAL" : "ESSAI", "PACK 30D" : "PREMIUM"}
 

class SubscriptionPage extends Component<any,
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

      selectedPack : null
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

  selectPack(pack)
  {
    this.setState({selectedPack : pack})
  }

  async postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: "no-cors", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "access-control-allow-origin": "*",
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': '*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 453c14ca-b3be-3d4c-9913-33cab8f7d693',
        'country-code':'sn',
        'mno-name':'orange',
        'lang':'fr',
        'channel':'web',
        'Cookie':'route=1700728895.533.3407.482340|81ae3a9a04c06b83bdb4bb4311fcd72d'
      },
      // redirect: "follow", // manual, *follow, error
      // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response; // parses JSON response into native JavaScript objects
  }

  gotoPayment(paymentMethod)
  {
    var order_id = this.state.user.id + "_"+new Date().getTime();
    var user_msisdn = this.state.user.phone;

    var payload = {
      mno : paymentMethod,
      data : {
        currency : "XOF",
        order_id : "Kaypay_"+order_id,
        amount : /* this.state.selectedPack.price */ 100,
        state :"testing",
        reference : "Kayfo",
        cancel_url : "http://strapi-test-1-staging.eu-central-1.elasticbeanstalk.com/payment?success",
        return_url : "http://strapi-test-1-staging.eu-central-1.elasticbeanstalk.com/payment?fail",
        user_msisdn : user_msisdn
      }
    }

    // this.setState({processing : true})

    // paymentService.requestPaymentUrl(payload)
    // .then(d=>{
    //   console.log(d)
    //   // this.setState({processing : false, success:true})

    // })
    // .catch(e=>{
    //   console.log(e)
    //   // this.setState({processing : false, success:false})
    // })

    var data = {
      "currency": "XOF",
      "order_id": "Kay_pay006",
      "amount":100,
      "state":"testing",
      "reference": "Kayfo",
      "cancel_url": "http://strapi-test-1-staging.eu-central-1.elasticbeanstalk.com/payment?success",
      "return_url": "http://strapi-test-1-staging.eu-central-1.elasticbeanstalk.com/payment?fail",
      "user_msisdn":"221777632718"
      }

    this.postData("https://preproduction-gateway.bizao.com/mobilemoney/v1", data)

  }
 

   render(): React.ReactNode {
     return(
        <div className="cmd-page">
          
            <Header hidebtn={true} />
            <div className='kayfo-body-content'>

             <div className='kayfo-block-title' style={{textAlign:'center', marginTop:15, textTransform:'uppercase'}}><span>{!this.state.selectedPack? 'Choisissez votre abonnement' : ''}</span></div>

              <Container>
                <Row style={{justifyContent:'center', marginTop:15, color:'#fff'}}>
                  <Col lg="4" sm="8" xs="11" className='kayfo-signin-box' style={{backgroundColor:'#1B0327', paddingTop:20}}>

                    <Row>
                      <Col style={{marginBottom: this.state.selectedPack?20:0}}>
                      <span style={{fontSize:14, color:'gainsboro'}}>{this.state.selectedPack? 'Votre abonnement' : ''}</span>
                      {this.state.selectedPack && <span style={{fontSize:14, color:'#DA7F14', float:'right', cursor:'pointer'}} onClick={()=>this.selectPack(null)}>Retour</span>}
                      </Col>
                    </Row>

                    {!this.state.selectedPack &&

                      <Container>
                        <Row>

                          {packs.map((p,i)=>{

                            return <Col key={i} className='kayfo-subscription-pack' onClick={()=>this.selectPack(p)} >
                              <span style={{fontWeight:'lighter'}}>Validité {p.validityLabel}</span>
                              <h1 style={{fontWeight:'bold', marginBottom:0}}>{p.price} FCFA</h1>
                              <span>Résilier à tout moment</span>

                              <Image src={require("../assets/icons/kayfo-icon-white.png")} width={80} style={{position:'absolute', top:'20%', right:'5%', opacity:0.15}} alt="Kayfo"  />

                            </Col>
                            })

                          }
                        </Row>
                      </Container>
                    }   

                    {this.state.selectedPack &&

                    <Container>
                      <Row>
                        <Col className='kayfo-subscription-pack-selected' >
                          <span style={{fontWeight:'lighter'}}>Validité {this.state.selectedPack.validityLabel}</span>
                          <h1 style={{fontWeight:'bold', marginBottom:0}}>{this.state.selectedPack.price} FCFA</h1>
                          <span>Résilier à tout moment</span>

                          <Image src={require("../assets/icons/kayfo-icon-white.png")} width={80} style={{position:'absolute', top:'20%', right:'5%', opacity:0.15}} alt="Kayfo"  />

                        </Col>
                      </Row>

                      <Row style={{display:'flex', flexDirection:'column'}}>
                        
                        <Col style={{marginTop: 20}}>
                          <span style={{fontSize:14, color:'gainsboro'}}>Moyen de paiement</span>
                        </Col>

                        <Col>
                          <Row style={{ display:'flex', flexDirection:'column'}}>

                            {paymentMethods.map((p,i)=>{

                              return <Col key={i} style={{marginTop: 20}} className='kayfo-payment-method' onClick={()=>this.gotoPayment(p.mno)}>
                                  <Image src={p.icon} width={40} style={{}} alt="payment"  />
                                  <span style={{fontSize:14, marginLeft:15, fontWeight:'bold', color:'gainsboro'}}>{p.name}</span>
                                </Col>
                              })

                            }
 
                          </Row>
                        </Col>

                      </Row>

                    </Container>
                    } 

                    {/* {this.state.processing && !this.state.error &&
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
                    } */}

                   

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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SubscriptionPage));
