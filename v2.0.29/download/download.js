define(["jquery","windows/windows","websockets/binary_websockets","navigation/menu","moment","lodash","jquery-growl","common/util","highstock","highcharts-exporting"],function(a,b,c,d,e,f){function g(b,d,f){var g=a(".downloadChart");g.highcharts()&&g.highcharts().destroy(),g.highcharts("StockChart",{chart:{events:{load:function(){this.credits.element.onclick=function(){window.open("http://www.binary.com","_blank")}}},spacingLeft:0,marginLeft:45},navigator:{enabled:!0,series:{id:"navigator"}},plotOptions:{candlestick:{lineColor:"black",color:"red",upColor:"green",upLineColor:"black",shadow:!0}},title:{text:b.display_name+" ("+d+")"},credits:{href:"http://www.binary.com",text:"Binary.com"},xAxis:{labels:{formatter:function(){var a=this.axis.defaultLabelFormatter.call(this);return a.replace(".","")}}},yAxis:[{opposite:!1,labels:{formatter:function(){return this.value},align:"center"}}],tooltip:{crosshairs:[{width:2,color:"red",dashStyle:"dash"},{width:2,color:"red",dashStyle:"dash"}],enabled:!0,enabledIndicators:!0,xDateFormat:"%A, %b %e, %Y %H:%M:%S"},exporting:{enabled:!0,url:"https://export.highcharts.com",buttons:{contextButton:{menuItems:[{text:"Download PNG",onclick:function(){this.exportChartLocal()}},{text:"Download JPEG",onclick:function(){this.exportChart({type:"image/jpeg"})},separator:!1},{text:"Download PDF",onclick:function(){this.exportChart({type:"application/pdf"})},separator:!1},{text:"Download SVG",onclick:function(){this.exportChartLocal({type:"image/svg+xml"})},separator:!1},{text:"Download CSV",onclick:function(){var a=this.series[0],b=isTick(d),c=a.options.name+" ("+d+").csv",f=a.options.data.map(function(a){var c=a[0],d=a[1];if(b)return'"'+e.utc(c).format("YYYY-MM-DD HH:mm")+'",'+ +d;var f=a[2],g=a[3],h=a[4];return'"'+e.utc(c).format("YYYY-MM-DD HH:mm")+'",'+d+","+f+","+g+","+h}),g=(b?"Date,Tick\n":"Date,Open,High,Low,Close\n")+f.join("\n"),h=new Blob([g],{type:"text/csv;charset=utf-8;"});if(navigator.msSaveBlob)navigator.msSaveBlob(h,c);else{var i=document.createElement("a");if(void 0!==i.download){var j=URL.createObjectURL(h);i.setAttribute("href",j),i.setAttribute("download",c),i.style.visibility="hidden",document.body.appendChild(i),i.click(),document.body.removeChild(i)}}},separator:!1}]}},filename:b.display_name.split(" ").join("_")+"("+d+")"},rangeSelector:{enabled:!1}});var h=g.highcharts();h.showLoading(),a(".download_show").prop("disabled",!0);var i=e.utc(f,"DD/MM/YYYY HH:mm").unix(),j=i+1800,k={ticks_history:b.symbol,start:i};isTick(d)||(k.granularity=convertToTimeperiodObject(d).timeInSeconds(),k.style="candles",j=i+1e3*k.granularity),e.utc().unix()<j&&(j=e.utc().unix()),k.end=j,c.send(k).then(function(c){var e=[];isTick(d)?c.history.times.forEach(function(a,b){e.push([1e3*parseInt(a),parseFloat(c.history.prices[b])])}):c.candles.forEach(function(a){e.push([1e3*a.epoch,parseFloat(a.open),parseFloat(a.high),parseFloat(a.low),parseFloat(a.close)])});var f=e.length;if(0===f)return a.growl.error({message:"There is no historical data available!"}),h.hideLoading(),void a(".download_show").prop("disabled",!1);var g=f>100?100:f-1;h.xAxis[0].setExtremes(e[0][0],e[g][0]);var i=b.display_name,j={id:"_"+Date.now(),name:i,data:e,type:isTick(d)?"line":"candlestick",dataGrouping:{enabled:!1},states:{hover:{enabled:!1}}};isTick(d)&&(j.marker={enabled:!0,radius:4}),h.addSeries(j),h.hideLoading(),a(".download_show").prop("disabled",!1)})["catch"](function(b){a.growl.error({message:b.message}),h.hideLoading(),a(".download_show").prop("disabled",!1)})}function h(h){require(["css!download/download.css"]),h.click(function(){j?j.moveToTop():(j=b.createBlankWindow(a('<div class="download_window"/>'),{title:"View Historical Data",width:700,minHeight:460,height:460,resize:function(){var b=a(".downloadChart").width(a(this).width()).height(a(this).height()-40).highcharts();b&&b.reflow()}}),j.dialog("open"),j.closest("div.ui-dialog").css("overflow","visible"),require(["text!download/download.html"],function(b){b=a(b),b.find("button, input[type=button]").button(),b.find(".download_fromDate").datepicker({changeMonth:!0,changeYear:!0,dateFormat:"dd/mm/yy",showButtonPanel:!0,minDate:e.utc().subtract(1,"years").toDate(),maxDate:e.utc().toDate()}).click(function(){a(this).datepicker("show")}),b.find(".download_fromTime").timepicker({showCloseButton:!0}).click(function(){a(this).timepicker("show")}),b.appendTo(j),c.cached.send({trading_times:(new Date).toISOString().slice(0,10)}).then(function(c){k=d.extractChartableMarkets(c),k=d.sortMenu(k);var e=a("<ul>"),g=void 0;k.forEach(function(c){var d=a("<ul>");c.submarkets.forEach(function(c){var e=a("<ul>");c.instruments.forEach(function(c){var d=a("<li>");d.append(c.display_name),d.data("instrumentObject",c),d.click(function(){var c=a(this).data("instrumentObject");a(".download_instruments").data("instrumentObject",c).find("span").html(c.display_name),a(".download_instruments_container > ul").toggle(),i(60*a(this).data("instrumentObject").delay_amount,b)}),f.isUndefined(g)&&(g=c),e.append(d)}),d.append(a("<li>").append(c.name).append(e))}),e.append(a("<li>").append(c.name).append(d))}),a(".download_instruments_container").append(e),e.menu().toggle();var h=a(".download_instruments");h.click(function(){a(".download_instruments_container > ul").toggle()}).blur(function(){a(".download_instruments_container > ul").hide()}),h.data("instrumentObject",g),h.find("span").html(g.display_name),i(60*h.data("instrumentObject").delay_amount,b),a(".download_show").click()})["catch"](function(b){a.growl.error({message:b.message})});var h=a(".download_timePeriod");h.click(function(){a(".download_timePeriod_container > ul").toggle()}).blur(function(){a(".download_timePeriod_container > ul").hide()}),h.data("timePeriodObject",{name:"1 day",code:"1d"}),h.find("span").html("1 day"),a(".download_fromTime").hide(),b.find(".download_show").click(function(){var b=a(".download_instruments"),c=a(".download_timePeriod"),d=b.data("instrumentObject"),e=c.data("timePeriodObject");g(d,e.code,a(".download_fromDate").val()+" "+a(".download_fromTime").val())}),b.find(".download_fromDate").val(e.utc().subtract(1,"years").format("DD/MM/YYYY"))}))})}function i(b,c){var d,e=a(".download_timePeriod"),g=!1;e.find("ul").length>0&&e.find("ul")[0].remove();var h=a("<ul>");l.forEach(function(i){var j=a("<ul>");i.timePeriods.forEach(function(h){var i=a("<li>");if(d=convertToTimeperiodObject(h.code).timeInSeconds(),i.append(h.name),b>d)i.addClass("ui-button-disabled ui-state-disabled");else if(i.data("timePeriodObject",h),i.click(function(){var b=a(this).data("timePeriodObject");a(".download_timePeriod").data("timePeriodObject",b).find("span").html(a(this).data("timePeriodObject").name),a(".download_timePeriod_container > ul").toggle();var d="1d"===b.code,e=c.find(".download_fromTime");d?(e.val("00:00"),e.hide()):e.show()}),!f.isUndefined(e.data("timePeriodObject"))&&!g){var k=e.data("timePeriodObject"),l=convertToTimeperiodObject(k.code).timeInSeconds();b>l&&(i.click(),a(".download_timePeriod_container > ul").toggle()),g=!0}j.append(i)}),h.append(a("<li>").append(i.name).append(j))}),a(".download_timePeriod_container").append(h),h.menu().toggle()}var j=null,k=[],l=[{name:"Ticks",timePeriods:[{name:"1 Tick",code:"1t"}]},{name:"Minutes",timePeriods:[{name:"1 min",code:"1m"},{name:"2 mins",code:"2m"},{name:"3 mins",code:"3m"},{name:"5 mins",code:"5m"},{name:"10 mins",code:"10m"},{name:"15 mins",code:"15m"},{name:"30 mins",code:"30m"}]},{name:"Hours",timePeriods:[{name:"1 hour",code:"1h"},{name:"2 hours",code:"2h"},{name:"4 hours",code:"4h"},{name:"8 hours",code:"8h"}]},{name:"Days",timePeriods:[{name:"1 day",code:"1d"}]}];return{init:h}});