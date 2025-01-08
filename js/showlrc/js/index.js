let content = "";
let lrc_div = document.getElementById("lrc")
let audio = document.getElementById("audio")
let lfc_arr=[];
let showline = false
let showheight=0
let middle =document.getElementById("lrc_div").clientHeight/2
let height=0
let maxshowheight = 9
let pyheight =0 



/*****格式化歌词****/
/**
 * 格式化lrc歌词
 * @param {*} $lrc 
 */
function formatlrc(lrc){
    let arr =  lrc.split("\r\n\r\n");  
    let lrc_arr =[]
    arr.forEach(function(line) {
        let item = formatlrc_line(line)
        lrc_arr.push(item)
    }); 
    return lrc_arr
}
/**
 *  格式化lrc歌词 每行
 * @param {*} $line 
 */
function formatlrc_line(line){
    line  = line.substr(1);
    let line_arr = line.split("]"); 
    let word = line_arr[1].trim();
    let time_str = line_arr[0].trim();
    let time = timetoint(time_str);
    let item ={
        'time':time,
        'word':word
    } 
    return item
}
/**
 * 时间字符串转int
 */ 
function timetoint(str){
    let str_arr = str.split(":"); 
    let hs =60 //换算
    let timt1 = str_arr[0]*hs
    let timt2 = str_arr[1]*1
    let time = timt1+timt2
    return time
}


/***获取歌词**/
async function getFile(url) {
  let promise = new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {resolve(req.response);}
      else {resolve("File not Found");}
    };
    req.send();
   });
   let result = await promise; 
   content = result; 
}

function readFile(url,callback) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url,true);
  xhr.onreadystatechange = function() { 
    if (xhr.readyState === 4 && xhr.status === 200) {
     content = xhr.responseText; 
      callback(content)
    }
  };
  xhr.send();
}

/***歌词展示**/
function showli(arr){
    arr.forEach(function(value){
        var newli = document.createElement('li');
        newli.textContent = value.word;
        lrc_div.appendChild(newli)
    })
}


/***初始化 **/
function init(){ 
    let fileUrl = './static/胆小鬼_梁静茹.lfc';
    readFile(fileUrl,function(content){ 
        let lfc_arr =  formatlrc(content);
        showli(lfc_arr)
    });
}

/***初始化 优化**/
async function init2(){
    await getFile('./static/胆小鬼_梁静茹.lfc')
    lfc_arr =  formatlrc(content);
    showli(lfc_arr)
    setliitemheight();
    maxshowheight = height*lrc_div.childNodes.length
    changetransform(0)
}
function setliitemheight(){
    let liitem = lrc_div.childNodes[1]
    height= liitem.offsetHeight
    var style = window.getComputedStyle(liitem);
    var marginBottom = parseInt(style.marginBottom);
    var marginTop = parseInt(style.marginTop);
    height = height + marginBottom+marginTop
}

function changetransform(key){
    console.log(middle,height*key)
    pyheight = middle-height*key-height/2
    lrc_div.style.transform = `translateY(${pyheight}px)`;
}


// init()
init2() 



// test()

 
// 用法示例

// let require(fileUrl);
// const content = readFile(fileUrl);
// console.log("content:",content)  


// let lrc_arr = formatlrc(lrc);
// console.log(lrc_arr);

/*高亮显示歌词*/
function  showlrcline(){
    //监听是否结束
    let key = getshowkey();
    changekey(key)
}

/*根据当前播放时间获取数据*/
function getshowkey(){
    let currenttime =  audio.currentTime;
    let key=false;
    let line="";
    for(var i=0;i<lfc_arr.length;i++){
       let value = lfc_arr[i];
       if(value.time>currenttime){
            key = i//边界处理
            line = lfc_arr[key];
            break; 
        }  
    }
    //边界处理 
    if(false===key){
        key = lfc_arr.length
        line = lfc_arr[lfc_arr.length];
    } 
    return key
}


function changekey(newkey){
    if(newkey!=showline){
        var showitem = document.querySelector(".active"); 
        showline = newkey
        //样式处理
        let classname="active"
        if(showitem){
            showitem.classList.remove(classname); 
        } 
        lrc_div.childNodes[showline].classList.add(classname);
        changetransform(newkey)
    }
}


audio.addEventListener("timeupdate",function(){
    showlrcline()
});