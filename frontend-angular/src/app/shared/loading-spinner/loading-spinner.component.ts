import {Component} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {LoadingService} from '../../services/loading.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  imports: [
    NgIf,
    CommonModule
  ],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  isLoading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.isLoading$;
  }
}
