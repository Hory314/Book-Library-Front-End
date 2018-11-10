let status = function (type, url)
{
    let statusEl = $("#status");
    let href = $("<a>").attr("href", url).text(url).css("color","inherit").attr("target","_blank");
    statusEl.text("Pobrano metodą " + type + " z ").append(href);
};

let fillInfo = function (element, data)
{
    element.text(data["id"] + " " + data["isbn"]);//todo reszta danych
};


let fillContent = function (data)
{
    data.forEach(book =>
    {
        let mainContentDiv = $("div.content");

        let bookDiv = $("<div>");
        bookDiv.attr("data-book-id", book["id"]);

        let h1 = $("<h1>");
        h1.text(book["title"]);
        bookDiv.append(h1);

        let bookInfoDiv = $("<div>");
        bookInfoDiv.addClass("book-info").css("display", "none");
        bookDiv.append(bookInfoDiv);

        mainContentDiv.append(bookDiv);
    });
};

function getBookData()
{
    let bookInfoDiv = $(this).next("div.book-info");
    let divWithId = $(this).parent();
    let bookId = divWithId.attr("data-book-id"); // book id
    console.log(bookId); // log

    $.ajax({
        url: 'http://localhost:8282/books/' + bookId,
        type: 'GET'
    })
        .done(function (data)
        {
            bookInfoDiv.text(data);
            fillInfo(bookInfoDiv, data);
            status(this.type, this.url);
            bookInfoDiv.slideToggle(300);
        });

    $(this).on("click", false); // $(this)em jest H1 który został kliknięty. Dodaje mu pusty eventListener wiec nie bedzie juz dzialal
                                // , false = Cancel action and prevent the event bubbling up by returning false
    $(this).on("click", slideOnly); // i od razu daje mu event tylko ze sliderem
}

function slideOnly()
{
    $(this).next("div").slideToggle(300);
}

let detailsAction = function ()
{
    let mainContentDiv = $("div.content");
    mainContentDiv.on("click", "h1", getBookData);
};


let initData = function ()
{
    $.ajax({
        url: 'http://localhost:8282/books/',
        type: 'GET'
    })
        .done(function (data)
        {
            fillContent(data);
            status(this.type, this.url);
        });
};

$(document).ready(function ()
{
    initData();
    //add action on click to h1
    detailsAction();
});
