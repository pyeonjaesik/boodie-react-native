import React,{Component} from 'react';
import {StyleSheet, View,Image,TouchableOpacity, Text,Platform,Dimensions,ScrollView,Linking,ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Swiper from 'react-native-swiper';
import {MyStatusBar} from './MyStatusBar';
import {cleanSeat} from '../lotte/cleanSeat';
import {SetSeat2} from '../lotte/SetSeat2';
import {bookcgv} from '../bookcgv';
import {bookmega} from '../bookmega';
import {booklotte} from '../booklotte';
// import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import RecoTheater1 from './list/RecoTheater1';
import RecoTheater2 from './list/RecoTheater2';
import RecoTheater3 from './list/RecoTheater3';


// import { connect } from 'react-redux';
// import * as actions from '../actions';
const {width,height}=Dimensions.get("window");
const renderPagination = (index, total, context) => {
  console.log('vvv');
  // console.log(index);
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
class BookingScreen3 extends Component{
  constructor(props){
    super(props);
    this.state={
      maxX:0,
      maxY:0,
      minX:0,
      minY:0,
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
    var user_i={
      y:parseFloat(this.props.setbook_yi), // 0~1 높을 수록 뒷자리
      x:parseFloat(this.props.setbook_xi),  //0~1 높을 수록 오른쪽자리
      p:parseFloat(this.props.setbook_pi), //0~1 높을 수록 통로자리 선호
      s:parseFloat(this.props.setbook_si),  //0~1 높을 수록 옆자리가 비어있는것을 선호
    }
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
    let item= this.props.route.params.item||{};
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
    var theaterDay=`${theaterDay_dy}-${theaterDay_dm}-${theaterDay_dd}`;
    var data={
    }
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    let formData = new FormData();
    var zzz={"MethodName":"GetSeats","channelType":"HO","osType":"Chrome","osVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36","cinemaId":item.cinemaId,"screenId":item.screenId,"playDate":theaterDay,"playSequence":item.playSequence,"screenDivisionCode":item.screenDivisionCode.toString()}
    var fff=JSON.stringify(zzz);
    formData.append('paramList',fff);
    
    const options = {
      method: 'POST',
      body: formData
    };
    await fetch(`http://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx`, options)
    .then((response) => response.json())
    .then(async (responseJson) => {
        console.log(responseJson);
        var user={
          userY:parseFloat(this.props.setbook_yi), // 0~1 높을 수록 뒷자리
          userX:parseFloat(this.props.setbook_xi),  //0~1 높을 수록 오른쪽자리
          userP:parseFloat(this.props.setbook_pi), //0~1 높을 수록 통로자리 선호
          userS:parseFloat(this.props.setbook_si),  //0~1 높을 수록 옆자리가 비어있는것을 선호
        }
        var {seatList_temp,seatList_empty,maxX,maxY,minX,minY,reverse_ratio}=await cleanSeat({responseJson,user});
        var {seatResult2}=await SetSeat2({seatList_empty});
        var hilight=[];
        if(seatResult2.length>0){
          hilight=seatResult2[0].seat
        }
        console.log('reverse_ratio'+reverse_ratio)
        await this.setState({
          maxX,
          maxY,
          minX,
          minY,
          seatList:seatList_temp,
          seatTypes:responseJson.seatTypes,
          seatResult1:seatList_empty,
          seatResult2,
          hilight,
          title:`${item.name} - ${item.start} ${item.cinemaName}`,
          reverse_ratio,
          fontSize:(parseFloat(seatList_temp[0].SeatXLength)/maxX*width)*0.35
        });
        this._getReco();
    })
    .catch((error) => {
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
            ...styles.seatContainer,height:width*this.state.reverse_ratio}}>
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
                        if(x.SeatStatusCode!=0){
                          return(
                            <TouchableOpacity 
                              style={{
                                ...styles.seat,
                                left:(parseFloat(x.SeatXCoordinate)/this.state.maxX*width),
                                top:(parseFloat(x.SeatYCoordinate)/this.state.maxY*width)*this.state.reverse_ratio,
                                width:(parseFloat(x.SeatXLength)/this.state.maxX*width),
                                height:(parseFloat(x.SeatYLength)/this.state.maxY*width)*this.state.reverse_ratio,
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
                              key={`${x.SeatXCoordinate}${x.SeatYCoordinate}`}  
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
                          //   backgroundColor='#222'
                          // }
                          backgroundColor='#222'
                          return(
                            <TouchableOpacity 
                              style={{
                                ...styles.seat,
                                left:(parseFloat(x.SeatXCoordinate)/this.state.maxX*width),
                                top:(parseFloat(x.SeatYCoordinate)/this.state.maxY*width)*this.state.reverse_ratio,
                                width:(parseFloat(x.SeatXLength)/this.state.maxX*width),
                                height:(parseFloat(x.SeatYLength)/this.state.maxY*width)*this.state.reverse_ratio,
                                position:'absolute',
                                backgroundColor:this.state.hilight.indexOf(`${x.SeatRow}${x.SeatColumn}`)==-1?'#222':'#d20962',
                              }}
                              rippleContainerBorderRadius={50}
                              rippleColor={'#ffffff'}
                              rippleDuration={300}
                              onPress={
                                ()=>{
                                  //this._dialog({pay_amount:x})
                                }
                              }
                              key={`${x.SeatXCoordinate}${x.SeatYCoordinate}`}
                            >
                              <Text style={{
                                ...styles.seatTxt,
                                color:'#fff',
                                fontSize:this.state.fontSize
                              }}>{`${x.SeatRow}${x.SeatColumn}`}</Text>
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
                          <View style={styles.seatLeco} key={i}>
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
              let item= this.props.route.params.item||{};
              console.log(item);
              console.log(`https://www.lottecinema.co.kr/NLCHS/Cinema/Detail?divisionCode=${item.divisionCode}&detailDivisionCode=${item.detailDivisionCode}&cinemaID=${item.cinemaId}`)
            Linking.openURL(`https://www.lottecinema.co.kr/NLCMW/Ticketing/Cinema`)
        }}>
          <Text style={styles.ticketing_txt}>{`롯데시네마 이동`}</Text>
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
    backgroundColor:'#fff',
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
    backgroundColor:'rgba(100,100,100,0.1)',
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
export default connect(mapStateToProps)(BookingScreen3);