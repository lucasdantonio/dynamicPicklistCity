public class DynamicPicklistCityController {
    
    @AuraEnabled
    public static String getStatesByCity(){
        List<Cidade__c> cidades = [SELECT Id, UF__c, Name FROM Cidade__c ORDER BY UF__c DESC, Name ASC];
        Map<String, List<Cidade__c>> mapCidadePorEstado = new Map<String, List<Cidade__c>>();
        for(Cidade__c cidade : cidades){
            if(!mapCidadePorEstado.containsKey(cidade.UF__c)){
                mapCidadePorEstado.put(cidade.UF__c, new List<Cidade__c>());
            }

            mapCidadePorEstado.get(cidade.UF__c).add(cidade);
        }


        return System.JSON.serialize(mapCidadePorEstado);
    }

}