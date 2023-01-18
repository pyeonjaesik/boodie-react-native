import { cos } from "react-native-reanimated";

export var cleanData = async ({inputData})=>{
    var movieList=[];
    var output={};
    var regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣+]*$/;
    await inputData.map(em=>{
        var str_result=''
        for(var i=0;i<em.name.length;i++){
            if( regex.test(em.name[i]) ) {
                str_result+=em.name[i];
            }
        }
        var movieIndex=movieList.indexOf(str_result);
        if(movieIndex==-1){
            movieList.push(str_result);
            output={...output,...{[str_result]:[em]}}
        }else{
            output[str_result].push(em);
        }
    });
    var keyList=[]
    await movieList.map(em=>{
        keyList.push({
            key:em,
            title:output[em][0].name,
            leng:output[em].length
        });
        output[em].sort((a,b)=>{
            return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
        })
        console.log('output[em]'),
        console.log(output[em]);
        let info;
        let index=false;
        for(var k=0;k<output[em].length;k++){
            if(output[em][k].type==='MEGA'||output[em][k].type==='LOTTE'){
                output[em].unshift({
                    type:'IMG',
                    detail:'MEGA',
                    movieCode:output[em][k].movie,
                    name:output[em][k].name
                });
                break;
            }
        }
    })
    keyList.sort(function(a, b) { // 내림차순
        return b.leng - a.leng;
    });
    var result={keyList:keyList,output:output};
    return result;
}