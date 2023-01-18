import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity,Dimensions,Text,Image,TextInput,Platform,FlatList,ActivityIndicator} from 'react-native';
import {MyStatusBar} from './MyStatusBar';
import {KeyboardAvoidingView} from 'react-native';
import MovieList from './list/MovieList';
import SelectedMovie from './list/SelectedMovie';
import Toast from 'react-native-simple-toast';

const {width,height}=Dimensions.get("window");
export default class FindMovie extends Component{
  constructor(props){
    super(props);
    this.state={
      query:'',
      btn_status:false,
      post:[],
    }
    this._findMovie=this._findMovie.bind(this);
    this._findSpecial=this._findSpecial.bind(this);
    this._clearQuery=this._clearQuery.bind(this);
  }
  _clearQuery(){
    this.refs.searchBox.setNativeProps({text: ''})
  }
  async _findMovie(query){
    var regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣+]*$/;
    var str_result=''
    for(var i=0;i<query.length;i++){
      if( regex.test(query[i]) ) {
          str_result+=query[i];
      }
    }
    var searchList=[];
    this.props.movieList.map(em=>{
      for(var i=0;i<query.length;i++){
        if(em.indexOf(query[i])!=-1){
          searchList.push(em);
          // if(em.indexOf('더빙')!=-1){
          //   var em_sliced=em.split('더빙');
          //   searchList.push('(더빙) '+em_sliced[1])
          // }else{
          //   searchList.push(em);
          // }
        }
      }
    });
    var searchObj=[];
    searchList.map(em=>{
      var movieIndex=searchObj.findIndex(x=>x.name==em);
      if(movieIndex==-1){
        searchObj.push({name:em,leng:1});
      }else{
        var search_temp=searchObj[movieIndex];
        searchObj.splice(movieIndex,1,{name:em,leng:search_temp.leng+1});
      }
    });
    searchObj.sort(function(a, b) { // 내림차순
      return b.leng - a.leng;
    });
    await this.setState({
      post:[]
    }); //post가 많은상태에서 적은상태로 가면 movieList의 constructor가 작동하지 않는 문제 때문에 post를 매번 비우고 시작한다
        // 그러면 항상 더 많은 상태로 가는 경우이기에 constructor가 항상 작동한다.
    this.setState({
      post:searchObj
    });
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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled
      >
        <MyStatusBar backgroundColor='#fff' barStyle='dark-content'/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{
              this.props._setStatus(2);
            }}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <TextInput
            style={styles.txtinput}
            placeholder="영화 이름을 입력해주세요"
            autoFocus={true}
            clearButtonMode='always'
            ref='searchBox'
            onChangeText={query => {
              this._findMovie(query);
            }}
          />
        </View>
        <View style={styles.selected}>
          <Text style={styles.selected_title}>영화</Text>
          <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1,height:50}}
            keyboardShouldPersistTaps="always"
            data={this.props.selected}
            keyExtractor={(item,index)=>`a${index}`}
            horizontal={true}
            renderItem={({item,index}) => {
              return (
                <SelectedMovie item={item} _select={this.props._select}/>
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
              <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
                keyboardShouldPersistTaps="always"
                data={this.state.post}
                keyExtractor={(item,index)=>`a${index}`}
                renderItem={({item,index}) => {
                  return (
                    <MovieList item={item} selected={this.props.selected} _select={this.props._select}
                      _clearQuery={this._clearQuery} post={this.state.post}
                    />
                  )
                }}
              />
              {
                this.props.selected.length===0 ? (
                  <TouchableOpacity style={styles.nextbutton} 
                    onPress={async ()=>{
                      // await this.props._setSpecial();
                      // this.props._setStatus(4);
                      Toast.show('영화를 선택해주세요!');
                    }}
                  >
                    <Text style={styles.nextbutton_txt}>{'다음'}</Text>
                  </TouchableOpacity>
                ):(
                  <TouchableOpacity style={{...styles.nextbutton,backgroundColor:'#d20962'}} 
                    onPress={async ()=>{
                      var findIndex=await this._findSpecial();
                      if(findIndex===0){
                        await this.props._setSpecial();
                        this.props._setStatus(5);
                      }else{
                        await this.props._setSpecial();
                        this.props._setStatus(4);
                      }

                    }}
                  >
                    <Text style={styles.nextbutton_txt}>{`다음 (${this.props.selected.length})`}</Text>
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
    backgroundColor:'#888',
    width:'80%',
    marginLeft:'10%',
    height:50,
    borderRadius:3,
  },
  nextbutton_txt:{
    color:'#fff',
    fontSize:18,
  },
});