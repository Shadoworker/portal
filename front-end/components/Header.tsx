import { Avatar } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import Image from 'next/image';
import { withRouter } from 'next/router';
import React, { Component, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as mainActions from '../redux/main/mainActions'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import userService from '../services/user.service';

 

class Header extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      index : 0,
      user : null,
      dev:false,
    };
  }


  componentDidMount(): void {
    
    var user = (sessionStorage.getItem("user") && sessionStorage.getItem("user") != 'undefined') ? JSON.parse(sessionStorage.getItem("user") || "{}") : null;

    const { router } = this.props;
    if(router.asPath.includes("?dev")) this.setState({dev:true})


    this.setState({user})

  }

  gotoLogin = ()=>{
    const { router } = this.props;
    router.push({pathname:"/login"})
  }

  
  myaccount = ()=>{
 
    const { router } = this.props;
    router.push({pathname:"/account"})
  }

  logout = ()=>{

    var user = null;

    setTimeout(() => {
      
      const { router } = this.props;

      this.props.mainActions.setUser(user);
      sessionStorage.removeItem("user")
      // router.reload()
      router.push({pathname:"/"})


    }, 50);

  }

 
   render(): React.ReactNode {
     return(
      <Navbar expand="lg" className="bg-body-tertiary kayfo-header">
      <Container fluid>
        <Navbar.Brand href="/">
          <Image src={require("../assets/icons/kayfo-logo.png")} className='kayfo-logo' width={150} alt="Kayfo"  />
        </Navbar.Brand>

        {/* {this.state.dev && */}
        <>
          {!this.props.hidebtn && !this.state.user &&
            <Button variant="default kayfo-connexion-btn" size='lg' onClick={this.gotoLogin} >Connexion</Button>
          }
        </>
        {/* } */}
        
        {this.state.user &&
          <Dropdown drop={"start"}>
          <Dropdown.Toggle variant="default" style={{color:'#fff', border:'none'}} id="dropdown-basic">
            <span style={{position:'absolute', right:'150%'}}>{this.state.user.name}</span><Avatar style={{position:'absolute', top:0, left:-5}} sx={{ bgcolor: deepOrange[500] }}>{/* this.state.user?.name ? this.state.user?.name[0] : */ null }</Avatar>
          </Dropdown.Toggle>
          <Dropdown.Menu >
            <Dropdown.Item onClick={()=>this.myaccount()}>
              Mon compte
            </Dropdown.Item>
            <Dropdown.Item onClick={()=>this.logout()}>
              Déconnexion
            </Dropdown.Item>
            
          </Dropdown.Menu>
        </Dropdown>
        }
        {this.props.hidebtn &&
          <Form.Select style={{width:'auto', backgroundColor:'transparent', color:"#fff", borderRadius:25, padding:'5px 35px 5px 15px'}} aria-label="">
            <option value="1" style={{backgroundColor:"transparent", color:"#000"}}>Français</option>
            <option value="2" style={{backgroundColor:"transparent", color:"#000"}}>English</option>
          </Form.Select>
        }

      </Container>
    </Navbar>
     )
   }


}



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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
