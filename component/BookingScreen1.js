import React,{Component} from 'react';
import {StyleSheet, View,Image,TouchableOpacity, Text,Platform,Dimensions,ScrollView,Linking,ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Swiper from 'react-native-swiper';
import {MyStatusBar} from './MyStatusBar';
import {cleanSeat} from '../cgv/cleanSeat';
import {SetSeat2} from '../cgv/SetSeat2';
import {bookcgv} from '../bookcgv';
import {bookmega} from '../bookmega';
import {booklotte} from '../booklotte';
// import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import RecoTheater1 from './list/RecoTheater1';
import RecoTheater2 from './list/RecoTheater2';
import RecoTheater3 from './list/RecoTheater3';
import DomParser from 'dom-parser';
import {URL} from '../config';
import axios from 'axios';

// https://www.cgv.co.kr/common/showtimes/iframeTheater.aspx/GetSeatList?theatercode=0259&palyymd=20220213&screencode=003&playnum=1&starttime=0830&endtime=1045&theatername=CGV제주노형&cnt=139&screenname=3관

// import { connect } from 'react-redux';
// import * as actions from '../actions';
const {width,height}=Dimensions.get("window");
const renderPagination = (index, total, context) => {
  console.log(index);
  // return (
  //   <View style={styles.paginationStyle}>
  //     <Text style={{ 
  //        color: 'rgb(220,220,220)',
  //        paddingHorizontal:10,
  //        borderRadius:20,
  //        fontSize:15        
  //       }}>
  //       <Text style={{
  //         color: 'white',
  //         fontSize: 15
  //       }}>{index + 1}</Text>/{total}
  //     </Text>
  //   </View>
  // )
}
class BookingScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      maxX:0,
      maxY:0,
      seatList:[],
      seatTypes:[],
      seatResult1:[],
      seatResult2:[],
      title:'',
      reco_post:[],
      hilight:[],
      post:[],
      reverse_ratio:1,
      fontSize:10,
      recoLoading:true
    }
    this._getReco=this._getReco.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  async _getReco(){
    console.log('getReco!!!!')
    var user_i={
      y:parseFloat(this.props.setbook_yi), // 0~1 높을 수록 뒷자리
      x:parseFloat(this.props.setbook_xi),  //0~1 높을 수록 오른쪽자리
      p:parseFloat(this.props.setbook_pi), //0~1 높을 수록 통로자리 선호
      s:parseFloat(this.props.setbook_si),  //0~1 높을 수록 옆자리가 비어있는것을 선호
    }
    console.log(this.props.navigation.route)
    console.log("@@@@@@")
    let post = this.props.route.params.post||[];
    let item= this.props.route.params.item||{};
    let time_sliced=item.start.split(':');
    let time=parseFloat(time_sliced[0])+parseFloat(time_sliced[1])/60;
    time=time.toFixed(3);
    var reco_post=[];
    post.map(em=>{
      if(em.type=='IMG'){
        return;
      }
      let time_sliced2=em.start.split(':');
      let time2=parseFloat(time_sliced2[0])+parseFloat(time_sliced2[1])/60;
      time2=time2.toFixed(3);
      if(Math.abs(time2-time)<=0.5){
        if(Math.abs(time2-time)==0&&item.cinemaName==em.cinemaName){
          
        }else{
          reco_post.push(em);
        }
      }
    })
    var reco_result=[];
    var index=0;
    console.log(reco_post)
    if(!reco_post.length){
      this.setState({
        recoLoading:false
      })
    }
    reco_post.map(async em=>{
      switch(em.type){
        case 'CGV':
          var reco_result_temp=await bookcgv({item:em,user_i,date:this.props.date});
          if(reco_result_temp.seat2.length!=0){
            reco_result.push(reco_result_temp); //1열로 이어진 두개가 없을 때 나중에 명 수 선택 기능 추가 후 고려하여 지울것.
          }
          index++;
          recoFinish(index);
          break;
        case 'MEGA':
          var reco_result_temp=await bookmega({item:em,user_i,date:this.props.date});
          if(reco_result_temp.seat2.length!=0){
            reco_result.push(reco_result_temp); //1열로 이어진 두개가 없을 때 나중에 명 수 선택 기능 추가 후 고려하여 지울것.
          }
          index++;
          recoFinish(index);
          break;
        case 'LOTTE':
          var reco_result_temp=await booklotte({item:em,user_i,date:this.props.date});
          if(reco_result_temp.seat2.length!=0){
            reco_result.push(reco_result_temp); //1열로 이어진 두개가 없을 때 나중에 명 수 선택 기능 추가 후 고려하여 지울것.
          }
          index++;
          recoFinish(index);
          break;
        default:
          break;
      }
    });
    const recoFinish=async (index)=>{
      if(index!=reco_post.length){
        return;
      }
      reco_result=reco_result.filter((em)=>{
        return em.seat2[0].score>(!this.state.seatResult2?9999:this.state.seatResult2[0].score)
      })
      reco_result.sort(function(a,b){
        return a.seat2[0].score<b.seat2[0].score? 1:-1;
      });
      await this.setState({
        reco_post:reco_result,
        post,
        recoLoading:false
      });
    }
  }
  async componentDidMount(){
    let item= await this.props.route.params.item||{};
    var now = parseInt(Date.now())+(this.props.date*86400000);
    var theaterDay_d = new Date(now);
    var theaterDay_dy=theaterDay_d.getFullYear();
    var theaterDay_dm=theaterDay_d.getMonth()+1;
    var theaterDay_dd=theaterDay_d.getDate();
    if(theaterDay_dm<10){
        theaterDay_dm='0'+theaterDay_dm;
    }
    if(theaterDay_dd<10){
        theaterDay_dd='0'+theaterDay_dd;
    }
    var theaterDay=`${theaterDay_dy}${theaterDay_dm}${theaterDay_dd}`;
    var starttime_txt=`${item.start.split(':')[0]}${item.start.split(':')[1]}`;
    const obj = {
      body: `{theatercode: '${item.theaterCd}',  palyymd : '${theaterDay}', screencode : '${item.screencode}' , playnum : '${item.playnum}', starttime : '${starttime_txt}', endtime : '${item.end}', theatername : '${item.cinemaName}', cnt : '${item.remain}', screenname : '${item.place}'}`,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'POST'
      }
      console.log(obj)

      await fetch(`https://www.cgv.co.kr/common/showtimes/iframeTheater.aspx/GetSeatList`, obj)
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log('BOOKSCREEN2@@@@@@@@@@@@@@@@@')
        var regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣+|<>/"=|_| |:,]*$/;
        var dom_txt=''
        for(var i=0;i<responseJson.d.length;i++){
            if( regex.test(responseJson.d[i]) ) {
              dom_txt+=responseJson.d[i];
            }
        }
        var parser = new DomParser();
        var dom = parser.parseFromString(dom_txt);
        var seat_reserved=await dom.getElementsByClassName("mini_seat reserved");
        var alphabet=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
        "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        var reserved=seat_reserved.map((em,index)=>{
          var style=em.getAttribute('style');
          var left=parseInt(style.split(':')[1].split('px')[0])*4;
          var top=parseInt(style.split(':')[2].split('px')[0])*4;
          return{
            left,
            top,
            alha:alphabet[top/16],
            no:left/16
          }
        });
        var seat_reserved_x=await dom.getElementsByClassName("mini_seat");
        var reserved_x=seat_reserved_x.map((em,index)=>{
          var style=em.getAttribute('style');
          var left=parseInt(style.split(':')[1].split('px')[0])*4;
          var top=parseInt(style.split(':')[2].split('px')[0])*4;
          // var r_f=reserved.findIndex(emS=>emS.left==left&&emS.top==top);
          return{
            left,
            top,
            alha:alphabet[top/16],
            no:left/16,
            seatStatus:reserved.findIndex(emS=>emS.left==left&&emS.top==top)==-1?"00":"11",
            color:'#222'
          }
        });
        console.log(reserved);
        console.log(reserved_x);
        var user={
          userY:parseFloat(this.props.setbook_yi), // 0~1 높을 수록 뒷자리
          userX:parseFloat(this.props.setbook_xi),  //0~1 높을 수록 오른쪽자리
          userP:parseFloat(this.props.setbook_pi), //0~1 높을 수록 통로자리 선호
          userS:parseFloat(this.props.setbook_si),  //0~1 높을 수록 옆자리가 비어있는것을 선호
        }
        var {seatList_temp,seatList_empty,maxX,maxY,reverse_ratio}=await cleanSeat({responseJson:reserved_x,user});
        var {seatResult2}=await SetSeat2({seatList_empty});
        await this.setState({
          maxX,
          maxY,
          seatList:seatList_temp,
          seatTypes:responseJson.seatTypes,
          seatResult1:seatList_empty,
          seatResult2,
          hilight:seatResult2[0].seat, ///!!!!! seatResult2가 없을때 경우에 대해서 오류 방지 코드 짜놓을것
          title:`${item.name} - ${item.start} ${item.cinemaName}`,
          reverse_ratio,
          fontSize:(15/maxX*width)*0.35
        });
        this._getReco();
      })
      .catch((error) => {
        console.log('에러다 ㅎㅎ')
      console.error(error);
      });
  }
  logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    console.log('');
    console.log('');
    console.log('-------------');
    console.log('Event: ', event);
    console.log('GestureState: ', gestureState);
    console.log('ZoomableEventObject: ', zoomableViewEventObject);
    console.log('');
    console.log(`Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`);
  }
  render(){
    return(
      <View style={styles.container}>
        <MyStatusBar backgroundColor='#fff' barStyle="dark-content"/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={() => {
              let togo = this.props.route.params.togo||'';
              if(togo=='Home'){
                this.props.navigation.navigate('Home')
              }else{
                this.props.navigation.goBack()
              }
            }}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <Text style={styles.title}>
            {this.state.title}
          </Text>
        </View>
        <ScrollView style={{flex:1}}>
          <View style={{
            ...styles.seatContainer,
            height:width*this.state.reverse_ratio
            }}>
            <View //ReactNativeZoomableView
              maxZoom={2}
              minZoom={1}
              zoomStep={1}
              initialZoom={1}
              bindToBorders={true}
              onZoomAfter={this.logOutZoomState}
              style={{
                  backgroundColor: '#fff',
                  flex:1
              }}
            >
              <View style={{flex:1}}>
                  {
                    (()=>{
                      let seatList=this.state.seatList;
                      let seatJSX=seatList.map((x,index)=>{
                        var backgroundColor;
                        if(x.seatStatus!=='00'){
                          return(
                            <TouchableOpacity 
                              style={{
                                ...styles.seat,
                                left:(parseFloat(x.left+0.5)/this.state.maxX*width),
                                top:(parseFloat(x.top+0.5)/this.state.maxY*width)*this.state.reverse_ratio,
                                width:(15/this.state.maxX*width),
                                height:(15/this.state.maxY*width)*this.state.reverse_ratio,
                                position:'absolute',
                                backgroundColor:'#777',
                              }}
                              rippleContainerBorderRadius={50}
                              rippleColor={'#ffffff'}
                              rippleDuration={300}
                              onPress={
                                ()=>{
                                  //this._dialog({pay_amount:x})
                                }
                              }
                              key={`${x.left}${x.top}`}  
                            >
                            <Image source={require('../assets/x_w_16.png')}
                                style={{
                                  width:'50%',
                                  height:'50%',
                                }}
                            />
                            </TouchableOpacity>
                          )
                        }else{
                          // var fst_i=this.state.seatTypes.findIndex(em=>em.seatType==x.seatAllocType);
                          // if(fst_i!=-1){
                          //   backgroundColor=this.state.seatTypes[fst_i].seatColor=='FFFFFF'?`#222`:`#${this.state.seatTypes[fst_i].seatColor}`;
                          // }else{
                          //   backgroundColor='#f00'
                          // }
                          // backgroundColor='#222'
                          return(
                            <TouchableOpacity 
                              style={{
                                ...styles.seat,
                                left:(parseFloat(x.left+0.5)/this.state.maxX*width),
                                top:(parseFloat(x.top+0.5)/this.state.maxY*width)*this.state.reverse_ratio,
                                width:(15/this.state.maxX*width),
                                height:(15/this.state.maxY*width)*this.state.reverse_ratio,
                                position:'absolute',
                                backgroundColor:this.state.hilight.indexOf(`${x.alha}${x.no}`)==-1?'#222':'#d20962',
                                borderColor:this.state.hilight.indexOf(`${x.alha}${x.no}`)==-1?x.color:'#d20962',
                                borderWidth:(1.2/this.state.maxX*width)
                              }}
                              rippleContainerBorderRadius={50}
                              rippleColor={'#ffffff'}
                              rippleDuration={300}
                              onPress={
                                ()=>{
                                  //this._dialog({pay_amount:x})
                                }
                              }
                              key={`${x.left}${x.top}`}  
                            >
                              <Text style={{
                                ...styles.seatTxt,
                                color:'#fff',
                                fontSize:this.state.fontSize*0.8
                              }}>{`${x.alha}${x.no}`}</Text>
                            </TouchableOpacity>
                          )
                        }
                      })
                      return seatJSX;
                    })()
                  }
              </View>
            </View>
          </View>
          <View style={{width:width,height:70,backgroundColor:'rgba(100,100,100,0.1)'}}>
          {
            this.state.seatResult2.length>0?(
                <Swiper 
                  style={Platform.OS==='ios'?{...styles.swiper}:{...styles.swiper}} 
                  showsButtons={false} 
                  showsPagination={false}
                  loop={false}
                  paginationStyle={{
                    // : 30, right: 10
                  }}
                  onIndexChanged={(index)=>{
                    console.log(this.state.seatResult2[index]);
                    this.setState({
                      hilight:this.state.seatResult2[index].seat
                    });
                  }}
                >
                  {
                    (()=>{
                      var seatResult2_leng=this.state.seatResult2.length<10?this.state.seatResult2.length:10;
                      var seatReco=[];
                      let numberList=['첫','두','세','네','다섯','여섯','일곱','여덟','아홉','열'];
                      for(var i=0;i<seatResult2_leng;i++){
                        seatReco.push(
                          <View style={styles.seatLeco} key={`${i}`}>
                            <View style={styles.numberList}>
                              <Text style={styles.numberList_txt}>{`${numberList[i]} 번째 추천`}</Text>
                            </View>
                            {
                              `${this.state.seatResult2[i].seat[0]}`==`${this.state.seatResult2[i].seat[1]}`?(
                                <Text style={styles.seatLeco_txt}>{`${this.state.seatResult2[i].seat[0]}`}</Text>
                              ):(
                                <Text style={styles.seatLeco_txt}>{`${this.state.seatResult2[i].seat[0]}, ${this.state.seatResult2[i].seat[1]}`}</Text>
                              )
                            }
                          </View>
                        )
                      }
                      return seatReco;
                    })()
                  }
                </Swiper>
            ):(null)
          }
          </View>
          {
            this.state.recoLoading?(
              <View
                style={{
                  justifyContent:'center',
                  alignItems:'center',
                  // backgroundColor:'blue',
                  flex:1,
                  height:120,
                  marginTop:40
                }}
              >
                <ActivityIndicator size={Platform.OS === 'ios'? 0 : 50} color="#d20962" />
                  <Text style={{
                      color:'#000',
                      paddingTop:10,
                      fontSize:18,
                      fontWeight:'600',
                      width:'100%',
                      // backgroundColor:'blue',
                      textAlign:'center',
                      marginTop:24
                    }}>
                      {`더 좋은 자리를 찾아줄게요.`}
                  </Text>
              </View>     
            ):(
              <>
              <>
                {
                  !this.state.reco_post.length?(
                    <Text style={{
                        color:'#000',
                        paddingTop:10,
                        fontSize:18,
                        fontWeight:'600',
                        width:'100%',
                        // backgroundColor:'blue',
                        textAlign:'center',
                        marginTop:24
                      }}>
                        {`지금 보고 있는 상영관이 \n제일 좋아요!`}
                    </Text>
                  ):(
                    <Text style={{
                        color:'#000',
                        paddingTop:10,
                        paddingLeft:30,
                        marginBottom:15,
                        fontSize:18,
                        fontWeight:'600'
                      }}>
                      더 좋은 자리에서 볼 수 있어요.
                    </Text>
                  )
                }
              </>

            {
              (()=>{
                var reco_post=[];
                this.state.reco_post.map((em,index)=>{
                  switch(em.item.type){
                    case 'CGV':
                      reco_post.push(
                        <RecoTheater1 
                          item={em} 
                          key={`${index}`} 
                          score={this.state.seatResult2.length>0?this.state.seatResult2[0].score:9999}
                          navigation={this.props.navigation}
                          post={this.state.post}
                        />);
                      break;
                    case 'MEGA':
                      reco_post.push(
                        <RecoTheater2 
                          item={em} 
                          key={`${index}`} 
                          score={this.state.seatResult2.length>0?this.state.seatResult2[0].score:9999}
                          navigation={this.props.navigation}
                          post={this.state.post}
                        />);
                      break;
                    case 'LOTTE':
                      reco_post.push(
                        <RecoTheater3 
                          item={em} 
                          key={`${index}`} 
                          score={this.state.seatResult2.length>0?this.state.seatResult2[0].score:9999}
                          navigation={this.props.navigation}
                          post={this.state.post}
                        />);
                      break;
                    // default:
                    //   break;
                  } 
                })
                return reco_post;
              })()
            }
              </>
            )
          }
        </ScrollView>
        <TouchableOpacity style={styles.ticketing} onPress={async ()=>{
              let item= await this.props.route.params.item||{};
              this.t_index=true;
              var now = parseInt(Date.now())+(this.props.date*86400000);
              var d = new Date(now);
              var dy=d.getFullYear();
              var dm=d.getMonth()+1;
              var dd=d.getDate();
              if(dm<10){
                dm='0'+dm;
              }
              if(dd<10){
                  dd='0'+dd;
              }
              var playYMD=`${dy}${dm}${dd}`;
              console.log(item);
              Linking.openURL(`http://m.cgv.co.kr/Schedule/?tc=${item.theaterCd}&t=T&ymd=${playYMD}&src=`)
        }}>
          <Text style={styles.ticketing_txt}>{`CGV 이동`}</Text>
        </TouchableOpacity>
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
  title:{
    color:'#000',
    fontSize:18,
    fontWeight:'600'
  },
  seatContainer:{
    width,
    height:width,
    backgroundColor:'blue',
    overflow:'hidden',
  },
  seat:{
    backgroundColor:'#222',
    justifyContent:'center',
    alignItems:'center'
  },
  seatTxt:{
    fontSize:7,
    color:'#fff'
  },
  swiperContainer:{
    width:width,
    height:300,
    backgroundColor:'red'
  },
  swiper:{
    // width:width,
    height:70,
    // overflow:'hidden',
    backgroundColor:'rgba(100,100,100,0)',
    marginTop:0
  },
  seatLeco:{
    width:width,
    height:70,
    justifyContent:'center',
    alignItems:'center'
  },
  seatLeco_txt:{
    fontSize:30,
    fontWeight:'600',
    color:'#000'
  },
  paginationStyle:{
    // position:'absolute',
    // top:10,
    // left:10,
    backgroundColor:'rgba(0,0,0,0.4)',
    height:23,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:23,
    backgroundColor:'blue',
    width:100,
    height:100
  },
  numberList:{
    width,
    justifyContent:'center',
    alignItems:'center'
  },
  numberList_txt:{
    fontSize:14,
    color:'#000'
  },
  ticketing:{
    width:width,
    height:65,
    backgroundColor:'#d20962',
    justifyContent:'center',
    alignItems:'center'
  },
  ticketing_txt:{
    color:'#fff',
    fontWeight:'600',
    fontSize:20
  }
});
const mapStateToProps = (state) =>{
  return{
    date:state.sidefunc.date,
    setbook_xi:state.sidefunc.setbook_x,
    setbook_yi:state.sidefunc.setbook_y,
    setbook_pi:state.sidefunc.setbook_p,
    setbook_si:state.sidefunc.setbook_s,
  }
}
export default connect(mapStateToProps)(BookingScreen);