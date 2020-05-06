function fetchGoogleSheet(url, num) {
    let sheetId = url.split("/")[5];
    console.log(url.split("/")[5]);
    return fetch(`https://spreadsheets.google.com/feeds/cells/${sheetId}/${num}/public/full?alt=json`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let rows = []
        let headers = []
        data['feed']['entry'].forEach((cell) => {
            rownum = cell['title']['$t'].substring(1) - 1
            colnum = cell['title']['$t'].substring(0, 1).charCodeAt(0) - 65;
            content = isNaN(Number(cell['content']['$t'])) ? cell['content']['$t'].trim() : Number(cell['content']['$t']);
            // Get Headers
            if (rownum == 0) {
                headers.push(content)
            }
            // Build out rows
            if (rows[rownum] === undefined) {
                rows[rownum] = {}
            }
            rows[rownum][headers[colnum]] = content
        });
        document.getElementById("put").innerHTML = JSON.stringify(rows)
        return rows;
    });
}

$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        let formData = $("form").serializeArray().reduce((obj, x) => {
            obj[x["name"]] = x["value"];
            return obj;
        }, {});

        fetchGoogleSheet(formData['url'], formData['num']);
    });
});