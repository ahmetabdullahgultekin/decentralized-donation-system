import {Component} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
  RouterOutlet
} from '@angular/router';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {FooterComponent} from './shared/footer/footer.component';
import {LoadingSpinnerComponent} from './shared/loading-spinner/loading-spinner.component';
import {LoadingService} from './services/loading.service';
import {filter} from 'rxjs';
import {Web3Service} from './services/web3.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-angular';

  constructor(
    public router: Router,
    private loadingService: LoadingService,
    private web3Service: Web3Service
  ) {
    router.events.pipe(
      filter(e => e instanceof RouterEvent)
    ).subscribe((e: RouterEvent) => {
      this.checkRouterEvent(e);
    });
    this.web3Service.initializeService();
  }

  checkRouterEvent(e: RouterEvent) {
    // If the event is a NavigationStart event, show the spinner
    if (e instanceof NavigationStart) {
      window.scrollTo(0, 0);
      this.loadingService.show();
    }

    // If the page has finished loading, hide the spinner
    if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
      this.loadingService.hide();
    }
  }
}
