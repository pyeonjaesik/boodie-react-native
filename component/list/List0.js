import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,View,Linking, Platform} from 'react-native';
import Ripple from 'react-native-material-ripple';
import DomParser from 'dom-parser';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import { BlurView } from "@react-native-community/blur";
import StarRating from './StarRating'
const {width}=Dimensions.get("window");
const getInfoMEGA=async (url)=>{
  var schedule_Data= await axios.post(url);
  const parser = new DomParser();
  const dom = parser.parseFromString(schedule_Data.data);
  const rate=dom.getElementById('contents').getElementsByClassName('score')[0].getElementsByClassName('before')[1].getElementsByTagName('em')[0].innerHTML||'';
  let imageURL=dom.getElementsByClassName('poster')[0].getElementsByTagName('img')[0].attributes[0].value||''
  const ranking=dom.getElementById('contents').getElementsByClassName('rate')[0].getElementsByTagName('em')[0].innerHTML||'0'
  imageURL=imageURL.slice(0,-7)+'720.jpg'
  console.log(imageURL);
  return [imageURL,rate,ranking]
}
const getInfoLOTTE=async (url)=>{

}
export default class List0 extends Component{
  constructor(props){
    super(props);
    this.state={
      imageURL:''
    }

  }
  t_index=false;
  async componentDidMount(){
    if(this.props.item.detail=='MEGA'){
      const url=`https://www.megabox.co.kr/movie-detail?rpstMovieNo=${this.props.item.movieCode}`;
      const [imageURL,rate,ranking]= await getInfoMEGA(url);
      this.setState({
        imageURL,
        rate,
        ranking
      })
    }else if(this.props.item.detail==='LOTTE'){
      const formData = new FormData();
      const lowData={
        "MethodName":"GetMovieDetailTOBE",
        "channelType":"MW",
        "osType":"Chrome",
        "osVersion":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Mobile Safari/537.36",
        "multiLanguageID":"KR",
        "representationMovieCode":"17634",
        "memberOnNo":""
      }
      var form=JSON.stringify(lowData);
      formData.append('paramList',form);
      
      const options = {
        method: 'POST',
        body: formData
      };
      await fetch(`https://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx`, options)
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
        this.setState({
          imageURL:responseJson.Movie.PosterURL,
          rate:responseJson.Movie.ViewEvaluation,
          ranking:responseJson.Movie.BookingRank
        })
      })
      .catch((error) => {
        console.error(error);
      });
    }

  }
  render(){
    return(
      <Ripple style={{...styles.container}} activeOpacity={0.7} onPress={async () => {
          if(this.t_index==false){
            console.log(this.props.item)
            this.t_index=true;
            if(this.props.item.detail=='MEGA'){
              this.props.navigation.navigate('Web',{
                uri:`https://www.megabox.co.kr/movie-detail?rpstMovieNo=${this.props.item.movieCode}`
              })
            }else if(this.props.item.detail==='LOTTE'){
              console.log(this.props.item)
              this.props.navigation.navigate('Web',{
                uri:`https://www.lottecinema.co.kr/NLCMW/Movie/MovieDetailView?movie=${this.props.item.output.movie}`
              })
            }

                      
          }
          setTimeout(()=>{this.t_index=false
            console.log('t_index ==> false');
          },1000);
        }}
        rippleColor={this.props.item.detail=='MEGA'?'#511378':'#ff0000'} rippleDuration={500}>
          {
            !this.state.imageURL?(null):(
              <View style={styles.div}>
                <View style={{width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                  <FastImage
                        style={styles.poster_background}
                        source={{
                            uri: this.state.imageURL,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                />
                  {
                    Platform.OS==='ios'?(
                      <BlurView
                        style={styles.absolute}
                        blurType="black"
                        blurAmount={10}
                        reducedTransparencyFallbackColor="white"
                      />
                    ):(
                      <View
                        style={{...styles.absolute,backgroundColor:'rgba(0,0,0,0.7)'}}
                      />
                    )
                  }

                </View>
                <View
                    style={styles.bottom}
                />
                <View
                  style={{width:'100%',height:'100%',flexDirection:'row',position:'absolute'}}
                >
                  <View style={styles.info}>
                    <View style={{marginLeft:24,width:'100%',paddingTop:'12.5%'}}>

                      {(()=>{
                        if(this.props.item.detail=='MEGA'){
                          return(
                            <Text numberOfLines={2} style={{...styles.info_txt_subject,fontSize:24}}>{this.props.item.name}</Text>
                          )
                        }else{
                          return(
                            <Text numberOfLines={2} style={{...styles.info_txt_subject,fontSize:24}}>{this.props.item.output.name}</Text>
                          )
                        }
                      })()}
                      <Text style={styles.info_txt_subject}>평       점    <Text style={{fontSize:20}}>{this.state.rate}</Text></Text>
                      <Text style={styles.info_txt_subject}>예매순위    <Text style={{fontSize:18,color:'#fd5c63'}}>{`${this.state.ranking}위`}</Text></Text>
                    </View>
  
                  </View>
                  <FastImage
                      style={styles.poster}
                      source={{
                          uri: this.state.imageURL,
                          headers: { Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </View>
            )
          }
      </Ripple>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
  },
  div:{
    width:width,
    // borderBottomWidth:0.3,
    // borderColor:'rgb(180,180,180)',
    justifyContent:'center',
    alignItems:'center',
    height:width*0.5,
    marginTop:0,
    backgroundColor:'rgba(0,0,0,0.9)',
    backgroundColor:['#3393E4', '#715886']

  },
  poster_background:{
    width:'100%',
    height:'100%',
    opacity:1
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  poster:{
    height:'80%',
    // position:'absolute',
    marginTop:'5%',
    flex:1,
    // backgroundColor:'blue'
  },
  bottom:{
    width:'100%',
    position:'absolute',
    bottom:0,
    height:40,
    backgroundColor:'#fff',
    borderTopLeftRadius:32,
    borderTopRightRadius:32
  },
  info:{
    flex:1,
  },
  info_txt_subject:{
    fontSize:14,
    color:'rgba(255,255,255,1)',
    fontWeight:'bold',
    marginBottom:2
  },
  info_txt_content:{
    marginTop:8,
    fontSize:22,
    color:'rgba(255,255,255,1)',
    fontWeight:'bold',
  },
  main:{
    width:width-100,
    marginLeft:0,
  },
  imgcontainer:{
    width:60,
    height:60,
    justifyContent:'center',
    alignItems:'center'
  },
  main_subject:{
    fontSize:17,
    color:'rgb(20,20,20)',
    width:'100%',
    marginTop:9,
    fontWeight:'500',
    alignItems:'center'
  },
  main_subject_v:{
    fontSize:15,
    color:'rgb(40,40,40)',
    width:width-200,
    marginTop:3,
    marginBottom:7,
  },
  main_txt:{
    fontSize:14,
    color:'rgb(100,100,100)',
    marginTop:5,
    marginBottom:10
  },
  main_time:{
    fontSize:14,
    color:'rgb(115,115,115)',
    marginBottom:10
  },
  seat:{
    position:'absolute',
    top:10,
    right:15,
    height:30,
    paddingHorizontal:10,
    borderWidth:0.5,
    borderColor:'rgba(100,100,100,0.4)',
    borderRadius:6,
    justifyContent:'center',
    alignItems:'center'
  },
  remain:{
    fontSize:13,
    color:'#000'
  },
  size:{
    fontSize:12,
    color:'#444'
  },
  div_txt:{
    color:'#000',
    fontSize:18,
    fontWeight:'600'
  }

})