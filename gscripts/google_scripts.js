/*
 Recusrsively add a list of files from a named folder to a sheet
 */

const folderId = "1_MuCXkawPkbPMt5uP4V8b2RNKA4xwXv0";
const fileListSheetId = "13x9K_rZZDXVbJCnSKQU86TYtwTuJIuB-F4Cw3tMyL4Q";
const targetSheet = "1tKixwN7ljrRT2VboEBNATg_NY2qLWoO1u2rzi7vV9xs";

function clearResultsFile() {
    let resultsSheet = SpreadsheetApp.openById(targetSheet);
    SpreadsheetApp.setActiveSpreadsheet(resultsSheet);
    let activeRange = resultsSheet.getDataRange();
    activeRange.clearContent();
}


function writeDataToFile(data) {
    let ss = SpreadsheetApp.openById(targetSheet);
    SpreadsheetApp.setActiveSpreadsheet(ss);
    for (var i = 0; i < data.length; i++) {
        SpreadsheetApp.getActiveSheet().appendRow(data[i]);
    }
}

function removeEmptyRows() {
    let sh = SpreadsheetApp.getActiveSheet();
    let maxRows = sh.getMaxRows();
    let lastRow = sh.getLastRow();
    sh.deleteRows(lastRow + 1, maxRows - lastRow);
}

function iterateFiles() {
    clearResultsFile();
    let ss = SpreadsheetApp.openById(fileListSheetId);
    let files = ss.getRange('C2:C').getValues();
    for (const file of files) {
        fileId = file.pop();
        if (fileId.length > 0) {
            data = readAllSpreadsheets(fileId);
            writeDataToFile(data.pop());
        }
    }
}

function readAllSpreadsheets(fileId) {
    let results = [];
    let ss = SpreadsheetApp.openById(fileId);
    SpreadsheetApp.setActiveSpreadsheet(ss);

    for (var i = 0; i < ss.getSheets().length; i++) {
        let sheet = SpreadsheetApp.setActiveSheet(ss.getSheets()[i]);
        results.push(sheet.getDataRange().getValues());
        Logger.log('Read ' + sheet.getName() + " from " + fileId)
    }
    return results;
}

function createFileList() {
    let ss = SpreadsheetApp.openById(fileListSheetId);
    SpreadsheetApp.setActiveSpreadsheet(ss);
    let sheet = SpreadsheetApp.setActiveSheet(ss.getSheets()[0]);
    sheet.clear();
    sheet.appendRow(["Name", "Date", "ID", "folderName"]);

    var root = DriveApp.getFolderById(folderId);
    var folders = root.getFolders()
    while (folders.hasNext()) {
        var f = folders.next();
        var contents = f.getFiles();
        if (contents.length != 0) {
            addFilesToSheet(contents, f);
        }
    }

    function addFilesToSheet(files, folder) {
        var data;
        var folderName = folder.getName();
        while (files.hasNext()) {
            var file = files.next();
            sheet.appendRow([
                file.getName(),
                file.getDateCreated(),
                file.getId(),
                folderName
            ]);
        }
    }
}