import { Component, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonLabel,
  IonSpinner,
  IonList,
  IonItem,
  IonNote,
} from '@ionic/angular/standalone';
import { text } from 'ionicons/icons';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, filter, of, switchMap, tap } from 'rxjs';
import { GsApiService } from '../services/gs-api/gs-api.service';
import { WordCardModel } from '../tab1/tab1.models';
import { LocalStorageService } from '../services/local-storage-service/local-storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    ReactiveFormsModule,
    IonLabel,
    IonSpinner,
    IonList,
    IonItem,
    IonNote,
  ],
})
export class Tab3Page {
  private readonly formBuilder = inject(FormBuilder);
  private readonly gsApiService = inject(GsApiService);
  private readonly localStorageService = inject(LocalStorageService);
  protected searchControl = this.formBuilder.control<string>('');
  protected words = signal<WordCardModel[]>([]);
  protected isLoading: boolean = false;

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(300),
        filter((value) => !!value),
        switchMap((value) => {
          return !!value ? this.gsApiService.fetchMatchingWords(value) : of([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (value) => {
          this.isLoading = false;
          this.words.set(value);
          this.localStorageService.addSearchPageSearch(!value.length);
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
      });
  }

  protected readonly text = text;
}
