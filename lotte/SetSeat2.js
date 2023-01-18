export var SetSeat2 = async ({seatList_empty})=>{
  console.log('setSeat2')
  var seatResult2=[];
  var seatClose=parseInt(seatList_empty[0].SeatXLength)*1.6
  seatList_empty.map((emP)=>{
    var f_l=seatList_empty.findIndex(emS=>emS.SeatYCoordinate==emP.SeatYCoordinate&&emP.SeatXCoordinate-emS.SeatXCoordinate>=0&&emP.SeatXCoordinate-emS.SeatXCoordinate<=seatClose&&emS.SeatXCoordinate!==emP.SeatXCoordinate);
    var f_r=seatList_empty.findIndex(emS=>emS.SeatYCoordinate==emP.SeatYCoordinate&&emS.SeatXCoordinate-emP.SeatXCoordinate>=0&&emS.SeatXCoordinate-emP.SeatXCoordinate<=seatClose&&emS.SeatXCoordinate!==emP.SeatXCoordinate);
    console.log(f_l+'/'+f_r)
    if(f_l!=-1){
      let name=`${seatList_empty[f_l].SeatRow}${seatList_empty[f_l].ShowSeatColumn}${emP.SeatRow}${emP.ShowSeatColumn}`;
      if(seatResult2.findIndex(em=>em.name==name)==-1){
        seatResult2.push({
          score:emP.score+seatList_empty[f_l].score,
          seat:[`${seatList_empty[f_l].SeatRow}${seatList_empty[f_l].ShowSeatColumn}`,`${emP.SeatRow}${emP.ShowSeatColumn}`],
          name
        })
      }
    }
    if(f_r!=-1){
      let name=`${emP.SeatRow}${emP.ShowSeatColumn}${seatList_empty[f_r].SeatRow}${seatList_empty[f_r].ShowSeatColumn}`;
      if(seatResult2.findIndex(em=>em.name==name)==-1){
        seatResult2.push({
          score:emP.score+seatList_empty[f_r].score,
          seat:[`${emP.SeatRow}${emP.ShowSeatColumn}`,`${seatList_empty[f_r].SeatRow}${seatList_empty[f_r].ShowSeatColumn}`],
          name
        })
      }
    }
  });
  if(seatResult2.length==0){
    seatList_empty.map(emP=>{
      seatResult2.push({
        score:emP.score*2,
        seat:[`${emP.SeatRow}${emP.ShowSeatColumn}`,`${emP.SeatRow}${emP.ShowSeatColumn}`],
        name:`${emP.SeatRow}${emP.ShowSeatColumn}`
      })
    });  
  }
  seatResult2=await seatResult2.sort((a,b)=>{
    return a.score>b.score?-1:1
  });
  return {
    seatResult2
  }
}