export var cleanSeat = async ({responseJson,user})=>{
    console.log(responseJson);
    var minX=parseInt(Math.min.apply(Math,responseJson.Seats.Items.map(function(o){return o.SeatXCoordinate;})));
    var minY=parseInt(Math.min.apply(Math,responseJson.Seats.Items.map(function(o){return o.SeatYCoordinate;})));
    var maxX=parseInt(Math.max.apply(Math,responseJson.Seats.Items.map(function(o){return o.SeatXCoordinate;})))+parseInt(responseJson.Seats.Items[0].SeatXLength)-minX;
    var maxY=parseInt(Math.max.apply(Math,responseJson.Seats.Items.map(function(o){return o.SeatYCoordinate;})))+parseInt(responseJson.Seats.Items[0].SeatYLength)-minY;
    var reverse_ratio=(parseInt(responseJson.Seats.Items[0].SeatXLength)/maxX)/(parseInt(responseJson.Seats.Items[0].SeatYLength)/maxY);
    var seatList_length=responseJson.Seats.Items.length;
    var seatList_temp=responseJson.Seats.Items.map((em,index)=>{
      var Cy=(parseInt(em.SeatYCoordinate-minY)+parseInt(em.SeatYLength)/2)/maxY;
      var Cx=(parseInt(em.SeatXCoordinate-minX)+parseInt(em.SeatXLength)/2)/maxX;
      var indexY;
      var indexX;
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
        if(responseJson.Seats.Items[index-1].SeatRow==responseJson.Seats.Items[index].SeatRow){
          if(responseJson.Seats.Items[index-1].SeatStatusCode!=0){
            if(responseJson.Seats.Items[index].SeatXCoordinate-responseJson.Seats.Items[index-1].SeatXCoordinate<parseInt(responseJson.Seats.Items[0].SeatXLength)*1.5){
             // console.log('왼쪽 누가앉음'+responseJson.seatList[index].seatGroup+''+responseJson.seatList[index].seatNo);
              if(score>0){
                score*=(1-userS); // 왼쪽에 누가 앉음.
              }else{
                score*=(1+userS); // 왼쪽에 누가 앉음.
              }
            }
          }
          if(responseJson.Seats.Items[index].SeatXCoordinate-responseJson.Seats.Items[index-1].SeatXCoordinate>parseInt(responseJson.Seats.Items[0].SeatXLength)*1.5){
         //   console.log('왼쪽 통로'+responseJson.seatList[index].seatGroup+''+responseJson.seatList[index].seatNo);
            if(score>0){
              score*=(1+userP); // 왼쪽에 통로있음.
            }else{
              score*=(1-userP); // 왼쪽에 통로있음.
            }
          }
        }
        if(responseJson.Seats.Items[index].SeatRow==responseJson.Seats.Items[index+1].SeatRow){
          if(responseJson.Seats.Items[index+1].SeatStatusCode!=0){
            if(responseJson.Seats.Items[index+1].SeatXCoordinate-responseJson.Seats.Items[index].SeatXCoordinate<parseInt(responseJson.Seats.Items[0].SeatXLength)*1.5){
           //   console.log('오른쪽 누가 앉음'+responseJson.seatList[index].seatGroup+''+responseJson.seatList[index].seatNo);
              if(score>0){
                score*=(1-userS); // 오른쪽에 누가 앉음.
              }else{
                score*=(1+userS); // 오른쪽에 누가 앉음.
              }
            }
          }
          if(responseJson.Seats.Items[index+1].SeatXCoordinate-responseJson.Seats.Items[index].SeatXCoordinate>parseInt(responseJson.Seats.Items[0].SeatXLength)*1.5){
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
        score,
        SeatYCoordinate:em.SeatYCoordinate-minY,
        SeatXCoordinate:em.SeatXCoordinate-minX,
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
      if(x.SeatStatusCode==0){
        seatList_empty.push(x);
      }
    });
    return {
        seatList_temp,
        seatList_empty,
        maxX,
        maxY,
        minX,
        minY,
        reverse_ratio
    }
}