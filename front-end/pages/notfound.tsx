import Image from 'next/image';
import React, { Component, useState } from 'react';

interface State {
   index : number
}


class NotFoundPage extends Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      index : 0
    };
  }

 
   render(): React.ReactNode {
     return(
        <div className="cmd-page" style={{display:'flex', flex:1, height:'100%', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
           <Image src="https://st.depositphotos.com/47577860/52247/v/450/depositphotos_522478724-stock-illustration-browser-error-internet-icon-flat.jpg" style={{width:'30%', margin:'40px 0px'}} alt="" />
           <h1>Page introuvable !</h1>
        </div>
    )
  };
};

export default NotFoundPage;
