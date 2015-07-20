            var previewImage = function(file,position,head)
              {
               
                var div = document.getElementById(position);
                if (file.files && file.files[0])
                {

                    div.innerHTML ='<img class="img-full" id='+head+'>';
                    var img = document.getElementById(head);
                    img.onload = function(){
                    	
                    }
                    var reader = new FileReader();
                    reader.onload = function(evt){img.src = evt.target.result;}
                    reader.readAsDataURL(file.files[0]);
                }
                
              }
            
            