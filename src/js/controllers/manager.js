app.controller('ManagerCtrl', ['$scope', '$http', function($scope, $http) {
        $('#datatables').dataTable( {
                "ajax": {
                    "url": "http://localhost:8888/New_JXQ/school/getOrders.do?schoolID=10"
                    "dataSrc": function(json){
                        return json;
                    } 
                },
                "columns": [
                    { "data": "name" },
                    { "data": "phone" },
                    { "data": "order_time" },
                    { "data": "local" },
                    { "data": "checked" }
                ],
                 "createdRow": function( row, data, dataIndex ) {
                     
                    if ( data.checked == '是' ) {
                      $(row).addClass( 'success' );
                    } else{
                        $(row).addClass( 'warning' );
                    }
                  },
                 "order": [[ 2, "desc" ]]
            } );
}]);
