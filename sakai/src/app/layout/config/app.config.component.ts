import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuService } from '../app.menu.service';

@Component({
  selector: 'app-config',
  templateUrl: './app.config.component.html',
})
export class AppConfigComponent implements OnInit {
  @Input() minimal: boolean = false;

  scales: number[] = [12, 13, 14, 15, 16];

  constructor(
    public layoutService: LayoutService,
    public menuService: MenuService
  ) {}

  ngOnInit() {
    this.loadThemeFromLocalStorage();
  }

  loadThemeFromLocalStorage() {
    const storedTheme = localStorage.getItem('theme');
    const storedColorScheme = localStorage.getItem('colorScheme');

    if (storedTheme && storedColorScheme) {
      this.theme = storedTheme;
      this.colorScheme = storedColorScheme;
    }
  }

  get visible(): boolean {
    return this.layoutService.state.configSidebarVisible;
  }
  set visible(_val: boolean) {
    this.layoutService.state.configSidebarVisible = _val;
  }

  get scale(): number {
    return this.layoutService.config().scale;
  }
  set scale(_val: number) {
    this.layoutService.config.update((config) => ({
      ...config,
      scale: _val,
    }));
  }

/*   get menuMode(): string {
    return this.layoutService.config().menuMode;
  }
  set menuMode(_val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      menuMode: _val,
    }));
  }
 */
  get inputStyle(): string {
    return this.layoutService.config().inputStyle;
  }
  set inputStyle(_val: string) {
    this.layoutService.config().inputStyle = _val;
  }

  get ripple(): boolean {
    return this.layoutService.config().ripple;
  }
  set ripple(_val: boolean) {
    this.layoutService.config.update((config) => ({
      ...config,
      ripple: _val,
    }));
  }

  set theme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      theme: val,
    }));

    localStorage.setItem('theme', val);



  }

  get theme(): string {
    return this.layoutService.config().theme;
  }

  set colorScheme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      colorScheme: val,
    }));

    localStorage.setItem('colorScheme', val);

  }

  get colorScheme(): string {
    return this.layoutService.config().colorScheme;
  }


  changeTheme(theme: string, colorScheme: string) {
    this.theme = theme;
    this.colorScheme = colorScheme;
    window.location.reload();

  }

  decrementScale() {
    this.scale--;
  }

  incrementScale() {
    this.scale++;
  }
}
