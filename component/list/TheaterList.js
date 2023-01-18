import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,View,Linking,TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import { Animated, Easing } from 'react-native';

const {width}=Dimensions.get("window");
export default class TheaterList extends Component{
  constructor(props){
    super(props);
    var x = (this.props.location[0]-parseFloat(this.props.item.geo.lat))*100000.0*0.884;
    var y = (this.props.location[1]-parseFloat(this.props.item.geo.long))*100000.0*1.110;
    var distance=parseInt(Math.sqrt((x*x)+(y*y)));
    this.state={
      progress:new Animated.Value(0.2),
      movieList:[],
      movieScreen:{},
      movieScreen_str:'',
      movieList_str:'',
      distance:distance>1000?`${(distance/1000).toFixed(1)}km`:`${distance}m`
    }
  }
  componentWillMount(){
    var movieList=[];
    var movieScreen=[];
    this.props.movieList.map(em=>{
      if(this.props.item.movieList.indexOf(em)!==-1){
        movieList.push(em);
      }
    });
    this.props.movieScreen.map(em=>{
      if(this.props.item.movieScreen.indexOf(em)!==-1){
        movieScreen.push(em);
      }
    });
    var movieList_str='';
    var movieLength=movieList.length;
    movieList.map((em,index)=>{
      if(index+1===movieLength){
        movieList_str+=em;
      }else{
        movieList_str+=em+' | ';
      }
    });
    var movieScreen_r={};
    var movieScreen_check=[];
    movieScreen.map(em=>{
      var movieScreen_spliced=em.split('*');
      var movieIndex=movieScreen_check.indexOf(movieScreen_spliced[0]);
      if(movieIndex==-1){
        movieScreen_check.push(movieScreen_spliced[0]);
        movieScreen_r={...movieScreen_r,...{[movieScreen_spliced[0]]:[movieScreen_spliced[1]]}}
      }else{
        movieScreen_r[movieScreen_spliced[0]].push(movieScreen_spliced[1]);
      }
    });
    var movieScreen_str='';
    for(key in movieScreen_r){
      movieScreen_str+=key+' ';
      movieScreen_r[key].map(em=>{
        movieScreen_str+='#'+em+' ';
      });
      // movieScreen_str+='\n';
    }
    this.setState({
      movieList,
      movieScreen:movieScreen_r,
      movieList_str,
      movieScreen_str
    })
  }
  async componentWillReceiveProps(nextProps) {
    if(nextProps.selected.findIndex(em=>em.type==this.props.item.type&&em.code==this.props.item.code)===-1){
      Animated.timing(this.state.progress, {
        toValue: 0.2,
        duration: 0,
        easing: Easing.linear,
      }).start();
    }else{
      Animated.timing(this.state.progress, {
        toValue: 0.3,
        duration: 400,
        easing: Easing.linear,
      }).start();
    }
  }
  render(){
    return(
      <TouchableOpacity style={{...styles.container}} activeOpacity={1} onPress={() => {
          if(this.props.selected.findIndex(em=>em.type==this.props.item.type&&em.code==this.props.item.code)===-1){
            this.props._select({
              name:this.props.item.name,
              type:this.props.item.type,
              code:this.props.item.code,
              distance:this.state.distance,
              movieList:this.state.movieList,
              movieScreen:this.state.movieScreen,
              boolean:true
            });
            // Animated.timing(this.state.progress, {
            //   toValue: 0.3,
            //   duration: 400,
            //   easing: Easing.linear,
            // }).start();
          }else{
            this.props._select({
              type:this.props.item.type,
              code:this.props.item.code,
              boolean:false
            });
            // Animated.timing(this.state.progress, {
            //   toValue: 0.2,
            //   duration: 0,
            //   easing: Easing.linear,
            // }).start();
          }
        }}>
        <View style={styles.lottie_c}>
          <LottieView style={styles.check_lottie} source={require('../../assets/animation/check.json')}
            progress={this.state.progress} resizeMode="cover"
          />
        </View>
        <View style={styles.main_c}>
          <Text style={styles.name}>{this.props.item.name}
            <Text style={styles.distance}>{`  ${this.state.distance}`}</Text>
          </Text>
          {
            this.state.movieList.length>0?(
              <Text style={styles.movieList}>{this.state.movieList_str}</Text>
            ):(null)
          }   
          {
            JSON.stringify(this.state.movieScreen)!='{}'?(
              <Text style={styles.movieScreen}>{this.state.movieScreen_str}</Text>
            ):(null)
          }     
          </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    marginBottom:15
  },
  lottie_c:{
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:0
  },
  check_lottie:{
    width:50,
    height:50,
  },
  main_c:{
    width:width-50
  },
  name:{
    fontSize:17,
    marginLeft:2,
    marginRight:50,
    color:'#000',
    fontWeight:'600'
  },
  movieList:{
    fontSize:14,
    color:'#000',
    marginTop:3,
    paddingRight:30
  },
  movieScreen:{
    fontSize:15,
    color:'#511378',
    paddingRight:30,
    marginTop:3
  },
  distance:{
    color:'#333',
    fontSize:15
  }
})