public with sharing class OrderProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<AvailableProduct> getAvailableProducts(String recordId) {

        List<AvailableProduct> availableProducts = new List<AvailableProduct>();
        //Get available products for pricebook order
        Order ord = [Select id, Pricebook2Id From Order where Id=: recordId];

        System.debug('order Id' +ord);
        for(PricebookEntry prod : [Select id, Product2.Name, UnitPrice From PricebookEntry Where Pricebook2Id =: ord.Pricebook2Id Order By Product2.Name]){
            AvailableProduct avProduct = new AvailableProduct();
            avProduct.Name = prod.Product2.Name;
            avProduct.ListPrice = prod.UnitPrice;

            availableProducts.add(avProduct);

        }

        System.debug(availableProducts);
        return availableProducts;

    }

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderItem(String recordId) {

        List<OrderItem> items = [Select id, Product2.Name, Quantity, UnitPrice, TotalPrice From OrderItem Where OrderId =: recordId];

        System.debug('itens '+items);
        return items; 

    }

    //Wrapper for product
    class AvailableProduct{
        @AuraEnabled public String Name;
        @AuraEnabled public Decimal ListPrice;
    }
}
