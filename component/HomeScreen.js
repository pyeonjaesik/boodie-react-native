import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,Image,StatusBar,PermissionsAndroid,ActivityIndicator} from 'react-native';
import {MyStatusBar} from './MyStatusBar';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL} from '../config';
import Geolocation from '@react-native-community/geolocation';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import Header from './header/Header'; 
import {getTheater} from '../getTheater';
import {getDetailTheater} from '../getDetailTheater';
import {filterDetail} from '../func/filterDetail';
import {getCGV} from '../getCGV';
import {getMEGA} from '../getMEGA';
import {getLOTTE} from '../getLOTTE';
import {cleanData} from '../cleanData';
import HomeSlide from './HomeSlide';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Permissions from 'react-native-permissions';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;

const {width,height}=Dimensions.get("window");
class HomeScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: '' },
      ],
      scene:{
        first: ()=>{return <View/>},
      },
      loading:true,
      date:0,
      empty:false,
      mainrefresh:0
    };
    this.getfetch=this.getfetch.bind(this);
    this.getDetailfetch=this.getDetailfetch.bind(this);
    this._renderScene=this._renderScene.bind(this);
    this._getLocation=this._getLocation.bind(this);
    this._beforeFetch=this._beforeFetch.bind(this);
    this.getLocationFail=this.getLocationFail.bind(this);
    this._setLocation=this._setLocation.bind(this);
    this._onRefresh=this._onRefresh.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  async _onRefresh(index){
    await this.setState({
      routes: [
        { key: 'first', title: '' },
      ],
      scene:{
        first: ()=>{return <View/>},
      },
      loading:true,
      empty:false
    });
    if(index===1){
      this.getfetch({lat:0,long:0});
    }else{
      this.getDetailfetch();
    }
    
  }
  async getfetch({lat,long}){
    if(lat===0||long===0){
      lat=this.props.lat;
      long=this.props.long;
    }
    var date=this.props.date;
    var findTheater= await getTheater(lat,long,5);
    console.log(findTheater);
    if(findTheater.length==0){
      this.setState({
        map:false,
        calendar:false,
        loading:false,
        empty:true
      });
      return;
    }
    var result=[];
    var index=0;
    await findTheater.map(async (em)=>{
      switch (em.type){
        case 'CGV':
          var result_temp= await getCGV({
            cinemaName:em.name,
            RegionCode:em.RegionCode,
            theaterCd:em.theaterCd,
            date,
            distance:em.distance
          });
          result=result.concat(result_temp);
          console.log(result_temp)
          index++;
          finishControl(index);
          break;
        case 'MEGA':
          var result_temp= await getMEGA({
            cinemaName:em.name,
            cinema:em.cinema,
            date,
            distance:em.distance
          });
          result=result.concat(result_temp);
          console.log('adsads');
          console.log(result_temp);
          index++;
          finishControl(index);
          break; 
        case 'LOTTE':
            var result_temp= await getLOTTE({
              cinemaName:em.name,
              divisionCode:em.divisionCode,
              detailDivisionCode:em.detailDivisionCode,
              cinemaID:em.cinemaID,
              date,
              distance:em.distance
            });
            result=result.concat(result_temp);
            index++;
            finishControl(index);
            break;    
        default:
          break;    
      }
    });
    var finishControl=async (index)=>{
      console.log(result);
      if(index!=findTheater.length){
        return;
      }
      console.log(index+'/'+findTheater.length)
      console.log('가져온 상영 수 :'+result.length);
      if(result.length==0){
        this.setState({
          empty:true,
          loading:false
        })
        return;
      }
      var result2= await cleanData({inputData:result});
      console.log('result2@@@@@@@@@@@@@@')
      console.log(result2);
      var scene_temp={};
      //  first: ()=>{return <View/>},
      var routes_temp=result2.keyList.map(em=>{
        scene_temp={...scene_temp,...{[em.key]:()=>{return <HomeSlide 
        navigation={this.props.navigation}
        post={result2.output[em.key]}/>}}}
        return{
          key:em.key,
          title:em.title
        }
      });
      this.setState({
        routes:routes_temp,
        scene:scene_temp,
        loading:false
      })
    }
  }
  // async getfetch({lat,long}){
  //   if(lat===0||long===0){
  //     lat=this.props.lat;
  //     long=this.props.long;
  //   }
  //   var resultControl=async ({inputData})=>{
  //     var result2= await cleanData({inputData});
  //     var scene_temp={};
  //     var routes_temp=await result2.keyList.map(em=>{
  //       scene_temp={...scene_temp,...{[em.key]:()=>{
  //         return (
  //           <HomeSlide 
  //             navigation={this.props.navigation}
  //             post={result2.output[em.key]}
  //           />
  //         )
  //       }}}
  //       return{
  //         key:em.key,
  //         title:em.title
  //       }
  //     });
  //     await this.setState({
  //       routes:routes_temp,
  //       scene:scene_temp,
  //     });
  //     console.log(routes_temp);
  //     console.log(scene_temp);
  //     this.setState({
  //       loading:false
  //     });
  //     console.log('result Control!!');
  //   }
  //   var now = parseInt(Date.now())+(this.props.date*86400000);
  //   var theaterDay_d = new Date(now);
  //   var theaterDay_dy=theaterDay_d.getFullYear();
  //   var theaterDay_dm=theaterDay_d.getMonth()+1;
  //   var theaterDay_dd=theaterDay_d.getDate();
  //   if(theaterDay_dm<10){
  //       theaterDay_dm='0'+theaterDay_dm;
  //   }
  //   if(theaterDay_dd<10){
  //       theaterDay_dd='0'+theaterDay_dd;
  //   }
  //   var theaterDay=`${theaterDay_dy}${theaterDay_dm}${theaterDay_dd}`;
  //   var data={
  //     geo:[lat,long],
  //     theaterDay
  //   }
  //   const obj = {
  //     body: JSON.stringify(data),
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'POST'
  //   }
  //   fetch(`${URL}/getschedule`, obj)
  //   .then((response) => response.json())
  //   .then(async (responseJson) => {
  //     if(responseJson.status===100){
  //       console.log(responseJson.post);
  //       var inputData=[];
  //       responseJson.post.map(em=>{
  //         var x = (lat-em.geo.lat)*100000.0*0.884;
  //         var y = (long-em.geo.long)*100000.0*1.110;
  //         var distance = Math.sqrt((x*x)+(y*y));
  //         em.schedule.map(schedule=>{
  //           inputData.push({
  //             ...schedule,
  //             code:em.code,
  //             type:em.type,
  //             cinemaName:em.name,
  //             distance
  //           })
  //         })
  //       });
  //       if(inputData.length===0){
  //         this.setState({
  //           empty:true,
  //           loading:false
  //         })
  //       }else{
  //         resultControl({inputData});
  //       }
  //     }else if(responseJson.status===102){
  //       console.log(responseJson.status);
  //       this.setState({
  //         empty:true,
  //         loading:false
  //       })
  //     }else{
  //       alert('상영정보를 가져오는 중 에러발생');
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  // }
  async getDetailfetch(){
    var date=this.props.date;
    var findTheater= await getDetailTheater(this.props.findoption);
    if(findTheater.length==0){
      this.setState({
        map:false,
        calendar:false,
        loading:false,
        empty:true
      });
      return;
    }
    var result=[];
    var index=0;
    await findTheater.map(async (em,ii)=>{
      switch (em.type){
        case 'CGV':
          var result_temp= await getCGV({
            cinemaName:em.name,
            RegionCode:em.RegionCode,
            theaterCd:em.theaterCd,
            date,
            distance:em.distance
          });
          result_temp= await filterDetail({result_temp,findoption:this.props.findoption[ii]});
          result=result.concat(result_temp);
          index++;
          finishControl(index);
          break;
        case 'MEGA':
          var result_temp= await getMEGA({
            cinemaName:em.name,
            cinema:em.cinema,
            date,
            distance:em.distance
          });
          result_temp= await filterDetail({result_temp,findoption:this.props.findoption[ii]});
          result=result.concat(result_temp);
          index++;
          finishControl(index);
          break; 
        case 'LOTTE':
          var result_temp= await getLOTTE({
            cinemaName:em.name,
            divisionCode:em.divisionCode,
            detailDivisionCode:em.detailDivisionCode,
            cinemaID:em.cinemaID,
            date,
            distance:em.distance
          });
          result_temp= await filterDetail({result_temp,findoption:this.props.findoption[ii]});
          result=result.concat(result_temp);
          index++;
          finishControl(index);
          break;    
        default:
          break;    
      }
    })
    var finishControl=async (index)=>{
      if(index!=findTheater.length){
        return;
      }
      console.log('가져온 상영 수 :'+result.length);
      if(result.length==0){
        this.setState({
          empty:true,
          loading:false
        })
        return;
      }
      var result2= await cleanData({inputData:result});
      console.log(result2);
      var scene_temp={};
      //  first: ()=>{return <View/>},
      var routes_temp=result2.keyList.map(em=>{
        scene_temp={...scene_temp,...{[em.key]:()=>{return <HomeSlide 
        navigation={this.props.navigation}
        post={result2.output[em.key]}/>}}}
        return{
          key:em.key,
          title:em.title
        }
      });
      this.setState({
        routes:routes_temp,
        scene:scene_temp,
        loading:false
      })
    }
    //
    //
    ///
    ///
    ///
    return;
    var resultControl=async ({inputData})=>{
      var result2= await cleanData({inputData});
      console.log('cleared data');
      console.log(result2);
      var scene_temp={};
      var routes_temp=await result2.keyList.map(em=>{
        scene_temp={...scene_temp,...{[em.key]:()=>{
          return (
            <HomeSlide 
              navigation={this.props.navigation}
              post={result2.output[em.key]}
            />
          )
        }}}
        return{
          key:em.key,
          title:em.title
        }
      });
      console.log('routes_temp / scene_temp');
      console.log(routes_temp);
      console.log(scene_temp);
      await this.setState({
        routes:routes_temp,
        scene:scene_temp,
      });
      console.log('---------------');
      console.log(this.state.routes);
      console.log(this.state.scene);
      this.setState({
        loading:false
      });
    }
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
    var data={
      findoption:this.props.findoption,
      theaterDay
    }
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getdetail`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100){
        console.log(`responseJson.post`);
        console.log(responseJson.post);
        var inputData=[];
        responseJson.post.map(em=>{
          var x = (this.props.lat-em.geo.lat)*100000.0*0.884;
          var y = (this.props.long-em.geo.long)*100000.0*1.110;
          var distance = Math.sqrt((x*x)+(y*y));
          em.schedule.map(schedule=>{
            inputData.push({
              ...schedule,
              code:em.code,
              type:em.type,
              cinemaName:em.name,
              distance
            })
          })
        });
        if(inputData.length===0){
          this.setState({
            empty:true,
            loading:false
          })
        }else{
          resultControl({inputData});
        }
      }else if(responseJson.status===102){
        console.log(responseJson.status);
        this.setState({
          empty:true,
          loading:false
        })
      }else{
        alert('상영정보를 가져오는 중 에러발생');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async _setLocation(){
    await this.setState({
      calendar:false,
      loading:true,
      empty:false,
      map:false
    });
    this.getfetch({lat:0,long:0})
  }
  async _beforeFetch({lat,long}){
    await this.props.location_f({lat,long}); ///=> 부팅시에 작동안함.
    this.getfetch({lat,long});
    var coords_temp = await AsyncStorage.getItem('coords')||'0/0';
    await AsyncStorage.setItem('coords', `${lat}/${long}`);
    var coords=coords_temp.split('/');
    var lat_older=parseFloat(coords[0]);
    var long_older=parseFloat(coords[1]);
    var x = (lat-lat_older)*100000.0*0.884;
    var y = (long-long_older)*100000.0*1.110;
    if(Math.sqrt((x*x)+(y*y))>500){
      const obj = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-NCP-APIGW-API-KEY-ID':'lq6q2xrxsr',
          'X-NCP-APIGW-API-KEY':'tgUzmRUJULFOp6LOe4TeURjYmLGjtEn9eXEnhplM'
        },
        method: 'GET'
      }
      fetch(`https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${long},${lat}&sourcecrs=epsg:4326&output=json&orders=admcode`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status.name=='ok'){
          if(responseJson.results.length>0){
            var region=`${responseJson.results[0].region.area1.name} ${responseJson.results[0].region.area2.name} ${responseJson.results[0].region.area3.name} ${responseJson.results[0].region.area4.name}`
            this.props.placename_f({placename:region});
            AsyncStorage.setItem('placename', region);
          }else{
          }
        }else{
          AsyncStorage.setItem('placename', '머나먼 곳');
          this.props.placename_f({placename:'머나먼 곳'});
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }else{
      var region_older = await AsyncStorage.getItem('placename')||'';
      this.props.placename_f({placename:region_older});
        console.log('기존 위치:'+region_older)
    }
  }
  async _getLocation(){
    if(Platform.OS === 'ios'){      
      Permissions.request('location', {type: 'whenInUse'}).then(response => {
        if(response=='authorized'){
          Geolocation.getCurrentPosition(async (info) =>{
            this._beforeFetch({lat:info.coords.latitude,long:info.coords.longitude});
          },async (err)=>{
            this.getLocationFail();
          },{
            timeout:5000,
            maximumAge:300000
          });
        }else{
          this.getLocationFail();
        }
      });
    }else{
      Geolocation.getCurrentPosition(async (info) =>{
        this._beforeFetch({lat:info.coords.latitude,long:info.coords.longitude});
      },async (err)=>{
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: '부디앱에서 위치정보를 사용합니다.',
              message:
                '근처에 있는 영화관을 찾기위해 부디앱에서 위치정보를 받아오고자 합니다. 다음 화면에서 허용버튼을 눌러주세요.',
              buttonPositive: '다음',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            DeviceInfo.getAvailableLocationProviders().then(providers => {
              if(providers.gps===true&&providers.network===true&&providers.passive===true){
                Geolocation.getCurrentPosition(info =>{
                  this._beforeFetch({lat:info.coords.latitude,long:info.coords.longitude});
                },(err)=>{
                  this.getLocationFail();
                },{
                  timeout:5000,
                  maximumAge:300000
                });
              }else{
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                .then(data => {
                  Geolocation.getCurrentPosition(info =>{
                    this._beforeFetch({lat:info.coords.latitude,long:info.coords.longitude});
                  },(err)=>{
                    this.getLocationFail();
                  },{
                    timeout:5000,
                    maximumAge:300000
                  });
                }).catch(err => {
                  console.log(err);
                  this.getLocationFail();
                });
              }
            });
          } else {
            console.log('Camera permission denied');
            this.getLocationFail();
          }
        } catch (err) {
          console.warn(err);
          this.getLocationFail();
        }
      },{
        timeout:5000,
        maximumAge:300000
      });
    }
  }
  getLocationFail(){
    this.setState({
      map:true,
      calendar:false,
      loading:false,
      empty:true
    });
    this.props.placename_f({placename:'위치를 설정해주세요.'})
  }
  async componentWillReceiveProps(nextProps) {
    if(nextProps.mainrefresh !== this.state.mainrefresh) {
      await this.setState({ mainrefresh: nextProps.mainrefresh });
      if(nextProps.findoption.length>0){
        this._onRefresh(2);
        //findoption
      }else{
        this._onRefresh(1);
      }
      
    }
  }
  async componentDidMount(){
    await this._getLocation();
  }
  _renderScene(){
    return SceneMap(this.state.scene)
  }
  render(){
    return(
      <View style={styles.container}>
        <MyStatusBar backgroundColor='#fff' barStyle='dark-content'/>
        <Header navigation={this.props.navigation}/>
        {
          this.state.loading===false?(
            <TabView
              navigationState={this.state}
              renderScene={this._renderScene()}
              enabled ={true}
              onIndexChange={index => this.setState({ index })}
              initialLayout={{ width: Dimensions.get('window').width }}
              scrollEnabled={true}
              renderTabBar={props =>
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: '#000' }}
                  style={styles.tabBar}
                  scrollEnabled={true}
                  activeColor='#d20962'
                  inactiveColor='#777'
                  tabStyle={{width:'auto',marginHorizontal:10}}
                  bounces={true}
                  labelStyle={{fontSize:14}}
                  indicatorStyle={{height:6,marginBottom:-3,backgroundColor:'#d20962',borderRadius:10}}
                >
                </TabBar>
              }
            />
          ):(
            <View
              style={{
                height:height-STATUSBAR_HEIGHT-55,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'#fff'
              }}
            >
              <ActivityIndicator size={Platform.OS === 'ios'? 0 : 50} color="#d20962" />
            </View>
          )
        }
        {
          this.state.empty===true?(
            <View 
              style={{
                height:height-STATUSBAR_HEIGHT-55,
                justifyContent:'center',
                alignItems:'center'
              }}
            >
              <Image source={require('../assets/alert.png')}
                  style={{
                    width:120,
                    height:120,
                    marginBottom:50
                  }}
              />
              <Text style={{color:'#000',fontSize:20,textAlign:'center',lineHeight:26}}>{'상영 정보가 없습니다.\n상단의 버튼을 클릭하여 \n날짜 혹은 위치를 설정해주세요.'}</Text>
            </View>
          ):(null)
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  scene: {
    flex: 1,
  },
  tabBar:{
    backgroundColor: '#fff',
    borderBottomWidth:1,
    borderBottomColor:'rgba(200,200,200,0.2)',
    shadowOffset: { height: 0, width: 0 }, 
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    height:50,
    overflow:'hidden'
  },
  lottie: {
    width:width*0.5,
    height:width*0.5,
    alignSelf:'center',
    marginBottom:height*0.1,
    marginTop:30
  },
});
const mapStateToProps = (state) =>{
  return{
    lat:state.sidefunc.lat,
    long:state.sidefunc.long,
    placename:state.sidefunc.placename,
    date:state.sidefunc.date,
    mainrefresh:state.sidefunc.mainrefresh,
    findoption:state.sidefunc.findoption,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    location_f: ({lat,long})=>{
      dispatch(actions.location({lat,long}));
    },
    placename_f:({placename})=>{
      dispatch(actions.placename({placename}))
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen);