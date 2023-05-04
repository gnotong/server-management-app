import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: string, ...args: boolean[]): unknown {
    const [confirmed] = args;
    if (confirmed) {
      return this.reverseString(value);
    }
    
    return value;
  }

  reverseString(str: string): string {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
}

}
