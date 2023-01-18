import React,{Component} from 'react';
import {StyleSheet, View,Dimensions,Image,TouchableOpacity,Text} from 'react-native';

import {URL} from '../config';
const {width}=Dimensions.get("window");
export default class FindOption extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  static navigationOptions = {
    header:null
  };
  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity style={styles.leftbtn}
          onPress={()=>{
            this.props._setStatus(1)
          }}
        >
          <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
        </TouchableOpacity>
        <View style={{flex:1,justifyContent:'center'}}>
          <Text style={styles.subject}>검색옵션을 선택해주세요.</Text>
          <TouchableOpacity style={styles.findBtn1} onPress={this.props._findSimple}>
            <View style={styles.btn_top}>
              <Image source={require('../assets/location.png')} style={styles.btn_img}/>
              <Text style={styles.btn_txt_main}>간단 검색</Text>
            </View>
            <Text style={styles.btn_txt_sub}>내 근처 영화관의 상영시간표를 조회합니다.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.findBtn2}
            onPress={async ()=>{
              await this.props._initialize()
              this.props._setStatus(3)
            }}
          >
            <View style={styles.btn_top}>
              <Image source={require('../assets/detail.png')} style={styles.btn_img}/>
              <Text style={styles.btn_txt_main}>상세 검색</Text>
            </View>
            <Text style={styles.btn_txt_sub}>영화,특별 상영관,영화관을 상세 조정합니다.</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) 
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  subject:{
    fontSize:25,
    color:'#000',
    marginLeft:'10%',
    marginBottom:30,
    marginTop:'-20%',
    fontWeight:'600'
  },
  leftbtn:{
    marginTop:0,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center',
  },
  findBtn1:{
    width:'85%',
    height:160,
    alignSelf:'center',
    backgroundColor:'#00334e',
    marginBottom:15,
    borderRadius:10,
    justifyContent:'center'
  },
  findBtn2:{
    width:'85%',
    height:160,
    alignSelf:'center',
    backgroundColor:'#d20962',
    borderRadius:10,
    justifyContent:'center'
  },
  btn_top:{
    width:'100%',
    height:60,
    alignItems:'center',
    flexDirection:'row'
  },
  btn_img:{
    width:36,
    height:36,
    marginLeft:30
  },
  btn_txt_main:{
    fontSize:40,
    marginLeft:15,
    color:'#fff'
  },
  btn_txt_sub:{
    fontSize:15,
    marginLeft:30,
    marginTop:10,
    color:'#fff'
  }
});