// ID dan nama-nama sheet Google Sheets
const idSpreadSheet = '1ODFzhU4KiWBepbiXGfJRnuJZA_0wzxi4lL2MCu6-VQQ';
const sourceSheetName = "main";
const spreadSheet = SpreadsheetApp.openById(idSpreadSheet)
const sheet = spreadSheet.getSheetByName(sourceSheetName);
const sheetHarga = spreadSheet.getSheetByName("harga");

// Fungsi doPost untuk menangani permintaan POST HTTP
function doPost(request) {
  // Ekstraksi parameter dari permintaan
  var requestData = request.parameter;
  // Persiapkan objek respons
  let response = {
    success: true,
    message: "Data berhasil ditambahkan!",
    data: requestData
  };
  // Tambahkan baris baru dengan data dari permintaan
  sheet.appendRow([new Date().toLocaleDateString(), requestData['id_pesanan'],requestData['nickname'], requestData['platform'], requestData['email'], requestData['password'], requestData['req_hero'], requestData['kategori'], requestData['paket'], requestData['catatan'], requestData['no_wa'],  requestData['total_harga'], requestData['worker']]);
  // Kembalikan respons dalam format JSON
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

// Fungsi doGet untuk menangani permintaan GET HTTP
function doGet(e) {
  // Ekstraksi parameter dari permintaan
  const kategori = e.parameter.kategori;
  const id_pesanan = e.parameter.id_pesanan;
  let response;

  // Periksa nilai kategori untuk menentukan jenis respons
  if (kategori != 'payment') {
    // Jika kategori bukan 'payment', kembalikan data harga untuk kategori tertentu
    response = {
      success: true,
      message: `Berhasil menampilkan harga ${kategori}`,
      data: getAllHarga().filter(function (element) {
        return element['kategori'] == kategori
      }),
    };
  } else {
    // Jika kategori adalah 'payment', kembalikan data untuk id_pesanan tertentu
    response = {
      success: true,
      message: `Berhasil menampilkan data`,
      data: getAlldata().find(function (element) {
        return element['id_pesanan'] == id_pesanan
      }),
    };
  }

  // Kembalikan respons dalam format JSON
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

// Fungsi untuk mengambil semua data harga
function getAllHarga() {
  const data = [];
  const rLen = sheetHarga.getLastRow();
  const cLen = sheetHarga.getLastColumn();
  const rows = sheetHarga.getRange(1, 1, rLen, cLen).getValues();

  // Loop melalui baris dan kolom untuk membuat array data harga
  for(let i = 1; i < rows.length; i++) {
    const dataRow = rows[i];
    let record = {};
    for(let j = 0; j < cLen; j++) {
      record[rows[0][j]] = dataRow[j];
    }    
      data.push(record);
  }
  // Kembalikan array data harga
  return data;
}

// Fungsi untuk mengambil semua data dari sheet utama
function getAlldata() {
  const data = [];
  const rLen = sheet.getLastRow();
  const cLen = sheet.getLastColumn();
  const rows = sheet.getRange(1, 1, rLen, cLen).getValues();

  // Loop melalui baris dan kolom untuk membuat array data
  for(let i = 1; i < rows.length; i++) {
    const dataRow = rows[i];
    let record = {};
    for(let j = 0; j < cLen; j++) {
      record[rows[0][j]] = dataRow[j];
    }
      data.push(record);
  }

  // Kembalikan array data
  return data;
}
