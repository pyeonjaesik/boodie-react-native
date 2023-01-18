import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity,Dimensions,Text,Image,TextInput,Platform,ActivityIndicator,PermissionsAndroid,Button} from 'react-native';
import {MyStatusBar} from './MyStatusBar';
import Geocoder from 'react-native-geocoding';
import {KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Permissions from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

const {width,height}=Dimensions.get("window");
export default class Map extends Component{
  constructor(props){
    super(props);
    this.state={
      region:'',
      status:0,
      lat:0,
      long:0,
      alert:''
    }
    this._search=this._search.bind(this);
    this._getLocation=this._getLocation.bind(this);
    this._findRegion=this._findRegion.bind(this);
    this._getLocationFail=this._getLocationFail.bind(this);
  }
  async _getLocation(){
    this.refs.searchBox.blur();
    await this.setState({status:9});
    if(Platform.OS === 'ios'){
      Permissions.request('location', {type: 'whenInUse'}).then(response => {
        if(response=='authorized'){
          Geolocation.getCurrentPosition(async (info) =>{
            this._findRegion({lat:info.coords.latitude,long:info.coords.longitude});
          },async (err)=>{
            Permissions.check('location', {type: 'whenInUse'}).then(response => {
              if(response=="restricted"){
                this._getLocationFail('위치서비스를 켜주세요.');
              }else if(response=="denied"){
                this._getLocationFail('부디의 위치서비스 권한을 허용해주세요.');
              }else{
                this._getLocationFail('주소를 직접 입력해주세요.');
              }
            });
          },{
            timeout:5000,
            maximumAge:300000
            // enableHighAccuracy:false
          });
        }else{
          Permissions.check('location', {type: 'whenInUse'}).then(response => {
            if(response=="restricted"){
              this._getLocationFail('위치서비스를 켜주세요.');
            }else if(response=="denied"){
              this._getLocationFail('부디의 위치서비스 권한을 허용해주세요.');
            }else{
              this._getLocationFail('주소를 직접 입력해주세요.');
            }
          });
        }
      });
    }else{
      Geolocation.getCurrentPosition(async (info) =>{
        //success
        this._findRegion({lat:info.coords.latitude,long:info.coords.longitude});
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
                  //success
                  this._findRegion({lat:info.coords.latitude,long:info.coords.longitude});
                },(err)=>{
                  //fail
                  this._getLocationFail('위치서비스를 켜주세요.');
                },{
                  timeout:5000,
                  maximumAge:300000
                  // enableHighAccuracy:false
                });
              }else{
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                .then(data => {
                  Geolocation.getCurrentPosition(info =>{
                    //success
                    this._findRegion({lat:info.coords.latitude,long:info.coords.longitude});
                  },(err)=>{
                    //fail
                    this._getLocationFail('위치서비스를 켜주세요.');
                  },{
                    timeout:5000,
                    maximumAge:300000
                    // enableHighAccuracy:false
                  });
                }).catch(err => {
                  console.log(err);
                  //fail
                  this._getLocationFail('위치서비스를 켜주세요.');
                });
              }
            });
          } else {
            console.log('Camera permission denied');
            //fail
            this._getLocationFail('위치권한을 허용해 주세요.');
          }
        } catch (err) {
          console.warn(err);
          //fail
          this._getLocationFail('알 수 없는 에러 android 301')
        }
      },{
        timeout:5000,
        maximumAge:300000
        // enableHighAccuracy:false
      });
    }
  }
  _findRegion({lat,long}){
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
          console.log(responseJson.results[0])
          var region=`${responseJson.results[0].region.area1.name} ${responseJson.results[0].region.area2.name} ${responseJson.results[0].region.area3.name} ${responseJson.results[0].region.area4.name}`;
          this.setState({
            region,
            status:1,
            lat,
            long
          })
        }else{
          this.setState({
            status:2
          })
        }
      }else{
        this.setState({
          status:2
        })
      }
    })
    .catch((error) => {
      this.setState({
        status:2
      })
    });
  }
  _getLocationFail(alert){
    this.setState({
      status:3,
      alert
    })
  }
  async _search(){
    this.refs.searchBox.blur();
    await this.setState({
      status:9
    })
    console.log('_search');
    Geocoder.init('AIzaSyA355S3x_lyqulF_ScuPpGjF4wSZfVYmwA'); // use a valid API key
    Geocoder.from(`대한민국 ${this.state.query}`)
    .then( (json) => {
      console.log(json);
        var location = json.results[0].geometry.location;
        this._findRegion({lat:location.lat,long:location.lng});
    })
    .catch(error => {
      console.log(error);
      this.setState({
        status:2
      })
    });
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
        <MyStatusBar backgroundColor='#fff' barStyle='dark-content'/>
        <TouchableOpacity style={styles.leftbtn}
          onPress={()=>{
            this.props.navigation.goBack();
          }}
        >
          <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
        </TouchableOpacity>
        <Text style={styles.subject}>{'지역, 도로명, 건물명을\n입력하세요.'}</Text>
        <View style={{flexDirection:'row',marginTop:15}}>
          <TextInput
            style={styles.txtinput}
            placeholder="예) 서울시 부디아파트"
            autoFocus={true}
            clearButtonMode='always'
            ref='searchBox'
            onChangeText={query => {
              this.setState({query});
            }}
          />
          <TouchableOpacity style={styles.search}
            onPress={this._search}
          >
            <Image style={{width:40,height:40}} source={require('../assets/search.png')}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.thisPlace}
          onPress={this._getLocation}
        >
          <Image source={require('../assets/aim.png')} style={{width:40,height:40,marginLeft:-10,marginBottom:-2}}/>
          <Text style={styles.thisPlace_txt}>현 위치로 주소 설정</Text>
        </TouchableOpacity>
        {
          (()=>{
            switch(this.state.status){
              case 1:
                return(
                  <View>
                    <TouchableOpacity style={styles.resultBox}
                      onPress={async ()=>{
                        this.props._placename(this.state.region);
                        this.props._location([this.state.lat,this.state.long])
                        await AsyncStorage.setItem('coords', `${this.state.lat}/${this.state.long}`);
                        AsyncStorage.setItem('placename', this.state.region);
                      }}
                    >
                      <Text style={styles.resultBox_txt}>{this.state.region}</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize:13,color:'#000',textAlign:'center',marginTop:20}}>위 주소가 맞다면 검정색 버튼을 클릭해주세요.</Text>
                  </View>
                )
              case 2:
                  return(
                    <View style={styles.loadingBox}>
                      <Text style={{...styles.resultBox_txt,color:'orange'}}>주소를 제대로 입력해주세요.</Text>
                    </View>
                  )
              case 3:
                  return(
                    <View style={styles.loadingBox}>
                      <Text style={{...styles.resultBox_txt,color:'orange'}}>{this.state.alert}</Text>
                    </View>
                  )            
              case 9:
                return(
                  <View style={styles.loadingBox}>
                    <ActivityIndicator size={Platform.OS === 'ios'? 1 : 20} color="#000000" />
                  </View>
                )
              default:
                break;    
            }
          })()
        }
      </KeyboardAvoidingView>
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
  },
  main:{
    width:'100%',
    backgroundColor:'rgba(255,255,255,0)',
    alignItems:'center',
  },
  leftbtn:{
    marginTop:0,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  subject:{
    fontSize:23,
    color:'#000000',
    marginLeft:25,
    lineHeight:33
  },
  txtinput:{
    width:width-112,
    marginLeft:26,
    backgroundColor:'rgba(150,150,150,0.1)',
    borderWidth:0.5,
    borderColor:'rgba(100,100,100,0.2)',
    paddingHorizontal:15,
    color:'#000',
    borderRadius:3,
    height:50
  },
  search:{
    width:50,
    height:50,
    borderWidth:0.5,
    marginLeft:10,
    borderColor:'rgba(100,100,100,0.2)',
    borderRadius:3,
    justifyContent:'center',
    alignItems:'center'
  },
  thisPlace:{
    width:width-52,
    height:50,
    borderWidth:0.5,
    marginLeft:26,
    borderColor:'rgba(100,100,100,0.2)',
    borderRadius:3,
    marginTop:10,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  thisPlace_txt:{
    color:'#000',
    fontSize:15,
  },
  resultBox:{
    width:width-52,
    height:50,
    borderWidth:0.5,
    marginLeft:26,
    borderColor:'rgba(100,100,100,0.8)',
    borderRadius:3,
    marginTop:30,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'#000'
  },
  resultBox_txt:{
    color:'#fff',
    fontSize:15,
  },
  loadingBox:{
    width:width-52,
    height:50,
    borderWidth:0.5,
    marginLeft:26,
    borderColor:'rgba(100,100,100,0.2)',
    borderRadius:3,
    marginTop:30,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  }
});