export var cleanSeat = async ({responseJson,reserved,user})=>{
    let seatList= responseJson;
    console.log(seatList);
    var maxX=parseInt(Math.max.apply(Math,seatList.map(function(o){return o.left;})))+16;
    var maxY=parseInt(Math.max.apply(Math,seatList.map(function(o){return o.top;})))+16;
    var seatList_length=seatList.length;
    var reverse_ratio=maxY/maxX;
    var seatList_temp=seatList.map((em,index)=>{
      var Cy=(parseInt(em.top)+8)/maxY;
      var Cx=(parseInt(em.left)+8)/maxX;
      var indexY;
      var indexX;
    //   var userY=0.6; // 0~1 높을수록 뒷자리
    //   var userX=0.5; //0~1 높을수록 오른쪽자리
    //   var userP=0.1; //0~1 높을 수록 통로자리 선호
      var {userY,userX,userP,userS}=user;
      console.log(userY+'/'+userX+'/'+userP);
      if(Cy>userY){
        indexY=1-Math.abs(userY-Cy);
      }else{
        indexY=1-(Math.abs(userY-Cy)*(1.6));
      }
      indexX=maxX-(Math.abs(userX-Cx)*maxX);
      var score=parseInt(indexX*indexY);
      if(index<seatList_length-1&&index>0){
        if(seatList[index-1].alha==seatList[index].alha){
          if(seatList[index-1].seatStatus!='00'){
            if(seatList[index].left-seatList[index-1].left<24){
             // console.log('왼쪽 누가앉음'+responseJson.seatList[index].seatGroup+''+responseJson.seatList[index].seatNo);
              if(score>0){
                score*=(1-userS); // 왼쪽에 누가 앉음.
              }else{
                score*=(1+userS); // 왼쪽에 누가 앉음.
              }
            }
          }
          if(seatList[index].left-seatList[index-1].left>24){
         //   console.log('왼쪽 통로'+responseJson.seatList[index].seatGroup+''+responseJson.seatList[index].seatNo);
            if(score>0){
              score*=(1+userP); // 왼쪽에 통로있음.
            }else{
              score*=(1-userP); // 왼쪽에 통로있음.
            }
          }
        }
        if(seatList[index].alha==seatList[index+1].alha){
          if(seatList[index+1].seatStatus!='00'){
            if(seatList[index+1].left-seatList[index].left<24){
           //   console.log('오른쪽 누가 앉음'+responseJson.seatList[index].seatGroup+''+responseJson.seatList[index].seatNo);
              if(score>0){
                score*=(1-userS); // 오른쪽에 누가 앉음.
              }else{
                score*=(1+userS); // 오른쪽에 누가 앉음.
              }
            }
          }
          if(seatList[index+1].left-seatList[index].left>24){
           // console.log('오른쪽 통로'+responseJson.seatList[index].seatGroup+''+responseJson.seatList[index].seatNo)
            if(score>0){
              score*=(1+userP); // 왼쪽에 통로있음.
            }else{
              score*=(1-userP); // 왼쪽에 통로있음.
            }
          }
        }
      }
      return {
        ...em,
        score
      }
    });
    seatList_temp=await seatList_temp.sort((a,b)=>{
      return a.score>b.score?-1:1
    });
    let maxScore=seatList_temp[0].score;
    seatList_temp=await seatList_temp.map((em,grade)=>{
      return {
        ...em,
        grade,
        score:parseInt(em.score/maxScore*1000)
      }
    });
    var seatList_empty=[];
    seatList_temp.map(x=>{ 
      if(x.seatStatus=='00'){
        seatList_empty.push({
            ...x,
            left:parseInt(x.left),
            top:parseInt(x.top)
        });
      }
    });
    return {
        seatList_temp,
        seatList_empty,
        maxX,
        maxY,
        reverse_ratio
    }
}