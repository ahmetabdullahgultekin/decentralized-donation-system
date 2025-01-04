import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false); // Default state is not loading
  public isLoading$ = this.loadingSubject.asObservable(); // Observable to subscribe to

  show() {
    const minDisplayTime = 300; // 300ms minimum display time
    const now = Date.now();
    const lastShown = this.loadingSubject.value ? now : 0;

    if (now - lastShown > minDisplayTime) {
      this.loadingSubject.next(true);
    }
  }

  hide() {
    setTimeout(() => {
      this.loadingSubject.next(false);
    }, 300); // Enforce minimum visibility
  }

}
