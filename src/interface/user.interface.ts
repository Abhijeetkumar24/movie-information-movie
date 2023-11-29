import { Observable } from "rxjs";

export interface UserService {
    getSubscriber(data: { request: boolean}): Observable<any>;
    getNameEmail(data: { id: string}): Observable<any>;
}