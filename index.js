var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stdDBName = "STUDENT";
var stdRelationName = "SCHOOL-DB";
var connToken = "90931229|-31949328765038779|90961304";

$("#rno").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getrnoAsJsonObj() {
    var rno = $("#rno").val();
    var jsonStr = {
        id: rno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fname").val(record.name);
    $("#cls").val(record.cls);
    $("#dob").val(record.dob);
    $("#address").val(record.address);
    $("#enrolldate").val(record.enrolldate);
}

function resetForm() {
    $("#rno").val("");
    $("#fname").val("");
    $("#cls").val("");
    $("#dob").val("");
    $("#address").val("");
    $("#enrolldate").val("");
    $("#rno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rno").focus();
}

    function validateData() {

        var rno, fname, cls, dob, address, enrolldate;

        rno = $("#rno").val();
        fname = $("#fname").val();
        cls = $("#cls").val();
        dob = $("#dob").val();
        address = $("#address").val();
        enrolldate = $("#enrolldate").val();

        if (rno === "") {
            alert("rno is missing");
            $("#rno").focus();
            return "";
        }
        if (fname === "") {
            alert("Name is missing");
            $("#fname").focus();
            return "";
        }
        if (cls === "") {
            alert("Class is missing");
            $("#cls").focus();
            return "";
        }
        if (dob === "") {
            alert("Date of Birth is missing");
            $("#dob").focus();
            return "";
        }
        if (address === "") {
            alert("Address is missing");
            $("#address").focus();
            return "";
        }
        if (enrolldate === "") {
            alert("Enrollment date is missing");
            $("#enrolldate").focus();
            return "";
        }

        var jsonStrObj = {
            id: rno,
            FullName: fname,
            Class: cls,
            DateofBirth: dob,
            Address: address,
            EnrollmentDate: enrolldate,
        };
        return JSON.stringify(jsonStrObj);
    }

    function getStd() {
        var rnoJsonObj = getrnoAsJsonObj();
        var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdRelationName, rnoJsonObj);
        jQuery.ajaxSetup({ async: false });
        var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
        jQuery.ajaxSetup({ async: true });
        if (resJsonObj.status === 400) {
            $("#save").prop("disabled", false);
            $("#reset").prop("disabled", false);
            $("#fname").focus();
        }
        else if (resJsonObj.status === 200) {
            $("#rno").prop("disabled", true);
            fillData(resJsonObj);

            $("#change").prop("disabled", false);
            $("#reset").prop("disabled", false);
            $("#fname").focus();
        }
    }

    function saveData() {
        var jsonStrObj = validateData();
        if (jsonStrObj === "") {
            return "";
        }
        var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, stdRelationName);
        jQuery.ajaxSetup({ async: false });
        var resJsonObj=executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({ async: true });
        resetForm();
        $("#rno").focus();
    }

    function changeData() {
        $("#change").prop("disabled", true);
        jsonChg = validateData();
        var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName, stdRelationName, localStorage.getItem("recno"));
        jQuery.ajaxSetup({ async: false });
        var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({ async: true });
        console.log(resJsonObj);
        resetForm();
        $("#rno").focus(); 
    }




