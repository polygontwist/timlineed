
/*
	V1.0
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
	var setlive=true;
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
		if(setlive)_this.refresh();
	}
	
	var onChangeColor=function(e){
		var data=this.data;
		data.color=this.value;
		if(setlive)_this.refresh();//gleich setzen
	}
	
	var onClickmerkefarbeinListe=function(e){
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
		if(setlive)_this.refresh();
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
				
				if(setlive)
					input.addEventListener('input',onChangeColor);
				else
					input.addEventListener('change',onChangeColor);
				
				//add to list
				a=cE(p,"a",undefined,"button");
				a.href="#";
				a.innerHTML="In Liste merken";
				a.inputfarbe=input;
				a.addEventListener('click',onClickmerkefarbeinListe);
			
				//farbenmerker
				p=cE(node,"p");
				label=cE(p,"span",undefined,"bedeutung");
				label.innerHTML="Farbenmerkeliste:";
				
				p=cE(node,"p",undefined,"farbenliste");
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


var chartobyte=function(s){
	var re=s.charCodeAt(0);
	if(re>255){
		console.log("konvertfehler",re,s);
		re=0;
	}
	return re;
}
var rgbToHex=function(r, g, b){
	var componentToHex=function(c){
		var hex=c.toString(16);
		return hex.length==1?"0"+hex:hex;
	}
	return "#"+componentToHex(r)+componentToHex(g)+componentToHex(b);
}

var oTimelineEd=function(zielnode){
	var contextmenue,popup,
		timelineheight=30,
		spurheight=50,
		infobereich=120, 	//px			
		
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
		
		,timelinestartpos=200	//ms
		,timelineendpos=200	//ms
		
		,timelinemin=0	//ms
		,timelinemax=200	//ms
		
		,rtimemax=6000 			//ms 6Sek
		,raster1Sek=100	  		//100px pro Sekunde
		,zoomX=1
		,zoomXmin=0.6
		,zoomXstepp=0.2
		,zoomXmax=4
		
		,zoomY=1
		,fontsize=10
		,font=fontsize+"px Verdana"
		
		,mausXpos=-1
		,mausYpos=-1
		,lastmausXpos=-1
		,lastmausYpos=-1
		,lastmousisdown=false
		,mousisdown=false
		,istouchdevice=false
		,timeatmouse=0			//ms
		,mauszeile=-1			//-1=timeline/info, 0...=Spur
		
		,istickertimeout=false
		,tickertimer
		,keyover=undefined
		,listeover=undefined
		,keyswidth=0			//px automatisch
		
		,ismovingtimeline=false
		
		,isplayingtimeline=false
		,playingposition=0
		,playingpositionmax=0
		,playingtimer=undefined
		,playanistep=25		//ms
		
		,fdunkel="#222222"
		,fdunkelElemente="#e0e0e0"
		,fdunkelElementeinaktiv="#9e9e9e"
		,fdunkelElementehover="#ffffff"
		,fhell="#d0d0d0"
		,fkey="#333333"
		,fkeyhover="#666666"
		;
	
	var drawTL=function(ismousevent){//immer
		var x,y,cursor="default",i,
			b=maincanvas.width-infobereich,
			h=maincanvas.height,
			tpos,tmp,textsize,xx,yy,isoverbutt,hh,bb
			;
		
		mauszeile=-1;
		if(mausXpos>infobereich){
			if(mausYpos>timelineheight){
				//over spurbereich
				mauszeile=Math.floor((mausYpos-timelineheight)/spurheight);
			}
		}
		
		//in obere Zeitleiste verschieben
		if(mausYpos<timelineheight && mausXpos>infobereich){
			if(ismousevent)cursor="ew-resize";
			if(ismousevent && mousisdown){
				var diff=lastmausXpos-mausXpos;
				if(diff!=0){
					MoveTimline(-diff*10*(1/zoomX));
					ismovingtimeline=true;
				}
			}
		}else{
			if(ismovingtimeline){
				ismovingtimeline=false;
				mousisdown=false;
				return;
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
		timelineendpos=timelinestartpos+((b+raster1Sek*zoomX)/raster1Sek*1000)/zoomX-(diffsec)*1000;

		if(timelinemax>timelineendpos){//Zeiger rechts
			hh=timelineheight*0.4;
			bb=hh*1.2;
			xx=b-5;
			yy=hh*0.3;
			mcctx.fillStyle = fhell;
			mcctx.beginPath();
			mcctx.moveTo(xx-bb,yy+ timelineheight*0.5-hh*0.5); 
			mcctx.lineTo(xx,yy+timelineheight*0.5); 
			mcctx.lineTo(xx-bb,yy+ timelineheight*0.5+hh*0.5);
			mcctx.closePath();
			mcctx.fill();
		}
		if(timelinestartpos>timelinemin){//Zeiger Links
			hh=timelineheight*0.4;
			bb=hh*1.2;
			xx=5+bb;
			yy=hh*0.3;
			mcctx.fillStyle = fhell;
			mcctx.beginPath();
			mcctx.moveTo(xx	,yy+ timelineheight*0.5-hh*0.5); 
			mcctx.lineTo(xx-bb	,yy+timelineheight*0.5); 
			mcctx.lineTo(xx	,yy+ timelineheight*0.5+hh*0.5);
			mcctx.closePath();
			mcctx.fill();
		}
		
		//Timelineraster+Sec-Anzeige
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
			if(x>0){//Raster
				bb=(raster1Sek*zoomX);
				for(i=1;i<10;i++){
					//nach
					cline(mcctx,
							xx+bb/10*i,timelineheight-timelineheight*0.3, 
							xx+bb/10*i,timelineheight, 
							fdunkelElemente,1);
							
					if(x<raster1Sek*zoomX*2){
						//vor
						cline(mcctx,
								xx-bb/10*i,timelineheight-timelineheight*0.3, 
								xx-bb/10*i,timelineheight, 
								fdunkelElemente,1);
					}
				}
			}
					
			textsize=getCanvasTextSize(tmp,font);
			if(xx+2-textsize.width*0.5<0)textsize.width=0;
			xx=xx-textsize.width*0.5;
			if(xx<4)xx=4;
			ctext(mcctx,xx,fontsize,tmp,fdunkelElemente,font);
			
		}
		
		
		
		//----Mauszeigerzeit----
		var mp=mausXpos-infobereich;
		
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
		}

		if(timeatmouse>-1){//Zeit unterm Mauscursor = im Bereich Zeitleiste/Kanäleinhalt
			if(mauszeile>-1){
				//keys unter mause?
				var key,item,liste;
//console.log(istickertimeout,keyover!=undefined);
				if(keyover==undefined){
					item=getKeyandrefresh(mauszeile,timeatmouse);
					key=item.key;
					liste=item.liste;
				}
				
				//if(key==undefined && keyover!=undefined)
				if(keyover!=undefined){
					key=keyover;
					liste=listeover;
				}
				
				if(key!=undefined){
					cursor="pointer";//menü: del/setcolor/...
					if(key.ismoving===true){
						if(lastmousisdown){
							sortKeys(liste);//Key verschoben, liste sortieren
							refreshAllKeys();
						}
					}
					key.ismoving=false;
					
					if(istickertimeout){
						cursor="none";//moving
						var diff=key.end-key.start;//keyweite
						key.start=timeatmouse;
						key.end=timeatmouse+diff;
						key.ismoving=true;
						keyover=key;
						listeover=liste;
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
		
		
		
		//----infobereich: Aktionsbuttons----
		
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
		
		xx-=(buttmass+buttrand*2+buttrand*0.5)*0.5;		
		//Text-Faktor
		tmp=zoomX+'';
		if(tmp.indexOf('.')<1)tmp+=".0";		
		textsize=getCanvasTextSize(tmp,font);
		ctext(mcctx
				,xx //infobereich*0.5-textsize.width*0.5
				,timelineheight - 2//*0.5 +textsize.height*0.5
				,tmp,fdunkelElemente,font);		
		xx+=(buttmass+buttrand*2+buttrand*0.5)*0.5;
		xx+=buttmass+buttrand*2+buttrand*0.5;
		
		//playpause
		if(drawButt("play",xx-buttrand*0.5,buttrand ,buttmass,buttmass ))isoverbutt=true;
		
		if(isoverbutt)cursor="pointer";
		
		//----------------
		//playingposition
		if(isplayingtimeline){
			mcctx.save();
			mcctx.beginPath();
			mcctx.rect(infobereich, 0, b, timelineheight);
			mcctx.clip(); // Clip-Bereich setzen (alles außerhalb wird maskiert)

			xx=timeToPX(playingposition)*zoomX +infobereich;
			
			mcctx.fillStyle = "#36dca7";
			mcctx.fillRect(xx, 0, 5, timelineheight);
			
			mcctx.restore();
		}
		
		
		//----------------
		lastmousisdown=false;//onMouseUP
		maincanvas.style.cursor=cursor;
	}

	var startplaying=function(){
		//isplayingtimeline=true;
		if(playingtimer!=undefined)clearInterval(playingtimer);
		playingposition=0;
		playingtimer=setInterval(playingloop,playanistep);
	}
	var playingloop=function(){
		if(isplayingtimeline){
			playingposition+=playanistep;
			
			if(playingposition>playingpositionmax){//timelinemax
				playingposition=0;
				//isplayingtimeline=false;
				//if(playingtimer!=undefined)clearInterval(playingtimer);
			}
			
			drawVorsatzStatus();
			drawTL(false);
		}
	}
	var stoppplaing=function(){
		playingposition=0;
		isplayingtimeline=false;
		if(playingtimer!=undefined)clearInterval(playingtimer);
	}

	
	var drawButt=function(typ,x,y ,b,h){
		var isover=mausXpos>=x && mausXpos<x+b &&
				   mausYpos>=y && mausYpos<y+h;
		var refreshTL=false;
		
		var farbe=fdunkelElemente;
		if(isover)farbe=fdunkelElementehover;

		if(isover && lastmousisdown && !mousisdown){//onClick
			//console.log("klick",typ);
			if(typ=="zoom-" || typ=="zoom+"){
				
				if(typ=="zoom-")
					zoomX-=zoomXstepp;
				else
					zoomX+=zoomXstepp;
				
				zoomX=Math.floor(zoomX*10)/10;
				
				if(zoomX<zoomXmin)zoomX=zoomXmin;
				if(zoomX>zoomXmax)zoomX=zoomXmax;
			
			}
			
			if(typ=="play"){
				if(!isplayingtimeline){
					isplayingtimeline=true;
					startplaying();
				}
				else{
					isplayingtimeline=false;
					stoppplaing();
					drawVorsatz();
					drawVorsatzStatus();
				}
			}
			
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
		
		if(typ=="play"){
			mcctx.fillStyle=fdunkel;
			mcctx.beginPath();
			
			if(isplayingtimeline===true){
				mcctx.moveTo(x+rand*1.3, y+rand*1.3);
				mcctx.lineTo(x+b-rand*1.3, y+rand*1.3);
				mcctx.lineTo(x+b-rand*1.3, y+h-rand*1.3);
				mcctx.lineTo(x+rand*1.3, y+h-rand*1.3);
				mcctx.closePath();
			}
			else{
				mcctx.moveTo(x+rand*1.7, y+rand*1.2);
				mcctx.lineTo(x+b-rand*1.2, y+h*0.5);
				mcctx.lineTo(x+rand*1.7, y+h-rand*1.2);
				mcctx.closePath();
			}
			
			mcctx.fill(); 
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
		stoppplaing();
		
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
		stoppplaing();
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
		
		addLEDKey(zeile,timems,fcolor);
		
	}
	
	var sortKeys=function(liste){
		liste.sort(function(a, b) {return a.start - b.start;});
	}
	
	var addLEDKey=function(spur,starttime,hexcolorstr){
		var liste=spuren[spur].events;
		
		if(playingpositionmax<starttime+200)playingpositionmax=starttime+200;
		
		liste.push({
			start:starttime
			,end:starttime+200
			,isover:false
			,typ:"led"
			,color:hexcolorstr
			});
			
		if(timelinemax<starttime+200){
			timelinemax=starttime+200;
		}
		//sortbytime	
		sortKeys(liste);//.sort(function(a, b) {return a.start - b.start;});
		//console.log(spuren[zeile].events)
	}
	var clearSpuren=function(){
		var i;
		for(i=0;i<spuren.length;i++){
			spuren[i].events=[]
		};
		timelinemax=0;
		drawTLChannels();
	}
	
	var spurenaufraumen=function(){
		var ispur,spur,i,newlist=[],lastkey,key;
		for(ispur=0;ispur<spuren.length;ispur++){
			spur=spuren[ispur];
			newlist=[];
			for(i=0;i<spur.events.length;i++){
				key=spur.events[i]
				if(i==0)
					newlist.push(key);
				else{
					lastkey=newlist[newlist.length-1];
					if(lastkey.color!=key.color){
						newlist.push(key);
					}
				}
			}
			spur.events=newlist;
		}
	}
	
	var refreshAllKeys=function(){
		var t,i,liste,eventitem,newlist;
		timelinemax=0;
		playingpositionmax=0;
		for(t=0;t<spuren.length;t++){
			liste=spuren[t].events;
			newlist=[];
			for(i=0;i<liste.length;i++){
				eventitem=liste[i];
				if( !(eventitem["delete"]===true)){
					newlist.push(eventitem);
					if(timelinemax<eventitem.start)timelinemax=eventitem.start+200;
					if(playingpositionmax<eventitem.start+200)playingpositionmax=eventitem.start+200;
				}
			}
			spuren[t].events=newlist;
		}
		console.log(timelinemax);
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
		var i,ev,end,key=undefined,isover=false,keyliste=undefined;
		var liste=spuren[zeile].events;
		deselectallKey();
		
		liste=spuren[zeile].events;
		for(i=0;i<liste.length;i++){
			ev=liste[liste.length-1-i];
			end=ev.end;
			if(timems>=ev.start && timems<end && !isover){//im ziel=hover
				key=ev;
				keyliste=liste;
				ev.isover=true;
				isover=true;
			}
			else{
				ev.isover=false;//alle zurücksetzen
			}
		}
		return {"key":key,"liste":keyliste};
	}
	
	var timeToPX=function(xpos_ms){
		//xposms=timelinestartpos+(xpospx/raster1Sek*1000)/zoomX //pxtotime
		return Math.floor( (xpos_ms-timelinestartpos)/1000 *raster1Sek );
	}
	
	var drawTLChannels=function(){
		var x,y,i,t,key,keylist,xx,yy,kexb,hh,rr,ledxpos,ledypos,ledradius,
			b=maincanvas.width-infobereich,
			h=maincanvas.height
			;
		mcctx.save();
		mcctx.translate(infobereich,0);
		
		//mcctx.translate(infobereich,0); *zoomX
			
		//hg
		mcctx.fillStyle = fhell;
		mcctx.fillRect(0, timelineheight, b, h);
			
		mcctx.beginPath();
		mcctx.rect(0, 0, b, h);
		mcctx.clip(); // Clip-Bereich setzen (alles außerhalb wird maskiert)
		
		for(y=0;y<kanaele;y++){
			cline(mcctx,
				0,y*spurheight	+timelineheight, 
				b,y*spurheight	+timelineheight, 
				fdunkel,2);
				
			keylist=spuren[y].events;
			for(i=0;i<keylist.length;i++){
				key=keylist[i];
				//if(key.start>=timelinestartpos-200 && key.start<timelineendpos){
				if(true){
					//wenn innerhalb sichbaren bereiches, zeichnen:
					
					xx=timeToPX(key.start)*zoomX;
					kexb=timeToPX(key.end)*zoomX-xx;
					keyswidth=kexb;
					
					yy=y*spurheight+timelineheight +timelineheight*0.1;
					hh=(y+1)*spurheight+timelineheight -timelineheight*0.1  -yy;
					
					rr=kexb*0.4;
					if(hh<kexb){
						rr=hh*0.4;
					}
					if(rr>10)rr=10;
					rr=3;
					
					if(key.isover)	
						drawRoundRect(mcctx, xx, yy, kexb, hh, rr, fkeyhover);
					else
						drawRoundRect(mcctx, xx, yy, kexb, hh, rr, fkey);
					
					if(key["typ"]==="led"){
						var maxbh=Math.min(kexb,hh)-2;
						ledradius=maxbh*0.5;
						if(ledradius>10)ledradius=10;
						
						ledxpos=xx+ledradius;//+kexb*0.5;						
						ledypos=yy+ledradius+2;//kexb*0.5;
						
						//LED-Grund
						drawKreis(mcctx,ledxpos,ledypos,ledradius,key["color"]);
						//Glanzpunkt
						ledradius=ledradius*0.3;
						drawKreis(mcctx,ledxpos-ledradius*0.6,ledypos-ledradius*0.6,ledradius,"#ffffff");
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
			
			//LED
			
		}
		
	}
	
	
	var getcolorbypos=function(liste,pos){
		var i,key,recolor="#111111";
		for(i=0;i<liste.length;i++){
			key=liste[i];
			if(key.start<=pos){
				recolor=key.color;
			}
		}
		return recolor;
	}
	var drawVorsatzStatus=function(){
		//LEDs im Vorsatzbereich
		var i,y,xx,yy,cc,
			b=infobereich,
			h=maincanvas.height
			;
		//mcctx.fillStyle = fdunkel;
		//mcctx.fillRect(0, timelineheight, b, h);
			
		/*cline(mcctx,
					0,timelineheight, 
					b,timelineheight, 
					fdunkelElemente,1);*/
		var itemheight=10;
		var itemrand=5;
		for(i=0;i<spuren.length;i++){
			y=timelineheight+spurheight*i;
			
			cc=getcolorbypos(spuren[i].events,playingposition);
			//LED			
			xx=b-itemheight-itemrand;
			yy=y+spurheight-itemheight-itemrand;
			var ledradius=itemheight;
			//LED-Grund
			drawKreis(mcctx,xx,yy,ledradius+2,fdunkel);
			drawKreis(mcctx,xx,yy,ledradius,cc);
			//Glanzpunkt
			ledradius=ledradius*0.3;
			drawKreis(mcctx,xx-ledradius*0.6,yy-ledradius*0.6,ledradius,"#ffffff");
			
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
			drawVorsatzStatus();
			drawTL(false);//obere Zeitleiste + Buttons links
			drawTLChannels();
			
		}
	}
	
	var MoveTimline=function(deltapos){
		var pos=timelinestartpos-deltapos;
		if(pos<0)pos=0;
		if(timelinestartpos!=pos){
			timelinestartpos=pos;
			refreshAll();
		}
	}
	
	
	var onWheel=function(e){
		MoveTimline(Math.floor(e.deltaY*2));
		e.preventDefault();// Verhindert, dass das Scrollen des Mausrads die Seite scrollt
	}
	
	var onMousemove=function(e){
		var rect = this.getBoundingClientRect();
		var x = e.clientX - rect.left;
		var y = e.clientY - rect.top;
		lastmausXpos=mausXpos;
		lastmausYpos=mausYpos;
		mausXpos=x;
		mausYpos=y;
		if(!mousisdown)clearticker();
		if(!istouchdevice)drawTL(true);//nicht bei touchdevice -> touchmove
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
		lastmausXpos=mausXpos;
		lastmausYpos=mausYpos;
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
			stoppplaing();
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
		
		window.addEventListener('wheel',onWheel, { passive: false });		
		window.addEventListener('resize',function(e){refreshAll();});		
	}
	
	//---download ani---
	var getfirstItemFrom=function(time){
		var i,t,spur,re={hatnext:false,hatitems:false,mintime:undefined};
		
		for(i=0;i<spuren.length;i++){
			re["sp"+i]={item:undefined};
			spur=spuren[i].events;
			for(t=0;t<spur.length;t++){
				item=spur[t];
				if(item.start>time && re["sp"+i].item==undefined){
					re["sp"+i].item=item;
					re["sp"+i].pos=t;
					re["sp"+i].max=spur.length;
					if(t<spur.length-1)re.hatnext=true;
					re.hatitems=true;
					if(re.mintime>item.start || re.mintime==undefined)re.mintime=item.start;
				}
			}
		}
		return re;
	}
	
	var HexToRGB=function(s){
		s = s.slice(1);
		return [
			parseInt(s.slice(0, 2), 16),
			parseInt(s.slice(2, 4), 16),
			parseInt(s.slice(4, 6), 16)
			]
	}
	var downloadani=function(anode){
		//"S",anzahl,r,g,b,r,g,b,...
		//"T" 2 byte=time
		//"E" =letzter Eintrag
		var time=0,mintime=0,tmp,rgb
			,i,t,item,nextitem
			,maxitems=0,fitm,nullitems
			,spurstatus={},
			aniliste=[];
		
		//init
		for(i=0;i<spuren.length;i++){
			spurstatus["sp"+i]={c:"#000000"};
			if(maxitems<spuren[i].events.length)maxitems=spuren[i].events.length;
		}

		if(maxitems>0){
			fitm=getfirstItemFrom(-1);			
			while(fitm.hatitems){
				tmp=[];
				for(i=0;i<spuren.length;i++){
					item=fitm["sp"+i].item;
					if(item!=undefined)
					if(fitm.mintime==item.start){
						spurstatus["sp"+i].c=item.color;
						spurstatus["sp"+i].item=item;
					}
					tmp.push(spurstatus["sp"+i].c);
				}
				if(fitm.mintime>0 && aniliste.length==0){
					nullitems={"t":0,"items":[]}
					for(i=0;i<spuren.length;i++){
						nullitems.items.push("#000000");
					}
					aniliste.push(nullitems);
				}
				aniliste.push({"t":fitm.mintime,"items":tmp});
				
				fitm=(getfirstItemFrom(fitm.mintime));
			}
		}
		if(aniliste.length>1){
			item=aniliste[0];
			for(i=0;i<aniliste.length-1;i++){
				item=aniliste[i];
				nextitem=aniliste[i+1];
				item["dauer"]=nextitem.t-item.t;//diff
			}
			aniliste[aniliste.length-1]["dauer"]=100;
		}
		console.log(aniliste);
		var datei=[],byte1,byte2;
		for(i=0;i<aniliste.length;i++){
			fitm=aniliste[i];
			datei.push(chartobyte("S"));
			datei.push(fitm.items.length);
			for(t=0;t<fitm.items.length;t++){
				rgb=HexToRGB(fitm.items[t]);//'#rrggbb' ->[r,g,b]
				datei.push(rgb[0]);
				datei.push(rgb[1]);
				datei.push(rgb[2]);
			}
			datei.push(chartobyte("T"));			
			byte1 = (fitm.dauer >> 8) & 0xFF; // Höheres Byte
            byte2 = fitm.dauer & 0xFF;
			datei.push(byte1);//H
			datei.push(byte2);//L
		}
		datei.push(chartobyte("E"));
		
		var dateistr="";
		for(i=0;i<datei.length;i++){
			dateistr+=String.fromCharCode(datei[i]);
		}
		
		downloadData("animation.ani",dateistr,anode);
	}
	var downloadData=function(filename, daten,anode) {
		var typ="application/octet-stream;base64";		
		var node = document.createElement('a');	 
		node.setAttribute('href', 'data:'+typ+',' + btoa(daten));
		node.setAttribute('download', filename);
		node.style.display = 'none';
		document.body.appendChild(node);
		node.click();
		document.body.removeChild(node);
	}
	
	//---Load ani---
	
	var onloadani=function(filedata){
		var i=0,t,fbyte,
			timepos=0,
			zeit=0,//ms
			pixelwerte=[],anz,r,g,b,bhi,hlow;
		
		clearSpuren();
		timelinestartpos=0;
		playingpositionmax=0;
		
		while(i<filedata.length){
			fbyte=filedata[i];
			if(fbyte==chartobyte("S")){//anzahl,r,g,b,r,g,b,...
				//chartobyte
				pixelwerte=[];
				i++;
				anz=filedata[i];
				for(t=0;t<anz;t++){
					i++;
					r=filedata[i];
					i++;
					g=filedata[i];
					i++;
					b=filedata[i];
					pixelwerte.push([r,g,b]);
				}
			}
			if(fbyte==chartobyte("T")){//2 byte=time
				//zeit=0
				i++;
				bhi=filedata[i];
				i++;
				hlow=filedata[i];
				zeit=bhi*256+hlow;
				
				for(t=0;t<pixelwerte.length;t++){
					addLEDKey(
						t
						,timepos
						,rgbToHex(
							 pixelwerte[t][0]
							,pixelwerte[t][1]
							,pixelwerte[t][2]
							)
						);
				}
				timepos+=zeit;
			}
			i++
		}
		spurenaufraumen();
		drawTLChannels();
		refreshAll();
	}
	
	this.loadani=function(src,anode){		
		if(src=="CLR"){
			stoppplaing();
			clearSpuren();
			refreshAllKeys();
			refreshAll();
			return;
		}
		if(src=="DL"){
			stoppplaing();
			downloadani(anode);
			return;
		}
		
		var xhr = new XMLHttpRequest();
		xhr.open('GET', ""+src, true);
		xhr.responseType = 'arraybuffer';

		xhr.onload = function() {
			if (xhr.status === 200) {
				onloadani(new Uint8Array(xhr.response));
			} else {
				console.error('Fehler beim Laden der Datei:', xhr.statusText);
			}
		};
		xhr.onerror = function() {
			console.error('Netzwerkfehler');
		};
		xhr.send();
	}
	
	ini();
}


var onClickLE=function(e){
	this.dataTL.loadani(this.getAttribute("data-tle-src"),this);
}

window.addEventListener('load', function (event) {
	var timeline=new oTimelineEd(gE("timelineed"));	
	
	var i,a,atrb,liste=document.getElementsByTagName('a');
	for(i=0;i<liste.length;i++){
		a=liste[i];
		atrb=a.getAttribute("data-tle-src");
		if(atrb!=undefined){
			a.dataTL=timeline;
			a.addEventListener('click',onClickLE);
		}
		
	}
});