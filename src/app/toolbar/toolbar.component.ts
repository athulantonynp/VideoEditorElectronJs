import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { PathListnerService } from '../services/PathListnerService';



@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {



  constructor(private _electronService: ElectronService,private eventService:PathListnerService) { }

  ngOnInit() {
  }

  onMergeClick(){
    this._electronService.remote.dialog.showOpenDialog({ properties: ['openFile'] ,
    filters: [  { name: 'Movies', extensions: ['mp4'] }]},(result,error)=>{
      if(result!==null){
          this.updatePathItems(result.toString())
      }
    });
  }

  updatePathItems(path:String){
    this.eventService.sendEventMessage(path)
  }

}
