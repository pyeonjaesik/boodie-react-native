import React,{Component} from 'react';
import {StyleSheet, View,Image,TouchableOpacity,Dimensions,StatusBar,Platform,ActivityIndicator} from 'react-native';
import {MyStatusBar} from './MyStatusBar';
import { WebView } from 'react-native-webview';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;

const {width,height}=Dimensions.get("window");
export default class WebScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      uri:'',
      loading:true
    }

  }
  static navigationOptions = {
    header:null
  };
  async componentDidMount(){
    let uri= await this.props.route.params.uri||'';
    this.setState({
      uri
    })
  }
  render(){
    return(
      <View style={styles.container}>
        <MyStatusBar backgroundColor='#fff' barStyle='dark-content'/>
        <TouchableOpacity style={styles.leftbtn}
          onPress={() => {this.props.navigation.goBack()}}
        >
          <Image source={require('../assets/x_black.png')} style={{width:30,height:30}}/>
        </TouchableOpacity>
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'blue'}}>
          <WebView
              source={{uri: this.state.uri}}
              style={{marginTop:0,width:width,height:height-STATUSBAR_HEIGHT-55}}
              onLoad={() => {
                this.setState({loading:false});
              }}
          />
          {
            this.state.loading===true?(
              <View style={{position:'absolute',top:(height-STATUSBAR_HEIGHT-155)/2,left:(width-100)/2,width:100,height:100,
              justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size={Platform.OS === 'ios'? 0 : 40} color="#000000" />
              </View>
              
            ):(null)
          }
        </View>
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
    marginRight:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'flex-end'
  },
});
