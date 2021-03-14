import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
    /**
     * Transform
     *
     * @param {any[]} items
     * @param {string} searchText
     * @returns {any[]}
     */
    transform(items: any[], searchText: string): any[] {
        let products = items[0];
        if (!items) {
            return [];
        }
        if (!searchText) {
            return null;
        }
        searchText = searchText.toLocaleLowerCase();

        return products.filter(it => {
            return it.name.toLocaleLowerCase().includes(searchText);
        });
    }
}