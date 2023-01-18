export var SetSeat2 = async ({seatList_empty})=>{
  var seatResult2=[];
  seatList_empty.map((emP)=>{
    var f_l=seatList_empty.findIndex(emS=>emS.horzCoorVal==emP.horzCoorVal-1&&emS.vertCoorVal==emP.vertCoorVal);
    var f_r=seatList_empty.findIndex(emS=>emS.horzCoorVal==emP.horzCoorVal+1&&emS.vertCoorVal==emP.vertCoorVal);
    if(f_l!=-1){
      let name=`${seatList_empty[f_l].rowNm}${seatList_empty[f_l].seatNo}${emP.rowNm}${emP.seatNo}`;
      if(seatResult2.findIndex(em=>em.name==name)==-1){
        seatResult2.push({
          score:emP.score+seatList_empty[f_l].score,
          seat:[`${seatList_empty[f_l].rowNm}${seatList_empty[f_l].seatNo}`,`${emP.rowNm}${emP.seatNo}`],
          name
        })
      }
    }
    if(f_r!=-1){
      let name=`${emP.rowNm}${emP.seatNo}${seatList_empty[f_r].rowNm}${seatList_empty[f_r].seatNo}`;
      if(seatResult2.findIndex(em=>em.name==name)==-1){
        seatResult2.push({
          score:emP.score+seatList_empty[f_r].score,
          seat:[`${emP.rowNm}${emP.seatNo}`,`${seatList_empty[f_r].rowNm}${seatList_empty[f_r].seatNo}`],
          name
        })
      }
    }
  });
  seatList_empty.map(emP=>{
    seatResult2.push({
      score:emP.score*2,
      seat:[`${emP.rowNm}${emP.seatNo}`,`${emP.rowNm}${emP.seatNo}`],
      name:`${emP.rowNm}${emP.seatNo}`
    })
  });  
  seatResult2=await seatResult2.sort((a,b)=>{
    return a.score>b.score?-1:1
  });
  return {
    seatResult2
  }
}