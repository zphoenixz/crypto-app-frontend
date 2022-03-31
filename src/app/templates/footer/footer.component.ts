import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CounterState } from 'src/app/state/counter.state';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private store: Store<{ counter: CounterState }>
  ) { }


  // counter!: number;
  counter$!: Observable<{ counter: number }>;
  // counterSubscription!: Subscription;

  ngOnInit(): void {
    // this.counterSubscription = this.store
    //   .select('counter')
    //   .subscribe(data => {
    //     this.counter = data.counter;
    //   });

      this.counter$ = this.store.select('counter');
  }

  // ngOnDestroy(): void {
  //   if (this.counterSubscription) {
  //     this.counterSubscription.unsubscribe();
  //   }
  // }

}
