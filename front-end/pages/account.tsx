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

interface Props {

  title : string
}
 
 

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
      password:"",
      repassword:"",

      user : null
    };
  }



  componentDidMount(): void {
    
    var user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user") || "{}") : null;
  
    this.setState({user : user})
  }
 
  switchNavstate = (state:string)=>{
    this.setState({navState : state})
  }

  updateInput = (key,value) =>{

    this.setState({[key] : value})
  }


  submitForm = () =>{

    if(!this.state.email.trim().length) return;
     
    var updateData = 
    { 
      email : this.state.email 
    }
        

    // this.updateUser(updateData)
      

  }

  updateUser = (signinData : any)=>{

    this.setState({navState : 'signin', processing : true})
    var userId = this.state.user.id;

    userService.updateUser(userId, signinData).then((d:any)=>{
          
      var user = d.user;
      this.setState({success : true})

      setTimeout(() => {
         
        this.props.mainActions.setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user))
        
      }, 50);
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

 

   render(): React.ReactNode {
     return(
        <div className="cmd-page">
          
            <Header hidebtn={true} />
            <div className='kayfo-body-content'>

             <div className='kayfo-block-title' style={{textAlign:'center', marginTop:15, textTransform:'uppercase'}}><span>Mon compte</span></div>

              <Container>
                <Row style={{justifyContent:'center', marginTop:15, color:'#fff'}}>
                  <Col lg="4" sm="8" xs="11" className='kayfo-signin-box'>
                    {!this.state.processing &&
                      <Form>
                        
                        <Form.Group className="mb-3" controlId="formBasicTel" style={{display:'flex'}}>
                          <Form.Control required className='kayfo-signin-input' placeholder="tel" disabled value={this.state.user?.username} style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicTel" style={{display:'flex'}}>
                          <Form.Control required className='kayfo-signin-input' onChange={(e)=>this.updateInput("email", e.target.value)} type="email" placeholder="Email de recupération"  style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                        </Form.Group>

                      {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control required className='kayfo-signin-input' onChange={(e)=>this.updateInput("password", e.target.value)} type="password" placeholder="Mot de passe*" style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                      </Form.Group> */}

                      
                      <Button variant="default kayfo-signin-btn" style={{width:'100%', marginTop:45}} onClick={this.submitForm} type="submit" size='lg' >Enregistrer</Button>

                    </Form>
                    }    
                    
                    
                    {this.state.success &&

                      <Snackbar open={true}  anchorOrigin={{ vertical:'top', horizontal:"center" }} autoHideDuration={5000}>
                        <Alert severity="success" sx={{ width: '100%' }}>
                          {this.state.navState == "signup" ? 'Compte créé avec succés !' : 'Connecté.e !'}
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
