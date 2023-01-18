import * as types from './type';

export function location({lat,long}){
    return{
        type: types.LOCATION,
        lat,
        long
    };
}
export function placename({placename}){
    return{
        type: types.PLACENAME,
        placename
    };
}
export function setdate(date){
    return{
        type: types.DATE,
        date
    };
}
export function mainrefresh(mainrefresh){
    return{
        type: types.MAINREFRESH,
        mainrefresh
    };
}
export function findoption(findoption){
    return{
        type: types.FINDOPTION,
        findoption
    };
}
export function setbook_xy(x,y){
    return{
        type: types.SETBOOK_XY,
        setbook_x:x,
        setbook_y:y
    };
}
export function setbook_p(p){
    return{
        type: types.SETBOOK_P,
        setbook_p:p,
    };
}
export function setbook_s(s){
    return{
        type: types.SETBOOK_S,
        setbook_s:s,
    };
}
//1. redux가 잘 안될땐 type을 제대로 기입했는지 확인할 것