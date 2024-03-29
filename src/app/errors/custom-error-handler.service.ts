import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandler implements ErrorHandler {

  constructor() { }

  handleError(error: any): void {
    console.error(error);
    alert('An error occurred! please contact the administrator.');
  }
}
