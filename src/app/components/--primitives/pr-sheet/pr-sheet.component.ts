import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LittleCoreService } from 'src/app/services/little-core/little-core.service';
import { Player, PlayerStats } from 'src/app/services/little-core/types';

@Component({
  selector: 'app-pr-sheet',
  templateUrl: './pr-sheet.component.html',
  styleUrls: ['./pr-sheet.component.scss'],
})
export class PrSheetComponent implements OnChanges, OnInit {
  @Input() players: Player[] = [];
  @Output() bestPlayer: EventEmitter<PlayerStats> = new EventEmitter<PlayerStats>();
  
  completePlayersStats: PlayerStats[] = [];

  constructor(private littleCoreService: LittleCoreService) {}

  ngOnInit(): void {
    this.bestPlayer.emit(this.completePlayersStats[0]);
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.players?.currentValue?.length) {
      this.completePlayersStats = await this.littleCoreService.getCompleteStats(
        this.players.map((player: Player) => player.id)
      );
      console.log(this.completePlayersStats, 'this.playersStats', this.players);
    }
  }

  sortPlayers(sorter: string) {
    if(!this.completePlayersStats.length) {
      return;
    }
    this.completePlayersStats = this.littleCoreService.sortPlayersBy(
      this.completePlayersStats,
      sorter
    );
    
    this.emitPlayer(this.completePlayersStats[0]);
  }

  emitPlayer(player: PlayerStats) {
    this.bestPlayer.emit(player);
  }
}
