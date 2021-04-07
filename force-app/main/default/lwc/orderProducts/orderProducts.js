import { api, LightningElement, track, wire} from 'lwc';
import getOrderItem from '@salesforce/apex/OrderProductController.getOrderItem';

const columns = [
    { label: 'Name', fieldName: 'ProductName', type: 'text', sortable: true},
    { label: 'Unit Price', fieldName: 'UnitPrice', type: 'currency', currencyIsoCode: 'USD', sortable: true},
    { label: 'Quantity', fieldName: 'Quantity', type: 'number', sortable: true},
    { label: 'Total Price', fieldName: 'TotalPrice', type: 'currency', currencyIsoCode: 'USD', sortable: true}
];

export default class OrderProducts extends LightningElement {

    @api recordId;

    error;
    columns = columns;

    @track orderItems;

    @wire(getOrderItem, {recordId : '$recordId'}) 
    orderItems({ error, data }){
        if(data){
            this.orderItems = data.map(record => Object.assign(
                {"ProductName": record.Product2.Name}, record
            ));
        } else if(error){
            this.error = error;
        }
    }


    //Sort block
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
        sortedBy = event.detail.fieldName;
        const cloneData = [...this.orderItems];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.orderItems = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}