$(document).ready(function(){

    $("#upload-form").on('submit', function(e) {
     
        e.preventDefault();

        $('#faturaTablosu').empty();
        $('#manuelVeriGirisFormu').empty();

        var fileInput = $('#fileInput')[0].files[0];

        if (!fileInput) {
            alert('Lütfen bir dosya seçiniz!');
            return;
        }

        var formData = new FormData();
        formData.append('file', fileInput);


    
        if (fileInput.type === 'application/pdf') {
         
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#dosyaGoruntuleme').html('<iframe src="' + e.target.result + '" type="application/pdf"></iframe>');
        };

        reader.readAsDataURL(fileInput);

        }else if (fileInput.type === 'image/jpg' || fileInput.type === 'image/jpeg' ||  fileInput.type == 'image/png') {
        
            var reader = new FileReader();

            reader.onload = function(e) {
             
            $('#dosyaGoruntuleme').html('<img src="' + e.target.result + '" alt="Görüntü" style="width: 100%; height: 100%; object-fit: contain;">');

            };

            reader.readAsDataURL(fileInput);
     
        }
        

        $.ajax({
            url: '/getQRDetails', 
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('File uploaded successfully!');
            
                try {
                    var jsonData = JSON.parse(response);
                    jsonData.filename = fileInput.name;
                    console.log('Parsed JSON:', jsonData);

                    if (typeof jsonData === 'object' && jsonData !== null) {

                        if ($('#writeToDB').length === 0){
                            $('#faturaTablosu').append(createTable(jsonData, fileInput.name));

                            $('#faturaTablosu').append('<button id="writeToDB">Veri tabanına kaydet</button>');
                        }



                        $('#writeToDB').on('click', function() {
                            sendJsonToDb(jsonData);
                        });


                    }else {
                        $('#faturaTablosu').append('<p>QR kodu düzgün okunamadı. Lütfen bilgileri kendiniz giriniz.</p>');
                        createManuelDataForm(fileInput.name);
                    }


                } catch (e) {
                    $('#faturaTablosu').append('<p>QR kodu düzgün okunamadı. Lütfen bilgileri kendiniz giriniz.</p>');
                    createManuelDataForm(fileInput.name);
                    console.error('Failed to parse JSON:', e);
                }


            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#faturaTablosu').append('<p>Dosya yüklemesi başarısız!</p>');
                console.error('File upload failed:', textStatus, errorThrown);
            }
     
        });
    });

    function createTable(data, filename) {

        let table = $('<table></table>').addClass('table');

        let caption = $('<caption id="fileName"></caption>').text(filename);

        table.append(caption);


        let thead = $('<thead></thead>');
        let headerRow = $('<tr></tr>');

        Object.keys(data).forEach(key => {
            let th = $('<th></th>').text(key.charAt(0).toUpperCase() + key.slice(1));
            headerRow.append(th);
        });

        thead.append(headerRow);
        table.append(thead);

        let tbody = $('<tbody></tbody>');
        let row = $('<tr></tr>');

        Object.values(data).forEach(value => {
            let td = $('<td></td>').text(value);
            row.append(td);
        });

        tbody.append(row);
        table.append(tbody);

        return table;
    }


    function sendJsonToDb(jsonData) {

        if (!jsonData) {
            console.error('No JSON data available to post.');
            return;
        }

        $.ajax({
            url: '/writeToDb',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
            success: function (response) {
                console.log('POST request successful:', response);
                showNotification('Veri tabanına kaydedildi.', 'success');
                return response;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showNotification('Veri tabanına kaydedilemedi.', 'error');
                console.error('POST request failed:', textStatus, errorThrown);
            }
        });
    }

    function createManuelDataForm(fileName) {
        var formHtml = `
         <h2>${fileName}</h2>
         <form id="veriFormu">
             
             <input type="hidden" id="filename" name="filename" value="${fileName}">

             <label for="vkntckn" style="font-weight: bold;">Vkntckn:</label>
             <input type="text" id="vkntckn" name="vkntckn" required><br><br>
             
             <label for="avkntckn" style="font-weight: bold;">Avkntckn:</label>
             <input type="text" id="avkntckn" name="avkntckn" required><br><br>

             <label for="senaryo" style="font-weight: bold;">Senaryo:</label>
             <input type="text" id="senaryo" name="senaryo" required><br><br>

             <label for="tip" style="font-weight: bold;">Tip:</label>
             <input type="text" id="tip" name="tip" required><br><br>

             <label for="tarih" style="font-weight: bold;">Tarih:</label>
             <input type="date" id="tarih" name="tarih" required><br><br>

             <label for="no" style="font-weight: bold;">No:</label>
             <input type="text" id="no" name="no" required><br><br>

             <label for="ettn" style="font-weight: bold;">Ettn:</label>
             <input type="text" id="ettn" name="ettn" required><br><br>

             <label for="parabirimi" style="font-weight: bold;">Para birimi:</label>
             <select id="parabirimi" name="parabirimi" required>
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
            </select><br><br>

             <label for="malhizmettoplam" style="font-weight: bold;">Mal-hizmet toplam:</label>
             <input type="number" id="malhizmettoplam" name="malhizmettoplam" step="0.01" required><br><br>

             <label for="kdvmatrah" style="font-weight: bold;">KDV matrah:</label>
             <input type="number" id="kdvmatrah" name="kdvmatrah" step="0.01" required><br><br>

             <label for="hesaplanankdv" style="font-weight: bold;">Hesaplanan KDV:</label>
             <input type="number" id="hesaplanankdv" name="hesaplanankdv" step="0.01" required><br><br>

             <label for="vergidahil" style="font-weight: bold;">Vergi dahil:</label>
             <input type="number" id="vergidahil" name="vergidahil" step="0.01" required><br><br>

             <label for="odenecek" style="font-weight: bold;">Ödenecek:</label>
             <input type="number" id="odenecek" name="odenecek" step="0.01" required><br><br>
             
             <button type="button" id="ManuelDbButton">Veri tabanına yaz</button>
         </form>
     `;

        $('#manuelVeriGirisFormu').html(formHtml);
    }


});



$('#manuelVeriGirisFormu').on('click', '#ManuelDbButton', function () {

    var valid = true;

    var formData = {
        filename: $.trim($('#filename').val()),
        vkntckn: $.trim($('#vkntckn').val()),
        avkntckn: $.trim($('#avkntckn').val()),
        senaryo: $.trim($('#senaryo').val()),
        tip: $.trim($('#tip').val()),
        tarih: $.trim($('#tarih').val()),
        no: $.trim($('#no').val()),
        ettn: $.trim($('#ettn').val()),
        parabirimi: $.trim($('#parabirimi').val()),
        malhizmettoplam: $.trim($('#malhizmettoplam').val()),
        kdvmatrah: $.trim($('#kdvmatrah').val()),
        hesaplanankdv: $.trim($('#hesaplanankdv').val()),
        vergidahil: $.trim($('#vergidahil').val()),
        odenecek: $.trim($('#odenecek').val())
    };

    formData.append

    $.each(formData, function (key, value) {
        if (value === '') {
            valid = false;
            $('#' + key).addClass('error');
        } else {
            $('#' + key).removeClass('error');
        }
    });

    console.log(JSON.stringify(formData))

    if (valid) {

        $.ajax({
            url: '/writeToDb',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                console.log('POST request successful:', response);
                showNotification('Veri tabanına kaydedildi.', 'success');
                return response;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showNotification('Veri tabanına kaydedilemedi.', 'error');
                console.error('POST request failed:', textStatus, errorThrown);
            }
        });

    } else {
        showNotification('Lütfen tüm alanları doldurun.', 'warning');
    }




});



function showNotification(message, type) {
    var notificationDiv = $('#notification');
    var notification = $('<div></div>').text(message);

    if (type === 'success') {
        notification.css('background-color', '#4CAF50'); // Yeşil
    } else if (type === 'error') {
        notification.css('background-color', '#f44336'); // Kırmızı
    } else if (type === 'warning') {
        notification.css('background-color', '#ff9800'); // Turuncu
    }

    notification.css({
        'color': '#fff',
        'padding': '10px',
        'margin-bottom': '10px',
        'border-radius': '5px',
        'box-shadow': '0px 0px 10px rgba(0, 0, 0, 0.1)',
        'opacity': '0.9'
    });

    notificationDiv.append(notification);

    setTimeout(function () {
        notification.fadeOut(400, function () {
            $(this).remove();
        });
    }, 3000); // 3 saniye sonra kaybolacak
}


$(document).ready(function () {
    
    $('#past-archives-button').on('click', function () {
        openArchives();
    });

    function openArchives() {
        window.open("/get_all_archives", "_blank");
    }
});


$(document).ready(function () {
    $("#about-button").click(function () {
        $("#modal-text").text("Bu uygulama; E-Fatura ve E-Arşiv Fatura görüntüleme, veri tabanı kayıt-kontrol işlemlerini hızlı ve kolayca yapmak için geliştirilmiştir.");
        $("#modal").show();
    });

    $("#contact-button").click(function () {
        $("#modal-text").text("E-Mail: bugrates25@gmail.com");
        $("#modal").show();
    });

    $(window).click(function (event) {
        if ($(event.target).is("#modal")) {
            $("#modal").hide();
        }
    });

    $(window).click(function (event) {
        if ($(event.target).is("#close")) {
            $("#modal").hide();
        }
    });


});



