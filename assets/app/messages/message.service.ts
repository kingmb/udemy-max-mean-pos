import { ErrorService } from '../errors/error.service';
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Message } from "./message.model";

@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http, private errorService: ErrorService) {
    }

    addMessage(message: Message): Observable<any> {
        const body = JSON.stringify(message);
        return this.http.post('http://localhost:3000/message' + this.getToken(), body, this.getHeaders())
            .map((response: Response) => {
                const result = response.json();
                const message = new Message(
                    result.obj.content,
                    result.obj.User.firstName,
                    result.obj.id,
                    result.obj.User.id);
                this.messages.push(message);
                return message;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    getMessages(): Observable<any> {
        return this.http.get('http://localhost:3000/message')
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(
                        message.content,
                        message.User.firstName,
                        message.id,
                        message.User.id)
                    );
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message): Observable<any> {
        const body = JSON.stringify(message);
        return this.http.patch('http://localhost:3000/message/' + message.messageId + this.getToken(), body, this.getHeaders())
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    deleteMessage(message: Message): Observable<any> {
        this.messages.splice(this.messages.indexOf(message), 1);
        return this.http.delete('http://localhost:3000/message/' + message.messageId + this.getToken())
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    private getToken(): string {
       const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return token; 
    }

    private getHeaders(){
        const headers = new Headers({'Content-Type': 'application/json'});
        return  {headers: headers};
    }
}