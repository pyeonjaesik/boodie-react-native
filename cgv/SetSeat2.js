export var SetSeat2 = async ({seatList_empty})=>{
  var seatResult2=[];
  var index=false;
  console.log('SetSeat2@@@@@ -1')
  await seatList_empty.map((emP)=>{
    var f_l=seatList_empty.findIndex(emS=>emS.left==emP.left-16&&emS.top==emP.top);
    var f_r=seatList_empty.findIndex(emS=>emS.left==emP.left+16&&emS.top==emP.top);
    if(f_l!=-1){
      let name=`${seatList_empty[f_l].alha}${seatList_empty[f_l].no}${emP.alha}${emP.no}`;
      if(seatResult2.findIndex(em=>em.name==name)==-1){
        seatResult2.push({
          score:emP.score+seatList_empty[f_l].score,
          seat:[`${seatList_empty[f_l].alha}${seatList_empty[f_l].no}`,`${emP.alha}${emP.no}`],
          name
        })
      }
      index=true;
    }
    if(f_r!=-1){
      let name=`${emP.alha}${emP.no}${seatList_empty[f_r].alha}${seatList_empty[f_r].no}`;
      if(seatResult2.findIndex(em=>em.name==name)==-1){
        seatResult2.push({
          score:emP.score+seatList_empty[f_r].score,
          seat:[`${emP.alha}${emP.no}`,`${seatList_empty[f_r].alha}${seatList_empty[f_r].no}`],
          name
        })
      }
      index=true;
    }
  });
  console.log('SetSeat2@@@@@ -2')
  if(seatResult2.length==0){
    seatList_empty.map(emP=>{
      seatResult2.push({
        score:emP.score*2,
        seat:[`${emP.alha}${emP.no}`,`${emP.alha}${emP.no}`],
        name:`${emP.alha}${emP.no}`
      })
    });
  }
  seatResult2=await seatResult2.sort((a,b)=>{
    return a.score>b.score?-1:1
  });
  console.log('SetSeat2@@@@@ -4')

  return {
    seatResult2
  }
}