var scopedata;

document.getElementById("sf").addEventListener("submit", function (e) {
    e.preventDefault();

});

acquire_database();

// function to add a new user
function new_user() {
    var http = new XMLHttpRequest();

    var fn = document.getElementById("fn").value;
    var ln = document.getElementById("ln").value;
    var em = document.getElementById("email").value;
    var pn = document.getElementById("pn").value;
    document.getElementById("sf").reset();

    var url = "http://hire.lcdevelopment.com/api/user/add";
    var params = "api_key=ashok.kommi1993@gmail.com&first_name=" + fn + "&last_name=" + ln + "&email=" + em + "&phone=" + pn;
    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
               alert("data sent successfully.......");
               acquire_database();
        }
    };

    http.send(params);
}

// function to acquire the database
function acquire_database() {

    var data;
    var http = new XMLHttpRequest();
    var url2 = "http://hire.lcdevelopment.com/api/users";
    var params2 = "api_key=ashok.kommi1993@gmail.com";

    http.open("GET", url2 + "?" + params2, true);


    http.onreadystatechange = function () {
        if (http.readyState == XMLHttpRequest.DONE) {

            data = (JSON.parse(http.responseText)).users;
            scopedata = data;

            display_database(data);

        };
    }

    http.send(params2);
}

// function to erase the database
function erase_database() {
    var http = new XMLHttpRequest();
    var url3 = "http://hire.lcdevelopment.com/api/reset";
    var params3 = "api_key=ashok.kommi1993@gmail.com";

    http.open("POST", url3, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            alert("data deleted successfully......");
            acquire_database();
        }
    };

    http.send(params3);
}

// function to display the database
function display_database(data) {
    var ele, x;
    var emailplot, phoneplot;

    // constructing the table
    document.getElementById("tab").innerHTML = "<tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Phone Number</th></tr>";

    //displaying table data
    for (var i = 0; i < data.length; i++) {
        x = data[i];
        ele = "<tr><td>" + x.first_name + "</td><td>" + x.last_name + "</td><td>" + x.email + "</td><td>" + x.phone + "</td></tr>";
        document.getElementById("tab").innerHTML += ele;

    };

    // plotting the email stats chart
    emailplot = {

        gridThickness: 2,
        gridDashType: "dash",
        animationEnabled: true,
        axisX: {
                  
            interval: 1,
            labelFontSize: 15,
            labelFontColor: "dimGrey",
            title: "Number of Char's in email",
        },
        axisY: {
            
            interval: 1,
            labelFontColor: "dimGrey",
            labelFontSize: 15,
            title: "Number of Users",
            gridThickness: 1,
            gridColor: "lightGray"
        },
        data: [

                {
                    type: "column",
                    dataPoints: []
                }
             ]
    };

    emailplot.data[0].dataPoints = get_email_stats();

    var emailchart = new CanvasJS.Chart("emailchart", emailplot);

    emailchart.render();

    // plotting the phone stats chart
    phoneplot = {
        animationEnabled: true,
        data: [
            {
                type: "doughnut",
                startAngle: 20,
                toolTipContent: "{x} - <strong>#percent%</strong>",
                indexLabel: "{x}",
                indexLabelFontColor: "maroon",   
                dataPoints: []
            }
        ]
    }
   
    phoneplot.data[0].dataPoints = get_phone_stats();

    var phonechart = new CanvasJS.Chart("phonechart", phoneplot);

    phonechart.render();


}

// function to get stats of email addresses
function get_email_stats() {

    var emailaddr = [],
        ret = [],
        length_arr = [];

    scopedata.map(function (x) {
        emailaddr.push(x.email.length);
    });

    var obj = {};
    for (var i = 0; i < emailaddr.length; i++) {
        obj[emailaddr[i]] = (obj[emailaddr[i]] || 0) + 1;
    };

    var ydat = Object.values(obj);
    var xdat = Object.getOwnPropertyNames(obj);

    for (var j = 0; j < xdat.length; j++) {
        ret.push({
            x: parseInt(xdat[j]),
            y: ydat[j]
        });
    }

    return ret;
}

// function to get stats of phone numbers
function get_phone_stats() {

    var phonenos = [],
        ret = [],
        area_arr = [];

    scopedata.map(function (x) {
        phonenos.push(x.phone);
    });

    phonenos.map(function (x) {
        area_arr.push(Math.floor(parseInt(x) / 10000000));
    });

    var obj = {};
    for (var i = 0; i < area_arr.length; i++) {
        obj[area_arr[i]] = (obj[area_arr[i]] || 0) + 1;
    };

    var ydat = Object.values(obj);
    var xdat = Object.getOwnPropertyNames(obj);

    for (var j = 0; j < xdat.length; j++) {
        ret.push({
            x: (parseInt(xdat[j])),
            y: ydat[j]
        });
    }

    return ret;
}