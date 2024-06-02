var cE=function(ziel,e,id,cn){
	var newNode=document.createElement(e);
	if(id!=undefined)newNode.id=id;
	if(cn!=undefined)newNode.className=cn;
	if(ziel)ziel.appendChild(newNode);
	return newNode;
	}
var gE=function(id){return document.getElementById(id);}
var addClass=function(htmlNode,Classe){	
	var newClass;
	if(htmlNode!=undefined){
		newClass=htmlNode.className;
		if(newClass==undefined || newClass=="")newClass=Classe;
		else
		if(!istClass(htmlNode,Classe))newClass+=' '+Classe;	
		htmlNode.className=newClass;
	}			
}
var subClass=function(htmlNode,Classe){
	var aClass,i;
	if(htmlNode!=undefined && htmlNode.className!=undefined){
		aClass=htmlNode.className.split(" ");	
		var newClass="";
		for(i=0;i<aClass.length;i++){
			if(aClass[i]!=Classe){
				if(newClass!="")newClass+=" ";
				newClass+=aClass[i];
				}
		}
		htmlNode.className=newClass;
	}
}
var istClass=function(htmlNode,Classe){
	if(htmlNode.className){
		var i,aClass=htmlNode.className.split(' ');
		for(i=0;i<aClass.length;i++){
			if(aClass[i]==Classe)return true;
		}	
	}		
	return false;
}

