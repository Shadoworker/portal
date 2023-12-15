import Image from 'next/image';
import React, { Component, useState } from 'react';


import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


interface State {
   index : number
}


class Header extends Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      index : 0
    };
  }

 
   render(): React.ReactNode {
     return(
      <Navbar expand="lg" className="bg-body-tertiary kayfo-header">
      <Container fluid>
        <Navbar.Brand href="/">
          <Image src={require("../assets/icons/kayfo-logo.png")} className='kayfo-logo' width={150} alt="Kayfo"  />
        </Navbar.Brand>
    
       {/*  <Button variant="default kayfo-connexion-btn" size='lg'>Connexion</Button> */}

      </Container>
    </Navbar>
     )
   }


}

export default Header;
