import React,{Component} from 'react';
import {StyleSheet, View,Image,TouchableOpacity, Text,Platform,Dimensions} from 'react-native';
import SetBook1 from './SetBook1'
import SetBook2 from './SetBook2'
import SetBook3 from './SetBook3'
import { connect } from 'react-redux';
import * as actions from '../actions';
const {width,height}=Dimensions.get("window");
class SetBookScreen extends Component{
  constructor(props){
    super(props);
    console.log(this.props)
    console.log(this.props.navigation)
    console.log('aaa')
    // let from = ''||this.props.navigation.getParam('from','');
    let from = ''
    let post=[];
    let item={};
    // if(from.indexOf('Booking')!=-1){
    //   post = []||this.props.navigation.getParam('post',[]);
    //   item= {}||this.props.navigation.getParam('item',{});
    // }
    this.state={
      status:0,
      from,
      post,
      item
    }
    this._goBack=this._goBack.bind(this);
    this._goTo=this._goTo.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  _goBack = ()=>{
    switch(this.state.status){
      case 0:
        this.props.navigation.goBack();
        break;
      case 1:
        this.setState({
          status:0
        })
        break; 
      case 2:
        this.setState({
          status:1
        })
        break;         
    }
  }
  _goTo = ()=>{
    switch(this.state.status){
      case 0:
        this.setState({
          status:1
        })
        break;
      case 1:
        this.setState({
          status:2
        })
        break;       
    }
  }

  render(){
    return(
      <View style={styles.container}>
        {
          (()=>{
            switch(this.state.status){
              case 0:
                return(
                  <SetBook1 
                    _goBack={this._goBack}
                    _goTo={this._goTo} 
                    status={this.state.status} 
                    setbook_xy={this.props.setbook_xy} 
                    setbook_xi={this.props.setbook_xi}
                    setbook_yi={this.props.setbook_yi}
                  />
                )
              case 1:
                  return(
                    <SetBook2 
                      _goBack={this._goBack}
                      _goTo={this._goTo} 
                      status={this.state.status} 
                      setbook_p={this.props.setbook_p}
                      setbook_pi={this.props.setbook_pi}
                      setbook_s={this.props.setbook_s}
                      setbook_si={this.props.setbook_si}
                      navigation={this.props.navigation}
                    />
                  ) 
              case 2:
                  return(
                    <SetBook3 
                      _goBack={this._goBack}
                      _goTo={this._goTo} 
                      status={this.state.status} 
                      setbook_p={this.props.setbook_p}
                      setbook_pi={this.props.setbook_pi}
                      setbook_s={this.props.setbook_s}
                      setbook_si={this.props.setbook_si}
                      navigation={this.props.navigation}
                      from={this.state.from}
                      post={this.state.post}
                      item={this.state.item}
                    />
                  )                   
            }
          })()
        }
      </View>
    )
    
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  header:{
    width:'100%',
    height:55,
    flexDirection:'row',
    alignItems:'center'
  },
  leftbtn:{
    marginTop:0,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
});
const mapStateToProps = (state) =>{
  return{
    setbook_xi:state.sidefunc.setbook_x,
    setbook_yi:state.sidefunc.setbook_y,
    setbook_pi:state.sidefunc.setbook_p,
    setbook_si:state.sidefunc.setbook_s,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setbook_xy: (x,y)=>{
      dispatch(actions.setbook_xy(x,y));
    },
    setbook_p: (p)=>{
      dispatch(actions.setbook_p(p));
    },
    setbook_s: (s)=>{
      dispatch(actions.setbook_s(s));
    },
  }   
}

export default connect(mapStateToProps,mapDispatchToProps)(SetBookScreen);