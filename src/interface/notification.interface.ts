import { Observable } from "rxjs";

export interface NotificationService {
    addMovie(data: { msg: string }): Observable<any>;
}