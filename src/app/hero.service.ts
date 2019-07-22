import { Injectable } from '@angular/core';
import { Observable, of, ObservableLike } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HammerLoader } from '@angular/platform-browser';

/*const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'})
};*/

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroUrl = 'http://localhost:8081/topics';
  private heroUrlId = 'http://localhost:8081/topic/';

   constructor(private messageService: MessageService,
    private http: HttpClient) { }

  getHeroes() : Observable<Hero[]> {
    this.messageService.add('Hero Service : Fetched heroes');
    return this.http.get<Hero[]>(this.heroUrl)
    .pipe(
      tap(_ => this.log(`fetched heroes`)),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );//of(HEROES);
  }

  private handleError<T> (operation = 'operation', result?:T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  getHero(id: number) : Observable<Hero> {
    this.messageService.add(`Hero Service : Fetched heroes id=${id}`);
    const url = `${this.heroUrlId}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );//of(HEROES.find(hero => hero.id === id));
  }

  private log(message:string) {
    this.messageService.add(`HeroSerive: ${message}`);
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroUrlId+`/${hero.id}`, hero).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  add(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroUrl, hero).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  delete(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroUrlId}/${id}`;

    return this.http.delete<Hero>(url).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
}
