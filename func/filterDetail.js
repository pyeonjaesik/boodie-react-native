export var filterDetail= ({result_temp,findoption})=>{
    var schedule_r=[];
    if(result_temp.length==0){
        return schedule_r;
    }
    // var f_i = findoption.findIndex(em=>em.name==result_temp[0].cinemaName);
    // findoption=findoption[f_i];
    var regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣+]*$/;
    var schedule=result_temp;
    var schedule2=result_temp.map(em=>{
      var str_result='';
      for(var i=0;i<em.name.length;i++){
          if( regex.test(em.name[i]) ) {
              str_result+=em.name[i];
          }
      }
      return {
        ...em,
        name:str_result
      }
    });
    findoption.movieList.map(emP=>{
      schedule2.map((emS,index)=>{
        if(emP==emS.name){
          schedule_r.push(schedule[index]);
        }
      });
    });
    console.log(schedule_r);
    var f_movieScreen=findoption.movieScreen
    for( var key in f_movieScreen){
      f_movieScreen[key ].map(emP=>{
        schedule2.map((emS,index)=>{
          if(key==emS.name&&emP==emS.screen){
            schedule_r.push(schedule[index]);
          }
        });
      })
    }
    console.log(schedule);
    console.log(schedule2);
    return schedule_r;
}
