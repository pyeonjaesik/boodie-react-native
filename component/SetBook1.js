import React,{Component} from 'react';
import {StyleSheet, View,Image,TouchableOpacity, Text,Platform,Dimensions} from 'react-native';
import {MyStatusBar} from './MyStatusBar';
// import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
// import { connect } from 'react-redux';
// import * as actions from '../actions';
const {width,height}=Dimensions.get("window");
export default class SetBook1 extends Component{
  constructor(props){
    super(props);
    this.state={
      selected:[]
    }
    this._select=this._select.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  async _select({x,y}){
    await this.setState({
      selected:[x,y]
    });
    console.log(this.state.selected)
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
        <View style={styles.seatContainer}>
          <Text style={styles.subject}>
              {'선호하는 좌석을\n선택해주세요.'}
          </Text>
          <View style={{width:width,height:width+60}}>
            <View style={styles.screen_c}>
              <View style={styles.screen}>
                <Text style={styles.screen_txt}>스크린</Text>
              </View>
            </View>
            {
              (()=>{
                var alphabet=['A','B','C','D','E','F','G'];
                var seatList=[];
                for(var i=0;i<7;i++){
                  for(var j=0;j<7;j++){
                    seatList.push({
                      y:i,
                      x:j,
                      name:`${alphabet[i]}${j+1}`
                    })
                  }
                }
                let seatJSX=seatList.map((x,index)=>{
                  var backgroundColor;
                  return(
                    <View
                      style={{
                        left:width/7*x.x,
                        top:width/7*x.y+60,
                        width:width/7,
                        height:width/7 ,
                        position:'absolute',
                        backgroundColor:'#fff',
                        justifyContent:'center',
                        alignItems:'center'
                      }}
                      onPress={
                        ()=>{
                          //this._dialog({pay_amount:x})
                        }
                      }
                      key={`${x.x}${x.y}`}  
                    >
                      <TouchableOpacity style={{
                        ...styles.seatbtn,
                        // borderWidth:this.state.selected[0]==x.x&&this.state.selected[1]==x.y?4:0,
                        // borderColor:this.state.selected[0]==x.x&&this.state.selected[1]==x.y?'#fd5c63':'#000',
                        backgroundColor:this.state.selected[0]==x.x&&this.state.selected[1]==x.y?'#d20962':'#000'
                      }} onPress={()=>{
                        this._select({x:x.x,y:x.y})
                      }}
                      activeOpacity={0.5}
                      >
                        <Text style={{
                          color:'#fff',
                          fontSize:width/25
                        }}>{`${x.name}`}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                })
                return seatJSX;
              })()
            }
            </View>
          </View>
          {
            this.state.selected.length==0 ? (
              <TouchableOpacity style={{
                ...styles.nextbutton
              }} 
                onPress={ ()=>{

                }}
              >
                <Text style={styles.nextbutton_txt}>{'다음'}</Text>
              </TouchableOpacity>
            ):(
              <TouchableOpacity style={{...styles.nextbutton,backgroundColor:'#d20962'}} 
                onPress={async ()=>{
                  var x=(this.state.selected[0]+0.5)/7;
                  var y=(this.state.selected[1]+0.5)/7;
                  if(this.state.selected[0]==0){
                    x=0;
                  }
                  if(this.state.selected[0]==6){
                    x=1;
                  }
                  if(this.state.selected[1]==0){
                    y=0;
                  }
                  if(this.state.selected[1]==6){
                    y=1;
                  }
                  await this.props.setbook_xy(x.toFixed(3),y.toFixed(3));
                  this.props._goTo();
                  console.log(this.props.setbook_xi+' '+this.props.setbook_yi)
                }}
              >
                <Text style={styles.nextbutton_txt}>{`다음`}</Text>
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
  seatContainer:{
    flex:1,
    backgroundColor:'#fff',
    justifyContent:'center'
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
  seatbtn:{
    width:'90%',
    height:'90%',
    backgroundColor:'#000',
    justifyContent:'center',
    alignItems:'center'
  },
  subject:{
    color:"#000",
    fontSize:28,
    paddingLeft:25,
    marginTop:-height*0.2,
    marginBottom:height*0.03,
    fontWeight:'600'
  },
  screen_c:{
    justifyContent:'center',
    alignItems:'center',
    width:width,
    height:60
  },
  screen:{
    width:width*0.7,
    height:35,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#003666',
    borderRadius:3
  },
  screen_txt:{
    color:'#fff',
    fontSize:17,
    fontWeight:'600'
  }
})