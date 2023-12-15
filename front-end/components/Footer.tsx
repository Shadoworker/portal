import React, { Component, useState } from 'react';
import Button from 'react-bootstrap/Button';
import {Row, Col, Nav} from 'react-bootstrap';
import Image from 'next/image';

interface State {
   index : number
}


class Footer extends Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      index : 0
    };
  }

 
   render(): React.ReactNode {
     return(
        <Row className='kayfo-footer-box'>
            <Col>
                <Row style={{display:'flex', flexDirection:'row'}}>
                    <Col>
                      <Image src={require("../assets/icons/kayfo-logo.png")} className='kayfo-logo-footer' width={150} alt="Kayfo"  />
                    </Col>
                    <Col style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
                        <Row>
                            <Col style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <a href="https://www.facebook.com/kayfogames?mibextid=LQQJ4d" className='kayfo-social-link'>
                                    <Image src={require('../assets/icons/fb-icon.png')} alt="" />
                                </a>
                            </Col>
                            <Col style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <a href="https://youtube.com/@kayfogames7107?si=wv-ejD-NksYtHqiD" className='kayfo-social-link'>
                                    <Image src={require('../assets/icons/yt-icon.png')} alt="" />
                                </a>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col>

                <Nav as="ul" className='kayfo-footer-links-nav'>
                    <Nav.Item as="li">
                        <Nav.Link href="#">A propos</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <Nav.Link eventKey="link-1">Conditions d'utilisation</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <Nav.Link eventKey="link-2">Contactez-nous</Nav.Link>
                    </Nav.Item>
                </Nav>

            </Col>
        </Row>
        
    )
  };
};

export default Footer;
