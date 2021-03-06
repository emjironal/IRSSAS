
var nuevos=[];
var actualizados=[];
var borrados=[];
var delcont = 0;

function addComponent(){
	var table = document.getElementById("componenttable");
	if(table.rows.length!=0)
	var lastRow = parseInt(table.rows[ table.rows.length - 1 ].cells[0].innerHTML) + 1;
	else
	var lastRow = 1;

	var row = table.insertRow();

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);

	nuevos.push(lastRow);

	cell1.innerHTML = lastRow ;
	cell2.innerHTML = '<input type="text" class="form-control hideinput" name="name-'+lastRow+'" value="COMPONENTE NUEVO">';
	cell3.innerHTML = '<input type="number" class="form-control hideinput" name="value-'+lastRow+'" value="0">';
	cell4.innerHTML = '<i class="glyphicon glyphicon-trash" onclick="deleteComponent(this,'+lastRow+');"></i>';
	document.getElementById("savebutton").style.visibility = "visible";
};

function deleteComponent(element, id){
	element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
	if(!nuevos.includes(id)){
		borrados.push(id);
		if(actualizados.includes(id)){
			actualizados.splice(actualizados.indexOf(id),1);	
		}
	}
	else
		nuevos.splice(nuevos.indexOf(id),1);
	document.getElementById("savebutton").style.visibility = "visible";
}

function updateComponent(id){
	if(!actualizados.includes(id))
		actualizados.push(id);
	document.getElementById("savebutton").style.visibility = "visible";
}

function contador(){
	var cont = 0;
	var table = document.getElementById("componenttable");
	for (var i = table.rows.length - 1; i >= 0; i--) {
		cont+= parseInt(table.rows[i].cells[2].childNodes[0].value);
	}
	if(cont==100)
		return true;
	else
		return false;
}

function subcontador(){
	var vals=[];
	var conts=[];
	var table = document.getElementById("componenttable");
	for (var i = 0; i < table.rows.length; i++) {
		if(vals.includes(table.rows[i].cells[2].childNodes[0].selectedOptions[0].label)){
			conts[vals.indexOf(table.rows[i].cells[2].childNodes[0].selectedOptions[0].label)]+= parseInt(table.rows[i].cells[3].childNodes[0].value);
		}else{
			vals.push(table.rows[i].cells[2].childNodes[0].selectedOptions[0].label);
			conts.push(parseInt(table.rows[i].cells[3].childNodes[0].value));
		}
	}
	for (var i = 0; i < conts.length; i++) {
		if(conts[i]!=100){
			return false;
		}
	}
	return true;
}

function saveComponent(){
	if(contador()){
	news=[];
	updates=[];
	var table = document.getElementById("componenttable");
	var valor = 0;
	for (var i = table.rows.length - 1; i >= 0; i--) {
		valor = parseInt(table.rows[i].cells[0].innerHTML);
		if(nuevos.includes(valor)){
			var x = table.rows[i].cells[1].childNodes[0].value.replace(/"/gi,"");
            x= x.replace(/'/gi,"");
			news.push({"id": valor, "nombre": x , "valor": parseInt(table.rows[i].cells[2].childNodes[0].value)});
		}
		else if(actualizados.includes(valor)){
			var x = table.rows[i].cells[1].childNodes[0].value.replace(/"/gi,"");
            x= x.replace(/'/gi,"");
			updates.push({"id": valor, "nombre": x , "valor": parseInt(table.rows[i].cells[2].childNodes[0].value)});
		}
	}
	
	var parameters = { "nuevos": news, "actualizados": updates, "borrados": borrados};
	$.get('/saveComponente',parameters,function(data) {
      jsonsites = data;
     }).done(function(res){     	
		});
     return true;
 	}
 	else{
 		document.getElementById("error").innerHTML="Error, la suma de porcentajes debe dar 100";
 		return false;
 	}
}

function addSubComponent(){
	var table = document.getElementById("componenttable");
	if(table.rows.length!=0)
	var lastRow = parseInt(table.rows[ table.rows.length - 1 ].cells[0].innerHTML) + 1;
	else
	var lastRow = 1;

	var row = table.insertRow();

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);

	nuevos.push(lastRow);

	cell1.innerHTML = lastRow ;
	cell2.innerHTML = '<input type="text" class="form-control hideinput" name="name-'+lastRow+'" value="SUBCOMPONENTE NUEVO">';
	cell3.innerHTML = document.getElementById("selectlist").innerHTML;
	cell4.innerHTML = '<input type="number" class="form-control hideinput" name="value-'+lastRow+'" value="0">';
	cell5.innerHTML = '<input type="text" class="form-control hideinput" name="siglas-'+lastRow+'" value="SUB">';
	cell6.innerHTML = '<i class="glyphicon glyphicon-trash" onclick="deleteComponent(this,'+lastRow+');"></i>';
	document.getElementById("savebutton").style.visibility = "visible";
};

function saveSubComponent(){
	if(subcontador()){
	news=[];
	updates=[];
	var table = document.getElementById("componenttable");
	var valor = 0;
	for (var i = table.rows.length - 1; i >= 0; i--) {
		valor = parseInt(table.rows[i].cells[0].innerHTML);
		if(nuevos.includes(valor)){
			var x = table.rows[i].cells[1].childNodes[0].value.replace(/"/gi,"");
            x= x.replace(/'/gi,"");
			news.push({"id": valor, "nombre": x , "componente": table.rows[i].cells[2].childNodes[0].value , "valor": parseInt(table.rows[i].cells[3].childNodes[0].value), "siglas": table.rows[i].cells[4].childNodes[0].value });
		}
		else if(actualizados.includes(valor)){
			var x = table.rows[i].cells[1].childNodes[0].value.replace(/"/gi,"");
            x= x.replace(/'/gi,"");
			updates.push({"id": valor, "nombre": x , "componente": table.rows[i].cells[2].childNodes[0].value, "valor": parseInt(table.rows[i].cells[3].childNodes[0].value), "siglas": table.rows[i].cells[4].childNodes[0].value });
		}
	}
	
	var parameters = { "nuevos": news, "actualizados": updates, "borrados": borrados};
	$.get('/savesubcomponente',parameters,function(data) {
     }).done(function(res){     	
		});
     return true;
 	}
 	else{
 		document.getElementById("error").innerHTML="Error, la suma de porcentajes debe dar 100";
 		return false;
 	}
}

function deleteIndicador(){
	
	var parameters = { "borrados": borrados};
	$.get('/deleteindicador',parameters,function(data) {
     }).done(function(res){     	
		});
     return true;
}

function updateIndicador(id){
	updates=[];
	textareas=["Nombre","Descripcion","Observaciones"];
	var table = document.getElementById("componenttable");
	var valor = 0;
	
	for (var i = 0; i < actualizados.length;  i++) {
			updates.push(document.getElementById(actualizados[i]).value);
	}
	
	var parameters = { "indicador": id,  "actualizacion": actualizados, "valores": updates};
	$.get('/updateindicador',parameters,function(data) {
     }).done(function(res){     	
		});
     return true;

}

function cambiarMedida(id){
	if(id=="1" || id=="2"){
		document.getElementById("Nominal").style.display = "none";
		document.getElementById("Lineal").style.display = "none";
	}else{
		document.getElementById("Nominal").style.display = "none";
		document.getElementById("Lineal").style.display = "block";
	}
	if(id=="5")
		document.getElementById("Nominal").style.display = "block";

}

function agregarNominal(){
	$("#irss").html("Canadá");
	var table = document.getElementById("tableNominalBody");
	var row = table.insertRow();

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);

	var cont = parseInt(document.getElementById("contador").value)+1;

	cell1.innerHTML = '<select id="Nominal-1-'+cont+'" name="Nominal-1-'+cont+'"><option value=">">></option><option value="<"><</option><option value="=">=</option></select>';
	cell2.innerHTML = '<input id="Nominal-2-'+cont+'" name="Nominal-2-'+cont+'" type="Number" min="0" max="100" step="1" class="form-control"  placeholder="Entero entre 0 y 100" value="">';
	cell3.innerHTML = '<input id="Nominal-3-'+cont+'" name="Nominal-3-'+cont+'" type="Number" min="0" max="1" step="any" class="form-control"  placeholder="Decimal entre 0 y 1" value="">';

	document.getElementById("contador").value = parseInt(document.getElementById("contador").value)+1;
	document.getElementById("borranominal").style.display = "inline-block";
	
}

function eliminarNominal(){
	var table = document.getElementById("tableNominalBody");
	var node= document.getElementById("Nominal-1-"+document.getElementById("contador").value);
	node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
	document.getElementById("contador").value= parseInt(document.getElementById("contador").value)-1;
	if(document.getElementById("contador").value == "1")
		document.getElementById("borranominal").style.display = "none";


}

function deleteAsada(){
	
	var parameters = { "borrados": borrados};
	$.get('/deleteAsada',parameters,function(data) {
     }).done(function(res){     	
		});
     return true;

}

function saveAsada(id){

	updates = [];

	for (var i = 0; i < actualizados.length;  i++) {
			updates.push(document.getElementById(actualizados[i]).value);
	}

	var parameters = { "actualizados": actualizados,"updates":updates,"id": id};
	$.get('/saveasada',parameters,function(data) {
     }).done(function(res){     	

		});

    return true;

}

function addUser(){
	var table = document.getElementById("usertable");
	if(table.rows.length!=0)
	var lastRow = parseInt(table.rows[ table.rows.length - 1 ].cells[0].innerHTML) + 1;
	else
	var lastRow = 1;

	var row = table.insertRow();
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);

	nuevos.push(lastRow);
	cell1.innerHTML = lastRow ;
	cell2.innerHTML = '<input type="text" class="form-control hideinput" name="name-'+lastRow+'" value="USUARIO NUEVO">';
	cell3.innerHTML = '<input type="text" class="form-control hideinput" name="user-'+lastRow+'" value="new_user">';
	cell4.innerHTML = '<input type="password" class="form-control hideinput" name="pass-'+lastRow+'" value="12345">';
	cell5.innerHTML = '<select class="form-control hideinput" name="type-'+lastRow+'"> <option name="type-1" value=1>Superusuario</option> <option name="type-2" value=2>Administrador</option> </select>';
	cell6.innerHTML = '<button class="btn btn-icon" onclick="deleteUser(this,'+lastRow+');"><i class="fas fa-trash text-danger"></i></button>';
	document.getElementById("savebutton").style.visibility = "visible";
};

function updateUser(id){
	if(!actualizados.includes(id))
		actualizados.push(id);
	document.getElementById("savebutton").style.visibility = "visible";
}

function deleteUser(element, id){
	element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
	if(!nuevos.includes(id)){
		borrados.push(id);
		if(actualizados.includes(id)){
			actualizados.splice(actualizados.indexOf(id),1);	
		}
	}
	else
		nuevos.splice(nuevos.indexOf(id),1);
	document.getElementById("savebutton").style.visibility = "visible";
};

function saveUser(){
	estado= true;
	news=[];
	updates=[];
	nameUsers=[];
	var table = document.getElementById("usertable");
	var valor = 0;
	for (var i = table.rows.length - 1; i >= 0; i--) {
		usuario = parseInt(table.rows[i].cells[0].innerHTML);
		if(nameUsers.includes(table.rows[i].cells[2].childNodes[0].value)){
			estado= false;
			$("#error").html("Error, los usuarios no pueden ser iguales.");
			i = -1;
		}
		else{
		if(nuevos.includes(usuario)){
			news.push({"id": usuario, 
					   "nombre": table.rows[i].cells[1].childNodes[0].value, 
					   "usuario": table.rows[i].cells[2].childNodes[0].value, 
					   "contrasenna": table.rows[i].cells[3].childNodes[0].value,
					   "tipo": table.rows[i].cells[4].childNodes[0].value
					  });
		}
		else if(actualizados.includes(usuario)){
			updates.push({"id": usuario, 
						  "nombre": table.rows[i].cells[1].childNodes[0].value, 
						  "usuario": table.rows[i].cells[2].childNodes[0].value, 
						  "contrasenna": table.rows[i].cells[3].childNodes[0].value,
						  "tipo": table.rows[i].cells[4].childNodes[0].value
					     });
		}
		nameUsers.push(table.rows[i].cells[2].childNodes[0].value);
		}
	}
	
	if(estado){
	var parameters = { "nuevos": news, "actualizados": updates, "borrados": borrados, "length": table.rows.length};
	$.get('/saveUsuario',parameters,function(data) {
     }).done(function(res){     	
		});
 	}
     return estado;
}

function valoresForm(){
	valores = [""];
	var table = document.getElementById("componenttable");
	for (var i = 1; i < table.rows.length; i++)
	{
		var select = table.rows[i].cells[1].childNodes[0];
		if (select.nodeName + "" == "SELECT")
		{
			valores.push (select.options[select.selectedIndex].text);
		}
		else
		{
			valores.push (select.value);
		}
		if(!valores[valores.length - 1])
		{
			return false
		}
	}
	document.getElementById("ocultos").value = valores.toString ();
	return true;

}

function seleccionarUsuario(asad, user){
	if(id!="0")
	document.getElementById("mark-"+id).className="far fa-times-circle";
    document.getElementById("mark-"+user).className="far fa-check-circle";
	asada=asad;
    id=user;
}

function seleccionarAsada(){
	if(id!="0"){
	document.getElementById("asadaID-"+id).innerHTML= document.getElementById("selector").value;
	document.getElementById("asada-"+id).innerHTML= document.getElementById("selector").options[document.getElementById("selector").selectedIndex].text;
	document.getElementById("savebutton").style.visibility = "visible";
	}
}

function saveUserAsada(){
	var table = document.getElementById("usertable");
	var lista=[]
	for (var i = 0; i<table.rows.length; i++) {
		if((table.rows[i].cells[2].innerHTML+"")!="")
			lista.push({"Usuario_ID":table.rows[i].cells[0].innerHTML,"Asada_ID":table.rows[i].cells[2].innerHTML});
	}
	var parameters = {"UsuarioAsada": lista};
	$.get('/setUsuariosAsada',parameters,function(data) {
     }).done(function(res){     	
		});

}

function hacerFiltroN(){
	print("holi");
    document.getElementById("listaDistritos").style.display = 'none';
    document.getElementById("listaCantones").style.display = 'none';
    document.getElementById("listaProvincias").style.display = 'none';
    document.getElementById("listaNacionales").style.display = 'inline';
}

function hacerFiltroP(){
	print("holi");
    document.getElementById("listaDistritos").style.display = 'none';
    document.getElementById("listaCantones").style.display = 'none';
    document.getElementById("listaNacionales").style.display = 'none';
    document.getElementById("listaProvincias").style.display = 'inline';
}

function hacerFiltroC(){
	print("holi");
    document.getElementById("listaDistritos").style.display = 'none';
    document.getElementById("listaProvincias").style.display = 'none';
    document.getElementById("listaNacionales").style.display = 'none';
    document.getElementById("listaCantones").style.display = 'inline';
}

function hacerFiltroD(){
	print("holi");
    document.getElementById("listaCantones").style.display = 'none';
    document.getElementById("listaProvincias").style.display = 'none';
    document.getElementById("listaNacionales").style.display = 'none';
    document.getElementById("listaDistritos").style.display = 'inline';

}

function manejoFormulario (funcion)
{
	keys = Object.keys(document.getElementById ("formulario"));
	keys.pop();
	keys.pop();
	keys.pop();
	keys.pop();
	keys.pop();

	var valores = [""]
	for (var i = 1; i < 31; i++)
	{
		valores.push (document.getElementsByName (i)[0].value);
	}

	var data = {"respuestas": valores, "indicadores": keys, "anno": document.getElementById("anno").value, "asada": document.getElementById("asada").value};
	if (data.asada == "")
	{
		alert ("Seleccione una asada");
	}
	else if (data.anno == "")
	{
		alert ("Ingrese un año");
	}
	else
	{
		funcion (data);
	} //end else
} //end manejoFormulario

function guardarFormulario (data)
{
	$.get ("/guardarFormulario", data)
		.done (function (res)
		{
			if (res.exito)
			{
				Swal.fire(
				{
					title: res.error ? 'Error' : '',
					icon: res.error ? 'error' : 'info',
					html: res.error ? 'Ocurrió un error guardando el formulario' : 'Se guardó el formulario',
					confirmButtonColor: '#1D2D51'
				}).then((value)=>
				{
					if(valoresForm())
					{
						$("#formulario")[0].submit()
					}
				}); //end sweetAyuda
			} //end if
			else
			{
				Swal.fire(
				{
					title: 'Error',
					icon: 'error',
					html: res.error,
					confirmButtonColor: '#1D2D51'
				}); //end sweetAyuda
			} //end else
		}) //end done
		.fail (function (err){console.log (err)});
} //end guardarFormulario

function cargarFormulario (data)
{
	$.get ("/cargarFormulario", data)
	.done (function (res)
	{
		res.forEach (row => 
		{
			document.getElementsByName (row.INDICADOR_ID)[0].value = row.TEXTO;
		});
	}) //end done
	.fail (function (err)
	{
		console.log (err)
	}) //end fail
} //end cargarFormulario