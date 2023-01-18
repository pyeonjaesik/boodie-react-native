import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,View,Linking,TouchableOpacity} from 'react-native';
import Ripple from 'react-native-material-ripple';

const {width}=Dimensions.get("window");
export default class RecoTheater2 extends Component{
  constructor(props){
    super(props);
    this.state={
    }
    console.log(this.props.seatResult2);
  }
  t_index=false;
  render(){
    return(
      <TouchableOpacity style={{...styles.container}} activeOpacity={1} onPress={() => {
          this.props.navigation.push('Booking1',{
            item:this.props.item.item,
            post:this.props.post
          });
        }}>
          <Image  style={styles.logo} source={require('../../assets/logoC.jpg')}/>
          <View style={styles.main}>
            <View style={styles.main_subject}>
              <Text style={styles.main_subject}>{`${this.props.item.item.start}`}</Text>
              {
                parseInt(this.props.item.seat2[0].score)>parseInt(this.props.score)?(
                  <View style={styles.star_c}>
                    <Text style={styles.star_txt} >{`+${((parseInt(this.props.item.seat2[0].score)-parseInt(this.props.score))/2000*100).toFixed(1)}%`}</Text>
                  </View>
                ):(null)
              }
            </View>
            <Text style={styles.main_subject_v}>{`${this.props.item.item.cinemaName} ${this.props.item.item.place}`}</Text>
          </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row',
    height:60
  },
  main:{
    width:width-100,
    marginLeft:0,
    justifyContent:'center'
  },
  main_subject:{
    fontSize:17,
    color:'rgb(20,20,20)',
    fontWeight:'600',
    alignItems:'center',
    flexDirection:'row'
  },
  main_subject_v:{
    fontSize:15,
    color:'rgb(40,40,40)',
    width:width-120,
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
  logo:{
    width:45,
    height:25.704,
    marginHorizontal:17.5,
    marginTop:15
  },
  star_c:{
    flexDirection:'row',
    alignItems:'center',
    height:20
  },
  star:{
    width:10,
    height:10,
    marginLeft:10
  },
  star_txt:{
    color:'#279b37',
    fontSize:13,
    marginLeft:5,
    fontWeight:'bold'
  }
})