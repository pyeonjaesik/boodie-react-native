import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions} from 'react-native';
const {width}=Dimensions.get("window");
export default class DialogE extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <TouchableOpacity 
       style={styles.container}
       activeOpacity={1}
      >
        <TouchableOpacity style={styles.space} onPress={this.props._cancel}/>
        <View style={styles.main}>
          <Text style={styles.subject}>{this.props.subject}</Text>
          <Text style={styles.main_txt}>{'정말로 아래 계좌정보로 '+this.props.coin+' 다트 ('+(this.props.coin*60).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'원)를(을) 환전하시겠습니까?'}</Text>
          <View style={styles.bankinfo_c}>
            <View style={styles.bankinfo_l}>
              <View style={styles.info_l}>
                <Text style={styles.bankinfo_t}>은행명</Text>
              </View>
              <Text style={styles.bankinfo_b}>{this.props.bank}</Text>
            </View>
            <View style={styles.bankinfo_l}>
              <View style={styles.info_l}>
               <Text style={styles.bankinfo_t}>예금주</Text>
              </View>
              <Text style={styles.bankinfo_b}>{this.props.name}</Text>
            </View>
            <View style={styles.bankinfo_l}>
              <View style={styles.info_l}>
                <Text style={styles.bankinfo_t}>계좌번호</Text>
              </View>
              <Text style={styles.bankinfo_s}>{this.props.number}</Text>
            </View>
          </View>

          <Text style={styles.alert}>{"경우에 따라 환전이 일주일 이상 \n소요될 수 있습니다."}</Text>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.btn2} onPress={this.props._cancel}>
              <Text style={styles.btn2_txt}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn1} onPress={this.props._ok}>
              <Text style={styles.btn1_txt}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.space} onPress={this.props._cancel}/>
      </TouchableOpacity>
    )
  }

}
const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top:0,
    left:0,
    width:'100%',
    height:'100%',
    backgroundColor:'rgba(40,40,40,0.3)',
    justifyContent:'center',
    alignItems:'center'
  },
  main:{
    width:'85%',
    backgroundColor:'white',
    borderRadius:35,
    alignItems:'center',
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84, 
    // elevation: 5,
  },
  subject:{
    fontSize:25,
    color:'#000000',
    marginTop:10,
    fontWeight:'500'
  },
  bankinfo_c:{
    marginTop:20,
    width:width*0.85-70,
    height:120,
    borderWidth:2,
    borderColor:'#000000',
    borderRadius:20,
    overflow:'hidden'
  },
  bankinfo_l:{
    width:'100%',
    height:40,
    flexDirection:'row',
    borderBottomWidth:1,
    alignItems:'center'
  },
  bankinfo_t:{
    width:90,
    textAlign:'center',
    fontSize:16,
    color:'#000000',
    fontWeight:'600'
  },
  bankinfo_b:{
    fontSize:16,
    color:'#000000',
    paddingLeft:10
  },
  bankinfo_s:{
    fontSize:14,
    color:'#000000',
    paddingLeft:10
  },
  bankinfo:{
    width:'100%',
    fontSize:18,
    color:'#000000',
    textAlign:'center',
    marginTop:20,
    paddingHorizontal:30,
    lineHeight:22 
  },
  info_l:{
    height:40,
    width:90,
    borderRightWidth:1,
    borderColor:'#000',
    justifyContent:'center',
    alignItems:'center'
  },
  main_txt:{
    width:'100%',
    fontSize:17,
    color:'rgba(22,23,27,0.9)',
    textAlign:'center',
    marginTop:15,
    paddingHorizontal:30,
    lineHeight:22
  },
  alert:{
    width:'100%',
    fontSize:13,
    color:'rgba(22,23,27,0.9)',
    textAlign:'center',
    marginTop:10,
    paddingHorizontal:30,
    lineHeight:17
  },
  bottom:{
    flexDirection:'row',
    width:'100%',
    height:70,
    marginTop:15,
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  btn1:{
    width:100,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5
  },
  btn1_txt:{
    color:'#000000',
    fontSize:18
  },
  btn2:{
    width:100,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5
  },
  btn2_txt:{
    color:'rgb(60,60,60)',
    fontSize:18
  },
  space:{
    flex:1,
    width:'100%',
  }
});