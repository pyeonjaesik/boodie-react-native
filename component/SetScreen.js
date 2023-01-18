import React,{Component} from 'react';
import {StyleSheet, View,Dimensions} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {MyStatusBar} from './MyStatusBar';
import {URL} from '../config';
import Map from './Map';
import Calendar from './Calendar';
// import FindOption from './FindOption';
// import FindMovie from './FindMovie';
// import FindSpecial from './FindSpecial';
// import FindTheater from './FindTheater';

const {width}=Dimensions.get("window");
class SetScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      status:0,
      placename:'',
      location:[0,0],
      date:0,
      movieList:[],
      movieScreen:[],
      screen:[],
      selected:[],
      selectedSpecial:{},
      detailLoading:false,
    }
    this._setStatus=this._setStatus.bind(this);
    this._placename=this._placename.bind(this);
    this._location=this._location.bind(this);
    this._setCalendar=this._setCalendar.bind(this);
    this._select=this._select.bind(this);
    this._getOption=this._getOption.bind(this);
    this._setSpecial=this._setSpecial.bind(this);
    this._selectSpecial=this._selectSpecial.bind(this);
    this._noMatter=this._noMatter.bind(this);
    this._findSimple=this._findSimple.bind(this);
    this._initialize=this._initialize.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  _setStatus=(status)=>{
    this.setState({
      status
    })
  }
  _placename(placename){
    this.setState({
      placename
    })
  }
  async _location(location){
    await this.setState({
      location
    });
    this._findSimple();
  }
  async _setCalendar(date){
    await this.setState({
      date,
      // status:2,
      // detailLoading:false
    });
    this._findSimple()
    // this._getOption(date);
  }
  _findSimple(){
    this.props.navigation.navigate('Home')
    this.props.location_f({lat:this.state.location[0],long:this.state.location[1]});
    this.props.placename_f({placename:this.state.placename});
    this.props.findoption_f([]);
    // this.props.setdate(this.state.date);
    this.props.mainrefresh(parseInt(Date.now()));
    
  }
  _getOption(date){
    var now = parseInt(Date.now())+(date*86400000);
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
      theaterDay
    }
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getoption`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100){
        console.log(responseJson);
        this.setState({
          movieList:responseJson.movieList,
          movieScreen:responseJson.movieScreen,
          screen:responseJson.screen,
          detailLoading:true
        })
      }else{
        alert('상영정보를 가져오는 중 에러발생');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  _initialize(){
    this.setState({
      selected:[],
      selectedSpecial:{},
    })
  }
  async _select(name,boolean){
    var selected=this.state.selected;
    if(boolean===true){
      selected.unshift(name);
    }else{
      selected.splice(selected.indexOf(name),1);
    }
    await this.setState({
      selected
    });
    console.log(this.state.selected);
  }
  async _setSpecial(){
    var selectedSpecial_tmp={};
    await this.state.selected.map(x=>{
      selectedSpecial_tmp={
        ...selectedSpecial_tmp,
        [x]:[]
      }
    })
    await this.setState({
      selectedSpecial:selectedSpecial_tmp
    });
    console.log(this.state.selectedSpecial);
  }
  async _selectSpecial({movie,type,boolean}){
    var selectedSpecial=this.state.selectedSpecial;
    if(boolean===true){
      if(selectedSpecial[movie].indexOf(type)===-1){
        selectedSpecial[movie].push(type);
      }
    }else{
      if(selectedSpecial[movie].indexOf(type)!==-1){
        selectedSpecial[movie].splice(selectedSpecial[movie].indexOf(type),1);
      }
    }
    await this.setState({
      selectedSpecial
    })
  }
  async _noMatter({movie,boolean}){
    var selectedSpecial=this.state.selectedSpecial;
    if(boolean){
      selectedSpecial[movie]=this.state.movieScreen[movie].concat('모두 선택');
    }else{
      selectedSpecial[movie]=[];
    }
    await this.setState({
      selectedSpecial
    });
    console.log(this.state.selectedSpecial)
  }
  render(){
    return(
      <View style={styles.container}>
        <MyStatusBar backgroundColor='rgba(255,255,255,0)' barStyle='dark-content'/>
        {
          (()=>{
            switch(this.state.status){
              case 0:
                return(
                  <Map 
                    navigation={this.props.navigation} 
                    _setStatus={this._setStatus} 
                    _placename={this._placename}
                    _location={this._location}
                  />
                )
              case 1:
                return(
                  <Calendar 
                    navigation={this.props.navigation} 
                    _setStatus={this._setStatus}
                    _setCalendar={this._setCalendar}
                  />
                )  
              // case 2:
              //   return(
              //     <FindOption
              //       _setStatus={this._setStatus}
              //       _findSimple={this._findSimple}
              //       _initialize={this._initialize}
              //     />
              //   ) 
              // case 3:
              //   return(
              //     <FindMovie
              //       _setStatus={this._setStatus}
              //       date={this.state.date}
              //       movieList={this.state.movieList}
              //       selected={this.state.selected}
              //       _select={this._select}
              //       detailLoading={this.state.detailLoading}
              //       _setSpecial={this._setSpecial}
              //       movieScreen={this.state.movieScreen}
              //     />
              //   )
              // case 4:
              //   return(
              //     <FindSpecial
              //       _setStatus={this._setStatus}
              //       movieScreen={this.state.movieScreen}
              //       screen={this.state.screen}
              //       selected={this.state.selected}
              //       selectedSpecial={this.state.selectedSpecial}
              //       _selectSpecial={this._selectSpecial}
              //       _noMatter={this._noMatter}
              //     />
              //   ) 
              // case 5:
              //   return(
              //     <FindTheater
              //       _setStatus={this._setStatus}
              //       selectedSpecial={this.state.selectedSpecial}
              //       date={this.state.date}
              //       location={this.state.location}
              //       placename={this.state.placename}
              //       navigation={this.props.navigation}
              //       selected={this.state.selected}
              //       movieScreen={this.state.movieScreen}
              //     />
              //   )           
              default:
                return(null)
            }
          })()
        }
      </View>
    ) 
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
});
const mapStateToProps = (state) =>{
  return{
    lat:state.sidefunc.lat,
    long:state.sidefunc.long,
    date:state.sidefunc.date,
    placename:state.sidefunc.placename,
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

export default connect(mapStateToProps,mapDispatchToProps)(SetScreen);