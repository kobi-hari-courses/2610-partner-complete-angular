import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AdditionService } from './services/addition.service';
import { WrongAdditionService } from './services/wrong-addition.service';
import { ADDER, Adder } from './services/adder';
import { PREFIX } from './tokens/prefix.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: WrongAdditionService,
      useClass: WrongAdditionService,
    },
    {
      provide: AdditionService,
      useExisting: WrongAdditionService,
    },
    {
      provide: PREFIX,
      useValue: () => `${new Date().toISOString()} DEBUG:`,
    },
  ],
};
