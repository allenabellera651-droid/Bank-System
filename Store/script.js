/* ==========================================================
   script.js - the BRAIN of the page

   How the data is saved (in the browser's localStorage):
     "sales:2026-10-22"  ->  list of sales on that day
   Each sale looks like:  { name: "Coke", price: 20, qty: 3 }
   A new date = a new empty list. That is how it "resets" each day.
   ========================================================== */


/* ---------- STEP 1: find the things on the page ---------- */
/* getElementById = "find the item on the page that has this id" */
var form = document.getElementById("f");
var nameBox = document.getElementById("name");
var priceBox = document.getElementById("price");
var qtyBox = document.getElementById("qty");
var dayPick = document.getElementById("dayPick");
var monthPick = document.getElementById("monthPick");
var todayBtn = document.getElementById("todayBtn");
var finishBtn = document.getElementById("finishBtn");


/* ---------- STEP 2: variables that remember what we are viewing ---------- */
var viewDay = getToday();               // example: "2026-10-22"
var viewMonth = viewDay.slice(0, 7);    // first 7 letters: "2026-10"


/* ---------- STEP 3: small helper functions ---------- */

/* Get today's date as text like "2026-10-22" */
function getToday() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;       // months start at 0, so add 1
  var day = now.getDate();
  if (month < 10) { month = "0" + month; }   // 5 becomes "05"
  if (day < 10) { day = "0" + day; }
  return year + "-" + month + "-" + day;
}

/* Turn a number into money text: 25 becomes "₱25.00" */
function peso(number) {
  return "₱" + number.toFixed(2);
}

/* Read the sales list of one day from the browser's storage */
function loadSales(day) {
  var saved = localStorage.getItem("sales:" + day);
  if (saved === null) {
    return [];                          // nothing saved yet = empty list
  }
  return JSON.parse(saved);             // turn the saved text back into a list
}

/* Save the sales list of one day into the browser's storage */
function saveSales(day, list) {
  if (list.length === 0) {
    localStorage.removeItem("sales:" + day);   // empty day: remove it
  } else {
    localStorage.setItem("sales:" + day, JSON.stringify(list));
  }
}

/* Add up all the money in a list: price x qty for every sale */
function totalOf(list) {
  var total = 0;
  for (var i = 0; i < list.length; i++) {
    total = total + list[i].price * list[i].qty;
  }
  return total;
}

/* Find all the days that have sales in a month (example month: "2026-10") */
function getDaysInMonth(month) {
  var days = [];
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);                  // example: "sales:2026-10-22"
    if (key.startsWith("sales:" + month)) {
      days.push(key.replace("sales:", ""));         // keep only "2026-10-22"
    }
  }
  days.sort();                                      // put in date order
  return days;
}

/* Stops weird characters in product names from breaking the page */
function safeText(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


/* ---------- STEP 4: draw everything on the page ---------- */
function showPage() {
  document.getElementById("summary").innerHTML = "";   // hide the old summary
  var sales = loadSales(viewDay);               // the sales of the day we are viewing
  var days = getDaysInMonth(viewMonth);         // the days of the month we are viewing

  /* 4a. The two big totals at the top */
  var monthTotal = 0;
  for (var i = 0; i < days.length; i++) {
    monthTotal = monthTotal + totalOf(loadSales(days[i]));
  }
  document.getElementById("dayLabel").textContent = viewDay + " total";
  document.getElementById("dayTotal").textContent = peso(totalOf(sales));
  document.getElementById("monthLabel").textContent = viewMonth + " total";
  document.getElementById("monthTotal").textContent = peso(monthTotal);

  /* 4b. Make the date boxes show what we are viewing */
  dayPick.value = viewDay;
  monthPick.value = viewMonth;

  /* 4c. The list of what was sold on that day */
  document.getElementById("listTitle").textContent = "Sold on " + viewDay;
  var listHtml = "";
  if (sales.length === 0) {
    listHtml = "<div class='empty'>No sales recorded for this day.</div>";
  } else {
    listHtml = "<table><tr><th>Product</th><th class='right'>Price</th>" +
               "<th class='right'>Qty</th><th class='right'>Total</th><th></th></tr>";
    for (var j = 0; j < sales.length; j++) {
      var sale = sales[j];
      listHtml = listHtml +
        "<tr>" +
        "<td>" + safeText(sale.name) + "</td>" +
        "<td class='right'>" + peso(sale.price) + "</td>" +
        "<td class='right'>" + sale.qty + "</td>" +
        "<td class='right'>" + peso(sale.price * sale.qty) + "</td>" +
        "<td><button class='del' onclick='deleteSale(" + j + ")'>✕</button></td>" +
        "</tr>";
    }
    listHtml = listHtml + "</table>";
  }
  document.getElementById("list").innerHTML = listHtml;

  /* 4d. The list of days in the month, with the total of each day */
  var historyHtml = "";
  if (days.length === 0) {
    historyHtml = "<div class='empty'>Nothing recorded in this month.</div>";
  } else {
    historyHtml = "<table>";
    for (var k = 0; k < days.length; k++) {
      var day = days[k];
      var rowClass = "pick";
      if (day === viewDay) { rowClass = "pick selected"; }   // highlight chosen day
      historyHtml = historyHtml +
        "<tr class='" + rowClass + "' onclick='showDay(\"" + day + "\")'>" +
        "<td>" + day + "</td>" +
        "<td class='right'>" + peso(totalOf(loadSales(day))) + "</td>" +
        "</tr>";
    }
    historyHtml = historyHtml + "</table>";
  }
  document.getElementById("history").innerHTML = historyHtml;
}


/* ---------- STEP 5: what happens when you click things ---------- */

/* When you press "Add sale" */
form.addEventListener("submit", function (event) {
  event.preventDefault();                       // stop the page from reloading

  var today = getToday();
  var sales = loadSales(today);

  /* make a new sale from what you typed, and add it to today's list */
  var newSale = {
    name: nameBox.value,
    price: Number(priceBox.value),              // Number() turns text into a number
    qty: Number(qtyBox.value)
  };
  sales.push(newSale);                          // push = add to the end of the list
  saveSales(today, sales);

  /* clear the boxes so you can type the next sale */
  nameBox.value = "";
  priceBox.value = "";
  qtyBox.value = 1;
  nameBox.focus();

  viewDay = today;                              // show today after adding
  viewMonth = today.slice(0, 7);
  showPage();
});

/* When you press the red X on a sale */
function deleteSale(position) {
  var sales = loadSales(viewDay);
  sales.splice(position, 1);                    // splice = remove 1 item at this position
  saveSales(viewDay, sales);
  showPage();
}

/* When you tap a day in the month list */
function showDay(day) {
  viewDay = day;
  showPage();
}

/* When you choose a date in the date box */
dayPick.addEventListener("change", function () {
  if (dayPick.value !== "") {
    viewDay = dayPick.value;
    viewMonth = viewDay.slice(0, 7);
    showPage();
  }
});

/* When you choose a month in the month box */
monthPick.addEventListener("change", function () {
  if (monthPick.value !== "") {
    viewMonth = monthPick.value;
    showPage();
  }
});

/* When you press the "Today" button */
todayBtn.addEventListener("click", function () {
  viewDay = getToday();
  viewMonth = viewDay.slice(0, 7);
  showPage();
});


/* ---------- FINISH DAY: add up everything sold on the day you are viewing ---------- */
function showSummary() {
  var sales = loadSales(viewDay);
  var box = document.getElementById("summary");

  /* no sales = nothing to add up */
  if (sales.length === 0) {
    box.innerHTML = "<div class='empty'>No sales to finish for " + viewDay + ".</div>";
    return;
  }

  /* Group the sales by product. We keep 4 lists, one position for each product:
     keys = product names in lowercase (to match "Coke" and "coke" as the same)
     labels = the name to show   |   quantities = how many sold   |   moneys = money earned */
  var keys = [];
  var labels = [];
  var quantities = [];
  var moneys = [];
  var totalMoney = 0;
  var totalItems = 0;

  for (var i = 0; i < sales.length; i++) {
    var sale = sales[i];
    var key = sale.name.trim().toLowerCase();
    var position = keys.indexOf(key);           // is this product already in the list?
    if (position === -1) {                      // no = add it as a new product
      keys.push(key);
      labels.push(sale.name.trim());
      quantities.push(0);
      moneys.push(0);
      position = keys.length - 1;
    }
    quantities[position] = quantities[position] + sale.qty;
    moneys[position] = moneys[position] + sale.price * sale.qty;
    totalItems = totalItems + sale.qty;
    totalMoney = totalMoney + sale.price * sale.qty;
  }

  /* Find the best seller = the product that earned the most money */
  var best = 0;
  for (var j = 1; j < keys.length; j++) {
    if (moneys[j] > moneys[best]) { best = j; }
  }

  /* Build the summary and show it */
  var html = "<div class='summary'>" +
    "<div class='label'>Day summary - " + viewDay + "</div>" +
    "<div class='big'>" + peso(totalMoney) + "</div>" +
    "<div class='label'>Total sales for the day</div>" +
    "<div class='stat'>Total items sold: <b>" + totalItems + "</b></div>" +
    "<div class='stat'>Number of sales entered: <b>" + sales.length + "</b></div>" +
    "<div class='stat'>Different products: <b>" + keys.length + "</b></div>" +
    "<div class='stat'>Best seller: <b>" + safeText(labels[best]) + "</b> (" + peso(moneys[best]) + ")</div>" +
    "<table><tr><th>Product</th><th class='right'>Qty</th><th class='right'>Money</th></tr>";
  for (var k = 0; k < keys.length; k++) {
    html = html + "<tr><td>" + safeText(labels[k]) + "</td>" +
      "<td class='right'>" + quantities[k] + "</td>" +
      "<td class='right'>" + peso(moneys[k]) + "</td></tr>";
  }
  html = html + "</table></div>";
  box.innerHTML = html;
  box.scrollIntoView({ behavior: "smooth" });   // scroll down so you can see it
}

/* When you press the "Finish day" button */
finishBtn.addEventListener("click", function () {
  showPage();        // refresh the page first
  showSummary();     // then show the summary
});


/* ---------- STEP 6: draw the page when it first opens ---------- */
showPage();