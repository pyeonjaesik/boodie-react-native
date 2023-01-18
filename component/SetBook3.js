import React,{Component} from 'react';
import {StyleSheet, View,Image,TouchableOpacity, Text,Platform,Dimensions} from 'react-native';
import {MyStatusBar} from './MyStatusBar';
// import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { connect } from 'react-redux';
// import * as actions from '../actions';
const {width,height}=Dimensions.get("window");
export default class SetBook2 extends Component{
  constructor(props){
    super(props);
    this.state={
      s:0,
    }
    this._select=this._select.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  async _select({x,y}){
  }
  render(){
    return(
      <View style={styles.container}>
        <MyStatusBar backgroundColor='#fff' barStyle="dark-content"/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={() => {this.props._goBack(this.props.status)}}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <Text style={styles.title}>
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.number}> 
            <Text style={styles.number_txt}>2<Text style={{fontSize:14,color:'#f1f1f1'}}>/2</Text></Text>
          </View>
          <Text style={styles.subject}>
            {'누군가 옆에 앉는 것을\n얼마나 싫어하시나요?'}
          </Text>
          <View style={styles.info_c}>
            <Image style={styles.info} source={require('../assets/setbook3.png')}/>
          </View>
          <View style={{
            ...styles.select_c,
            }}>
            <TouchableOpacity style={styles.select_dot_c}
              onPress={()=>{
                this.setState({
                  s:1
                })
              }}
            >
              <View style={{
                  borderRadius:width,
                  width:width/17,
                  height:width/17,
                  backgroundColor:this.state.s==1?'#d20962':'rgb(220,220,220)',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.select_dot_c}
              onPress={()=>{
                this.setState({
                  s:2
                })
              }}
            >
              <View style={{
                    borderRadius:width,
                    width:width/14,
                    height:width/14,
                    backgroundColor:this.state.s==2?'#d20962':'rgb(220,220,220)',
                  }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.select_dot_c}
              onPress={()=>{
                this.setState({
                  s:3
                })
              }}            
            >
              <View style={{
                  borderRadius:width,
                  width:width/11,
                  height:width/11,
                  backgroundColor:this.state.s==3?'#d20962':'rgb(220,220,220)',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.select_dot_c}
              onPress={()=>{
                this.setState({
                  s:4
                })
              }}          
            >
              <View style={{
                  borderRadius:width,
                  width:width/8.5,
                  height:width/8.5,
                  backgroundColor:this.state.s==4?'#d20962':'rgb(220,220,220)',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.select_dot_c}
              onPress={()=>{
                this.setState({
                  s:5
                })
              }}
            >
              <View style={{
                  borderRadius:width,
                  width:width/7,
                  height:width/7,
                  backgroundColor:this.state.s==5?'#d20962':'rgb(220,220,220)',
                }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.info_txt}>
            {(()=>{
              switch(this.state.s){
                case 1:
                  return '상관없어요.';
                case 2:
                  return '음.. 조금 싫어요';
                case 3:
                  return '대체로 싫어하는 편이에요.';
                case 4:
                  return '많이 싫어하는 편이에요.';
                case 5:
                  return '완전 싫어해요!\n옆 자리는 비어있는것이 쵝오!';                   
              }
            })()}
          </Text>
          </View>
          {
            this.state.s==0? (
              <TouchableOpacity style={styles.nextbutton} 
                onPress={ ()=>{

                }}
              >
                <Text style={styles.nextbutton_txt}>{'다음'}</Text>
              </TouchableOpacity>
            ):(
              <TouchableOpacity style={{...styles.nextbutton,backgroundColor:'#d20962'}} 
                onPress={async ()=>{
                  var s=(this.state.s-1)*0.3;
                  await this.props.setbook_s(s.toFixed(3));
                  await AsyncStorage.setItem('setbook', `true`);
                  if(this.props.from.indexOf('Booking')!=-1){
                    this.props.navigation.navigate(this.props.from,{
                      item:this.props.item,
                      post:this.props.post,
                      togo:'Home'
                    });
                  }else{
                    this.props.navigation.goBack();
                  }
                }}
              >
                <Text style={styles.nextbutton_txt}>{'다음'}</Text>
              </TouchableOpacity>
            )
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
  mainContainer:{
    flex:1,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center'
  },
  nextbutton:{
    position:'absolute',
    bottom:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgb(180,180,180)',
    width:'80%',
    marginLeft:'10%',
    height:50,
    borderRadius:100,
  },
  nextbutton_txt:{
    color:'white',
    fontSize:18,
  },
  subject:{
    color:"#333",
    fontSize:25,
    paddingLeft:25,
    fontWeight:'600',
    textAlign:'center',
  },
  select_c:{
    width,
    height:width/4,
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center'
  },
  select_dot_c:{
    backgroundColor:'#fff',
    width:width/6,
    height:width/6,
    justifyContent:'center',
    alignItems:'center'
  },
  info_c:{
    width:width,
    height:width*0.65,
    // backgroundColor:'blue',
    justifyContent:'center',
    alignItems:'center'
  },
  info:{
    width:width*0.6,
    height:width*0.6,
    // backgroundColor:'blue'
  },
  info_txt:{
    width:width,
    height:50,
    textAlign:'center',
    fontSize:16,
    color:'#333'
  },
  number:{
    width:50,
    height:40,
    backgroundColor:'#003666',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:50,
    marginTop:-height*0.15,
    marginBottom:height*0.02
  },
  number_txt:{
    color:'#fff',
    fontSize:17,
    fontWeight:'600',
  }
})