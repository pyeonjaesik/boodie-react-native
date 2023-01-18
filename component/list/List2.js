import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,View,Linking,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width}=Dimensions.get("window");
export default class List2 extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  t_index=false;
  render(){
    return(
      <TouchableOpacity style={{...styles.container}} activeOpacity={1} onPress={async () => {
          if(this.t_index==false){
            this.t_index=true;
            // Linking.openURL(`http://m.megabox.co.kr/?menuId=booking&cinemaCode1=${this.props.item.code}&mBookingType=2`);
            var setbook_index = await AsyncStorage.getItem('setbook')||'';
            if(setbook_index!='true'){
              this.props.navigation.navigate('SetBook',{
                from:'Booking2',
                item:this.props.item,
                post:this.props.post
              });
            }else{
              this.props.navigation.navigate('Booking2',{
                item:this.props.item,
                post:this.props.post
              });
            }
          }
          setTimeout(()=>{this.t_index=false
            console.log('t_index ==> false');
          },1000);
        }}>
          <Image  style={styles.logo} source={require('../../assets/logoM.jpg')}/>
          <View style={styles.main}>
          {
              (()=>{
                switch(this.props.item.time){
                  case '조조':
                    return(
                      <Text style={styles.main_subject}>{this.props.item.start}
                        <Text style={{color:'#222'}}> [조조]</Text>
                      </Text>
                    )
                  case '심야':
                      return(
                        <Text style={styles.main_subject}>{this.props.item.start}
                          <Text style={{color:'#222'}}> [심야]</Text>
                        </Text>
                      )  
                  default:
                    return(
                      <Text style={styles.main_subject}>{this.props.item.start}</Text>
                    );  
                }
              })()
            }
            <Text style={styles.main_subject_v}>{`${this.props.item.cinemaName} ${this.props.item.place}`}<Text
              style={{color:'#777',fontSize:13}}
            > {this.props.item.distance>1000?`${(this.props.item.distance/1000).toFixed(1)}km`:`${parseInt(this.props.item.distance)}m`}</Text></Text>
            </View>
          <View style={styles.seat}>
            <Text style={styles.remain}>{this.props.item.remain}<Text style={styles.size}>{`/${this.props.item.size}`}</Text></Text>
          </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row'
  },
  main:{
    width:width-160,
    marginLeft:0,
  },
  main_subject:{
    fontSize:17,
    color:'rgb(20,20,20)',
    width:'100%',
    marginTop:9,
    fontWeight:'500'
  },
  main_subject_v:{
    fontSize:15,
    color:'rgb(40,40,40)',
    width:width-200,
    marginTop:3,
    marginBottom:7
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
    width:40,
    height:40,
    marginTop:11,
    marginHorizontal:20
  }
})