import { Component, Input } from '@angular/core';
import { PlayerStats } from 'src/app/services/little-core/types';

@Component({
  selector: 'app-mvp-card',
  templateUrl: './mvp-card.component.html',
  styleUrls: ['./mvp-card.component.scss']
})
export class MvpCardComponent {
  @Input()
  bestPlayer: PlayerStats | undefined;

  closeMVP() {
    this.bestPlayer = undefined;
  }

}
