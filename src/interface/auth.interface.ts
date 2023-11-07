import { Observable } from "rxjs";

export interface AuthService {
    guard(data: { token: string }): Observable<any>;
}