var trackingData = [];
var partID = "";
var courseID = "";

// var slider = new Slider("#ex13", {
//     ticks: [0, 100, 200, 300, 400],
//     ticks_labels: ['$0', '$100', '$200', '$300', '$400'],
//     ticks_snap_bounds: 30
// });

function addEventListenerToBtns(){
    document.getElementById("btnSubmit").addEventListener("click", (e) => {
        e.preventDefault();
        let val = getRadioValue("valenceRad");
        let aro = getRadioValue("arousalRad");

        if(val == "" || aro == ""){
            showSelectValueModal();
        }else{
            addToTrackingData(val, aro, getCurrentTimeInString());
        }
    });

    document.getElementById("btnStop").addEventListener("click", (e) => {
        addToTrackingData("STOP", "STOP", getCurrentTimeInString());
    });

    document.getElementById("btnStart").addEventListener("click", (e) =>{
        e.preventDefault();
        partID = document.getElementById("partID").value;
        courseID = document.getElementById("courseID").value;

        if(partID === "" || courseID === ""){
            showModal();
        }else{
            addToTrackingData("START", "START", getCurrentTimeInString());
            enableBtns();
            lockRequiredForm();
            document.getElementById("btnStart").setAttribute("disabled", true);
        }
    });
    
    document.getElementById("btnDownload").addEventListener("click", (e) =>{
        e.preventDefault();
        convertArrayOfObjectsToCSV(trackingData);
        downloadCSV({"filename": partID});
    });
}

function getRadioValue(radGroupName){
    let retValue = "";
    document.getElementsByName(radGroupName).forEach(el => {
        if(el.checked == true){
            retValue =  el.value
        }
    });
    return retValue;
}

//true or false does not matter in this function, to re-enable button, attribute disabled must be removed
function disableBtns() {
    document.getElementById("btnDownload").setAttribute("disabled", true);
    document.getElementById("btnSubmit").setAttribute("disabled", true);
}

function enableBtns() {
    document.getElementById("btnDownload").removeAttribute("disabled");
    document.getElementById("btnSubmit").removeAttribute("disabled");
}

function lockRequiredForm(){
    document.getElementById("partID").setAttribute("readonly", true);
    document.getElementById("courseID").setAttribute("readonly", true);
}

function enableRequiredForm(){
    document.getElementById("partID").removeAttribute("readonly");
    document.getElementById("courseID").removeAttribute("readonly");
}

function convertArrayOfObjectsToCSV(args) {  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(args) {  
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
        data: trackingData
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

function getCurrentTimeInString(){
    return (new Date).toLocaleString();
}

function addToTrackingData(val, aro, time){
    var obj = {
        PartID: "",
        CourseID: "",
        Valence: "",
        Arousal: "",
        Date: "",
        TimeStamp: ""
    };
    obj.PartID = partID;
    obj.CourseID = courseID;
    obj.Valence = val;
    obj.Arousal = aro;
    obj.Date = time;
    trackingData.push(obj);
}

function showModal(){
    $("#requiredModal").modal('show');

    $("#requiredModal").on('hidden.bs.modal', function () {
        if(partID === ""){
            document.getElementById("partID").focus();
        }else{
            document.getElementById("courseID").focus();
        }
    });
}

function showSelectValueModal(){
    $("#selectValueModal").modal('show');
}

addEventListenerToBtns();
disableBtns();
