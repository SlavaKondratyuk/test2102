import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { playerStatsPremap } from './hepler';
import { PlayerBE, StatsBE, Player, Stats, PlayerStats } from './types';

@Injectable({
  providedIn: 'root',
})
export class LittleCoreService {
  endpoint: string = 'https://www.balldontlie.io/api/v1/';
  players = new BehaviorSubject<Player[]>([]);

  constructor() {
    this.fillData();
  }

  //
  // API
  //
  async fillData() {
    this.players.next(await this.getPlayers());
  }

  async getPlayers() {
    const response = await fetch(`${this.endpoint}players?per_page=100`, {
      method: 'GET',
    });
    const players = await response.json();
    return players.data.map((player: PlayerBE) => this.playerMapper(player));
  }

  async getStats(ids: number[]) {
    const response = await fetch(
      `${this.endpoint}stats?postseason=true&per_page=100${this.clarifyPlayers(
        ids
      )}`,
      {
        method: 'GET',
      }
    );
    const playersStats = (await response.text()) as any;
    const players = await JSON.parse(playersStats);
    playerStatsPremap(playersStats);
    return players.data.map((playerStats: StatsBE) =>
      this.playerStatsMapper(playerStats)
    );
  }

  async getCompleteStats(ids: number[]) {
    const response = await fetch(
      `${this.endpoint}stats?postseason=true&per_page=100${this.clarifyPlayers(
        ids
      )}`,
      {
        method: 'GET',
      }
    );
    const playersStats = (await response.text()) as any;
    const players = await JSON.parse(playersStats);
    playerStatsPremap(playersStats);
    return players.data.map((playerStats: StatsBE) =>
      this.completePlayerStatsMapper(playerStats)
    );
  }

  //
  // methods
  //

  clarifyPlayers(ids: number[]) {
    return ids.reduce(
      (playersParams: string, id: number) => `${playersParams}&player_id=${id}`,
      ''
    );
  }

  //
  // Mappers
  //

  playerMapper(playerBE: PlayerBE): Player {
    return {
      id: playerBE.id,
      isActive: false,
      name: `${playerBE.first_name} ${playerBE.last_name}`,
      teamTag: playerBE.team?.abbreviation,
      teamName: playerBE.team?.name,
    };
  }

  playerStatsMapper(playerStatsBE: StatsBE): Stats {
    return {
      id: playerStatsBE.player.id,
      fg: playerStatsBE.ft_pct,
      min: playerStatsBE.min,
      pts: playerStatsBE.pts,
    };
  }

  completePlayerStatsMapper(playerStatsBE: StatsBE): PlayerStats {
    return {
      id: playerStatsBE.player.id,
      isActive: false,
      name: `${playerStatsBE.player.first_name} ${playerStatsBE.player.last_name}`,
      teamTag: playerStatsBE.team?.abbreviation,
      teamName: playerStatsBE.team?.name,
      fg: playerStatsBE.ft_pct,
      min: playerStatsBE.min,
      pts: playerStatsBE.pts,
    };
  }

  sortPlayersBy(players: PlayerStats[], sorter: string) {
    return players.sort((a: PlayerStats, b: PlayerStats) => {
      if (+a[sorter as keyof PlayerStats] < +b[sorter as keyof PlayerStats]) {
        return 1;
      }
      if (+a[sorter as keyof PlayerStats] > +b[sorter as keyof PlayerStats]) {
        return -1;
      }
      return 0;
    });
  }
}
