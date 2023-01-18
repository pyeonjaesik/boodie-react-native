import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,View,TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import { Animated, Easing } from 'react-native';

const {width}=Dimensions.get("window");
export default class SpecialList extends Component{
  constructor(props){
    super(props);
    this.state={
      progress:new Animated.Value(0.2),
    }
  }
  t_index=false;
  async componentWillReceiveProps(nextProps) {
    if(nextProps.selectedSpecial[this.props.title].indexOf(this.props.item)===-1){
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
          if(this.props.item=='모두 선택'){
            if(this.state.progress._value==0.3){
              this.props._noMatter({movie:this.props.title,boolean:false});
            }else{
              this.props._noMatter({movie:this.props.title,boolean:true});
            }
            return;
          }    
          if(this.props.selectedSpecial[this.props.title].indexOf(this.props.item)===-1){
            this.props._selectSpecial({
              movie:this.props.title,
              type:this.props.item,
              boolean:true
            })     
            // Animated.timing(this.state.progress, {
            //   toValue: 0.3,
            //   duration: 400,
            //   easing: Easing.linear,
            // }).start();
          }else{
            this.props._selectSpecial({
              movie:this.props.title,
              type:this.props.item,
              boolean:false
            })     
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
        <Text style={styles.name}>{this.props.item}</Text>
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
    marginLeft:1,
    marginRight:50,
    color:'#000'
  },
  lottie_c:{
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:10
  },
  check_lottie:{
    width:50,
    height:50,
  }
})