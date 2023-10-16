/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
 define(['N/ui/serverWidget', 'N/record', 'N/url', 'N/query', './lodash.min.js'], (serverWidget, record, url, query, _) => {
    const onRequest = (context) => {
        let lineItemObject = [];
        let sixDigitBinNumberArr = new Array();
        let sevenDigitBinNumberArr = new Array();
      
        let lineItemSortedArr = new Array();
  
        let QOHBaseUnit = 0;
        if (context.request.method === 'GET') {
            try {
                let toID = context.request.parameters.recordId; //get TOId 
                let toType = context.request.parameters.recordType; //get TO Record Type
                log.debug('ST GET TO ID', 'TO Type ->' + toType + 'TO ID ->' + toID);
                let transferOrderObj = record.load({type: toType,id: toID,isDynamic: true});
                let itemLineCount = transferOrderObj.getLineCount('item');
                log.debug('TO Line count', itemLineCount);
  
                for (var toline = 0; toline < itemLineCount; toline++) {
                    let itemID = transferOrderObj.getSublistValue({sublistId: 'item',fieldId: 'item',line: toline});
                    let itemName = transferOrderObj.getSublistValue({sublistId: 'item',fieldId: 'custcol_cts_itemid',line: toline});
                    let itemDescription = transferOrderObj.getSublistValue({sublistId: 'item',fieldId: 'item_display',line: toline});
                    let bin_no = transferOrderObj.getSublistValue({sublistId: 'item',fieldId: 'custcolbin_number',line: toline});
                    let quantity = transferOrderObj.getSublistValue({sublistId: 'item',fieldId: 'quantity',line: toline});
                    let commited = transferOrderObj.getSublistValue({sublistId: 'item',fieldId: 'quantitycommitted',line: toline});
                    let units = transferOrderObj.getSublistValue({sublistId: 'item',fieldId: 'units',line: toline});
                    let unitsDisplay = transferOrderObj.getSublistValue({sublistId: 'item',fieldId: 'units_display',line: toline});
  
                    /*  if(itemID){
                        log.debug("BEFORE LOAD ","Line itemID __"+itemID + " Line itemName __"+itemName);
                          // let getQOHQuery = "SELECT itemid,totalquantityonhand FROM item WHERE  itemid = '2161076'";
                        let getQOHQuery = "SELECT itemid,totalquantityonhand FROM item WHERE itemid = '"+ itemName +"'";
                        log.debug('BEFORE LOAD', " getQOHQuery __" + getQOHQuery);
  
                        let queryResults = query.runSuiteQL(getQOHQuery);
                        let locationRec =  queryResults.asMappedResults();
                        let getQOHBaseUnitObj =  queryResults.asMappedResults();
                        log.debug('BEFORE LOAD', " getQOHBaseUnitObj __" +getQOHBaseUnitObj.length);
                        if (locationRec.length > 0) {
                          log.debug('Query totalquantityonhand ', getQOHBaseUnitObj[0].totalquantityonhand);
                          QOHBaseUnit = getQOHBaseUnitObj[0].totalquantityonhand;
                          log.debug('BEFORE LOAD', " QOHBaseUnit __" + QOHBaseUnit);
                        }
                      }*/
                   // let binArrayValues = ['153132', '153133', '173163', '134122', '1341133', '13131151', '1851063'];
  
                    var binNoLength = bin_no.length;
  
                    if (binNoLength <= 6) {
                        sixDigitBinNumberArr.push({"bin_no": bin_no});
                        sortedSixDigitArr = _.sortBy(sixDigitBinNumberArr, 'bin_no');
                       /* lineItemSortedArr.push({
                            "bin_no": bin_no,
                            "itemID": itemID,
                            "itemDescription": itemDescription,
                            "quantity": quantity,
                            "units": units,
                            "unitsDisplay": unitsDisplay,
                            "QOHBaseUnit": QOHBaseUnit,
                            "commited": commited
                        });*/
                         sortedSixDigitArr = _.merge(_.keyBy(sortedSixDigitArr, 'bin_no'), _.keyBy(lineItemSortedArr, 'bin_no'));
                      //  log.debug("ST mergedSixDigitArr", mergedSixDigitArr);
                        var mergedSixDigitArrValues = _.values(sortedSixDigitArr);
                        log.debug("ST mergedSixDigitArrValues length ", mergedSixDigitArrValues.length);
                        log.debug("ST mergedSixDigitArrValues", mergedSixDigitArrValues);
                    } else {
                        sevenDigitBinNumberArr.push({"bin_no": bin_no});
                        sortedSevenDigitArr = _.sortBy(sevenDigitBinNumberArr, 'bin_no');
                       /* lineItemSortedArr.push({
                          "bin_no": bin_no,
                          "itemID": itemID,
                          "itemDescription": itemDescription,
                          "quantity": quantity,
                          "units": units,
                          "unitsDisplay": unitsDisplay,
                          "QOHBaseUnit": QOHBaseUnit,
                          "commited": commited
                      });*/
  
                         sortedSevenDigitArr= _.merge(_.keyBy(sortedSevenDigitArr, 'bin_no'), _.keyBy(lineItemSortedArr, 'bin_no'));
                      //  log.debug("ST mergedSevenDigitArr", mergedSevenDigitArr);
                        var mergedSevenDigitArrValues = _.values(sortedSevenDigitArr);
                        log.debug("ST mergedSevenDigitArrValues length ", mergedSevenDigitArrValues.length);
                        log.debug("ST mergedSevenDigitArrValues", mergedSevenDigitArrValues);
                    }
                }
                log.debug("ST mergedSixDigitArrValues", mergedSixDigitArrValues);// 6 Digit Value
                var sixDigitArrLength = mergedSixDigitArrValues.length;
                log.debug("ST mergedSixDigitArrValues length ", sixDigitArrLength);// 6 Digit Length
  
                log.debug("ST mergedSevenDigitArrValues", mergedSevenDigitArrValues);// 7 Digit Value
                var sevDigitArrLength = mergedSevenDigitArrValues.length;
                log.debug("ST mergedSevenDigitArrValues length ", sevDigitArrLength);// 7 Digit Length
  
  
              var mainAscedingOrderArr = new Array();
                for(var a = 0 ;a <=  sixDigitArrLength; a++)
                {
                  var firstArr = mergedSixDigitArrValues.substring(0, 3);  //113311 - 6 Digit
                  log.debug("firstArr ",firstArr)
                  for(var b = 0 ;b <=  sevDigitArrLength; b++)  //1431013 - 7 Digit
                  {
                    var SecondArr = mergedSevenDigitArrValues.substring(0, 3); 
                    log.debug("SecondArr ",SecondArr);
  
                    if(firstArr <= SecondArr){
                      mainAscedingOrderArr.push(mergedSixDigitArrValues[a]);
                    } 
                    log.debug("mainAscedingOrderArr",mainAscedingOrderArr);
                   /* else if(firstArr <= SecondArr){    // 123 5 67 =123 10 78 
                      var fourthDigitValue = mergedSixDigitArrValues[0].substring(3,5);
  
                      mainAscedingOrderArr.push(mergedSixDigitArrValues[six]);
                    }*/
                  }
                }
  
                log.debug("lineItemObject ->", lineItemObject)
                let form = serverWidget.createForm({title: 'Transfer Order Details',hideNavBar: true});
  
               
  
                context.response.writePage(form);
            } catch (ex) {
                log.debug({title: "Error Statement",details: ex});
            }
        } else if (context.request.method === 'POST') {
            try {} 
            catch (er) {
                log.debug({title: "Error Statement",details: er});
          }
        }
    } //ON REQUEST
  
    return {
        onRequest
    }
  });
