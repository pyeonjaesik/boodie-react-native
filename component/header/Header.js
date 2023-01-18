import React from 'react';
import { StyleSheet, View, Dimensions, Platform ,TouchableOpacity,Text,Image} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
const {width,height}=Dimensions.get("window");

class Header extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    var d = new Date(parseInt(Date.now())+this.props.date*86400000);
    if(this.props.date===0){
      var resultDay=`${d.getDate()}일 (오늘)`;
      var resultColor='#11862f';
    }else{
      var day=['일','월','화','수','목','금','토'];
      var dayColor=['#be0027','#111','#111','#111','#111','#111','#0091cd'];
      var resultDay=`${d.getDate()}일 (${day[d.getDay()]})`;
      var resultColor=dayColor[d.getDay()];
    }
    return(
      <View style={styles.container}>
        <View style={styles.controllbar}>
          <TouchableOpacity style={styles.img_btn} onPress={()=>{
            this.props.navigation.navigate('SetBook');
          }}>
            <Text style={{fontSize:14}}>{'선호\n좌석'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.set_btn}
            onPress={()=>{
              this.props.navigation.navigate('Set')
            }}
          >
            {
              this.props.placename==''?(
                <Text style={{...styles.location_txt,color:'red'}}>{'   주소 설정     '}</Text>
              ):(           
                <Text style={styles.location_txt}>{this.props.placename}</Text>
              )
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.set_btn}
            onPress={()=>{
              this.props.navigation.navigate('Set2')
            }}
          >
              <Text style={[styles.location_txt,{color:resultColor}]}>{` ${resultDay}`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    width:width,
    height:60,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'space-around',
    flexDirection:'row'
  },
  controllbar:{
    height:50,
    width:'92%',
    flexDirection:'row',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.62,
    
    elevation: 2,
    backgroundColor:'#fff',
    borderWidth:0.5,
    borderColor:Platform.OS === 'ios' ? 'rgba(100,100,100,0.2)': '#fff',
    borderRadius:6
  },
  img_btn:{
    justifyContent:'center',
    alignItems:'center',
    height:50,
    width:50,
  },
  img:{
    width:30,
    height:30,
  },
  set_btn:{
    height:50,
    justifyContent:'center',
  },
  location_txt:{
    fontSize:14,
    color:'#222',
    fontWeight:'600'
  },
  calendar:{
    height:40,
    flexDirection:'row',
    alignItems:'center'
  },
  calendar_img:{
    width:24,
    height:24,
  },
  calendar_txt:{
    fontSize:14,
    color:'#000',
    fontWeight:'600',
    marginLeft:10
  },
  date:{
    color:'#00205b'
  }
});
const mapStateToProps = (state) =>{
  return{
    lat:state.sidefunc.lat,
    long:state.sidefunc.long,
    placename:state.sidefunc.placename,
    date:state.sidefunc.date,
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
export default connect(mapStateToProps,mapDispatchToProps)(Header);