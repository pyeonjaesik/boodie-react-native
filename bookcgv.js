import {cleanSeat} from './cgv/cleanSeat';
import {SetSeat2} from './cgv/SetSeat2';
import {URL} from './config';
import DomParser from 'dom-parser';

export var bookcgv = async ({item,user_i,date})=>{
  var output={};
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
  var starttime_txt=`${item.start.split(':')[0]}${item.start.split(':')[1]}`;
  const obj = {
    body: `{theatercode: '${item.theaterCd}',  palyymd : '${theaterDay}', screencode : '${item.screencode}' , playnum : '${item.playnum}', starttime : '${starttime_txt}', endtime : '${item.end}', theatername : '${item.cinemaName}', cnt : '${item.remain}', screenname : '${item.place}'}`,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    method: 'POST'
    }
    await fetch(`http://www.cgv.co.kr/common/showtimes/iframeTheater.aspx/GetSeatList`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      var regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣+|<>/"=|_| |:,]*$/;
      var dom_txt=''
      for(var i=0;i<responseJson.d.length;i++){
          if( regex.test(responseJson.d[i]) ) {
            dom_txt+=responseJson.d[i];
          }
      }
      var parser = new DomParser();
      var dom = parser.parseFromString(dom_txt);
      var seat_reserved=await dom.getElementsByClassName("mini_seat reserved");
      var alphabet=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
      "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
      var reserved=seat_reserved.map((em,index)=>{
        var style=em.getAttribute('style');
        var left=parseInt(style.split(':')[1].split('px')[0])*4;
        var top=parseInt(style.split(':')[2].split('px')[0])*4;
        return{
          left,
          top,
          alha:alphabet[top/16],
          no:left/16
        }
      });
      var seat_reserved_x=await dom.getElementsByClassName("mini_seat");
      var reserved_x=seat_reserved_x.map((em,index)=>{
        var style=em.getAttribute('style');
        var left=parseInt(style.split(':')[1].split('px')[0])*4;
        var top=parseInt(style.split(':')[2].split('px')[0])*4;
        // var r_f=reserved.findIndex(emS=>emS.left==left&&emS.top==top);
        return{
          left,
          top,
          alha:alphabet[top/16],
          no:left/16,
          seatStatus:reserved.findIndex(emS=>emS.left==left&&emS.top==top)==-1?"00":"11",
          color:'#222'
        }
      });
      var user={
        userY:user_i.y, // 0~1 높을 수록 뒷자리
        userX:user_i.x,  //0~1 높을 수록 오른쪽자리
        userP:user_i.p, //0~1 높을 수록 통로자리 선호
        userS:user_i.s,  //0~1 높을 수록 옆자리가 비어있는것을 선호
      }
      var {seatList_temp,seatList_empty,maxX,maxY,reverse_ratio}=await cleanSeat({responseJson:reserved_x,user});
      var {seatResult2}=await SetSeat2({seatList_empty});
      var seat1=[];
      var seat2=[];
      if(seatList_empty.length>0){
        seat1.push(seatList_empty[0]);
      }
      if(seatResult2.length>0){
        seat2.push(seatResult2[0]);
      }
      output={
        item,
        seat1,
        seat2
      }
    })
  .catch((error) => {
    console.error(error);
  });
  return output;   
}