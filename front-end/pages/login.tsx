import React, { Component, useState } from 'react';
import Header from '../components/Header';

import {withRouter } from 'next/router';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

interface Props {

  title : string
}
interface State {
   index : number,
   navState : string
}
 

class LoginPage extends Component<any,
State> {

  constructor(props:any)
  {
    super(props)
    this.state = {
      index : 0,
      navState : "signup",
    };
  }



  componentDidMount(): void {
    
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
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicTel" style={{display:'flex'}}>

                        <Form.Select style={{width:'auto', backgroundColor:'transparent', color:"#fff", border:'none', borderBottom:'solid 1px #fff', borderRadius:0, padding:'5px 5px', marginRight:10}} aria-label="">
                          <option value="+221" style={{backgroundColor:"transparent", color:"#000"}}> +221</option>
                          <option value="+222" style={{backgroundColor:"transparent", color:"#000"}}> +222</option>
                          <option value="+223" style={{backgroundColor:"transparent", color:"#000"}}> +223</option>
                          <option value="+224" style={{backgroundColor:"transparent", color:"#000"}}> +224</option>
                          <option value="+225" style={{backgroundColor:"transparent", color:"#000"}}> +225</option>
                        </Form.Select>
                        <Form.Control className='kayfo-signin-input' type="tel" placeholder="Numéro de mobile*"  style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control className='kayfo-signin-input' type="password" placeholder="Mot de passe*" style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />

                        {this.state.navState == "signin" &&
                          <Form.Text className="text-muted" style={{float:'right'}}>
                            <span style={{color:"#fff"}}>Oups ! </span><a href='' style={{color:"#FF7A00"}}>Mot de passe oublié ?</a>
                          </Form.Text>
                        }
                        
                      </Form.Group>

                      {this.state.navState == "signup" &&
                        <Form.Group className="mb-3" controlId="formBasicPassword2">
                          <Form.Control className='kayfo-signin-input' type="password" placeholder="Confirmer le mot de passe*" style={{border:'none', borderBottom:'solid 1px #fff', backgroundColor:'transparent', borderRadius:0}} />
                        </Form.Group>
                      }

                      
                      <Button variant="default kayfo-signin-btn" style={{width:'100%', marginTop:45}} type="submit" size='lg' >Se connecter</Button>

                      {this.state.navState == "signin" &&
                        <Form.Text className="text-muted" style={{display:'flex', flex:1, marginTop:10, justifyContent:'center', textAlign:'center'}}>
                          <span style={{color:"#fff", marginRight:10}}>Pas de compte ? </span> <a href='' style={{color:"#FF7A00"}}> Créer mon compte</a>
                        </Form.Text>
                      }
                      
                      {this.state.navState == "signup" &&
                        <Form.Text className="text-muted" style={{display:'flex', flex:1, marginTop:10, justifyContent:'center', textAlign:'center'}}>
                          <span style={{color:"#fff", marginRight:10}}>Déjà inscrit ? </span> <a href='' style={{color:"#FF7A00"}}> Se connecter</a>
                        </Form.Text>
                      }

                    </Form>                  

                  </Col>
                </Row>
              </Container>



            </div>
           
        </div>
    )
  };
};

export default withRouter(LoginPage);
