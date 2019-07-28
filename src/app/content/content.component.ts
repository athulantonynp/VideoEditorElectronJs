import { Component, OnInit } from '@angular/core';
import { PathListnerService } from '../services/PathListnerService';
import { ElectronService } from 'ngx-electron';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as videoConcat from '../scripts/videoconcat'
import * as mediaInfo from '../scripts/mediainfo'
import {VideoItem} from '../models/VideoItem'
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

   paths:VideoItem[]=[]
   outputDir:String=""
   outputName:String=new Date().getTime().toString();
   isOnProgress:boolean=false;

  constructor(private eventService:PathListnerService,
  private electron: ElectronService,private _snackBar: MatSnackBar,
public zone: NgZone){}

  showContent(){return this.paths.length>0;}

  ngOnInit() {
  }

  getFileNameFromPath(path:String):String{
    return path.replace(/^.*(\\|\/|\:)/, '')
  }

  onAddMoreClicked(){
    this.electron.remote.dialog.showOpenDialog({ properties: ['openFile'] ,
    filters: [  { name: 'Movies', extensions: ['mp4'] }]},(result,error)=>{
      if(result!==null){
        mediaInfo(result.toString())
        .then(result=>{
          try{
            var item=JSON.parse(result)

            var videoItem:VideoItem={
              path:item.format.filename.toString(),
              fileSize:this.formatBytes(parseInt(item.format.size)),
              name:this.getFileNameFromPath(item.format.filename.toString()),
              meta:item,
              resolution:item.streams[0].width.toString()+"X"+item.streams[0].height.toString(),
              videoFrameRate:item.streams[0].avg_frame_rate.toString(),
              audioFormat:item.streams[1].codec_name.toString(),
              duration: Math.floor(parseFloat(item.format.duration) / 60).toString()+" Minutes"
            }
            console.log(JSON.stringify(videoItem.fileSize))
            this.zone.run(() => this.paths.push(videoItem))
          }catch(e){
            console.log(e)
          }



        }).catch(err=>{

        })
      }
    });
  }

  onOutputLocationSelectClick(){
    this.electron.remote.dialog.showOpenDialog({ properties: ['openDirectory']},(result,error)=>{
      if(result!==null){
          this.outputDir=result.toString();
      }
    });
  }

  onClearClicked(){
    this.paths=[]
    this.outputDir=""
    this.outputName=new Date().getTime().toString();
    this.isOnProgress=false;
  }

  onStartMergeClicked(){
    if(this.paths.length<=1){
        this.openSnackBar('Need atleast two items to merge')
        return
    }
    if(this.outputDir===""){
        this.openSnackBar('Please provide an output directory')
        return
    }

    if(this.outputName===""){
      this.openSnackBar('Please provide an output file name')
      return
    }

    let fileOutName="/"+this.outputName+".mp4"
    this.isOnProgress=true;
    let pathsArray:String[]=[]

    this.paths.forEach((item)=>{
      pathsArray.push(item.path)
    })
    videoConcat({
           silent: true,
           overwrite: false
         }).clips(pathsArray)
         .output(this.outputDir+fileOutName)
     .concat()
     .then((outputFileName) => {
       this.isOnProgress=false;
       this.openSnackBar('File saved as '+outputFileName)
     })
     .catch((err)=>{
       this.isOnProgress=false;
      this.openSnackBar("Error Occured.Please try again.")
     })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message,null, {
      duration: 2000,
    });
  }

   formatBytes(bytes) {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
  };
}
