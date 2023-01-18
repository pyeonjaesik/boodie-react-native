import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity,Dimensions,Text,Image,TextInput,Platform,SectionList} from 'react-native';
import {MyStatusBar} from './MyStatusBar';
import {KeyboardAvoidingView} from 'react-native';
import SpecialList from './list/SpecialList';

const {width,height}=Dimensions.get("window");
export default class FindSpecial extends Component{
  constructor(props){
    super(props);
    this.state={
      query:'',
      post:[],
    }
  }
  async componentDidMount(){
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
    var result_movieScreen=[];
    await selected.map(em=>{
      if(this.props.movieScreen[em]!=undefined&&this.props.movieScreen[em]!='undefined'){
        var movieScreen_tmp=this.props.movieScreen[em].map(x=>x);
        movieScreen_tmp.push('모두 선택');
        result_movieScreen.push({title:em,data:movieScreen_tmp});
      }
    });
    result_movieScreen=result_movieScreen.concat([
      {title:'',data:[]},
      {title:'',data:[]},
      {title:'',data:[]}
    ])
    this.setState({
      post:result_movieScreen
    })
    // console.log(result_movieScreen);
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
        <MyStatusBar backgroundColor='#fff' barStyle='dark-content'/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{
              this.props._setStatus(3);
            }}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <Text style={styles.header_subject}>{'특별한 경험 어때요?'}</Text>
        </View>
        <SectionList
          style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
          sections={this.state.post}
          keyExtractor={(item, index) => `a${index}`}
          renderItem={({ item ,section: { title }}) => <SpecialList 
            item={item} 
            title={title} 
            _selectSpecial={this.props._selectSpecial}
            selectedSpecial={this.props.selectedSpecial}
            _noMatter={this.props._noMatter}
            // typeList={(()=>{
            //   var poi=this.state.post.findIndex(em=>em.title==title);
            //   return this.state.post[poi].data;
            // })()}
          />}
          renderSectionHeader={({ section: { title } },aa) => (
            <View style={styles.section_c}>
              <Text style={styles.section}>{(()=>{
                var title_result=title;
                if(title_result.indexOf('더빙')!=-1){
                  var title_sliced=title_result.split('더빙');
                  title_result='(더빙) '+title_sliced[1];
                }
                return title_result;
              })()
              }</Text>
            </View>            
          )}
        />
        {
          (()=>{
            var selectedIndex=0;
            for (var key in this.props.selectedSpecial) {
              if(this.props.selectedSpecial[key].length>0){
                console.log('11');
                selectedIndex++;
                break;
              }
            }
            if(selectedIndex>0){
              return(
                <TouchableOpacity style={{...styles.nextbutton,backgroundColor:'#d20962'}} 
                  onPress={()=>{
                    this.props._setStatus(5);
                  }}
                >
                  <Text style={styles.nextbutton_txt}>{`다음`}</Text>
                </TouchableOpacity>
              )
            }else{
              return(
                <TouchableOpacity style={{...styles.nextbutton,backgroundColor:'#00334e'}} 
                  onPress={()=>{
                    this.props._setStatus(5);
                  }}
                >
                  <Text style={styles.nextbutton_txt}>{`괜찮아요.`}</Text>
                </TouchableOpacity>
              )
            }
          })()
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
    borderBottomWidth:0.5,
    borderColor:'rgba(100,100,100,0.2)',
    alignItems:'center'
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
  section_c:{
    width:'100%',
    justifyContent:'center',
    height:40,
    marginBottom:0,
    backgroundColor:'#fff',
  },
  section:{
    fontSize:19,
    color:'#000',
    fontWeight:'600',
    marginLeft:20,
    
  }
});