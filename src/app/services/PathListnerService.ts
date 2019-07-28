import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({providedIn:'root'})
export class PathListnerService{

    private subject=new Subject<String>();

    sendEventMessage(item:String){
        this.subject.next(item)
    }

    clearMessages() {
        this.subject.next();
    }

    getMessage(): Observable<String> {
        return this.subject.asObservable();
    }
}
