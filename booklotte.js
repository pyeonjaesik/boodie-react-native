import {cleanSeat} from './lotte/cleanSeat';
import {SetSeat2} from './lotte/SetSeat2';

export var booklotte = async ({item,user_i,date})=>{
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
  var theaterDay=`${theaterDay_dy}-${theaterDay_dm}-${theaterDay_dd}`;
  var data={
  }
  const obj = {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST'
  }
  let formData = new FormData();
  var zzz={"MethodName":"GetSeats","channelType":"HO","osType":"Chrome","osVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36","cinemaId":item.cinemaId,"screenId":item.screenId,"playDate":theaterDay,"playSequence":item.playSequence,"screenDivisionCode":item.screenDivisionCode.toString()}
  var fff=JSON.stringify(zzz);
  formData.append('paramList',fff);
  
  const options = {
    method: 'POST',
    body: formData
  };
  await fetch(`http://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx`, options)
  .then((response) => response.json())
  .then(async (responseJson) => {
      var user={
        userY:user_i.y, // 0~1 높을 수록 뒷자리
        userX:user_i.x,  //0~1 높을 수록 오른쪽자리
        userP:user_i.p, //0~1 높을 수록 통로자리 선호
        userS:user_i.s,  //0~1 높을 수록 옆자리가 비어있는것을 선호
      }
      var {seatList_temp,seatList_empty,maxX,maxY,minX,minY}=await cleanSeat({responseJson,user});
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
