import {cleanSeat} from './mega/cleanSeat';
import {SetSeat2} from './mega/SetSeat2';

export var bookmega = async ({item,user_i,date})=>{
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
    await fetch(`https://www.megabox.co.kr/on/oh/ohz/PcntSeatChoi/selectSeatList.do?playSchdlNo=${item.screenCode}`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      var user={
        userY:user_i.y, // 0~1 높을 수록 뒷자리
        userX:user_i.x,  //0~1 높을 수록 오른쪽자리
        userP:user_i.p, //0~1 높을 수록 통로자리 선호
        userS:user_i.s,  //0~1 높을 수록 옆자리가 비어있는것을 선호
      }
      var {seatList_temp,seatList_empty,maxX,maxY}=await cleanSeat({responseJson:responseJson.seatListSD01,user});
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
    //   this.setState({
    //     maxX,
    //     maxY,
    //     seatList:seatList_temp,
    //     seatTypes:responseJson.seatTypes,
    //     seatResult1:seatList_empty,
    //     seatResult2,
    //     title:`${item.name} - ${item.cinemaName}`
    //   });
    })
    .catch((error) => {
      console.error(error);
    });
    console.log(output);
    return output;
}
