import React, { Component, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'next/image';

interface State {
   index : number
}


class BottomTabNav extends Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      index : 0
    };
  }
 
   render(): React.ReactNode {
     return(
        <Navbar expand="lg" fixed='bottom' className="bg-body-tertiary  kayfo-bottom-nav">
        <Nav fill variant="tabs" className=' kayfo-bottom-nav' defaultActiveKey="#" style={{display:'flex', flex:1, flexDirection:'row'}}>
            <Nav.Item >
                <Nav.Link className='kayfo-bottom-nav-link' href="/" >
                    <Image src={require("../assets/icons/home-icon.png")} alt="" />
                    Accueil        
            </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link className='kayfo-bottom-nav-link' eventKey="link-1" href='/'>
                    <Image src={require("../assets/icons/search-icon.png")} alt="" />
                    Recherche</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link className='kayfo-bottom-nav-link' eventKey="link-2" href='/'>
                    <Image src={require("../assets/icons/favs-icon.png")} alt="" />
                    Mes Jeux</Nav.Link>
            </Nav.Item>
            </Nav>
        </Navbar>
    )
  };
};

export default BottomTabNav;
