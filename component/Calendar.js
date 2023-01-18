import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity,Dimensions,Text,Image} from 'react-native';
import {MyStatusBar} from './MyStatusBar';

const {width,height}=Dimensions.get("window");
export default class Calendar extends Component{
  constructor(props){
    super(props);
  }
  render(){
    var d0 = new Date(parseInt(Date.now())-86400000);
    var d1 = new Date(parseInt(Date.now()));
    var d2 = new Date(parseInt(Date.now())+86400000);
    var d3 = new Date(parseInt(Date.now())+(86400000*2));
    var d4 = new Date(parseInt(Date.now())+(86400000*3));
    var d5 = new Date(parseInt(Date.now())+(86400000*4));
    var d6 = new Date(parseInt(Date.now())+(86400000*5));
    var day=['일','월','화','수','목','금','토'];
    var daycolor=['#fff','#fff','#fff','#fff','#fff','#fff','#fff'];
    var daycolor2=['#be0027','#111','#111','#111','#111','#111','#0091cd'];
    return(
      <View 
       style={styles.container}
      >
        <MyStatusBar backgroundColor='#fff' barStyle='dark-content'/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{
              this.props.navigation.goBack();
            }}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <Text style={styles.header_txt}>날짜를 선택해주세요.</Text>
        </View>

        <TouchableOpacity style={styles.space}/>
        
        <View style={styles.main}>
        <View style={{...styles.comp,height:height*0.11,marginTop:-50}}>
            <TouchableOpacity style={{...styles.btny}}
              onPress={()=>{
                this.props._setCalendar(-1)
              }}    
            >
              <View style={styles.btn_l}>
                <Text style={styles.btn_l_txt1}>{d0.getMonth()+1}</Text>
                <Text style={{...styles.btn_l_txt2,
                  color:daycolor[d0.getDay()]}}>{day[d0.getDay()]}</Text>
              </View>
              <Text style={styles.btn_txt}>{d0.getDate()}</Text>
            </TouchableOpacity>
            <View style={{...styles.btn,marginLeft:20,backgroundColor:'rgba(255,255,255,0)'}}
            >
            </View>
          </View>
          <View style={{...styles.comp}}>
            <TouchableOpacity style={{...styles.btn,borderTopLeftRadius:40,backgroundColor:'#11862f'}}
              onPress={()=>{
                this.props._setCalendar(0)
              }}
            >
              <View style={styles.btn_l}>
                <Text style={styles.btn_l_txt1}>{d1.getMonth()+1}</Text>
                <Text style={{...styles.btn_l_txt2,
                  color:daycolor[d1.getDay()]}}>{day[d1.getDay()]}</Text>
              </View>
              <Text style={styles.btn_txt}>{d1.getDate()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.btn,marginLeft:20,borderTopRightRadius:40,backgroundColor:daycolor2[d2.getDay()]}}
              onPress={()=>{
                this.props._setCalendar(1)
              }}
            >
              <View style={styles.btn_l}>
                <Text style={styles.btn_l_txt1}>{d2.getMonth()+1}</Text>
                <Text style={{...styles.btn_l_txt2,
                  color:daycolor[d2.getDay()]}}>{day[d2.getDay()]}</Text>
              </View>
              <Text style={styles.btn_txt}>{d2.getDate()}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.comp}>
            <TouchableOpacity style={{...styles.btn,backgroundColor:daycolor2[d3.getDay()]}}
              onPress={()=>{
                this.props._setCalendar(2)
              }}
            >
              <View style={styles.btn_l}>
                <Text style={styles.btn_l_txt1}>{d3.getMonth()+1}</Text>
                <Text style={{...styles.btn_l_txt2,
                  color:daycolor[d3.getDay()]}}>{day[d3.getDay()]}</Text>
              </View>
              <Text style={styles.btn_txt}>{d3.getDate()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.btn,marginLeft:20,backgroundColor:daycolor2[d4.getDay()]}}
              onPress={()=>{
                this.props._setCalendar(3)
              }}
            >
              <View style={styles.btn_l}>
                <Text style={styles.btn_l_txt1}>{d4.getMonth()+1}</Text>
                <Text style={{...styles.btn_l_txt2,
                  color:daycolor[d4.getDay()]}}>{day[d4.getDay()]}</Text>
              </View>
              <Text style={styles.btn_txt}>{d4.getDate()}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.comp}>
            <TouchableOpacity style={{...styles.btn,borderBottomLeftRadius:40,backgroundColor:daycolor2[d5.getDay()]}}
              onPress={()=>{
                this.props._setCalendar(4)
              }}    
            >
              <View style={styles.btn_l}>
                <Text style={styles.btn_l_txt1}>{d5.getMonth()+1}</Text>
                <Text style={{...styles.btn_l_txt2,
                  color:daycolor[d5.getDay()]}}>{day[d5.getDay()]}</Text>
              </View>
              <Text style={styles.btn_txt}>{d5.getDate()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.btn,marginLeft:20,borderBottomRightRadius:40,backgroundColor:daycolor2[d6.getDay()]}}
              onPress={()=>{
                this.props._setCalendar(5)
              }}
            >
              <View style={styles.btn_l}>
                <Text style={styles.btn_l_txt1}>{d6.getMonth()+1}</Text>
                <Text style={{...styles.btn_l_txt2,
                  color:daycolor[d6.getDay()]}}>{day[d6.getDay()]}</Text>
              </View>
              <Text style={styles.btn_txt}>{d6.getDate()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      <TouchableOpacity style={styles.space}/>
      </View>
    )
  }

}
const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top:0,
    left:0,
    bottom:0,
    right:0,
    width:'100%',
    height:'100%',
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center'
  },
  header:{
    height:55,
    width:'100%',
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
  header_txt:{
    fontSize:22,
    marginLeft:10,
    color:'#000'
  },
  main:{
    width:'100%',
    backgroundColor:'rgba(255,255,255,0)',
    alignItems:'center',
  },
  subject:{
    fontSize:25,
    color:'#000000',
    marginTop:10,
    fontWeight:'500'
  },
  space:{
    flex:1,
    width:'100%',
  },
  comp:{
    width:'100%',
    height:height*0.20,
    marginBottom:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  btn_txt:{
    color:'#fff',
    fontSize:width*0.10,
    marginLeft:5
  },
  btn:{
    width:width*0.4,
    height:height*0.18,
    backgroundColor:'#000',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20,
    // borderTopLeftRadius:30,
    flexDirection:'row'
  },
  btn_l:{
    alignItems:'center',
    justifyContent:'center',
  },
  btn_l_txt1:{
    color:'#fff',
    fontWeight:'600',
    fontSize:width*0.04
  },
  btn_l_txt2:{
    color:'#fff',
    fontWeight:'600',
    fontSize:width*0.04
  },
  btny:{
    width:width*0.38,
    height:height*0.11,
    backgroundColor:'orange',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:50,
    // borderTopLeftRadius:30,
    flexDirection:'row'
  },
  xbtn:{
    width:50,
    height:50,
    alignSelf:'flex-end',
    justifyContent:'center',
    alignItems:'center'
  }
});