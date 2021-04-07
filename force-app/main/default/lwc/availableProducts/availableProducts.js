import { api, LightningElement, wire } from 'lwc';
import getAvailableProducts from '@salesforce/apex/OrderProductController.getAvailableProducts';
const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', sortable: true},
    { label: 'List Price', fieldName: 'ListPrice', type: 'currency', currencyIsoCode: 'USD', sortable: true}
];

export default class AvailableProducts extends LightningElement {

    @api recordId;

    error;
    columns = columns;

    @wire(getAvailableProducts, {recordId : '$recordId'}) availableProducts;

    //Sortable informations
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;

    sortBy(field, reverse, primer) {
        const key = primer
            ? function(x) {
                    return primer(x[field]);
                }
            : function(x) {
                    return x[field];
                };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
        console.log('entrou aqui');
        console.log(event.detail.fieldName);
        sortedBy = event.detail.fieldName;
        console.log('saiu aqui ');
        const cloneData = [...this.availableProducts.data];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.availableProducts.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}