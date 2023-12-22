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
 
 

class ResetPasswordPage extends Component<any,
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
      token : null,

      user : null
    };
  }



  componentDidMount(): void {
     
    const urlParams = new URLSearchParams(window.location.search);
    // Get specific parameters
    const token = urlParams.get('token');

    this.setState({token:token})

  }
 
  switchNavstate = (state:string)=>{
    this.setState({navState : state})
  }

  updateInput = (key,value) =>{

    this.setState({[key] : value})
  }


  submitForm = () =>{
 
    if(!this.state.password || !this.state.password.trim().length) return;

    if(this.state.password != this.state.repassword) return;

    var updateData = 
    { 
      password : this.state.password,
      passwordResetToken : null
    }
        
    this.updatePassword(updateData)

    console.log("rrr")
  }

  updatePassword = (updateData : any)=>{

    this.setState({processing : true})

    userService.getUserByToken(this.state.token).then((d:any)=>{
          
      var users = d;

      if(users.length > 0)
      {
        var user = users[0];

        userService.updateUser(user.id, updateData).then((d:any)=>{
            
          this.setState({success : true})

          const { router } = this.props;
          
          setTimeout(() => {
            router.push({pathname:"/login"})
          }, 1200);
    
    
        })
        .catch(e=>{
    
          this.setState({error : true})
    
        })

      }
      else
      {
        this.setState({error : true})
      }


    })
    .catch(e=>{
 
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
                         
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Control required className='kayfo-signin-input' onChange={(e)=>this.updateInput("password", e.target.value)} type="password" placeholder="Mot de passe*" style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword2">
                            <Form.Control required className='kayfo-signin-input' onChange={(e)=>this.updateInput("repassword", e.target.value)} type="password" placeholder="Confirmer le mot de passe*" style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                        </Form.Group>
                          

                      <Button variant="default kayfo-signin-btn" style={{width:'100%', marginTop:45}} onClick={this.submitForm} type="submit" size='lg' >Envoyer</Button>

                    </Form>
                    }   

                    {this.state.processing && !this.state.error &&
                      <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                          <Spinner animation="grow" style={{marginBottom:15}} />
                          <span>Réinitialisation en cours ...</span>
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ResetPasswordPage));
