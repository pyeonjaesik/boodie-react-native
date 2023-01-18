import React,{Component} from 'react';
import {View,StyleSheet,FlatList,Dimensions} from 'react-native';
import {URL} from '../config';
import { connect } from 'react-redux';
import * as actions from '../actions';
import List0 from './list/List0';
import List1 from './list/List1';
import List2 from './list/List2';
import List3 from './list/List3';


const {width,height}=Dimensions.get("window");

class HomeSlide extends Component{
  constructor(props){
    super(props);
    this.state={
      post:this.props.post,
      refreshing: false,
      loading:true,
    }
  }
  _renderComponent(item){
    switch(item.type){
      case 'IMG':
        return(
          <List0 item={item} navigation={this.props.navigation}/>
        )
      case 'CGV':
        return (
          <List1 item={item} date={this.props.date} navigation={this.props.navigation} post={this.props.post}/>
        ) 
      case 'MEGA':
        return (
          <List2 item={item} date={this.props.date} navigation={this.props.navigation} post={this.props.post}/>
        )
      case 'LOTTE':
        return (
          <List3 item={item} date={this.props.date} navigation={this.props.navigation} post={this.props.post}/>
        )
      default:
        break;     
    }
  }
  render(){
    return(
      <View style={styles.container}>
        <FlatList maxToRenderPerBatch={20} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
          data={this.state.post}
          keyExtractor={(item,index)=>`a${index}`}
          renderItem={({item,index}) => {
            return this._renderComponent(item,index)
          }}
        />
      </View>
    )
  }
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  }
});
const mapStateToProps = (state) =>{
  return{
    date:state.sidefunc.date,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{

  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(HomeSlide);