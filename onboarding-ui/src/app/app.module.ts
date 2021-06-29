
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { createCustomElement } from '@angular/elements';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProgressLoaderComponent } from './common/loader-component/progress-loader';

import { DynamicFormModule } from 'dynamic-form';
import { MaterialModule } from '../material-module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonService } from './common/services/common.service';
import { DataService } from './common/services/data.service.ts';
import { Configuration, ConfigurationParameters, ApiModule } from 'onboarding-api';

import { ApiConfigService } from 'src/app/config.service';
import { TokenInterceptor } from './common/interceptor/interceptor.service';
import { AlertbarComponent } from './common//alertbar/alertbar.component';
import { AlertbarService } from './common//alertbar/service/alertbar.service';
import { ConfirmDialogElementComponent } from './common/confirm-dialog/confirm-Dialog.component';

import { ConfigurationComponent, DialogComponent } from './web-components/configuration/configuration.component';
import { OrderByPipe } from './web-components/configuration/pipe/configure.pipe';
import { RegistrationComponent } from './web-components/registration/registration.component';
import { ElementInterarctionService } from './web-components/element-interaction-service/element-interarction-service';
import { SetPasswordComponent } from './web-components/set-password/set-password.component';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: ApiConfigService.urls.onBoarding.configureApiUrl
  };
  return new Configuration(params);
}

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    ProgressLoaderComponent,
    ConfigurationComponent,
    RegistrationComponent,
    ConfirmDialogElementComponent,
    DialogComponent,
    SetPasswordComponent,
    OrderByPipe,
    AlertbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    UiSwitchModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonModule,
    DynamicFormModule,
    ApiModule.forRoot(apiConfigFactory),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ApiConfigService) => () => config.loadBootstrapConfiguration(),
      deps: [ApiConfigService],
      multi: true
    },
    TokenInterceptor,
    CommonService,
    ElementInterarctionService,
    AlertbarService,
    DataService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  //bootstrap: [AppComponent],
  entryComponents: [ ConfigurationComponent, DialogComponent, AlertbarComponent ]
})

export class AppModule {
  constructor( private injector: Injector, private apiConfigService: ApiConfigService ) {
    //apiConfigService.loadURLConfigurations();
    console.log('########################## element loaded ############################');
    apiConfigService.setLanguage();
  }
  ngDoBootstrap() {
    if (!customElements.get('element-configuration')) {
      const configuration: any = createCustomElement(ConfigurationComponent, { injector: this.injector });
      customElements.define('element-configuration', configuration);
    }

    if (!customElements.get('element-registration')) {
      const registration: any = createCustomElement(RegistrationComponent, { injector: this.injector });
      customElements.define('element-registration', registration);
    }

    if (!customElements.get('element-setpassword')) {
      const setPassword: any = createCustomElement(SetPasswordComponent, { injector: this.injector });
      customElements.define('element-setpassword', setPassword);
    }
  }
}

