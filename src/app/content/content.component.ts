import { Component, OnInit } from '@angular/core';
import { PathListnerService } from '../services/PathListnerService';
import { ElectronService } from 'ngx-electron';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as videoConcat from '../scripts/videoconcat'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

   paths:String[]=[]
   outputDir:String=""
   outputName:String=new Date().getTime().toString();

  constructor(private eventService:PathListnerService,
  private electron: ElectronService,private _snackBar: MatSnackBar){
    this.eventService.getMessage().subscribe(event =>{
      this.paths.push(event)
    })
  }

  showContent(){return this.paths.length>0;}

  ngOnInit() {
  }

  getFileNameFromPath(path:String):String{
    return path.replace(/^.*(\\|\/|\:)/, '')
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
    videoConcat({
           silent: true,
           overwrite: false
         }).clips(this.paths)
         .output(this.outputDir+fileOutName)
     .concat()
     .then((outputFileName) => {
       this.openSnackBar('File saved as '+outputFileName)
     })
     .catch((err)=>{
      this.openSnackBar(err)
      console.log(Error)
     })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message,null, {
      duration: 2000,
    });
  }
}
