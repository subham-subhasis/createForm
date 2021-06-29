import { Component, OnInit } from '@angular/core';
import { HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const THEME_DARKNESS_SUFFIX = `-dark`;
export enum Theme {
  Custom = 'custom-theme',
  Light = 'light-theme',
  Dark = 'dark-theme'
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SelfOnboardingPM';
  @HostBinding('class') activeThemeCssClass: string;
  isThemeDark = false;
  activeTheme: string;
  mainView = true;
  themes: string[] = [
    'deeppurple-amber',
    'indigo-pink',
    'pink-bluegrey',
    'purple-green',
  ];
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver,
              private overlayContainer: OverlayContainer) {
  }

  ngOnInit() {
  }

  setActiveTheme(theme: string, darkness: boolean = null) {
    if (darkness === null) {
      darkness = this.isThemeDark;
    } else if (this.isThemeDark === darkness) {
      if (this.activeTheme === theme) { return; }
    } else {
      this.isThemeDark = darkness;
    }
    this.activeTheme = theme;
    const cssClass = darkness === true ? theme + THEME_DARKNESS_SUFFIX : theme;
    const classList = this.overlayContainer.getContainerElement().classList;
    if (classList.contains(this.activeThemeCssClass)) {
      classList.replace(this.activeThemeCssClass, cssClass);
    } else {
      classList.add(cssClass);
    }
    this.activeThemeCssClass = cssClass;
  }

  toggleDarkness() {
    this.setActiveTheme(this.activeTheme, !this.isThemeDark);
  }
}
