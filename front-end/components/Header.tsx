import Image from 'next/image';
import { withRouter } from 'next/router';
import React, { Component, useState } from 'react';


import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


interface State {
   index : number
}


class Header extends Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      index : 0
    };
  }

  gotoLogin = ()=>{
    const { router } = this.props;
    router.push({pathname:"/login"})
  }
 
   render(): React.ReactNode {
     return(
      <Navbar expand="lg" className="bg-body-tertiary kayfo-header">
      <Container fluid>
        <Navbar.Brand href="/">
          <Image src={require("../assets/icons/kayfo-logo.png")} className='kayfo-logo' width={150} alt="Kayfo"  />
        </Navbar.Brand>

        {!this.props.hidebtn &&
        <></>
          // <Button variant="default kayfo-connexion-btn" size='lg' onClick={this.gotoLogin} >Connexion</Button>
        }
        {this.props.hidebtn &&
        <></>
        
        // <Form.Select style={{width:'auto', backgroundColor:'transparent', color:"#fff", borderRadius:25, padding:'5px 35px 5px 15px'}} aria-label="">
        //   <option value="1" style={{backgroundColor:"transparent", color:"#000"}}>Français</option>
        //   <option value="2" style={{backgroundColor:"transparent", color:"#000"}}>English</option>
        // </Form.Select>
        }

      </Container>
    </Navbar>
     )
   }


}

export default withRouter(Header);
