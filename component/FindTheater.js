import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity,Dimensions,Text,Image,TextInput,Platform,FlatList,ActivityIndicator} from 'react-native';
import {MyStatusBar} from './MyStatusBar';
import {KeyboardAvoidingView} from 'react-native';
import {URL} from '../config';
import TheaterList from './list/TheaterList';
import SelectedTheater from './list/SelectedTheater';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import * as actions from '../actions';

const {width,height}=Dimensions.get("window");
class FindTheater extends Component{
  constructor(props){
    super(props);
    this.state={
      post:[],
      loading:true,
      movieList:[],
      movieScreen:[],
      selected:[]
    }
    this._select=this._select.bind(this);
    this._find=this._find.bind(this);
    this._findSpecial=this._findSpecial.bind(this);
  }
  async componentDidMount(){
    var movieScreen=[];
    var movieList=[];
    var selectedSpecial=this.props.selectedSpecial;
    for (var key in selectedSpecial) {
      console.log('1');
      if(selectedSpecial[key].length===0){
        movieList.push(key);
      }else if(selectedSpecial[key].length===1){
        if(selectedSpecial[key]=='모두 선택'){
          movieList.push(key);
        }else{
          movieScreen.push(key+'*'+selectedSpecial[key][0]);
        }
      }else{
        selectedSpecial[key].map(em=>{
          if(em!='모두 선택'){
            console.log('2');
            movieScreen.push(key+'*'+em);
          }   
        });
      }
    }
    await this.setState({
      post:[],
      loading:true,
      movieList,
      movieScreen
    })
    var now = parseInt(Date.now())+(this.props.date*86400000);
    var theaterDay_d = new Date(now);
    var theaterDay_dy=theaterDay_d.getFullYear();
    var theaterDay_dm=theaterDay_d.getMonth()+1;
    var theaterDay_dd=theaterDay_d.getDate();
    if(theaterDay_dm<10){
        theaterDay_dm='0'+theaterDay_dm;
    }
    if(theaterDay_dd<10){
        theaterDay_dd='0'+theaterDay_dd;
    }
    var theaterDay=`${theaterDay_dy}${theaterDay_dm}${theaterDay_dd}`;
    var data={
      movieList,
      movieScreen,
      // selectedSpecial:this.props.selectedSpecial,
      theaterDay,
      location:this.props.location
    }
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/findtheater`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100){
        console.log(responseJson.post);
        this.setState({
          loading:false,
          post:responseJson.post
        })
      }else{
        
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async _select({name,type,code,movieList,movieScreen,distance,boolean}){
    var selected=this.state.selected;
    var s_i=selected.findIndex(ex=>ex.type==type&&ex.code==code);
    if(boolean===true){
      if(selected.length>=5){
        Toast.show('너무 많아요!');
        return;
      }
      if(s_i===-1){
        selected.unshift({
          name,
          type,
          code,
          distance,
          movieList,
          movieScreen
        });
      }
    }else{
      if(s_i!==-1){
        selected.splice(s_i,1);
      }
    }
    await this.setState({
      selected
    });
    console.log(this.state.selected);
  }
  async _find({selected}){
    this.props.location_f({lat:this.props.location[0],long:this.props.location[1]});
    this.props.placename_f({placename:this.props.placename});
    this.props.setdate(this.props.date);
    await this.props.findoption_f(selected);
    this.props.mainrefresh(parseInt(Date.now()));
    this.props.navigation.navigate('Home');
  }
  async _findSpecial(){
    var findIndex=0;
    var regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣+]*$/;
    var selected= await this.props.selected.map(em=>{
      var str_result=''
      for(var i=0;i<em.length;i++){
          if( regex.test(em[i]) ) {
            str_result+=em[i];
          }
      }
      return str_result;
    });
    for(var i=0;i<selected.length;i++){
      if(this.props.movieScreen[selected[i]]!=undefined&&this.props.movieScreen[selected[i]]!='undefined'){
        findIndex++;
        break;
      }
    }
    return findIndex;
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
        <MyStatusBar backgroundColor='#fff' barStyle='dark-content'/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={async ()=>{
              var findIndex=await this._findSpecial();
              if(findIndex===0){
                this.props._setStatus(3);
              }else{
                this.props._setStatus(4);
              }
            }}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <Text style={styles.header_subject}>{'극장을 선택해주세요.'}</Text>
        </View>
        <View style={styles.selected}>
          <Text style={styles.selected_title}>극장</Text>
          <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1,height:50}}
            data={this.state.selected}
            keyExtractor={(item,index)=>`a${index}`}
            horizontal={true}
            renderItem={({item,index}) => {
              return (
                <SelectedTheater item={item} _select={this._select}/>
              )
            }}
          />
        </View>
        {
          this.props.detailLoading===false?(
            <View
              style={{
                flex:1,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'#fff'
              }}
            >
              <ActivityIndicator size={Platform.OS === 'ios'? 0 : 50} color="#000" />
            </View>
          ):(
            <View style={{flex:1}}>
              {
                this.state.loading===false?(
                  <FlatList maxToRenderPerBatch={30} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
                    data={this.state.post}
                    keyExtractor={(item,index)=>`a${index}`}
                    renderItem={({item,index}) => {
                      return (
                        <TheaterList 
                          item={item} 
                          movieList={this.state.movieList} 
                          movieScreen={this.state.movieScreen} 
                          location={this.props.location}
                          _select={this._select}
                          selected={this.state.selected}
                        />
                      )
                    }}
                  /> 
                ):(
                  <View
                    style={{
                      justifyContent:'center',
                      alignItems:'center',
                      backgroundColor:'#fff',
                      flex:1
                    }}
                  >
                    <ActivityIndicator size={Platform.OS === 'ios'? 0 : 50} color="#000" />
                  </View>
                )
              }
              {
                this.state.selected.length===0 ? (
                  <TouchableOpacity style={styles.nextbutton} 
                    onPress={async ()=>{
                      var selected=[];
                      var post=this.state.post.splice(0,5);
                      post.map(emP=>{
                        var movieList=[];
                        var movieScreen=[];
                        this.state.movieList.map(em=>{
                          if(emP.movieList.indexOf(em)!==-1){
                            movieList.push(em);
                          }
                        });
                        console.log(this.state.movieScreen);
                        console.log(emP.movieScreen);
                        this.state.movieScreen.map(em=>{
                          if(emP.movieScreen.indexOf(em)!==-1){
                            movieScreen.push(em);
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
                        selected.push({
                          name:emP.name,
                          type:emP.type,
                          code:emP.code,
                          movieList,
                          movieScreen:movieScreen_r
                        });
                      });
                      console.log(selected);
                      this._find({selected:selected});
                    }}
                  >
                    <Text style={styles.nextbutton_txt}>{'거리순 자동추천'}</Text>
                  </TouchableOpacity>
                ):(
                  <TouchableOpacity style={{...styles.nextbutton,backgroundColor:'#d20962'}} 
                    onPress={()=>{
                      this._find({selected:this.state.selected});
                    }}
                  >
                    <Text style={styles.nextbutton_txt}>{`검색 (${this.state.selected.length})`}</Text>
                  </TouchableOpacity>
                )
              }
            </View>
          )
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
  header:{
    width:'100%',
    height:55,
    flexDirection:'row',
    alignItems:'center',
    borderBottomWidth:0.5,
    borderColor:'rgba(100,100,100,0.2)'
  },
  header_subject:{
    fontSize:18,
    color:'#000',
    marginLeft:5,
    fontWeight:'600'
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
    width:width-60,
    paddingHorizontal:15,
    color:'#000',
    borderRadius:3,
    height:50
  },
  selected:{
    width:'100%',
    height:50,
    flexDirection:'row',
    borderBottomWidth:0.5,
    borderColor:'rgba(100,100,100,0.3)',
    alignItems:'center'
  },
  selected_title:{
    color:'#222',
    fontSize:17,
    marginLeft:20,
    marginRight:10
  },
  nextbutton:{
    position:'absolute',
    bottom:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#00334e',
    width:'80%',
    marginLeft:'10%',
    height:50,
    borderRadius:3,
  },
  nextbutton_txt:{
    color:'white',
    fontSize:18,
  },
});
const mapDispatchToProps = (dispatch) =>{
  return{
    location_f: ({lat,long})=>{
      dispatch(actions.location({lat,long}));
    },
    placename_f:({placename})=>{
      dispatch(actions.placename({placename}))
    },
    setdate:(date)=>{
      dispatch(actions.setdate(date))
    },
    mainrefresh:(date)=>{
      dispatch(actions.mainrefresh(date))
    },
    findoption_f:(findoption)=>{
      dispatch(actions.findoption(findoption))
    }
  }   
}

export default connect(null,mapDispatchToProps)(FindTheater);