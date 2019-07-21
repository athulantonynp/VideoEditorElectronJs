let videoConcat = require('./videoconcat');
const { dialog } = require('electron').remote

var itemsPath=[]
var outputPath=""


function onInit(){
    document.getElementById("items-list-container").style.display = "none";
    document.getElementById("spinner").style.display = "none";
    document.getElementById("btn-merge").style.display = "inline-flex";
    document.getElementById('btn-clear').style.display="inline-flex";
    document.getElementById('input-file-name').value=""
    itemsPath=[]
    updatePath(outputPath)
}

document.getElementById('btn-output').addEventListener('click',function(){
  dialog.showOpenDialog({
    properties: ['openDirectory']
  },function(path,result){
    updatePath(path)
  })
})

function updatePath(path){
  if(path!=null){
    outputPath=path;
    document.getElementById('outpath').innerHTML=path
  }
}

document.getElementById('btn-start').addEventListener('click',function(){
    dialog.showOpenDialog({ properties: ['openFile'] ,
    filters: [
      { name: 'Movies', extensions: ['mp4'] }
    ]},function(path,result){
      updateItems(path)
    })
})

function showToast(msg){
  var x = document.getElementById("snackbar");
  x.textContent=msg;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function updateItems(path){
  if(path!=null){
    itemsPath.push(path)
  }
  if(itemsPath.length>0){
    document.getElementById("items-list-container").style.display = "block";
    renderList()
  }else{
    onInit()
  }
}

function renderList(){
  var listRoot=document.getElementById('items-list');
  listRoot.innerHTML=""

  for(var i=0;i<itemsPath.length;i++){

    var newcontent = document.createElement('li');
    var fileName=itemsPath[i].toString().replace(/^.*(\\|\/|\:)/, '')

    newcontent.appendChild(document.createTextNode(fileName));
    newcontent.setAttribute('class','list-group-item')
    listRoot.appendChild(newcontent)
  }

}

document.getElementById('btn-add-more').addEventListener('click',function(){
    document.getElementById('btn-start').click()
})


document.getElementById('btn-merge').addEventListener('click',function(){

    if(itemsPath.length<=1){
      showToast('Atleast 2 files needed to concate.')
      return
    }
    if(outputPath===null || outputPath===""){
      showToast('Provide an output path')
      return
    }

    var outname=document.getElementById('input-file-name').value;
    if(outname===null || outname===""){
      outname="/file_out"+(new Date).getTime().toString()+".mp4"
    }else{
      outname="/"+outname+".mp4"
    }
    
    //showToast('Conversion started')
    document.getElementById("spinner").style.display = "inline-flex";
    document.getElementById("btn-merge").style.display = "none";
    document.getElementById('btn-clear').style.display="none";

  
    videoConcat({
        silent: true, 
        overwrite: false 
      }).clips(itemsPath)
      .output(outputPath+outname) 
  .concat()
  .then((outputFileName) => {
    showToast('File saved on '+outputFileName)
    document.getElementById("spinner").style.display = "none";
    document.getElementById("btn-merge").style.display = "inline-flex";
    document.getElementById('btn-clear').style.display="inline-flex";
  })
  .catch((err)=>{
    showToast('Error occured.Please try again')
    document.getElementById("spinner").style.display = "none";
    document.getElementById("btn-merge").style.display = "inline-flex";
    document.getElementById('btn-clear').style.display="inline-flex";
  })
})

document.getElementById('btn-clear').addEventListener('click',onInit)
onInit();