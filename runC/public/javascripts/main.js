'use strict';

$(function () {
    $('#submit').click(function () {
        $.ajax({
            url: '/code',
            data: 'code=' + $('#code').val(),
            type: 'POST',
            processData: false,
            contentType: "application/x-www-form-urlencoded",
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
                    const resultJSON = JSON.parse(jqXHR.responseText);
                    var resultTip = 'Fail to run code\n\n\n' + data.stderr + '\n\n' + data.output;
                    $('#result').html(resultTip.replace(/[\n]/g, '</br>'));
                }
            },
            success: function (data, status, xhr) {
                var resultTip = data.success ? 'Run code successfully\n\n\n' : 'Fail to run code\n\n\n';
                resultTip += data.stderr + '\n\n' + data.output;
                $('#result').html(resultTip.replace(/[\n]/g, '</br>'));
            }
        })
    });
});