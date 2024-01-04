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


interface Props {

  title : string
}
 
 

class LoginPage extends Component<any,
any> {

  constructor(props:any)
  {
    super(props)
    this.state = {
      index : 0,
      navState : "signin",
      countries : countries, //.sort((a, b) => parseInt(a.dial_code) - parseInt(b.dial_code)),
      processing:false,
      error:false,
      errorMessage:"Une erreur s'est produite lors de l'opération",
      success : false,
      dialCode : "+221",
      flag : "SN.svg",

      username : "",
      password:"",
      repassword:""
    };
  }



  componentDidMount(): void {

    this.getUserCountry()
    
  }

  getUserCountry = async () => {
    try {
      const response = await fetch("https://ipapi.co/json");
      const data = await response.json();
      var countryName = data.country_name;

      var country = countries.find(c=>c.name == countryName) || countries.find(c=>c.name == "Senegal") // senegal by default

      this.setState({dialCode : country?.dial_code, flag : country?.image})

    } catch (error) {
      console.log(error);
    }
  }
 
  switchNavstate = (state:string)=>{
    this.setState({navState : state})
  }

  updateInput = (key,value) =>{

    this.setState({[key] : value})
  }


  submitForm = () =>{

    if(!this.state.username.trim().length) return;
    if(!this.state.password.trim().length) return;

    if(this.state.navState == "signup")
      if(this.state.password != this.state.repassword) return;


    this.setState({processing : true})

    var phone = this.state.dialCode + this.state.username;


    if(this.state.navState == "signup")
    {

      const shortId = nanoid(4);

      var signupData = 
      {
        username : phone,
        password : this.state.password,
        email : phone+"@kayfo-portal.games",
        name : "Joueur "+shortId,
        activated : false,
        subscriptionDate : new Date()
      }
        
      userService.createUser(signupData).then((d:any)=>{
        
        var user = d.user;
        this.setState({success : true})

        var signinData = 
        {
          identifier : phone,
          password : this.state.password,
        }
  
        this.authUser(signinData)
        
        console.log(user)

      })
      .catch(e=>{
        console.log(e)
        this.setState({error : true})

      })
    }
    else if(this.state.navState == "signin")
    {
      var signinData = 
      {
        identifier : phone,
        password : this.state.password,
      }

      this.authUser(signinData)
    }

  }

  authUser = (signinData : any)=>{

    this.setState({navState : 'signin', processing : true})

    userService.authUser(signinData).then((d:any)=>{
          
      var user = d.user;
      this.setState({success : true})

      setTimeout(() => {
        
        const { router } = this.props;

        this.props.mainActions.setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user))
        var to = this.props.mainState.pageOrigin ? this.props.mainState.pageOrigin : "/";

        this.props.mainActions.setPageOrigin(null)

        router.push({pathname:to})

      }, 1000);
      console.log(user)

    })
    .catch(e=>{

      var errorMessage = e.response.data.error.message;

      switch (errorMessage) {
        case accountErrors.noExistingAccount:
          setTimeout(() => {
            this.setState({
              username : "",
              password: "",
              error: false,
              processing:false, 
              navState : 'signup'
            })
          }, 10);
          break;
       
      }

      this.setState({error : true, errorMessage : errorMessage})

    })

  }


  requestPassword = ()=>{
    const { router } = this.props;

    router.push({pathname:"/forgotpassword"})
  }

 

   render(): React.ReactNode {
     return(
        <div className="cmd-page">
          
            <Header hidebtn={true} />
            <div className='kayfo-body-content'>

             <div className='kayfo-block-title' style={{textAlign:'center', marginTop:15, textTransform:'uppercase'}}><span>{this.state.navState == "signup" ? "Créer un compte" : "Se connecter"}</span></div>

              <Container>
                <Row style={{justifyContent:'center', marginTop:15, color:'#fff'}}>
                  <Col lg="4" sm="8" xs="11" className='kayfo-signin-box'>
                    {!this.state.processing &&
                      <Form>
                      <Form.Group className="mb-3" controlId="formBasicTel" style={{display:'flex'}}>
 
                        <Dropdown>
                          <Dropdown.Toggle variant="default" style={{color:'#fff'}} id="dropdown-basic">
                            <Image src={`https://country-code-au6g.vercel.app/${this.state.flag}`} width={20} height={20}  alt="flag"  />
                            <span>{this.state.dialCode}</span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{maxHeight:200, overflowY:'scroll'}}>
                            {countries.map((c:any,i:number)=>{
                              return  <Dropdown.Item key={i} onClick={()=>{this.setState({dialCode:c.dial_code, flag:c.image})}}>
                                  <Image src={`https://country-code-au6g.vercel.app/${c.image}`} width={20} height={20}  alt="flag"  />
                                   <span>{c.dial_code}</span>
                                   <span> - {c.name}</span>
                                </Dropdown.Item>
                            })
                            }
                          </Dropdown.Menu>
                        </Dropdown>
                        <Form.Control required className='kayfo-signin-input' value={this.state.username} onChange={(e)=>this.updateInput("username", e.target.value)} type="tel" placeholder="Numéro de mobile*"  style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control required className='kayfo-signin-input' value={this.state.password} onChange={(e)=>this.updateInput("password", e.target.value)} type="password" placeholder="Mot de passe*" style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />

                        {this.state.navState == "signin" &&
                          <Form.Text className="text-muted" style={{float:'right', marginTop:15}}>
                            <span style={{color:"#fff"}}>Oups ! </span><a onClick={()=>this.requestPassword()} style={{color:"#FF7A00"}}>Mot de passe oublié ?</a>
                          </Form.Text>
                        }
                        
                      </Form.Group>

                      {this.state.navState == "signup" &&
                        <>
                          <Form.Group className="mb-3" controlId="formBasicPassword2">
                            <Form.Control required className='kayfo-signin-input' onChange={(e)=>this.updateInput("repassword", e.target.value)} type="password" placeholder="Confirmer le mot de passe*" style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                          </Form.Group>
                          
                          {this.state.password != this.state.repassword &&
                            <Form.Text className="text-muted" style={{display:'flex', flex:1, marginTop:10, justifyContent:'flex-end', textAlign:'right'}}>
                              <a style={{color:"tomato"}}> Mots de passe non identiques</a>
                            </Form.Text>
                          }
                        </>
                      }

                      
                      <Button variant="default kayfo-signin-btn" style={{width:'100%', marginTop:45}} onClick={this.submitForm} type="submit" size='lg' >{this.state.navState == "signup" ? 'Créer mon compte' : 'Se connecter'}</Button>

                      {this.state.navState == "signin" &&
                        <Form.Text className="text-muted" style={{display:'flex', flex:1, marginTop:10, justifyContent:'center', textAlign:'center', cursor:'pointer'}}>
                          <span style={{color:"#fff", marginRight:10}}>Pas de compte ? </span> <a onClick={()=>this.switchNavstate("signup")} style={{color:"#FF7A00"}}> Créer mon compte</a>
                        </Form.Text>
                      }
                      
                      {this.state.navState == "signup" &&
                        <Form.Text className="text-muted" style={{display:'flex', flex:1, marginTop:10, justifyContent:'center', textAlign:'center', cursor:'pointer'}}>
                          <span style={{color:"#fff", marginRight:10}}>Déjà inscrit ? </span> <a onClick={()=>this.switchNavstate("signin")} style={{color:"#FF7A00"}}> Se connecter</a>
                        </Form.Text>
                      }

                    </Form>
                    }    

                    {this.state.processing && !this.state.error &&
                      <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
                        {this.state.navState == "signup" &&
                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                              <Spinner animation="grow" style={{marginBottom:15}} />
                              <span>Création de votre compte en cours ...</span>
                            </div>
                        }
                        {this.state.navState == "signin" &&
                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                              <Spinner animation="grow" style={{marginBottom:15}} />
                              <span>Connexion en cours ...</span>
                            </div>
                        }

                          <Image src={require("../assets/icons/kayfo-icon-white.png")} width={50} style={{position:'relative', bottom:-40, opacity:0.15}} alt="Kayfo"  />

                      </div>
                    }
                    
                    {this.state.error &&
                      <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
                        {this.state.navState == "signup" &&
                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                              <span>{this.state.errorMessage}</span>
                              <a href="" style={{color:"#FF7A00"}} >reprendre</a>
                            </div>
                        }
                        {this.state.navState == "signin" &&
                            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                              <span>{this.state.errorMessage}</span>
                              <a href="" style={{color:"#FF7A00"}} >reprendre</a>
                            </div>
                        }

                      </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginPage));
