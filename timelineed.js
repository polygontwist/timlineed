
/*
Spuren 	Zeit>
	e1 ........*.........*........*
	e2    *..........*
	e3             *..........*
	e4
	e5
(audio)

*/

var cline=function(ctx,ax,ay,zx,zy,farbe,breite){
	ctx.strokeStyle = farbe;
	ctx.lineWidth  = breite;
	ctx.beginPath();
	ctx.moveTo(ax,ay);
	ctx.lineTo(zx,zy);
	ctx.stroke();;
}
var ctext=function(ctx,x,y,stext,farbe,font){
	ctx.font = font;
	ctx.fillStyle = farbe;
	ctx.fillText(stext, x, y);	
}

var tempcanvas=document.createElement("canvas");
var getCanvasTextSize=function(stext,font){
	var ctx = tempcanvas.getContext("2d");
	ctx.font = font;	
	var i,h=0,fontliste=font.split(' ');
	for(i=0;i<fontliste.length;i++){
		if(fontliste[i].indexOf('px')>-1){
			h=parseFloat(fontliste[i].split('px')[0]);
		}
	}
	return {"width":ctx.measureText(stext).width,"height":h};
}


var drawRoundRect=function(ctx, x, y, width, height, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.fill();
}
var drawKreis=function(ctx,x,y, r ,color){
	if(color!=undefined)ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.closePath();
	if(color!=undefined)ctx.fill(); 
}

var oContextmenue=function(zielnode){
	var basisnode,
		isopen=false,
		xx=0,
		yy=0;
	
	this.isopen=function(){return isopen}
	
	this.show=function(zeigen,data, mx,my){
		var i,li,a,cl;
		basisnode.innerHTML="";
		if(zeigen && data!=undefined && mx!=undefined && my!=undefined){
			isopen=true;
			for(i=0;i<data.length;i++){
				cl="";
				if(data[i]["action"]!=undefined)
					cl=data[i]["action"];
				
				li=cE(basisnode,"li");
				
				if(data[i]["onClick"]!=undefined){
					a=cE(li,"a",undefined,cl);
					a.href="#";
					a.innerHTML=data[i].titel;
					a.data=data[i];//{titel:"del",action:"del",onClick:onclickMenueoption ,data:key}
					a.addEventListener('click',onClickOption);
				}
				else{
					a=cE(li,"span");
					a.innerHTML=data[i].titel;
					a.addEventListener('click',onClickOption);
				}
			}
			xx=mx;
			yy=my;
			
		}else{
			zeigen=false;
		}
		show(zeigen);
	}
	
	var onClickOption=function(e){
		var data=this.data;
		if(data!=undefined){
			if(typeof data.onClick ==="function")data.onClick(data);
		}
		show(false);
		e.preventDefault();
	}
	
	var show=function(zeigen){
		isopen=zeigen;
		if(zeigen===true){
			basisnode.style.display="block";
			
			var b=basisnode.offsetWidth;
			var bb=zielnode.offsetWidth;
			if(b+xx>bb)
				xx=bb-b;
			if(xx<0)xx=0;
			
			b=basisnode.offsetHeight;
			bb=zielnode.offsetHeight;
			if(b+yy>bb)
				yy=bb-b;
			if(yy<0)yy=0;
			
			basisnode.style.left=xx+'px';//erst nach display sinvolle werte
			basisnode.style.top=yy+'px';
		}
		else
			basisnode.style.display="none";
	}
	
	var ini=function(){
		basisnode=cE(zielnode,"ul","myContextmenue");		
	}	
	ini();
}

var oPopup=function(zielnode){
	var basisnode,_this=this, nodemerkliste;
	this.refresh=function(){}
	
	var farbenmerker=[];
	
	var onclickclose=function(e){
		show(false);
		_this.refresh();
	}
	
	var onChangeNumber=function(e){
		var data=this.data;
		var val=this.value;
		if(val<0)val=0;
		var diff=val-data.start;
		data.end+=diff;	//ende passend mit verschieben
		data.start=val;
	}
	
	var onChangeColor=function(e){
		var data=this.data;
		data.color=this.value;
	}
	
	var onclickmerkefarbe=function(e){
		var farbe=this.inputfarbe.value;
		
		var i,isneu=true;
		for(i=0;i<farbenmerker.length;i++){
			if(farbenmerker[i]==farbe)isneu=false;
		}
		if(isneu){
			farbenmerker.push(farbe);
			addMerkfarbeButt(this.inputfarbe.value,this.inputfarbe);
		}else{
			console.log("schon gemerkt");
		}
	}
	
	var addMerkfarbeButt=function(farbe,node){
		var butt=cE(nodemerkliste,"a",undefined,"farbbutton");
		butt.href="#";
		butt.style.backgroundColor=farbe;
		butt.inputfarbe=node;
		butt.farbe=farbe;
		butt.addEventListener('click',onclickmerkfarbe);
		
	}
	var onclickmerkfarbe=function(e){
		this.inputfarbe.value=this.farbe;
		this.inputfarbe.data.color=this.farbe;
		
		e.preventDefault();
	}
	
	this.show=function(zeigen,data){
		var popbox,h1,a,node,gruppe,input,label,br,label,p;
		
		if(zeigen){
			basisnode.innerHTML="";//blocker
			
			//titelleiste
			popbox=cE(basisnode,"div",undefined,"popbox");
			
			gruppe=cE(popbox,"div");
			h1=cE(gruppe,"h1");
			h1.innerHTML="Keyoptionen";
			
			/*a=cE(h1,"a",undefined,"closebutt");
			a.href="#";
			a.innerHTML="x";
			a.addEventListener('click',onclickclose);*/
			
			//console.log(data);
			//.start .end .ishover .typ="led" .color="#000000"
			
			//Optionen
			node=cE(gruppe,"div",undefined,"popboxcontent");
			
			if(data["start"]!=undefined){
				p=cE(node,"p");
				
				label=cE(p,"span",undefined,"bedeutung");
				label.innerHTML="Eventzeit:";
				
				input=cE(p,"input");
				input.type="Number";
				input.setAttribute('min',0);
				input.setAttribute('step',100);
				input.value=data.start;
				input.data=data;
				input.addEventListener('change',onChangeNumber);
				
				label=cE(p,"label");
				label.innerHTML="Millisekunden";
				
			}
			
			if(data["color"]!=undefined){
				p=cE(node,"p");
				
				label=cE(p,"span",undefined,"bedeutung");
				label.innerHTML="Farbe:";
				
				input=cE(p,"input");
				input.type="color";
				input.value=data.color;
				input.data=data;
				input.addEventListener('change',onChangeColor);
				
				//add
				a=cE(p,"a",undefined,"button");
				a.href="#";
				a.innerHTML="In Liste merken";
				a.inputfarbe=input;
				a.addEventListener('click',onclickmerkefarbe);
			
				//farbenmerker
				p=cE(node,"p");
				label=cE(p,"span",undefined,"bedeutung");
				label.innerHTML="Farbenmerkeliste:";
				
				p=cE(node,"p");
				nodemerkliste=p;
				for(i=0;i<farbenmerker.length;i++){
					addMerkfarbeButt(farbenmerker[i],input);
				}
			}
			
			
			//ok/abbrechen
			node=cE(popbox,"div",undefined,"popboxbottom");
			a=cE(node,"a",undefined,"button closebutt");
			a.href="#";
			a.innerHTML="schließen";
			a.addEventListener('click',onclickclose);
			
		}
			
		show(zeigen);
	}
	
	var show=function(zeigen){
		isopen=zeigen;
		if(zeigen===true)
			addClass(basisnode,"an");
		else
			subClass(basisnode,"an");
	}
	
	
	var ini=function(){
		basisnode=cE(zielnode,"div","myPopupmenue");		
	}
	ini();
}

var oTimelineEd=function(zielnode){
	var contextmenue,popup,
		timelineheight=30,
		spurheight=50,
		infobereich=60, 	//px			
		
		maincanvas
		,mcctx
		
		,spuren=[
			{"name":"L1", "events":[]}
			,
			{"name":"L2", "events":[]}
			,
			{"name":"L3", "events":[]}
			,
			{"name":"4er", "events":[]}
			,
			{"name":"1er", "events":[]}			
		]
		
		,kanaele=spuren.length
		
		,playerpos=3500			//
		,timelinestartpos=200	//ms
		,timelineendpos=200	//ms
		
		,rtimemax=6000 			//ms 6Sek
		,raster1Sek=100	  		//100px pro Sekunde
		,zoomX=1
		,zoomXmin=0.6
		,zoomXstepp=0.2
		,zoomXmax=2
		
		,zoomY=1
		,fontsize=10
		,font=fontsize+"px Verdana"
		
		,mausXpos=-1
		,mausYpos=-1
		,lastmousisdown=false
		,mousisdown=false
		,istouchdevice=false
		,timeatmouse=0			//ms
		,mauszeile=-1			//-1=timeline/info, 0...=Spur
		
		,istickertimeout=false
		,tickertimer
		,keyover=undefined
		,keyswidth=0			//px automatisch
		
		,fdunkel="#222222"
		,fdunkelElemente="#e0e0e0"
		,fdunkelElementeinaktiv="#9e9e9e"
		,fdunkelElementehover="#ffffff"
		,fhell="#d0d0d0"
		,fkey="#333333"
		,fkeyhover="#666666"
		;
	
	var drawTL=function(ismousevent){//immer
		var x,y,cursor="default",
			b=maincanvas.width-infobereich,
			h=maincanvas.height,
			tpos,tmp,textsize,xx,yy,isoverbutt
			;
		
		mauszeile=-1;
		if(mausXpos>infobereich){
			if(mausYpos>timelineheight){
				//over spurbereich
				mauszeile=Math.floor((mausYpos-timelineheight)/spurheight);
			}
		}
		
		mcctx.save();
		mcctx.translate(infobereich,0);
		
		//timeline
		mcctx.fillStyle = fdunkel;
		mcctx.fillRect(0, 0, b, timelineheight);
		
		var sec=timelinestartpos/1000;//sec
		var diffsec=sec-Math.floor(sec);
		
		diffXpx=diffsec*raster1Sek*zoomX;	//px
		//zeiteinteilung um diff verschieben, damit gerade Sekunden angezeigt werden
					
		for(x=0;x<(b+raster1Sek*zoomX);x+=raster1Sek*zoomX){//step=1sec
			xx=x;//pixel
			if(x>0){//+korektur um volle Sekunden zu zeigen
				xx=x-diffXpx;
				tpos=timelinestartpos+(x/raster1Sek*1000)/zoomX-(diffsec)*1000;//x-pos in Millisekunden
			}
			else
				tpos=timelinestartpos+(x/raster1Sek*1000)/zoomX ;//x-pos in Millisekunden
			//pos->sek
			
			tmp=Math.round((tpos)/1000*10)/10;//sec für Text
			if(x==0)tmp+="sec"
			if(xx<1)xx=1;
			cline(mcctx,
					xx,fontsize+2, 
					xx,timelineheight, 
					fdunkelElemente,1);
			
			textsize=getCanvasTextSize(tmp,font);
			if(xx+2-textsize.width*0.5<0)textsize.width=0;
			xx=xx-textsize.width*0.5;
			if(xx<4)xx=4;
			ctext(mcctx,xx,fontsize,tmp,fdunkelElemente,font);
		}
		
		timelineendpos=timelinestartpos+((b+raster1Sek*zoomX)/raster1Sek*1000)/zoomX-(diffsec)*1000
		
		xx=playerpos;
		
		
		//Mauszeigerzeit
		var mp=mausXpos-infobereich;
		if(istickertimeout){
			//mp+=keyswidth*0.5;//Key centern
		}
		
		timeatmouse=-1;
		if(mp>-1 && mp<b){
			timeatmouse=(timelinestartpos+((mp/raster1Sek*1000)/zoomX));//ms
			
			
			
			if(mausYpos>timelineheight){//nur sichtbar wenn im channel-bereich
				var mausXtext=''+Math.floor(timeatmouse/1000*100)/100;
				if(mausXtext.indexOf('.')<0){
					mausXtext+='.00';
				}
				mausXtext=mausXtext.split('.').join(',');
				
				yy=fontsize*2;
				if(mp<1)mp=1;
				cline(mcctx,
						mp,yy+2, 
						mp,timelineheight, 
						"#e961eb",1);
				textsize=getCanvasTextSize(mausXtext,font);
				
				xx=mp-textsize.width*0.5;
				if(xx<5)xx=5;
				if(xx+textsize.width+6>b)xx=b-textsize.width-6;
				
				drawRoundRect(mcctx,
							xx-3, yy-fontsize, 
							textsize.width+6, textsize.height+2, 
							3, "#e961eb")
				
				ctext(mcctx,xx,yy,mausXtext,"#000000",font);
			}
		}
		
		mcctx.restore();
		
		
		//--Mausaction--
		var istcontextopen=contextmenue.isopen();
		if(istcontextopen){
			contextmenue.show(false);
			deselectallKey();
			//drawTLChannels();
		}

		if(timeatmouse>-1){//Zeit unterm Mauscursor = im Bereich Zeitleiste/Kanäleinhalt
			if(mauszeile>-1){
				//keys unter mause?
				var key;
//console.log(istickertimeout,keyover!=undefined);
				if(keyover==undefined)
					key=getKeyandrefresh(mauszeile,timeatmouse);
				
				//if(key==undefined && keyover!=undefined)
				if(keyover!=undefined)
					key=keyover;
				
				if(key!=undefined){
					cursor="pointer";//menü: del/setcolor/...
					key.ismoving=false;
					
					if(istickertimeout){
						cursor="none";//moving
						var diff=key.end-key.start;//keyweite
						key.start=timeatmouse;
						key.end=timeatmouse+diff;
						key.ismoving=true;
						keyover=key;
						lastmousisdown=false;
						
					}
					else{
						if(lastmousisdown && keyover==undefined){
							showKeyMenue(mauszeile,key);
							zeigecontext=true;
						}
					}
				}
				else{
					if(!istcontextopen){
						cursor="copy";//add
						if(lastmousisdown){
							//add new Key
							addNewKey(mauszeile,timeatmouse);
						}
					}
				}
				
				if(ismousevent)drawTLChannels();
			}
		}
		
		//timeline + Button move left/right
		xx=infobereich;
		
		
		//draw bg Timelinebutton
		mcctx.fillStyle = fdunkel;
		mcctx.fillRect(0, 0, infobereich, timelineheight);
		isoverbutt=false;
		var buttmass=timelineheight*0.6;
		var buttrand=(timelineheight-buttmass)*0.5;
		var buttpy=buttrand;
		xx=buttrand;
		
		if(drawButt("zoom-",xx-buttrand*0.5,buttrand ,buttmass,buttmass ))isoverbutt=true;
		xx+=buttmass+buttrand*2+buttrand*0.5;
		if(drawButt("zoom+",xx,buttrand ,buttmass,buttmass ))isoverbutt=true;
		
		if(isoverbutt)cursor="pointer";
		
		//Text-Faktor
		textsize=getCanvasTextSize(zoomX,font);
		ctext(mcctx
				,infobereich*0.5-textsize.width*0.5
				,timelineheight - 2//*0.5 +textsize.height*0.5
				,zoomX,fdunkelElemente,font);
		
		//----------------
		
		lastmousisdown=false;//onMouseUP
		maincanvas.style.cursor=cursor;
	}
	
	var drawButt=function(typ,x,y ,b,h){
		var isover=mausXpos>=x && mausXpos<x+b &&
				   mausYpos>=y && mausYpos<y+h;
		var refreshTL=false;
		
		var farbe=fdunkelElemente;
		if(isover)farbe=fdunkelElementehover;

		if(isover && lastmousisdown && !mousisdown){
			//console.log("klick",typ);
			
			if(typ=="zoom+")zoomX+=zoomXstepp;
			if(typ=="zoom-")zoomX-=zoomXstepp;
			zoomX=Math.floor(zoomX*10)/10;
			
			if(zoomX<zoomXmin)zoomX=zoomXmin;
			if(zoomX>zoomXmax)zoomX=zoomXmax;
			//console.log("zoom",zoomX);
			
			lastmousisdown=false;
			
			refreshTL=true;
		}

		if(typ=="zoom-" && zoomX==zoomXmin){
			farbe=fdunkelElementeinaktiv;
			isover=false;
		}
		if(typ=="zoom+" && zoomX==zoomXmax){
			farbe=fdunkelElementeinaktiv;
			isover=false;
		}

		
		drawKreis(mcctx, x+b*0.5,y+h*0.5, h*0.5 ,farbe);
		
		var rand=b*0.2;
		mcctx.save();
		mcctx.strokeStyle = fdunkel; 
		mcctx.lineWidth = 2;  		
		mcctx.lineCap = 'round';  		
		
		if(typ=="zoom+" || typ=="zoom-"){
			mcctx.beginPath();
			mcctx.moveTo(x+rand, y+h*0.5);
			mcctx.lineTo(x-rand+b, y+h*0.5);
			mcctx.stroke(); 
			if(typ=="zoom+"){
				mcctx.beginPath();
				mcctx.moveTo(x+b*0.5, y+rand);
				mcctx.lineTo(x+b*0.5, y-rand+h);
				mcctx.stroke();
			}
		}
		
		mcctx.restore();
		
		if(refreshTL){
			drawTLChannels();
			drawTL(false);
			}
		
		return isover;
	}
	
	
	var startticker=function(){
		clearticker();
		tickertimer=setTimeout(tickertimeout,500);//nach 500ms umschalten auf bewegen
	}
	var tickertimeout=function(){
		clearticker();
		istickertimeout=true;
		
		drawTL(true);
	}
	var clearticker=function(){
		istickertimeout=false;
		if(tickertimer!=undefined)clearTimeout(tickertimer);
	}
	
	var onclickMenueoption=function(data){
		//console.log(">>",data);
		
		if(data.action==="delkey"){
			data.data.delete=true;
			refreshAllKeys();
		}
		if(data.action==="setoptionens"){
			popup.show(true,data.data);
		}
		
		//refressh
		deselectallKey();
		drawTLChannels();
	}

	var showKeyMenue=function(spur,key){
		contextmenue.show(true,[
					{titel:"Key:",action:""}
					,{titel:"löschen",action:"delkey",onClick:onclickMenueoption ,data:key}
					,{titel:"Optionen",action:"setoptionens",onClick:onclickMenueoption ,data:key}
				],
					mausXpos-5,mausYpos-5
				);
	}
	
	var addNewKey=function(zeile,timems){
		var i,vorkey,liste=spuren[zeile].events;
		var fcolor="#000000",lasttime=-1;
		
		//Farbe vom Key links von neuer Timepos übernehmen
		if(liste.length>0){
			for(i=0;i<liste.length;i++){
				vorkey=liste[i];
				if(vorkey.start<timems && lasttime<vorkey.start){
					fcolor=vorkey.color;
					lasttime=vorkey.start;
				}
			}
		}
		
		liste.push({
			start:timems
			,end:timems+200
			,isover:false
			,typ:"led"
			,color:fcolor
			});
		//sortbytime	
		liste.sort(function(a, b) {return a.start - b.start;});
		//console.log(spuren[zeile].events)
	}
	
	var refreshAllKeys=function(){
		var t,i,liste,ev,newlist;
		for(t=0;t<spuren.length;t++){
			liste=spuren[t].events;
			newlist=[];
			for(i=0;i<liste.length;i++){
				ev=liste[i];
				if( !(ev["delete"]===true)){
					newlist.push(ev);
				}
			}
			spuren[t].events=newlist;
		}
	}
	
	var deselectallKey=function(){
		var t,liste,ev
		for(t=0;t<spuren.length;t++){
			liste=spuren[t].events;
			for(i=0;i<liste.length;i++){
				ev=liste[i];
				ev.isover=false;//alle zurücksetzen
			}
		}
	}
	var getKeyandrefresh=function(zeile,timems){
		var i,ev,end,re=undefined
		var liste=spuren[zeile].events;
		deselectallKey();
		
		liste=spuren[zeile].events;
		for(i=0;i<liste.length;i++){
			ev=liste[i];
			end=ev.end;
			if(timems>=ev.start && timems<end){//im ziel=hover
				re=ev;
				ev.isover=true;
			}
			else{
				ev.isover=false;//alle zurücksetzen
			}
		}
		return re;
	}
	
	var timeToPX=function(xpos_ms){
		//xposms=timelinestartpos+(xpospx/raster1Sek*1000)/zoomX //pxtotime
		return Math.floor( (xpos_ms-timelinestartpos)/1000 *raster1Sek );
	}
	
	var drawTLChannels=function(){
		var x,y,i,t,key,keylist,xx,yy,kexb,hh,
			b=maincanvas.width-infobereich,
			h=maincanvas.height
			;
		mcctx.save();
		mcctx.translate(infobereich,0);
		
		//mcctx.translate(infobereich,0); *zoomX
			
		//hg
		mcctx.fillStyle = fhell;
		mcctx.fillRect(0, timelineheight, b, h);
			
		for(y=0;y<kanaele;y++){
			cline(mcctx,
				0,y*spurheight	+timelineheight, 
				b,y*spurheight	+timelineheight, 
				fdunkel,2);
				
			//	
			keylist=spuren[y].events;
			for(i=0;i<keylist.length;i++){
				key=keylist[i];
				if(key.start>=timelinestartpos && key.start<timelineendpos){
					//wenn innerhalb sichbaren bereiches, zeichnen:
					
					xx=timeToPX(key.start)*zoomX;
					kexb=timeToPX(key.end)*zoomX-xx;
					keyswidth=kexb;
					
					yy=y*spurheight+timelineheight +timelineheight*0.1;
					hh=(y+1)*spurheight+timelineheight -timelineheight*0.1  -yy;
					
					if(key.isover)	
						drawRoundRect(mcctx, xx, yy, kexb, hh, kexb*0.5, fkeyhover);
					else
						drawRoundRect(mcctx, xx, yy, kexb, hh, kexb*0.5, fkey);
					
					if(key["typ"]==="led"){
						var maxbh=Math.min(kexb,hh)-2;
						var radius=maxbh*0.5;
						if(radius>10)radius=10;
						//LED-Grund
						drawKreis(mcctx,xx+kexb*0.5,yy+kexb*0.5,radius,key["color"]);
						//Glanzpunkt
						radius=radius*0.3;
						drawKreis(mcctx,xx+kexb*0.5-radius*0.6,yy+kexb*0.5-radius*0.6,radius,"#ffffff");
					}
					
					if(key["ismoving"]===true){
						//Pfeil linksrechts, cursor ist ausgeblendet
						mcctx.strokeStyle = "#000000"; 
						mcctx.lineWidth = 4;  		
						for(t=0;t<2;t++){
							if(t==1){
							mcctx.strokeStyle = "#ffffff"; 
							mcctx.lineWidth = 2;  	
							}
							mcctx.lineCap = 'round';  		
							mcctx.beginPath();
							mcctx.moveTo(xx, yy+hh*0.6);
							mcctx.lineTo(xx+kexb, yy+hh*0.6);
							mcctx.stroke(); 

							mcctx.beginPath();
							mcctx.moveTo(xx+3, yy+hh*0.6-3);
							mcctx.lineTo(xx, yy+hh*0.6);
							mcctx.lineTo(xx+3, yy+hh*0.6+3);
							mcctx.stroke(); 

							mcctx.beginPath();
							mcctx.moveTo(xx+kexb-3, yy+hh*0.6-3);
							mcctx.lineTo(xx+kexb, yy+hh*0.6);
							mcctx.lineTo(xx+kexb-3, yy+hh*0.6+3);
							mcctx.stroke(); 
						}
					}
					
				}
			}
		}
		
		mcctx.restore();
	}
	
	var drawVorsatz=function(){
		var i,x,y,spo,textsize,tmp,
			b=infobereich,
			h=maincanvas.height
			;
		mcctx.fillStyle = fdunkel;
		mcctx.fillRect(0, timelineheight, b, h);
			
		/*cline(mcctx,
					0,timelineheight, 
					b,timelineheight, 
					fdunkelElemente,1);*/
		
		for(i=0;i<spuren.length;i++){
			spo=spuren[i];
			tmp=spo.name;
			y=timelineheight+spurheight*i;
			
			cline(mcctx,
						0,y, 
						b,y, 
						fdunkelElemente,1);
			
			textsize=getCanvasTextSize(tmp,font);
			ctext(mcctx,2,fontsize+y+2,tmp,fdunkelElemente,font);
		}
		
	}
	
	var refreshAll=function(){
		if(maincanvas){
			var b=zielnode.clientWidth,
				h=zielnode.clientHeight
				;
			if(b==0)b=100;
			if(h==0)h=100;
			
			h=timelineheight+spurheight*kanaele;
			
			maincanvas.width=b;
			maincanvas.height=h;

			
			drawVorsatz();//Element von Channels
			drawTL(false);//obere Zeitleiste + Buttons links
			drawTLChannels();
			
		}
	}
	
	var onWwheel=function(e){
        var deltaY = e.deltaY;//*
       
		/*varnewzoom=zoomX+deltaY/100;
		if(varnewzoom<0.1)varnewzoom=0.1;
		if(varnewzoom>3)varnewzoom=3;
		
		zoomX=varnewzoom;*/
		var pos=timelinestartpos-Math.floor(deltaY*2);//ms
		
		if(pos<0)pos=0;
		if(timelinestartpos!=pos){
			timelinestartpos=pos;
			refreshAll();
		}
		e.preventDefault();// Verhindert, dass das Scrollen des Mausrads die Seite scrollt
	}
	
	var onMousemove=function(e){
		var rect = this.getBoundingClientRect();
		var x = e.clientX - rect.left;
		var y = e.clientY - rect.top;
		mausXpos=x;
		mausYpos=y;
		if(!mousisdown)clearticker();
		if(!istouchdevice)drawTL(true);//nicht bei touchdevice
	}
	var onMousedown=function(e){
		mousisdown=true;
		startticker();
		}
	var onMouseup=function(e){
		if(mousisdown)lastmousisdown=true;
		mousisdown=false;
		clearticker();
		drawTL(true);
		keyover=undefined;		
		}
	var touchstart=function(e){
		istouchdevice=true;
		mousisdown=true;
		startticker();
	}
	var touchmove=function(e){
		var rect = this.getBoundingClientRect();
		var x = e.touches[0].clientX - rect.left; 
		var y = e.touches[0].clientY - rect.top;
		mausXpos=x;
		mausYpos=y;
		drawTL(true);//nicht bei touchdevice
	}
	var touchend=function(e){console.log("TE");
		mousisdown=false;
		clearticker();
		keyover=undefined;
		deselectallKey();
		drawTLChannels();
	}
	
	var ini=function(){
		zielnode.style.height=(timelineheight+spurheight*spuren.length)+"px";
		
		maincanvas=cE(zielnode,"canvas");
		mcctx = maincanvas.getContext('2d');
		
		contextmenue=new oContextmenue(zielnode);
		popup=new oPopup(zielnode);
		popup.refresh=function(){
			deselectallKey();
			drawTLChannels();
		}
		
		maincanvas.addEventListener('mousemove'	,onMousemove);//auch bei touch
		maincanvas.addEventListener('mousedown'	,onMousedown);
		maincanvas.addEventListener('mouseup'	,onMouseup);
		maincanvas.addEventListener('touchstart',touchstart,{passive:false});
		maincanvas.addEventListener('touchmove',touchmove,{passive:true});
		maincanvas.addEventListener('touchend',touchend,{passive:true});
		
		
		refreshAll();
		
		window.addEventListener('wheel',onWwheel, { passive: false });		
		window.addEventListener('resize',function(e){refreshAll();});		
	}
	
	ini();
}


window.addEventListener('load', function (event) {
	timeline=new oTimelineEd(gE("timelineed"));	
});