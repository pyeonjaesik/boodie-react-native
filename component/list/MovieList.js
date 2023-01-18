import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,View,Linking,TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import { Animated, Easing } from 'react-native';

const {width}=Dimensions.get("window");
export default class MovieList extends Component{
  constructor(props){
    super(props);
    this.state={
      progress:this.props.selected.indexOf(this.props.item.name)===-1?new Animated.Value(0.2):new Animated.Value(0.3),
    }
  }
  t_index=false;
  async componentWillReceiveProps(nextProps) {
    if(nextProps.selected.indexOf(this.props.item.name)===-1){
      Animated.timing(this.state.progress, {
        toValue: 0.2,
        duration: 0,
        easing: Easing.linear,
      }).start();
    }
  }
  render(){
    return(
      <TouchableOpacity style={{...styles.container}} activeOpacity={1} onPress={() => {
          if(this.props.selected.indexOf(this.props.item.name)===-1){
            this.props._select(this.props.item.name,true);
            Animated.timing(this.state.progress, {
              toValue: 0.3,
              duration: 400,
              easing: Easing.linear,
            }).start();
            this.props._clearQuery();
          }else{
            this.props._select(this.props.item.name,false);
            Animated.timing(this.state.progress, {
              toValue: 0.2,
              duration: 0,
              easing: Easing.linear,
            }).start();
          }
        }}>
        <View style={styles.lottie_c}>
          <LottieView style={styles.check_lottie} source={require('../../assets/animation/check.json')}
            progress={this.state.progress} resizeMode="cover"
          />
        </View>
        <Text style={styles.name}>{(()=>{
          var title=this.props.item.name;
          if(title.indexOf('더빙')!=-1){
            var title_sliced=title.split('더빙');
            title='(더빙) '+title_sliced[1];
          }
          return title;
        })()}</Text>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row',
    height:40,
    alignItems:'center'
  },
  name:{
    fontSize:16,
    marginLeft:2,
    marginRight:50,
    color:'#000'
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
  }
})