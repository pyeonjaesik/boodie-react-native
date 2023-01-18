import React,{Component} from 'react';
import {StyleSheet, View,Image,TouchableOpacity, Text,Platform,Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MyStatusBar} from './MyStatusBar';

// import { connect } from 'react-redux';
// import * as actions from '../actions';
const {width,height}=Dimensions.get("window");
export default class IntroScreen extends Component{
  constructor(props){
    super(props);
    this._start=this._start.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  componentWillUnmount(){
    AsyncStorage.setItem('intro', 'false');
  }
  _start(){
    this.props.navigation.goBack();
  }
  render(){
    return(
      <View style={styles.container}>
        <MyStatusBar backgroundColor='#fff' barStyle="light-content"/>
        <Swiper showsPagination={true} showsButtons={true} loop={false} bounces={Platform.OS==='ios'?true:false} activeDotColor='#000' style={styles.swiper}>
          <View style={styles_s.swiper_comp}>                 
            <Text style={{...styles_s.subject,marginTop:30}}>{'근처 영화관 시간표를'}</Text>
            <Text style={{...styles_s.subject2,marginTop:10,fontSize:40}}>{'한눈에!'}</Text>
            <View style={{
                width:width*0.8,
                height:width*1.48,
                borderRadius:35,
                overflow:'hidden',
                marginTop:3,
                borderWidth:3,
                borderColor:'#000',
                marginTop:40
            }}>
                <Image source={require('../temp/boodie.png')} 
                  style={{
                    width:width*0.8,
                    height:width*1.6,
                    borderRadius:35,
                    marginTop:0
                }}/>
            </View>
          </View>
          <View style={{flex:1,backgroundColor:'#fff',alignItems:'center'}}>              
          <Text style={{...styles_s.subject,marginTop:100}}>{'손쉽게 시간표 확인 후'}</Text>
            <Text style={{...styles_s.subject2,marginTop:10,fontSize:40}}>{'바로예매!'}</Text>
            <Image
              style={{
                marginTop:100,
                width:250,
                height:250
              }}
              source={require('../temp/ticket.png')}
            />
          </View>
          <View style={{flex:1,backgroundColor:'#fff',alignItems:'center'}}>              
          <Text style={{...styles_s.subject,marginTop:100}}>{'영화 정보 확인을'}</Text>
            <Text style={{...styles_s.subject2,marginTop:10,fontSize:40}}>{'손쉽게!'}</Text>
            <Image
              style={{
                marginTop:100,
                width:250,
                height:250
              }}
              source={require('../temp/movie-theater.png')}
            />
            <TouchableOpacity style={styles.start} onPress={this._start}>
              <Text style={styles.start_txt}>시작하기</Text>
            </TouchableOpacity>
          </View>
        </Swiper>
      </View>
    )
    
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  leftbtn:{
    marginTop:0,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  swiper:{
    backgroundColor:'#fff'
  },
  swiper_comp:{
    flex:1,
    backgroundColor:'#fff',
    alignItems:'center',
  },
  swiper_comp2:{
    flex:1,
    backgroundColor:'rgb(0,0,17)',
    alignItems:'center',
    justifyContent:'center'
  },
  intro_img:{
    width:width*0.5,
    height:width*0.5,
    marginTop:(height*0.8-width*0.5)/2,
    marginBottom:40
  },
  intro_img_s:{
    position:'absolute',
    width:width*0.2,
    height:width*0.2,
    top:(height*0.8-width*0.5)/2+width*0.33,
    left:width*0.6,
  },
  subject:{
    fontSize:27,
    color:'#fff',
    fontWeight:'600',
    marginBottom:15
  },
  info:{
    fontSize:17,
    color:'rgb(220,220,220)',
    fontWeight:'400',
    textAlign:'center',
    lineHeight:23
  },
  start:{
    position:'absolute',
    bottom:35,
    right:30,
    height:55,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    paddingHorizontal:20,
  },
  start_txt:{
    fontSize:18,
    color:'#000',
  }
});
const styles_s=StyleSheet.create({
  swiper_comp:{
    flex:1,
    backgroundColor:'#fff',
    alignItems:'center'
  },
  swiper_comp2:{
    flex:1,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center'
  },
  subject:{
    fontSize:30,
    color:'#000',
    marginTop:20,
    textAlign:'center',
    fontWeight:'200',
  },
  subject2:{
    fontSize:32,
    color:'#000',
    textAlign:'center',
    fontWeight:'600'
  },
  subject3:{
    fontSize:35,
    color:'#000',
    marginTop:0,
    marginLeft:30,
    fontWeight:'200',
    textAlign:'center'
  },
  intro_img_s:{
    width:width*0.8,
    height:width*1.6,
    borderRadius:35,
    marginTop:40
  }
})