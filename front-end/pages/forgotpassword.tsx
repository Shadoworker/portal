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
import { nanoid } from 'nanoid';
import axios from 'axios';

interface Props {

  title : string
}
 
 

class ForgotPasswordPage extends Component<any,
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

      user : null
    };
  }



  componentDidMount(): void {
    
    var user = (sessionStorage.getItem("user") && sessionStorage.getItem("user") != 'undefined') ? JSON.parse(sessionStorage.getItem("user") || "{}") : null;
  
    var userEmail = user?.email == user?.username+"@kayfo-portal.games" ? "" : user?.email; // the default mail

    this.setState({user : user, name : user?.name, email:userEmail})
  }
 
  switchNavstate = (state:string)=>{
    this.setState({navState : state})
  }

  updateInput = (key,value) =>{

    this.setState({[key] : value})
  }


  submitForm = () =>{

    if(!this.state.email || !this.state.email.trim().length) return;
     
    var email = this.state.email;
    
    this.updatePassword(email)
      

  }

  updatePassword = (email : any)=>{

    this.setState({processing : true})
    var userMail = email;

    userService.getUserByMail(userMail).then((d:any)=>{
          
      var users = d;
      const resetToken = nanoid();
      var data = {passwordResetToken : resetToken};
      
      console.log(users)
      if(users.length > 0)
      {
        var user = users[0];

        userService.updateUser(user.id, data)
        .then(_d=>{
          // var message = "http://portal-preprod.kayfo.games/resetpassword?token="+resetToken;
          var message = "http://localhost:3000/resetpassword?token="+resetToken;

          this.sendMail(userMail, message)
          //  console.log(resetToken);
        })
        .catch(_e=>{
        
          this.setState({error : true/* , errorMessage : errorMessage */})
          
        })
      }
      else
      {
        this.setState({error : true, errorMessage : "Aucun compte n'est lié à cet email"})
      }
 
    })
    .catch(e=>{

      console.log(e)

      this.setState({error : true/* , errorMessage : errorMessage */})

    })

  }


  sendMail(to_email, code)
  {
    let data = {
      "service_id": "service_gli2oyz",
      "template_id": "template_hipxplu",
      "user_id": "oAO1mLrQNSpuKUAX0",
      "template_params" : {
        "to_email" : to_email,
        "message" : code
      }
    };

    axios.post("https://api.emailjs.com/api/v1.0/email/send", data)
    .then(d=>{
      // console.log(d);
      this.setState({success : true, processing : false})

    })
    .catch(e=>{
      console.log(e);
      this.setState({error : true})

    })


  }
 

   render(): React.ReactNode {
     return(
        <div className="cmd-page">
          
            <Header hidebtn={true} />
            <div className='kayfo-body-content'>

             <div className='kayfo-block-title' style={{textAlign:'center', marginTop:15, textTransform:'uppercase'}}><span>Mot de passe oublié</span></div>

              <Container>
                <Row style={{justifyContent:'center', marginTop:15, color:'#fff'}}>
                  <Col lg="4" sm="8" xs="11" className='kayfo-signin-box'>
                    {!this.state.processing &&
                      <Form>
                        
                        <Form.Group className="mb-3" controlId="formBasicMail" style={{display:'flex'}}>
                          <Form.Control required pattern='/^[^\s@]+@[^\s@]+\.[^\s@]+$/' className='kayfo-signin-input' onChange={(e)=>this.updateInput("email", e.target.value)} type="email" placeholder="Email de recupération"  style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                        </Form.Group>


                      <Button variant="default kayfo-signin-btn" style={{width:'100%', marginTop:45}} onClick={this.submitForm} type="submit" size='lg' >Envoyer</Button>

                    </Form>
                    }   

                    {this.state.processing && !this.state.error &&
                      <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                          <Spinner animation="grow" style={{marginBottom:15}} />
                          <span>Envoie en cours ...</span>
                        </div>
                        <Image src={require("../assets/icons/kayfo-icon-white.png")} width={50} style={{position:'relative', bottom:-40, opacity:0.15}} alt="Kayfo"  />
                      </div>
                    }
                     
                    
                    {this.state.error &&
                      <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                          <span>{this.state.errorMessage}</span>
                          <a href="" style={{color:"#FF7A00"}} >reprendre</a>
                        </div>
                      </div>
                    }
                    {this.state.success &&

                      <Snackbar open={true}  anchorOrigin={{ vertical:'top', horizontal:"center" }} autoHideDuration={5000}>
                        <Alert severity="success" sx={{ width: '100%' }}>
                          Email de réinitialisation envoyé !
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ForgotPasswordPage));
