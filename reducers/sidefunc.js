import * as types from '../actions/type';

const initialState ={
  lat:0,
  long:0,
  date:0,
  placename:'',
  mainrefresh:0,
  findoption:[],
  setbook_x:0.5,
  setbook_y:0.66,
  setbook_p:0.2,
  setbook_s:0.6
};

export default function sidefunc(state=initialState,action){
    switch(action.type){
        case types.LOCATION:
          return{
            ...state,
            lat:action.lat,
            long:action.long
          }   
        case types.PLACENAME:
          return{
            ...state,
            placename:action.placename
          }
        case types.DATE:
          return{
            ...state,
            date:action.date
          }
        case types.MAINREFRESH:
          return{
            ...state,
            mainrefresh:action.mainrefresh
          } 
        case types.FINDOPTION:
          return{
            ...state,
            findoption:action.findoption
          } 
        case types.SETBOOK_XY:
          return{
            ...state,
            setbook_x:action.setbook_x,
            setbook_y:action.setbook_y
          }  
        case types.SETBOOK_P:
          return{
            ...state,
            setbook_p:action.setbook_p,
          } 
        case types.SETBOOK_S:
          return{
            ...state,
            setbook_s:action.setbook_s,
          }                       
        default:
          return state;        
    }
}